import React, { useCallback, useEffect, useRef, useState } from 'react';

const IDB_NAME = 'smartschool_persistent_db';
const IDB_VERSION = 1;
const IDB_STORE = 'kv_store';
const PENDING_CLOUD_KEYS_KEY = 'smartschool_pending_cloud_keys_v1';

export type StorageWriteSource = 'local' | 'remote';

interface IdbRecord<T = unknown> {
  key: string;
  updatedAt: number;
  data: T;
}

type KeyListener = (data: unknown, updatedAt: number, source: StorageWriteSource) => void;
type LocalMutationListener = (key: string, data: unknown, updatedAt: number) => void;

const keyListeners = new Map<string, Set<KeyListener>>();
const localMutationListeners = new Set<LocalMutationListener>();
const memoryDualStore = new Map<string, { value: unknown; updatedAt: number }>();
let highestRemoteTimestamp = 0;
let serverClockOffsetMs = 0;

export const LOCAL_ONLY_KEYS = new Set<string>([
  'smartschool_current_user',
  'smartschool_workspace_mode',
  'smartschool_language_v1',
  'smartschool_teacher_selected_class_v1',
  'smartschool_parent_selected_child_v1',
  'smartschool_current_school_id',
  'smartschool_current_school_id_v1',
  'smartschool_single_school_test_v1',
  'smartschool_mode_demo_flag',
  'smartschool_cloud_workspace_id_v1',
  'smartschool_last_activity_v1',
  PENDING_CLOUD_KEYS_KEY,
]);

export function setServerClockOffset(serverTime: number): void {
  if (typeof serverTime !== 'number' || !Number.isFinite(serverTime) || serverTime <= 0) return;
  const offset = serverTime - Date.now();
  // Smooth large transient spikes only if reasonable; track direct server skew
  serverClockOffsetMs = offset;
}

export function getServerAlignedNow(): number {
  return Date.now() + serverClockOffsetMs;
}

export function isSyncableKey(key: string): boolean {
  if (!key || !key.startsWith('smartschool_')) return false;
  if (LOCAL_ONLY_KEYS.has(key)) return false;
  if (key.endsWith('__ts')) return false;
  return true;
}

export function getMonotonicWriteTimestamp(floorTs = 0): number {
  return Math.max(getServerAlignedNow(), highestRemoteTimestamp + 1, floorTs);
}

export function subscribeStorageKey(key: string, listener: KeyListener): () => void {
  let set = keyListeners.get(key);
  if (!set) {
    set = new Set();
    keyListeners.set(key, set);
  }
  set.add(listener);
  return () => {
    set?.delete(listener);
    if (set && set.size === 0) {
      keyListeners.delete(key);
    }
  };
}

export function onLocalStorageMutation(listener: LocalMutationListener): () => void {
  localMutationListeners.add(listener);
  return () => {
    localMutationListeners.delete(listener);
  };
}

