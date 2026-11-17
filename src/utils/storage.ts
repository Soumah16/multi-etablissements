import React, { useEffect, useRef, useState } from 'react';

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

const LOCAL_ONLY_KEYS = new Set<string>([
  'smartschool_current_user',
  'smartschool_workspace_mode',
  'smartschool_language_v1',
  'smartschool_teacher_selected_class_v1',
  'smartschool_parent_selected_child_v1',
  'smartschool_current_school_id',
  'smartschool_single_school_test_v1',
  'smartschool_mode_demo_flag',
  'smartschool_cloud_workspace_id_v1',
  PENDING_CLOUD_KEYS_KEY,
]);

export function isSyncableKey(key: string): boolean {
  if (!key || !key.startsWith('smartschool_')) return false;
  if (LOCAL_ONLY_KEYS.has(key)) return false;
  if (key.endsWith('__ts')) return false;
  return true;
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

export function getLocalTimestamp(key: string): number {
  try {
    const raw = localStorage.getItem(tsKey(key));
    if (!raw) return 0;
    const cleaned = raw.startsWith('idb:') ? raw.slice(4) : raw;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export function loadLocalStorage<T>(
  key: string,
  fallback: T | (() => T),
  transform?: (loaded: T) => T
): T {
  const resolveFallback = (): T =>
    typeof fallback === 'function' ? (fallback as () => T)() : fallback;

  if (typeof window === 'undefined') return resolveFallback();

  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw) as T;
      return transform ? transform(parsed) : parsed;
    }
  } catch {
    // ignore corrupted JSON
  }
  const initial = resolveFallback();
  return transform ? transform(initial) : initial;
}

export async function readDualStorageValue(key: string): Promise<{ found: boolean; value: unknown }> {
  if (typeof window === 'undefined') return { found: false, value: null };
  try {
    const tsMarker = localStorage.getItem(tsKey(key));
    if (tsMarker && tsMarker.startsWith('idb:')) {
      const idbRec = await idbGetRecord<unknown>(key);
      if (idbRec) return { found: true, value: idbRec.data };
    }
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      return { found: true, value: JSON.parse(raw) };
    }
  } catch {
    // ignore parse/storage error and try IDB fallback
  }
  const idbRec = await idbGetRecord<unknown>(key);
  if (idbRec) return { found: true, value: idbRec.data };
  return { found: false, value: null };
}

export function saveDualStorage<T>(
  key: string,
  value: T,
  timestamp = Date.now(),
  source: StorageWriteSource = 'local'
): void {
  if (typeof window === 'undefined') return;

  // Always write full payload to IndexedDB (handles large base64 files/photos seamlessly)
  void idbSetRecord(key, value, timestamp);

  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(tsKey(key), String(timestamp));
  } catch {
    // localStorage quota exceeded (e.g. large uploaded PDF/image) — mark IDB as authoritative
    try {
      localStorage.setItem(tsKey(key), `idb:${timestamp}`);
    } catch {
      // ignore if even tiny timestamp cannot be stored
    }
  }

  // Notify mounted React subscribers for immediate real-time UI refresh
  const listeners = keyListeners.get(key);
  if (listeners) {
    listeners.forEach(cb => {
      try {
        cb(value, timestamp, source);
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
        cb(key, value, timestamp);
      } catch {
        // ignore listener failure
      }
    });
  }
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
  const mountedAtRef = useRef<number>(Date.now());
  const userMutatedRef = useRef<boolean>(false);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  // Hydrate from IndexedDB on mount if IDB holds a newer or quota-overflowed snapshot
  useEffect(() => {
    let active = true;
    const localTs = getLocalTimestamp(key);
    const hasLocal = (() => {
      try {
        return localStorage.getItem(key) !== null;
      } catch {
        return false;
      }
    })();

    void idbGetRecord<T>(key).then(rec => {
      if (!active || !rec || userMutatedRef.current) return;
      if (!hasLocal || rec.updatedAt > localTs) {
        const next = transformRef.current ? transformRef.current(rec.data) : rec.data;
        setState(next);
      }
    });

    // Listen for incoming remote cloud updates (from other phones/PCs)
    const unsubscribeRemote = subscribeStorageKey(key, (data, _updatedAt, source) => {
      if (!active || source !== 'remote') return;
      const next = transformRef.current ? transformRef.current(data as T) : (data as T);
      setState(next);
    });

    return () => {
      active = false;
      unsubscribeRemote();
    };
  }, [key]);

  // Persist every local change immediately to localStorage, IndexedDB, and Cloud Sync queue
  const setPersistedState: React.Dispatch<React.SetStateAction<T>> = valueOrUpdater => {
    userMutatedRef.current = true;
    setState(prev => {
      const next =
        typeof valueOrUpdater === 'function'
          ? (valueOrUpdater as (prevState: T) => T)(prev)
          : valueOrUpdater;
      saveDualStorage(key, next, Math.max(Date.now(), mountedAtRef.current + 1), 'local');
      return next;
    });
  };

  return [state, setPersistedState];
}
