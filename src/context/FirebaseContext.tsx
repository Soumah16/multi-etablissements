import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  browserPopupRedirectResolver,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  auth,
  checkDomainAuthorized,
  DomainAuthorizationCheck,
  googleProvider,
} from '../firebase';
import {
  attachWorkspaceSyncListeners,
  bootstrapOrResolveWorkspace,
  CORE_SYNC_KEYS,
  createWorkspaceInvite,
  DEFAULT_WORKSPACE_ID,
  ensureUserProfiles,
  propagateMemberUidsToSyncStates,
  pushAllLocalKeysToCloud,
  pushSyncKeyToCloud,
  redeemWorkspaceInvite,
  sanitizeDocId,
  SyncMetaRecord,
  WorkspaceInfo,
} from '../utils/cloudSync';
import { getLocalTimestamp, onLocalStorageMutation, readDualStorageValue } from '../utils/storage';

export type CloudSyncStatus = 'disconnected' | 'connecting' | 'synced' | 'syncing' | 'error';

export function formatFirebaseAuthError(err: unknown, hostname = ''): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: unknown }).code || '')
      : '';
  const rawMessage = err instanceof Error ? err.message : String(err || '');

  switch (code) {
    case 'auth/unauthorized-domain':
      return hostname
        ? `Le domaine actuel (${hostname}) n’est pas autorisé dans Firebase Authentication (ce qui provoque l’erreur « The requested action is invalid »). Utilisez l’URL officielle partagée de l’application ou ajoutez ce domaine dans Firebase Console → Authentication → Settings → Authorized domains.`
        : 'Ce domaine n’est pas autorisé dans Firebase Authentication. Ajoutez-le dans Firebase Console → Authentication → Settings → Authorized domains.';
    case 'auth/popup-blocked':
      return 'La fenêtre de connexion Google a été bloquée par votre navigateur. Autorisez les popups pour ce site puis réessayez.';
    case 'auth/popup-closed-by-user':
      return 'La fenêtre Google a été fermée avant la fin de la connexion. Réessayez sans fermer la fenêtre.';
    case 'auth/cancelled-popup-request':
      return 'Une autre fenêtre de connexion était déjà ouverte. Veuillez réessayer.';
    case 'auth/web-storage-unsupported':
      return 'Les cookies ou le stockage navigateur sont bloqués (mode privé ou restriction Safari/mobile). Autorisez les cookies pour ce site.';
    case 'auth/operation-not-allowed':
      return 'La connexion Google n’est pas activée dans Firebase Authentication (Console → Sign-in method → Google).';
    case 'auth/network-request-failed':
      return 'Connexion réseau impossible vers Google/Firebase. Vérifiez votre connexion Internet.';
    default:
      if (rawMessage.includes('unauthorized-domain') || rawMessage.includes('requested action is invalid')) {
        return formatFirebaseAuthError({ code: 'auth/unauthorized-domain' }, hostname);
      }
      return code ? `Erreur Google (${code}) : ${rawMessage}` : rawMessage || 'Erreur de connexion Google.';
  }
}

interface FirebaseContextValue {
  firebaseUser: User | null;
  isAuthReady: boolean;
  syncStatus: CloudSyncStatus;
  lastSyncedAt: number | null;
  workspace: WorkspaceInfo | null;
  cloudError: string | null;
  domainCheck: DomainAuthorizationCheck | null;
  recheckDomainAuthorization: () => Promise<DomainAuthorizationCheck>;
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
  const [domainCheck, setDomainCheck] = useState<DomainAuthorizationCheck | null>(null);
  const [showCloudModal, setShowCloudModal] = useState<boolean>(false);

  const recheckDomainAuthorization = useCallback(async () => {
    const result = await checkDomainAuthorized();
    setDomainCheck(result);
    return result;
  }, []);

  const knownSyncMetaRef = useRef<Map<string, SyncMetaRecord>>(new Map());
  const workspaceRef = useRef<WorkspaceInfo | null>(null);
  const userRef = useRef<User | null>(null);
  const domainCheckRef = useRef<DomainAuthorizationCheck | null>(null);
  const pendingPushKeysRef = useRef<Set<string>>(new Set());
  const debounceTimerRef = useRef<number | null>(null);
  const unsubSyncRef = useRef<(() => void) | null>(null);

  workspaceRef.current = workspace;
  userRef.current = firebaseUser;
  domainCheckRef.current = domainCheck;

  const flushPendingPushes = useCallback(async () => {
    const user = userRef.current;
    const ws = workspaceRef.current;
    if (!user || !user.emailVerified || !ws) return;
    if (pendingPushKeysRef.current.size === 0) return;

    const keysToPush = Array.from(pendingPushKeysRef.current);
    pendingPushKeysRef.current.clear();

    setSyncStatus('syncing');
    let firstError: string | null = null;
    for (const key of keysToPush) {
      try {
        const { found, value } = await readDualStorageValue(key);
        if (!found) continue;
        const ts = getLocalTimestamp(key) || Date.now();
        await pushSyncKeyToCloud({
          user,
          workspaceId: ws.id,
          workspaceOwnerUid: ws.ownerUid,
          memberUids: ws.memberUids,
          rawKey: key,
          value,
          clientUpdatedAt: ts,
          knownSyncMeta: knownSyncMetaRef.current,
        });
      } catch (err) {
        pendingPushKeysRef.current.add(key);
        if (!firstError) {
          firstError = err instanceof Error ? err.message : String(err);
        }
      }
    }
    if (firstError) {
      setCloudError(firstError);
      setSyncStatus('error');
      return;
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

        let resolveInitialSnapshot!: () => void;
        const initialSnapshotPromise = new Promise<void>(resolve => {
          resolveInitialSnapshot = resolve;
        });

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
          onInitialReady: () => {
            resolveInitialSnapshot();
          },
          onError: err => {
            resolveInitialSnapshot();
            setCloudError(err.message);
            setSyncStatus('error');
          },
        });

        // Wait briefly for initial cloud snapshot so remote Firestore state hydrates BEFORE pushing local deltas
        await Promise.race([
          initialSnapshotPromise,
          new Promise<void>(resolve => {
            window.setTimeout(resolve, 3500);
          }),
        ]);

        // Push any local pending edits made offline or prior to sign-in (only when strictly newer than cloud)
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

  // Firebase Auth listener — attach Firestore listeners when verified
  useEffect(() => {
    void getRedirectResult(auth).catch(() => undefined);

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
      const knownCheck = domainCheckRef.current;
      if (knownCheck && !knownCheck.authorized) {
        throw Object.assign(
          new Error(formatFirebaseAuthError({ code: 'auth/unauthorized-domain' }, knownCheck.currentHostname)),
          { code: 'auth/unauthorized-domain' }
        );
      }
      // Call signInWithPopup immediately inside click gesture so mobile browsers do not block the popup
      await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    } catch (err) {
      setSyncStatus('error');
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const message = formatFirebaseAuthError(err, hostname);
      setCloudError(message);
      void recheckDomainAuthorization();
      throw new Error(message);
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
      const missingCoreKeys = CORE_SYNC_KEYS.filter(
        k => !knownSyncMetaRef.current.has(sanitizeDocId(k))
      );
      const res = await pushAllLocalKeysToCloud({
        user,
        workspaceId: ws.id,
        workspaceOwnerUid: ws.ownerUid,
        memberUids: ws.memberUids,
        knownSyncMeta: knownSyncMetaRef.current,
        extraKeys: missingCoreKeys,
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
        domainCheck,
        recheckDomainAuthorization,
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