export function getPendingCloudKeys(): string[] {
  try {
    const raw = localStorage.getItem(PENDING_CLOUD_KEYS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : [];
  } catch {
    return [];
  }
}

export function addPendingCloudKey(key: string): void {
  if (!isSyncableKey(key)) return;
  try {
    const current = new Set(getPendingCloudKeys());
    current.add(key);
    localStorage.setItem(PENDING_CLOUD_KEYS_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // ignore
  }
}

export function removePendingCloudKeys(keys: string[]): void {
  if (keys.length === 0) return;
  try {
    const current = new Set(getPendingCloudKeys());
    for (const k of keys) current.delete(k);
    localStorage.setItem(PENDING_CLOUD_KEYS_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // ignore
  }
}

export function listModifiedSyncableKeys(): string[] {
  const keys = new Set<string>(getPendingCloudKeys());
  for (const k of memoryDualStore.keys()) {
    if (isSyncableKey(k) && getLocalTimestamp(k) > 0) {
      keys.add(k);
    }
  }
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.endsWith('__ts')) {
        const base = k.slice(0, -4);
        if (isSyncableKey(base) && getLocalTimestamp(base) > 0) {
          keys.add(base);
        }
      } else if (isSyncableKey(k) && getLocalTimestamp(k) > 0) {
        keys.add(k);
      }
    }
  } catch {
    // ignore
  }
  return Array.from(keys);
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openPersistentDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  if (!dbPromise) {
    dbPromise = new Promise(resolve => {
      try {
        const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE, { keyPath: 'key' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

export async function idbGetRecord<T>(key: string): Promise<IdbRecord<T> | null> {
  const db = await openPersistentDb();
  if (!db) return null;
  return new Promise(resolve => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as IdbRecord<T>) || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbSetRecord<T>(key: string, data: T, updatedAt: number): Promise<void> {
  const db = await openPersistentDb();
  if (!db) return;
  return new Promise(resolve => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put({ key, updatedAt, data });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

function tsKey(key: string): string {
  return `${key}__ts`;
}

export function isIdbAuthoritative(key: string): boolean {
  try {
    const raw = localStorage.getItem(tsKey(key));
    return Boolean(raw && raw.startsWith('idb:'));
  } catch {
    return false;
  }
}

export function getLocalTimestamp(key: string): number {
  const memTs = memoryDualStore.get(key)?.updatedAt || 0;
  let lsTs = 0;
  try {
    const raw = localStorage.getItem(tsKey(key));
    if (raw) {
      const cleaned = raw.startsWith('idb:') ? raw.slice(4) : raw;
      const n = Number(cleaned);
      if (Number.isFinite(n)) lsTs = n;
    }
  } catch {
    lsTs = 0;
  }
  return Math.max(lsTs, memTs);
}

export async function hydrateKeysFromIdb(keys: string[]): Promise<void> {
  if (typeof window === 'undefined') return;
  await Promise.all(
    keys.map(async key => {
      const rec = await idbGetRecord<unknown>(key);
      if (!rec) return;
      const existing = memoryDualStore.get(key);
      if (!existing || rec.updatedAt >= existing.updatedAt) {
        memoryDualStore.set(key, { value: rec.data, updatedAt: rec.updatedAt });
      }
      if (isIdbAuthoritative(key) || localStorage.getItem(key) === null) {
        const listeners = keyListeners.get(key);
        if (listeners) {
          listeners.forEach(cb => {
            try {
              cb(rec.data, rec.updatedAt, 'remote');
            } catch {
              // ignore
            }
          });
        }
      }
    })
  );
}

export function loadLocalStorage<T>(
  key: string,
  fallback: T | (() => T),
  transform?: (loaded: T) => T
): T {
  const resolveFallback = (): T =>
    typeof fallback === 'function' ? (fallback as () => T)() : fallback;

  if (typeof window === 'undefined') return resolveFallback();

  const mem = memoryDualStore.get(key);
  const idbOnly = isIdbAuthoritative(key);

  if (mem && (idbOnly || mem.updatedAt >= getLocalTimestamp(key))) {
    const cloned = mem.value as T;
    return transform ? transform(cloned) : cloned;
  }

  if (!idbOnly) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw) as T;
        return transform ? transform(parsed) : parsed;
      }
    } catch {
      // ignore corrupted JSON
    }
  }

  if (mem) {
    const cloned = mem.value as T;
    return transform ? transform(cloned) : cloned;
  }

  const initial = resolveFallback();
  return transform ? transform(initial) : initial;
}

export async function readDualStorageValue(key: string): Promise<{ found: boolean; value: unknown }> {
  if (typeof window === 'undefined') return { found: false, value: null };
  const mem = memoryDualStore.get(key);
  const localTs = getLocalTimestamp(key);
  if (mem && mem.updatedAt >= localTs) {
    return { found: true, value: mem.value };
  }
  try {
    if (isIdbAuthoritative(key)) {
      const idbRec = await idbGetRecord<unknown>(key);
      if (idbRec) {
        memoryDualStore.set(key, { value: idbRec.data, updatedAt: idbRec.updatedAt });
        return { found: true, value: idbRec.data };
      }
    }
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      return { found: true, value: JSON.parse(raw) };
    }
  } catch {
    // ignore parse/storage error and try IDB fallback
  }
  const idbRec = await idbGetRecord<unknown>(key);
  if (idbRec) {
    memoryDualStore.set(key, { value: idbRec.data, updatedAt: idbRec.updatedAt });
    return { found: true, value: idbRec.data };
  }
  return { found: false, value: null };
}

export function resolveEffectiveWriteTimestamp(
  key: string,
  desiredTs = getMonotonicWriteTimestamp()
): number {
  const baseTs =
    Number.isFinite(desiredTs) && desiredTs > 0 ? desiredTs : getMonotonicWriteTimestamp();
  const prevLocalTs = getLocalTimestamp(key);
  return Math.max(baseTs, highestRemoteTimestamp + 1, prevLocalTs + 1);
}

export function saveDualStorage<T>(
  key: string,
  value: T,
  timestamp = getMonotonicWriteTimestamp(),
  source: StorageWriteSource = 'local'
): number {
  if (typeof window === 'undefined') return 0;

  let effectiveTs =
    Number.isFinite(timestamp) && timestamp > 0 ? timestamp : getMonotonicWriteTimestamp();
  if (source === 'remote') {
    if (effectiveTs > highestRemoteTimestamp) {
      highestRemoteTimestamp = effectiveTs;
    }
  } else {
    effectiveTs = resolveEffectiveWriteTimestamp(key, effectiveTs);
  }

  memoryDualStore.set(key, { value, updatedAt: effectiveTs });

  // Always write full payload to IndexedDB (handles large base64 files/photos seamlessly)
  void idbSetRecord(key, value, effectiveTs);

  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(tsKey(key), String(effectiveTs));
  } catch {
    // localStorage quota exceeded (e.g. large uploaded PDF/image) — remove stale localStorage payload & mark IDB as authoritative
    try {
      localStorage.removeItem(key);
      localStorage.setItem(tsKey(key), `idb:${effectiveTs}`);
    } catch {
      // ignore if even tiny timestamp cannot be stored
    }
  }

  // Notify mounted React subscribers for immediate real-time UI refresh
  const listeners = keyListeners.get(key);
  if (listeners) {
    listeners.forEach(cb => {
      try {
        cb(value, effectiveTs, source);
      } catch {
        // ignore listener failure
      }
    });
  }

  // Only queue & broadcast cloud push for real local mutations
  if (source === 'local' && isSyncableKey(key)) {
    addPendingCloudKey(key);
    localMutationListeners.forEach(cb => {
      try {
        cb(key, value, effectiveTs);
      } catch {
        // ignore listener failure
      }
    });
  }

  return effectiveTs;
}

/**
 * Persistent React state backed simultaneously by localStorage (fast sync load),
 * IndexedDB (large-payload & crash-resilient persistence), and real-time Cloud Sync.
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T | (() => T),
  transform?: (loaded: T) => T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => loadLocalStorage<T>(key, initialValue, transform));
  const stateRef = useRef<T>(state);
  const mountedAtRef = useRef<number>(getServerAlignedNow());
  const userMutatedRef = useRef<boolean>(false);
  const lastWrittenTsRef = useRef<number>(0);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  // Hydrate from IndexedDB on mount if IDB holds a newer or quota-overflowed snapshot
  useEffect(() => {
    let active = true;

    void idbGetRecord<T>(key).then(rec => {
      if (!active || !rec || userMutatedRef.current) return;
      // Read live timestamps AFTER await so stale IDB never clobbers fresh server/remote updates
      const liveTs = getLocalTimestamp(key);
      const idbAuthoritative = isIdbAuthoritative(key);
      const hasLocal = (() => {
        try {
          return localStorage.getItem(key) !== null && !idbAuthoritative;
        } catch {
          return false;
        }
      })();

      if (!hasLocal || idbAuthoritative || rec.updatedAt > liveTs) {
        memoryDualStore.set(key, { value: rec.data, updatedAt: rec.updatedAt });
        const next = transformRef.current ? transformRef.current(rec.data) : rec.data;
        if (!Object.is(next, stateRef.current)) {
          stateRef.current = next;
          setState(next);
        }
      }
    });

    // Listen for incoming remote cloud updates AND external cross-module updates on the same key
    const unsubscribe = subscribeStorageKey(key, (data, updatedAt, source) => {
      if (!active) return;
      if (source !== 'remote' && updatedAt === lastWrittenTsRef.current) return;
      const next = transformRef.current ? transformRef.current(data as T) : (data as T);
      if (Object.is(next, stateRef.current)) return;
      stateRef.current = next;
      setState(next);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [key]);

  // Persist every genuine local change synchronously outside React state updater
  const setPersistedState: React.Dispatch<React.SetStateAction<T>> = useCallback(
    valueOrUpdater => {
      const prev = stateRef.current;
      const next =
        typeof valueOrUpdater === 'function'
          ? (valueOrUpdater as (prevState: T) => T)(prev)
          : valueOrUpdater;

      // Ignore no-op updates (e.g. updater returning `prev` unchanged) so we never stamp bogus timestamps
      if (Object.is(next, prev)) {
        return;
      }

      userMutatedRef.current = true;
      stateRef.current = next;
      const writeTs = resolveEffectiveWriteTimestamp(
        key,
        getMonotonicWriteTimestamp(
          Math.max(mountedAtRef.current + 1, lastWrittenTsRef.current + 1)
        )
      );
      lastWrittenTsRef.current = writeTs;
      setState(next);
      saveDualStorage(key, next, writeTs, 'local');
    },
    [key]
  );

  return [state, setPersistedState];
}
