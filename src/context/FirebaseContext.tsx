import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import {
  attachWorkspaceSyncListeners,
  bootstrapOrResolveWorkspace,
  createWorkspaceInvite,
  DEFAULT_WORKSPACE_ID,
  ensureUserProfiles,
  propagateMemberUidsToSyncStates,
  pushAllLocalKeysToCloud,
  pushSyncKeyToCloud,
  redeemWorkspaceInvite,
  SyncMetaRecord,
  WorkspaceInfo,
} from '../utils/cloudSync';
import { getLocalTimestamp, onLocalStorageMutation } from '../utils/storage';

export type CloudSyncStatus = 'disconnected' | 'connecting' | 'synced' | 'syncing' | 'error';

interface FirebaseContextValue {
  firebaseUser: User | null;
  isAuthReady: boolean;
  syncStatus: CloudSyncStatus;
  lastSyncedAt: number | null;
  workspace: WorkspaceInfo | null;
  cloudError: string | null;
  showCloudModal: boolean;
  setShowCloudModal: (open: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signOutGoogle: () => Promise<void>;
  forceSyncNow: () => Promise<number>;
  generateInviteCode: (invitedEmail?: string, role?: 'editor' | 'viewer') => Promise<string>;
  joinWorkspaceByInvite: (workspaceId: string, inviteCode: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('disconnected');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [showCloudModal, setShowCloudModal] = useState<boolean>(false);

  const knownSyncMetaRef = useRef<Map<string, SyncMetaRecord>>(new Map());
  const workspaceRef = useRef<WorkspaceInfo | null>(null);
  const userRef = useRef<User | null>(null);
  const pendingPushKeysRef = useRef<Set<string>>(new Set());
  const debounceTimerRef = useRef<number | null>(null);
  const unsubSyncRef = useRef<(() => void) | null>(null);

  workspaceRef.current = workspace;
  userRef.current = firebaseUser;

  const flushPendingPushes = useCallback(async () => {
    const user = userRef.current;
    const ws = workspaceRef.current;
    if (!user || !user.emailVerified || !ws) return;
    if (pendingPushKeysRef.current.size === 0) return;

    const keysToPush = Array.from(pendingPushKeysRef.current);
    pendingPushKeysRef.current.clear();

    setSyncStatus('syncing');
    for (const key of keysToPush) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) continue;
        const parsed = JSON.parse(raw);
        const ts = getLocalTimestamp(key) || Date.now();
        await pushSyncKeyToCloud({
          user,
          workspaceId: ws.id,
          workspaceOwnerUid: ws.ownerUid,
          memberUids: ws.memberUids,
          rawKey: key,
          value: parsed,
          clientUpdatedAt: ts,
          knownSyncMeta: knownSyncMetaRef.current,
        });
      } catch (err) {
        setCloudError(err instanceof Error ? err.message : String(err));
        setSyncStatus('error');
        return;
      }
    }
    setLastSyncedAt(Date.now());
    setSyncStatus('synced');
  }, []);

  // Queue local modifications for debounced real-time push to Firestore
  useEffect(() => {
    const unsubMutation = onLocalStorageMutation(key => {
      pendingPushKeysRef.current.add(key);
      if (!userRef.current || !workspaceRef.current) return;
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = window.setTimeout(() => {
        void flushPendingPushes();
      }, 350);
    });
    return () => {
      unsubMutation();
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [flushPendingPushes]);

  const startWorkspaceListeners = useCallback(
    async (user: User) => {
      if (unsubSyncRef.current) {
        unsubSyncRef.current();
        unsubSyncRef.current = null;
      }
      knownSyncMetaRef.current.clear();
      setSyncStatus('connecting');
      setCloudError(null);

      try {
        const resolvedWs = await bootstrapOrResolveWorkspace(user);
        await ensureUserProfiles(user, resolvedWs.id);
        setWorkspace(resolvedWs);
        workspaceRef.current = resolvedWs;

        unsubSyncRef.current = attachWorkspaceSyncListeners({
          user,
          workspaceId: resolvedWs.id,
          knownSyncMeta: knownSyncMetaRef.current,
          onWorkspaceUpdated: nextWs => {
            const prevCount = workspaceRef.current?.memberUids.length || 0;
            setWorkspace(nextWs);
            workspaceRef.current = nextWs;
            if (nextWs.memberUids.length > prevCount && nextWs.ownerUid === user.uid) {
              void propagateMemberUidsToSyncStates({
                user,
                workspaceId: nextWs.id,
                memberUids: nextWs.memberUids,
              });
            }
          },
          onSyncApplied: (_appliedKeys, syncedAt) => {
            setLastSyncedAt(syncedAt);
            setSyncStatus('synced');
          },
          onError: err => {
            setCloudError(err.message);
            setSyncStatus('error');
          },
        });

        // Push any local pending edits made offline or prior to sign-in
        const pushed = await pushAllLocalKeysToCloud({
          user,
          workspaceId: resolvedWs.id,
          workspaceOwnerUid: resolvedWs.ownerUid,
          memberUids: resolvedWs.memberUids,
          knownSyncMeta: knownSyncMetaRef.current,
        });
        if (pushed.pushedCount > 0) {
          setLastSyncedAt(Date.now());
        }
        setSyncStatus('synced');
      } catch (err) {
        setCloudError(err instanceof Error ? err.message : String(err));
        setSyncStatus('error');
      }
    },
    []
  );

  // Firebase Auth listener — strictly attach Firestore listeners ONLY after auth & emailVerified
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setFirebaseUser(user);
      setIsAuthReady(true);

      if (unsubSyncRef.current) {
        unsubSyncRef.current();
        unsubSyncRef.current = null;
      }

      if (user && user.emailVerified) {
        void startWorkspaceListeners(user);
      } else {
        setWorkspace(null);
        workspaceRef.current = null;
        setSyncStatus('disconnected');
        setLastSyncedAt(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubSyncRef.current) {
        unsubSyncRef.current();
      }
    };
  }, [startWorkspaceListeners]);

  const signInWithGoogle = async () => {
    setCloudError(null);
    setSyncStatus('connecting');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setSyncStatus('error');
      const message =
        err instanceof Error ? err.message : 'Connexion Google annulée ou bloquée par le navigateur.';
      setCloudError(message);
      throw err;
    }
  };

  const signOutGoogle = async () => {
    if (unsubSyncRef.current) {
      unsubSyncRef.current();
      unsubSyncRef.current = null;
    }
    await signOut(auth);
    setWorkspace(null);
    workspaceRef.current = null;
    setSyncStatus('disconnected');
    setCloudError(null);
  };

  const forceSyncNow = async (): Promise<number> => {
    const user = userRef.current;
    const ws = workspaceRef.current;
    if (!user || !user.emailVerified || !ws) {
      throw new Error('Veuillez d’abord connecter un compte Google.');
    }
    setSyncStatus('syncing');
    setCloudError(null);
    try {
      await flushPendingPushes();
      const res = await pushAllLocalKeysToCloud({
        user,
        workspaceId: ws.id,
        workspaceOwnerUid: ws.ownerUid,
        memberUids: ws.memberUids,
        knownSyncMeta: knownSyncMetaRef.current,
      });
      setLastSyncedAt(Date.now());
      setSyncStatus('synced');
      return res.pushedCount;
    } catch (err) {
      setCloudError(err instanceof Error ? err.message : String(err));
      setSyncStatus('error');
      throw err;
    }
  };

  const generateInviteCode = async (
    invitedEmail = '',
    role: 'editor' | 'viewer' = 'editor'
  ): Promise<string> => {
    const user = userRef.current;
    const ws = workspaceRef.current;
    if (!user || !ws) {
      throw new Error('Connectez-vous au Cloud avant de générer un code d’invitation.');
    }
    const code = await createWorkspaceInvite({
      user,
      workspaceId: ws.id,
      invitedEmail,
      role,
    });
    return code;
  };

  const joinWorkspaceByInvite = async (workspaceId: string, inviteCode: string): Promise<void> => {
    const user = userRef.current;
    if (!user || !user.emailVerified) {
      throw new Error('Veuillez d’abord connecter votre compte Google.');
    }
    setSyncStatus('connecting');
    setCloudError(null);
    try {
      await redeemWorkspaceInvite({
        user,
        workspaceId: workspaceId.trim() || DEFAULT_WORKSPACE_ID,
        inviteCode,
      });
      await startWorkspaceListeners(user);
    } catch (err) {
      setSyncStatus('error');
      const msg = err instanceof Error ? err.message : String(err);
      setCloudError(msg);
      throw err;
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        firebaseUser,
        isAuthReady,
        syncStatus,
        lastSyncedAt,
        workspace,
        cloudError,
        showCloudModal,
        setShowCloudModal,
        signInWithGoogle,
        signOutGoogle,
        forceSyncNow,
        generateInviteCode,
        joinWorkspaceByInvite,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextValue => {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return ctx;
};
