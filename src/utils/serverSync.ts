import {
  getLocalTimestamp,
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

function applyRemoteEntry(key: string, entry: RemoteStateEntry): void {
  if (!isSyncableKey(key) || !entry || typeof entry.updatedAt !== 'number') return;
  const localTs = getLocalTimestamp(key);
  if (entry.updatedAt > localTs) {
    saveDualStorage(key, entry.value, entry.updatedAt, 'remote');
  }
}

async function pushEntriesToServer(
  entries: Array<{ key: string; value: unknown; updatedAt: number }>
): Promise<void> {
  if (typeof window === 'undefined' || entries.length === 0) return;
  try {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries })
    });
  } catch {
    // Offline or transient network issue — local storage keeps pending state for next sync
  }
}

async function pullRemoteState(since = 0): Promise<Record<string, RemoteStateEntry> | null> {
  if (typeof window === 'undefined') return null;
  try {
    const url = since > 0 ? `/api/state?since=${encodeURIComponent(String(since))}` : '/api/state';
    const resp = await fetch(url);
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

async function reconcileInitialServerState(): Promise<void> {
  const remoteStates = await pullRemoteState(0);
  if (!remoteStates) return;

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
    await pushEntriesToServer(toPush);
  }
}

export function startServerSync(): () => void {
  if (typeof window === 'undefined') return () => undefined;
  if (started && cleanupFn) return cleanupFn;
  started = true;

  const pendingQueue = new Map<string, { value: unknown; updatedAt: number }>();
  let flushTimer: ReturnType<typeof setTimeout> | null = null;
  let eventSource: EventSource | null = null;

  const flushMutations = async () => {
    if (pendingQueue.size === 0) return;
    const entries = Array.from(pendingQueue.entries()).map(([key, item]) => ({
      key,
      value: item.value,
      updatedAt: item.updatedAt
    }));
    pendingQueue.clear();
    await pushEntriesToServer(entries);
  };

  const unsubMutations = onLocalStorageMutation((key, value, updatedAt) => {
    if (!isSyncableKey(key)) return;
    pendingQueue.set(key, { value, updatedAt });
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(() => {
      flushTimer = null;
      void flushMutations();
    }, 150);
  });

  // Initial state hydration & push of any offline local changes
  void reconcileInitialServerState();

  // Real-time Server-Sent Events stream for instant cross-browser sync
  if ('EventSource' in window) {
    try {
      eventSource = new EventSource('/api/state/stream');
      eventSource.addEventListener('state_update', (ev: MessageEvent) => {
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

      eventSource.addEventListener('comms_update', (ev: MessageEvent) => {
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
    } catch {
      // Fallback polling remains active below
    }
  }

  // Fallback poll every 8 seconds + instant catch-up when returning online or focusing tab
  const pollTimer = setInterval(() => {
    void pullRemoteState(lastSyncSince);
  }, 8_000);

  const handleResume = () => {
    void pullRemoteState(lastSyncSince);
    void syncSharedMessagesFromServer();
    void syncSharedRequestsFromServer();
  };

  window.addEventListener('focus', handleResume);
  window.addEventListener('online', handleResume);

  cleanupFn = () => {
    unsubMutations();
    if (flushTimer) clearTimeout(flushTimer);
    if (eventSource) eventSource.close();
    clearInterval(pollTimer);
    window.removeEventListener('focus', handleResume);
    window.removeEventListener('online', handleResume);
    started = false;
    cleanupFn = null;
  };

  return cleanupFn;
}
