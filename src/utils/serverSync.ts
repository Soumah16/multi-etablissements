import {
  getLocalTimestamp,
  hydrateKeysFromIdb,
  isSyncableKey,
  listModifiedSyncableKeys,
  onLocalStorageMutation,
  readDualStorageValue,
  saveDualStorage,
  setServerClockOffset
} from './storage';
import {
  syncSharedMessagesFromServer,
  syncSharedRequestsFromServer
} from './communicationHub';

interface RemoteStateEntry {
  value: unknown;
  updatedAt: number;
  serverSeq?: number;
}

let started = false;
let cleanupFn: (() => void) | null = null;
let lastServerSeq = 0;
let activeSyncHook: (() => Promise<boolean>) | null = null;

function applyRemoteEntry(key: string, entry: RemoteStateEntry): void {
  if (!isSyncableKey(key) || !entry || typeof entry.updatedAt !== 'number') return;
  const localTs = getLocalTimestamp(key);
  if (entry.updatedAt > localTs) {
    saveDualStorage(key, entry.value, entry.updatedAt, 'remote');
  }
}

async function pushEntriesToServer(
  entries: Array<{ key: string; value: unknown; updatedAt: number }>
): Promise<boolean> {
  if (typeof window === 'undefined' || entries.length === 0) return true;
  const CHUNK_SIZE = 35;
  try {
    for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
      const chunk = entries.slice(i, i + CHUNK_SIZE);
      const resp = await fetch('/api/state', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ entries: chunk })
      });
      if (!resp.ok) {
        return false;
      }
      try {
        const data = (await resp.json()) as { serverTime?: number };
        if (typeof data.serverTime === 'number') {
          setServerClockOffset(data.serverTime);
        }
      } catch {
        // ignore response parse error
      }
    }
    return true;
  } catch {
    return false;
  }
}

async function pullRemoteState(forceFull = false): Promise<Record<string, RemoteStateEntry> | null> {
  if (typeof window === 'undefined') return null;
  try {
    const useSeq = !forceFull && lastServerSeq > 0 ? lastServerSeq : 0;
    const url = `/api/state?sinceSeq=${encodeURIComponent(String(useSeq))}`;
    const resp = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    });
    if (!resp.ok) return null;
    const data = (await resp.json()) as {
      ok?: boolean;
      serverTime?: number;
      serverSeq?: number;
      states?: Record<string, RemoteStateEntry>;
    };
    if (!data.ok || !data.states) return null;

    if (typeof data.serverTime === 'number') {
      setServerClockOffset(data.serverTime);
    }

    for (const [key, entry] of Object.entries(data.states)) {
      applyRemoteEntry(key, entry);
      if (typeof entry?.serverSeq === 'number' && entry.serverSeq > lastServerSeq) {
        lastServerSeq = entry.serverSeq;
      }
    }

    if (typeof data.serverSeq === 'number') {
      if (data.serverSeq < useSeq) {
        // Server restarted with lower sequence; adopt new sequence
        lastServerSeq = data.serverSeq;
      } else if (data.serverSeq > lastServerSeq) {
        lastServerSeq = data.serverSeq;
      }
    }

    return data.states;
  } catch {
    return null;
  }
}

async function reconcileInitialServerState(): Promise<boolean> {
  await hydrateKeysFromIdb([
    'smartschool_accounts_v3',
    'smartschool_profile',
    'smartschool_global_settings',
    'smartschool_schools',
    'smartschool_admins',
    'smartschool_staff'
  ]);

  const remoteStates = await pullRemoteState(true);
  if (!remoteStates) return false;

  // Push any local modifications that are newer than the server snapshot
  const localKeys = listModifiedSyncableKeys();
  const toPush: Array<{ key: string; value: unknown; updatedAt: number }> = [];

  for (const key of localKeys) {
    if (!isSyncableKey(key)) continue;
    const localTs = getLocalTimestamp(key);
    const remoteTs = remoteStates[key]?.updatedAt || 0;
    if (localTs > remoteTs) {
      const record = await readDualStorageValue(key);
      if (record.found) {
        toPush.push({ key, value: record.value, updatedAt: localTs });
      }
    }
  }

  if (toPush.length > 0) {
    return pushEntriesToServer(toPush);
  }
  return true;
}

