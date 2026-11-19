import {
  getLocalTimestamp,
  hydrateKeysFromIdb,
  isSyncableKey,
  listModifiedSyncableKeys,
  onLocalStorageMutation,
  readDualStorageValue,
  saveDualStorage
} from './storage';
import {
  syncSharedMessagesFromServer,
  syncSharedRequestsFromServer
} from './communicationHub';

interface RemoteStateEntry {
  value: unknown;
  updatedAt: number;
}

let started = false;
let cleanupFn: (() => void) | null = null;
let lastSyncSince = 0;
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
    }
    return true;
  } catch {
    return false;
  }
}

async function pullRemoteState(since = 0): Promise<Record<string, RemoteStateEntry> | null> {
  if (typeof window === 'undefined') return null;
  try {
    const url =
      since > 0 ? `/api/state?since=${encodeURIComponent(String(since))}` : '/api/state';
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
      states?: Record<string, RemoteStateEntry>;
    };
    if (!data.ok || !data.states) return null;

    let maxRemoteTs = since;
    for (const [key, entry] of Object.entries(data.states)) {
      applyRemoteEntry(key, entry);
      if (typeof entry?.updatedAt === 'number' && entry.updatedAt > maxRemoteTs) {
        maxRemoteTs = entry.updatedAt;
      }
    }
    if (maxRemoteTs > lastSyncSince) {
      lastSyncSince = maxRemoteTs;
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

  const remoteStates = await pullRemoteState(0);
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
  let isFlushing = false;
  let eventSource: EventSource | null = null;
  let disposed = false;

  const flushMutations = async (): Promise<boolean> => {
    if (isFlushing) return true;
    if (pendingQueue.size === 0) return true;
    isFlushing = true;

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
    } else if (!disposed && !retryTimer) {
      retryTimer = setTimeout(() => {
        retryTimer = null;
        void flushMutations();
      }, 2500);
    }

    isFlushing = false;

    if (ok && pendingQueue.size > 0 && !disposed) {
      return flushMutations();
    }
    return ok;
  };

  activeSyncHook = flushMutations;

  const unsubMutations = onLocalStorageMutation((key, value, updatedAt) => {
    if (!isSyncableKey(key)) return;
    pendingQueue.set(key, { value, updatedAt });
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(() => {
      flushTimer = null;
      void flushMutations();
    }, 120);
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

      es.addEventListener('ready', () => {
        if (hadError) {
          hadError = false;
          void pullRemoteState(0);
          void syncSharedMessagesFromServer();
          void syncSharedRequestsFromServer();
        }
      });

      es.addEventListener('state_update', (ev: MessageEvent) => {
        try {
          const payload = JSON.parse(String(ev.data || '{}')) as {
            entries?: Array<{ key: string; value: unknown; updatedAt: number }>;
          };
          if (Array.isArray(payload.entries)) {
            for (const item of payload.entries) {
              applyRemoteEntry(item.key, { value: item.value, updatedAt: item.updatedAt });
              if (item.updatedAt > lastSyncSince) {
                lastSyncSince = item.updatedAt;
              }
            }
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

  // Fallback poll every 6 seconds (plus periodic full catch-up every 5th cycle)
  let pollTick = 0;
  const pollTimer = setInterval(() => {
    pollTick += 1;
    if (pendingQueue.size > 0) {
      void flushMutations();
    }
    if (pollTick % 5 === 0) {
      void pullRemoteState(0);
    } else {
      void pullRemoteState(lastSyncSince);
    }
  }, 6_000);

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
    }
  };

  window.addEventListener('focus', handleResume);
  window.addEventListener('online', handleResume);
  window.addEventListener('pageshow', handleResume);
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
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    started = false;
    cleanupFn = null;
  };

  return cleanupFn;
}
