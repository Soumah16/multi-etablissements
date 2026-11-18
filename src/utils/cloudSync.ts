import { User } from 'firebase/auth';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  getLocalTimestamp,
  isSyncableKey,
  listModifiedSyncableKeys,
  readDualStorageValue,
  removePendingCloudKeys,
  saveDualStorage,
} from './storage';

export const DEFAULT_WORKSPACE_ID = 'smartschool-guinee-main';
export const BOOTSTRAP_ADMIN_EMAIL = 'saidprince712@gmail.com';
const CLOUD_WORKSPACE_STORAGE_KEY = 'smartschool_cloud_workspace_id_v1';
const MAX_SAFE_PAYLOAD_BYTES = 820_000;

export interface WorkspaceInfo {
  id: string;
  name: string;
  ownerUid: string;
  memberUids: string[];
  status: 'active' | 'archived';
}

export interface SyncMetaRecord {
  ownerUid: string;
  memberUids: string[];
  clientUpdatedAt: number;
}

export function sanitizeDocId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 128);
  return cleaned.length > 0 ? cleaned : 'doc_default';
}

export function getSavedWorkspaceId(): string {
  try {
    const saved = localStorage.getItem(CLOUD_WORKSPACE_STORAGE_KEY);
    if (saved && /^[a-zA-Z0-9_\-]{1,128}$/.test(saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return DEFAULT_WORKSPACE_ID;
}

export function setSavedWorkspaceId(workspaceId: string): void {
  try {
    localStorage.setItem(CLOUD_WORKSPACE_STORAGE_KEY, sanitizeDocId(workspaceId));
  } catch {
    // ignore
  }
}

function getDeviceLabel(): string {
  if (typeof navigator === 'undefined') return 'Navigateur Web';
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'Téléphone Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'Appareil iOS';
  if (/Windows/i.test(ua)) return 'Ordinateur Windows';
  if (/Mac/i.test(ua)) return 'Ordinateur Mac';
  return 'Navigateur Web';
}

/**
 * Recursively strip undefined, functions, and non-finite numbers so Firestore
 * never rejects the map payload.
 */
function sanitizeFirestoreValue(val: unknown, stripLargeBase64 = false): unknown {
  if (val === null || val === undefined) return null;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
  if (typeof val === 'string') {
    if (stripLargeBase64 && val.startsWith('data:') && val.length > 16_000) {
      return '';
    }
    return val;
  }
  if (Array.isArray(val)) {
    return val.map(item => sanitizeFirestoreValue(item, stripLargeBase64));
  }
  if (typeof val === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (v === undefined || typeof v === 'function' || typeof v === 'symbol') continue;
      out[k] = sanitizeFirestoreValue(v, stripLargeBase64);
    }
    return out;
  }
  return String(val);
}

/**
 * Programmatic volumetric guard keeping every Firestore document cleanly under 1MB.
 */
export function enforcePayloadBudget(rawValue: unknown): {
  safeValue: unknown;
  trimmedLargeAttachments: boolean;
} {
  const firstPass = sanitizeFirestoreValue(rawValue, false);
  const encoder = new TextEncoder();
  const initialSize = encoder.encode(JSON.stringify({ v: firstPass })).length;
  if (initialSize <= MAX_SAFE_PAYLOAD_BYTES) {
    return { safeValue: firstPass, trimmedLargeAttachments: false };
  }

  // Strip oversized inline base64 blobs (>16KB) from cloud mirror while preserving local IndexedDB copy
  const stripped = sanitizeFirestoreValue(rawValue, true);
  const strippedSize = encoder.encode(JSON.stringify({ v: stripped })).length;
  if (strippedSize <= MAX_SAFE_PAYLOAD_BYTES) {
    return { safeValue: stripped, trimmedLargeAttachments: true };
  }

  // Fallback array tail trim if a log list grows extraordinarily huge
  if (Array.isArray(stripped)) {
    let items = [...stripped];
    while (items.length > 10 && encoder.encode(JSON.stringify({ v: items })).length > MAX_SAFE_PAYLOAD_BYTES) {
      items = items.slice(Math.floor(items.length * 0.2));
    }
    return { safeValue: items, trimmedLargeAttachments: true };
  }

  return { safeValue: stripped, trimmedLargeAttachments: true };
}

export async function ensureUserProfiles(user: User, workspaceId: string): Promise<void> {
  const displayName = (user.displayName || user.email?.split('@')[0] || 'Utilisateur').slice(0, 120);
  const email = (user.email || '').slice(0, 254);
  const safeWs = sanitizeDocId(workspaceId);

  const publicRef = doc(db, 'users', user.uid, 'public', 'info');
  const publicPath = `users/${user.uid}/public/info`;
  try {
    const pubSnap = await getDoc(publicRef);
    if (!pubSnap.exists()) {
      await setDoc(publicRef, {
        uid: user.uid,
        displayName,
        activeWorkspaceId: safeWs,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(publicRef, {
        displayName,
        activeWorkspaceId: safeWs,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, publicPath);
  }

  const privateRef = doc(db, 'users', user.uid, 'private', 'profile');
  const privatePath = `users/${user.uid}/private/profile`;
  try {
    const privSnap = await getDoc(privateRef);
    if (!privSnap.exists()) {
      await setDoc(privateRef, {
        uid: user.uid,
        email,
        displayName,
        activeWorkspaceId: safeWs,
        deviceLabel: getDeviceLabel().slice(0, 100),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(privateRef, {
        email,
        displayName,
        activeWorkspaceId: safeWs,
        deviceLabel: getDeviceLabel().slice(0, 100),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, privatePath);
  }
}

async function ensureOwnerMemberDoc(
  workspaceId: string,
  workspaceOwnerUid: string,
  user: User
): Promise<void> {
  const memberRef = doc(db, 'workspaces', workspaceId, 'members', user.uid);
  const memberPath = `workspaces/${workspaceId}/members/${user.uid}`;
  const displayName = (user.displayName || user.email?.split('@')[0] || 'Administrateur').slice(0, 120);
  try {
    const snap = await getDoc(memberRef);
    if (!snap.exists()) {
      await setDoc(memberRef, {
        uid: user.uid,
        workspaceId,
        ownerUid: workspaceOwnerUid,
        displayName,
        role: workspaceOwnerUid === user.uid ? 'owner' : 'editor',
        status: 'active',
        inviteCode: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, memberPath);
  }
}

export async function bootstrapOrResolveWorkspace(user: User): Promise<WorkspaceInfo> {
  const preferredId = getSavedWorkspaceId();

  // 1. Check workspaces where user is already a member
  const listPath = 'workspaces';
  try {
    const q = query(
      collection(db, 'workspaces'),
      where('memberUids', 'array-contains', user.uid),
      limit(10)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const preferredDoc = snap.docs.find(d => d.id === preferredId) || snap.docs[0];
      const data = preferredDoc.data();
      const wsInfo: WorkspaceInfo = {
        id: preferredDoc.id,
        name: String(data.name || 'SmartSchool ERP Guinée'),
        ownerUid: String(data.ownerUid || user.uid),
        memberUids: Array.isArray(data.memberUids) ? data.memberUids.map(String) : [user.uid],
        status: data.status === 'archived' ? 'archived' : 'active',
      };
      setSavedWorkspaceId(wsInfo.id);
      if (wsInfo.ownerUid === user.uid) {
        await ensureOwnerMemberDoc(wsInfo.id, wsInfo.ownerUid, user);
      }
      return wsInfo;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, listPath);
  }

  // 2. If bootstrapped admin, check or initialize the primary national workspace
  const isBootstrapped =
    Boolean(user.emailVerified) && user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL;
  const targetWsId = isBootstrapped
    ? DEFAULT_WORKSPACE_ID
    : sanitizeDocId(`ws-${user.uid.slice(0, 20)}`);
  const wsRef = doc(db, 'workspaces', targetWsId);
  const wsPath = `workspaces/${targetWsId}`;

  try {
    const existingSnap = await getDoc(wsRef);
    if (existingSnap.exists()) {
      const data = existingSnap.data();
      const currentMembers = Array.isArray(data.memberUids) ? data.memberUids.map(String) : [];
      if (!currentMembers.includes(user.uid) && isBootstrapped) {
        await updateDoc(wsRef, {
          memberUids: arrayUnion(user.uid),
          updatedAt: serverTimestamp(),
        });
        currentMembers.push(user.uid);
      }
      const wsInfo: WorkspaceInfo = {
        id: existingSnap.id,
        name: String(data.name || "Lycée d'Excellence de Conakry"),
        ownerUid: String(data.ownerUid || user.uid),
        memberUids: currentMembers.length > 0 ? currentMembers : [user.uid],
        status: data.status === 'archived' ? 'archived' : 'active',
      };
      setSavedWorkspaceId(wsInfo.id);
      await ensureOwnerMemberDoc(wsInfo.id, wsInfo.ownerUid, user);
      return wsInfo;
    }

    // Create fresh workspace owned by current verified user
    const wsName = isBootstrapped
      ? "Lycée d'Excellence de Conakry · ERP"
      : `Espace École · ${(user.displayName || user.email || 'Cloud').slice(0, 60)}`;
    await setDoc(wsRef, {
      id: targetWsId,
      name: wsName,
      ownerUid: user.uid,
      memberUids: [user.uid],
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await ensureOwnerMemberDoc(targetWsId, user.uid, user);
    setSavedWorkspaceId(targetWsId);
    return {
      id: targetWsId,
      name: wsName,
      ownerUid: user.uid,
      memberUids: [user.uid],
      status: 'active',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, wsPath);
  }
}

export async function pushSyncKeyToCloud(params: {
  user: User;
  workspaceId: string;
  workspaceOwnerUid: string;
  memberUids: string[];
  rawKey: string;
  value: unknown;
  clientUpdatedAt: number;
  knownSyncMeta: Map<string, SyncMetaRecord>;
}): Promise<{ trimmedLargeAttachments: boolean }> {
  const {
    user,
    workspaceId,
    workspaceOwnerUid,
    memberUids,
    rawKey,
    value,
    clientUpdatedAt,
    knownSyncMeta,
  } = params;

  if (!isSyncableKey(rawKey)) {
    return { trimmedLargeAttachments: false };
  }

  const stateKey = sanitizeDocId(rawKey);
  const docRef = doc(db, 'workspaces', workspaceId, 'syncStates', stateKey);
  const docPath = `workspaces/${workspaceId}/syncStates/${stateKey}`;

  const { safeValue, trimmedLargeAttachments } = enforcePayloadBudget(value);
  const boundedMembers = Array.from(new Set([workspaceOwnerUid, user.uid, ...memberUids])).slice(
    0,
    50
  );

  try {
    let meta = knownSyncMeta.get(stateKey);
    if (!meta) {
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        const data = existing.data();
        meta = {
          ownerUid: String(data.ownerUid || workspaceOwnerUid),
          memberUids: Array.isArray(data.memberUids) ? data.memberUids.map(String) : boundedMembers,
          clientUpdatedAt: Number(data.clientUpdatedAt || 0),
        };
        knownSyncMeta.set(stateKey, meta);
      }
    }

    if (meta) {
      // Skip redundant write if cloud is already newer or equal
      if (meta.clientUpdatedAt >= clientUpdatedAt) {
        removePendingCloudKeys([rawKey]);
        return { trimmedLargeAttachments };
      }
      await updateDoc(docRef, {
        payload: { v: safeValue },
        clientUpdatedAt,
        updatedByUid: user.uid,
        memberUids: boundedMembers,
        updatedAt: serverTimestamp(),
      });
      meta.clientUpdatedAt = clientUpdatedAt;
      meta.memberUids = boundedMembers;
    } else {
      await setDoc(docRef, {
        key: stateKey,
        workspaceId,
        ownerUid: workspaceOwnerUid,
        updatedByUid: user.uid,
        memberUids: boundedMembers,
        payload: { v: safeValue },
        clientUpdatedAt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      knownSyncMeta.set(stateKey, {
        ownerUid: workspaceOwnerUid,
        memberUids: boundedMembers,
        clientUpdatedAt,
      });
    }

    removePendingCloudKeys([rawKey]);
    return { trimmedLargeAttachments };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function pushAllLocalKeysToCloud(params: {
  user: User;
  workspaceId: string;
  workspaceOwnerUid: string;
  memberUids: string[];
  knownSyncMeta: Map<string, SyncMetaRecord>;
  extraKeys?: string[];
}): Promise<{ pushedCount: number; trimmedAny: boolean }> {
  const { user, workspaceId, workspaceOwnerUid, memberUids, knownSyncMeta, extraKeys = [] } = params;
  const candidateKeys = Array.from(new Set([...listModifiedSyncableKeys(), ...extraKeys])).filter(
    isSyncableKey
  );

  let pushedCount = 0;
  let trimmedAny = false;

  for (const key of candidateKeys) {
    try {
      const { found, value } = await readDualStorageValue(key);
      if (!found) continue;
      const localTs = getLocalTimestamp(key) || Date.now();
      const remoteMeta = knownSyncMeta.get(sanitizeDocId(key));
      if (remoteMeta && remoteMeta.clientUpdatedAt >= localTs) {
        removePendingCloudKeys([key]);
        continue;
      }
      const res = await pushSyncKeyToCloud({
        user,
        workspaceId,
        workspaceOwnerUid,
        memberUids,
        rawKey: key,
        value,
        clientUpdatedAt: localTs,
        knownSyncMeta,
      });
      pushedCount += 1;
      if (res.trimmedLargeAttachments) trimmedAny = true;
    } catch {
      // continue pushing remaining keys cleanly
    }
  }

  return { pushedCount, trimmedAny };
}

export async function createWorkspaceInvite(params: {
  user: User;
  workspaceId: string;
  invitedEmail?: string;
  role?: 'editor' | 'viewer';
}): Promise<string> {
  const { user, workspaceId, invitedEmail = '', role = 'editor' } = params;
  const randomSuffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  const inviteCode = sanitizeDocId(`INV-${randomSuffix}`);
  const inviteRef = doc(db, 'workspaces', workspaceId, 'invites', inviteCode);
  const invitePath = `workspaces/${workspaceId}/invites/${inviteCode}`;

  try {
    await setDoc(inviteRef, {
      id: inviteCode,
      workspaceId,
      ownerUid: user.uid,
      invitedEmail: invitedEmail.trim().toLowerCase().slice(0, 254),
      role,
      status: 'pending',
      acceptedByUid: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return inviteCode;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, invitePath);
  }
}

export function parseInviteAccessInput(rawWs: string, rawCode: string): {
  workspaceId: string;
  inviteCode: string;
} {
  let ws = rawWs.trim();
  let code = rawCode.trim();
  const combinedSource = [rawWs, rawCode].find(s => /INV-[A-Z0-9]+/i.test(s) && /ID\s*Espace/i.test(s));
  if (combinedSource) {
    const wsMatch = combinedSource.match(/ID\s*Espace\s*:\s*([^\s|]+)/i);
    const codeMatch = combinedSource.match(/(?:Code(?:\s*d['’]invitation)?\s*:\s*|)(INV-[A-Z0-9]+)/i);
    if (wsMatch?.[1]) ws = wsMatch[1].trim();
    if (codeMatch?.[1]) code = codeMatch[1].trim();
  }
  return {
    workspaceId: ws,
    inviteCode: code.toUpperCase(),
  };
}

export async function redeemWorkspaceInvite(params: {
  user: User;
  workspaceId: string;
  inviteCode: string;
}): Promise<WorkspaceInfo> {
  const { user, workspaceId, inviteCode } = params;
  const parsed = parseInviteAccessInput(workspaceId, inviteCode);

  if (!parsed.workspaceId || parsed.workspaceId.includes('@')) {
    throw new Error(
      "ID d'espace invalide. Ne saisissez pas une adresse email : copiez exactement l'ID d'espace affiché sur l'autre appareil (ex: ws-... ou smartschool-guinee-main)."
    );
  }
  if (!parsed.inviteCode || !parsed.inviteCode.startsWith('INV-') || parsed.inviteCode.length < 6) {
    throw new Error(
      "Code d'invitation invalide. Générez un code sur l'autre appareil (ex: INV-XXXXXX) via « Créer un code »."
    );
  }

  const cleanWsId = sanitizeDocId(parsed.workspaceId);
  const cleanCode = sanitizeDocId(parsed.inviteCode);

  const inviteRef = doc(db, 'workspaces', cleanWsId, 'invites', cleanCode);

  let inviteData: Record<string, unknown>;
  try {
    const inviteSnap = await getDoc(inviteRef);
    if (!inviteSnap.exists()) {
      throw new Error("Code d'invitation introuvable pour cet espace.");
    }
    inviteData = inviteSnap.data();
    if (inviteData.status !== 'pending') {
      throw new Error("Ce code d'invitation a déjà été utilisé ou révoqué.");
    }
    const invitedEmail = String(inviteData.invitedEmail || '').trim().toLowerCase();
    if (invitedEmail && invitedEmail !== (user.email || '').toLowerCase()) {
      throw new Error(`Ce code est réservé au compte Google ${invitedEmail}.`);
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Code d'invitation") ||
        error.message.includes("Ce code") ||
        error.message.includes("ID d'espace"))
    ) {
      throw error;
    }
    throw new Error(
      "Espace ou code d'invitation introuvable (ou réservé à un autre compte Google). Copiez exactement l'ID d'espace et le code générés sur l'appareil principal."
    );
  }

  const wsOwnerUid = String(inviteData.ownerUid || '');
  const role = inviteData.role === 'viewer' ? 'viewer' : 'editor';
  const displayName = (user.displayName || user.email?.split('@')[0] || 'Collaborateur').slice(0, 120);

  const wsRef = doc(db, 'workspaces', cleanWsId);
  const memberRef = doc(db, 'workspaces', cleanWsId, 'members', user.uid);

  const batch = writeBatch(db);
  batch.update(inviteRef, {
    status: 'accepted',
    acceptedByUid: user.uid,
    updatedAt: serverTimestamp(),
  });
  batch.set(memberRef, {
    uid: user.uid,
    workspaceId: cleanWsId,
    ownerUid: wsOwnerUid,
    displayName,
    role,
    status: 'active',
    inviteCode: cleanCode,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.update(wsRef, {
    memberUids: arrayUnion(user.uid),
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `workspaces/${cleanWsId}/invites/${cleanCode}`);
  }

  setSavedWorkspaceId(cleanWsId);

  try {
    const wsSnap = await getDoc(wsRef);
    const data = wsSnap.data() || {};
    return {
      id: cleanWsId,
      name: String(data.name || 'SmartSchool ERP Guinée'),
      ownerUid: String(data.ownerUid || wsOwnerUid),
      memberUids: Array.isArray(data.memberUids) ? data.memberUids.map(String) : [wsOwnerUid, user.uid],
      status: data.status === 'archived' ? 'archived' : 'active',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `workspaces/${cleanWsId}`);
  }
}

export async function propagateMemberUidsToSyncStates(params: {
  user: User;
  workspaceId: string;
  memberUids: string[];
}): Promise<void> {
  const { user, workspaceId, memberUids } = params;
  const bounded = Array.from(new Set(memberUids)).slice(0, 50);
  const statesPath = `workspaces/${workspaceId}/syncStates`;

  try {
    const q = query(
      collection(db, 'workspaces', workspaceId, 'syncStates'),
      where('memberUids', 'array-contains', user.uid)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    let updatesCount = 0;

    snap.docs.forEach(d => {
      const existingUids: string[] = Array.isArray(d.data().memberUids)
        ? d.data().memberUids.map(String)
        : [];
      const missing = bounded.some(uid => !existingUids.includes(uid));
      if (missing) {
        batch.update(d.ref, {
          memberUids: bounded,
          updatedByUid: user.uid,
          updatedAt: serverTimestamp(),
        });
        updatesCount += 1;
      }
    });

    if (updatesCount > 0) {
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, statesPath);
  }
}

export function attachWorkspaceSyncListeners(params: {
  user: User;
  workspaceId: string;
  knownSyncMeta: Map<string, SyncMetaRecord>;
  onWorkspaceUpdated: (ws: WorkspaceInfo) => void;
  onSyncApplied: (appliedKeys: string[], syncedAt: number) => void;
  onError: (err: Error) => void;
}): () => void {
  const { user, workspaceId, knownSyncMeta, onWorkspaceUpdated, onSyncApplied, onError } = params;

  const wsRef = doc(db, 'workspaces', workspaceId);
  const wsPath = `workspaces/${workspaceId}`;

  const unsubWorkspace = onSnapshot(
    wsRef,
    snap => {
      if (!snap.exists()) return;
      const data = snap.data();
      onWorkspaceUpdated({
        id: snap.id,
        name: String(data.name || 'SmartSchool ERP Guinée'),
        ownerUid: String(data.ownerUid || user.uid),
        memberUids: Array.isArray(data.memberUids) ? data.memberUids.map(String) : [user.uid],
        status: data.status === 'archived' ? 'archived' : 'active',
      });
    },
    error => {
      try {
        handleFirestoreError(error, OperationType.GET, wsPath);
      } catch (wrapped) {
        onError(wrapped as Error);
      }
    }
  );

  const statesPath = `workspaces/${workspaceId}/syncStates`;
  const statesQuery = query(
    collection(db, 'workspaces', workspaceId, 'syncStates'),
    where('memberUids', 'array-contains', user.uid)
  );

  const unsubStates = onSnapshot(
    statesQuery,
    snapshot => {
      const appliedKeys: string[] = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const key = String(data.key || docSnap.id);
        const remoteTs = Number(data.clientUpdatedAt || 0);
        const ownerUid = String(data.ownerUid || user.uid);
        const memberUids = Array.isArray(data.memberUids) ? data.memberUids.map(String) : [user.uid];

        knownSyncMeta.set(key, {
          ownerUid,
          memberUids,
          clientUpdatedAt: remoteTs,
        });

        const payloadMap = data.payload as { v?: unknown } | undefined;
        if (!payloadMap || !('v' in payloadMap)) continue;

        const localTs = getLocalTimestamp(key);
        if (localTs === 0 || remoteTs > localTs) {
          saveDualStorage(key, payloadMap.v, remoteTs, 'remote');
          removePendingCloudKeys([key]);
          appliedKeys.push(key);
        } else if (remoteTs === localTs) {
          removePendingCloudKeys([key]);
        }
      }

      onSyncApplied(appliedKeys, Date.now());
    },
    error => {
      try {
        handleFirestoreError(error, OperationType.LIST, statesPath);
      } catch (wrapped) {
        onError(wrapped as Error);
      }
    }
  );

  return () => {
    unsubWorkspace();
    unsubStates();
  };
}