/**
 * Forces an immediate full bidirectional synchronization with the Express server
 * (used prior to login/role switch, on mobile resume, and via "Actualiser").
 */
export async function syncNowWithServer(timeoutMs = 3500): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const runSync = async (): Promise<boolean> => {
    const flushed = activeSyncHook ? await activeSyncHook() : true;
    const reconciled = await reconcileInitialServerState();
    await Promise.all([
      syncSharedMessagesFromServer(),
      syncSharedRequestsFromServer()
    ]);
    return flushed && reconciled;
  };

  if (timeoutMs <= 0) return runSync();

  return Promise.race([
    runSync(),
    new Promise<boolean>(resolve => {
      setTimeout(() => resolve(false), timeoutMs);
    })
  ]);
}

export function startServerSync(): () => void {
  if (typeof window === 'undefined') return () => undefined;
  if (started && cleanupFn) return cleanupFn;
  started = true;

  const pendingQueue = new Map<string, { value: unknown; updatedAt: number }>();
  let flushTimer: ReturnType<typeof setTimeout> | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let sseReconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let activeFlushPromise: Promise<boolean> | null = null;
  let eventSource: EventSource | null = null;
  let disposed = false;

  const executeFlush = async (): Promise<boolean> => {
    let allOk = true;
    while (pendingQueue.size > 0 && !disposed) {
      const batch = Array.from(pendingQueue.entries()).map(([key, item]) => ({
        key,
        value: item.value,
        updatedAt: item.updatedAt
      }));

      const ok = await pushEntriesToServer(batch);
      if (ok) {
        for (const pushed of batch) {
          const cur = pendingQueue.get(pushed.key);
          if (cur && cur.updatedAt <= pushed.updatedAt) {
            pendingQueue.delete(pushed.key);
          }
        }
      } else {
        allOk = false;
        if (!disposed && !retryTimer) {
          retryTimer = setTimeout(() => {
            retryTimer = null;
            void flushMutations();
          }, 2500);
        }
        break;
      }
    }
    return allOk;
  };

  const flushMutations = async (): Promise<boolean> => {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (activeFlushPromise) {
      const prevOk = await activeFlushPromise;
      if (pendingQueue.size === 0 || disposed) return prevOk;
    }
    if (pendingQueue.size === 0) return true;

    activeFlushPromise = executeFlush().finally(() => {
      activeFlushPromise = null;
    });
    return activeFlushPromise;
  };

  const beaconUrgentPending = () => {
    if (pendingQueue.size === 0 || typeof navigator === 'undefined') return;
    const batch = Array.from(pendingQueue.entries()).map(([key, item]) => ({
      key,
      value: item.value,
      updatedAt: item.updatedAt
    }));
    try {
      const json = JSON.stringify({ entries: batch });
      if (json.length <= 60_000 && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([json], { type: 'application/json' });
        const sent = navigator.sendBeacon('/api/state', blob);
        if (sent) {
          return;
        }
      }
      if (json.length <= 60_000) {
        void fetch('/api/state', {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: json
        }).catch(() => undefined);
      }
    } catch {
      // Fallback to normal async flush
      void flushMutations();
    }
  };

  activeSyncHook = flushMutations;

  const unsubMutations = onLocalStorageMutation((key, value, updatedAt) => {
    if (!isSyncableKey(key)) return;
    pendingQueue.set(key, { value, updatedAt });
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(() => {
      flushTimer = null;
      void flushMutations();
    }, 80);
  });

  // Initial full state hydration & push of any offline local changes
  void reconcileInitialServerState();
  void syncSharedMessagesFromServer();
  void syncSharedRequestsFromServer();

  const connectSse = () => {
    if (disposed || typeof window === 'undefined' || !('EventSource' in window)) return;
    try {
      if (eventSource) {
        eventSource.close();
      }
      let hadError = false;
      const es = new EventSource('/api/state/stream');
      eventSource = es;

      es.addEventListener('ready', (ev: MessageEvent) => {
        try {
          const payload = JSON.parse(String(ev.data || '{}')) as {
            serverTime?: number;
            serverSeq?: number;
          };
          if (typeof payload.serverTime === 'number') {
            setServerClockOffset(payload.serverTime);
          }
          if (hadError || (typeof payload.serverSeq === 'number' && payload.serverSeq !== lastServerSeq)) {
            hadError = false;
            void pullRemoteState(true);
            void syncSharedMessagesFromServer();
            void syncSharedRequestsFromServer();
          }
        } catch {
          if (hadError) {
            hadError = false;
            void pullRemoteState(true);
          }
        }
      });

      es.addEventListener('state_update', (ev: MessageEvent) => {
        try {
          const payload = JSON.parse(String(ev.data || '{}')) as {
            serverTime?: number;
            serverSeq?: number;
            entries?: Array<{ key: string; value: unknown; updatedAt: number; serverSeq?: number }>;
          };
          if (typeof payload.serverTime === 'number') {
            setServerClockOffset(payload.serverTime);
          }
          if (Array.isArray(payload.entries)) {
            for (const item of payload.entries) {
              applyRemoteEntry(item.key, {
                value: item.value,
                updatedAt: item.updatedAt,
                serverSeq: item.serverSeq
              });
              if (typeof item.serverSeq === 'number' && item.serverSeq > lastServerSeq) {
                lastServerSeq = item.serverSeq;
              }
            }
          }
          if (typeof payload.serverSeq === 'number' && payload.serverSeq > lastServerSeq) {
            lastServerSeq = payload.serverSeq;
          }
        } catch {
          // ignore malformed SSE packet
        }
      });

      es.addEventListener('comms_update', (ev: MessageEvent) => {
        try {
          const payload = JSON.parse(String(ev.data || '{}')) as { kind?: string };
          if (payload.kind === 'messages') {
            void syncSharedMessagesFromServer();
          } else if (payload.kind === 'requests') {
            void syncSharedRequestsFromServer();
          }
        } catch {
          void syncSharedMessagesFromServer();
          void syncSharedRequestsFromServer();
        }
      });

      es.onerror = () => {
        hadError = true;
        if (es.readyState === EventSource.CLOSED && !disposed && !sseReconnectTimer) {
          sseReconnectTimer = setTimeout(() => {
            sseReconnectTimer = null;
            connectSse();
          }, 4000);
        }
      };
    } catch {
      // Fallback polling remains active below
    }
  };

  connectSse();

  // Fallback poll every 4 seconds (plus periodic full catch-up every 8th cycle)
  let pollTick = 0;
  const pollTimer = setInterval(() => {
    pollTick += 1;
    if (pendingQueue.size > 0) {
      void flushMutations();
    }
    if (pollTick % 8 === 0) {
      void pullRemoteState(true);
    } else {
      void pullRemoteState(false);
    }
  }, 4_000);

  const handleResume = () => {
    if (disposed) return;
    if (eventSource && eventSource.readyState === EventSource.CLOSED) {
      connectSse();
    }
    void syncNowWithServer(0);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      handleResume();
    } else if (document.visibilityState === 'hidden') {
      beaconUrgentPending();
    }
  };

  window.addEventListener('focus', handleResume);
  window.addEventListener('online', handleResume);
  window.addEventListener('pageshow', handleResume);
  window.addEventListener('pagehide', beaconUrgentPending);
  window.addEventListener('beforeunload', beaconUrgentPending);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  cleanupFn = () => {
    disposed = true;
    activeSyncHook = null;
    unsubMutations();
    if (flushTimer) clearTimeout(flushTimer);
    if (retryTimer) clearTimeout(retryTimer);
    if (sseReconnectTimer) clearTimeout(sseReconnectTimer);
    if (eventSource) eventSource.close();
    clearInterval(pollTimer);
    window.removeEventListener('focus', handleResume);
    window.removeEventListener('online', handleResume);
    window.removeEventListener('pageshow', handleResume);
    window.removeEventListener('pagehide', beaconUrgentPending);
    window.removeEventListener('beforeunload', beaconUrgentPending);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    started = false;
    cleanupFn = null;
  };

  return cleanupFn;
}
