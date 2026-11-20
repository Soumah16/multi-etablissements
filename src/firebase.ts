import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from 'firebase/storage';
import {
  firebaseConfig,
  firebaseDatabaseId,
  firebaseVapidKey,
} from './config/firebaseConfig';

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
auth.languageCode = 'fr';

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const db = firebaseDatabaseId
  ? getFirestore(app, firebaseDatabaseId)
  : getFirestore(app);

export const storage = getStorage(app);

export { firebaseConfig, firebaseDatabaseId, firebaseVapidKey };

export async function uploadFileToStorage(
  storagePath: string,
  file: Blob | Uint8Array | ArrayBuffer,
  contentType?: string
): Promise<string> {
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file, contentType ? { contentType } : undefined);
  return getDownloadURL(storageRef);
}

export async function uploadDataUrlToStorage(
  storagePath: string,
  dataUrl: string
): Promise<string> {
  const storageRef = ref(storage, storagePath);
  await uploadString(storageRef, dataUrl, 'data_url');
  return getDownloadURL(storageRef);
}

export async function getStorageFileUrl(storagePath: string): Promise<string> {
  const storageRef = ref(storage, storagePath);
  return getDownloadURL(storageRef);
}

export async function deleteStorageFile(storagePath: string): Promise<void> {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}

export interface DomainAuthorizationCheck {
  authorized: boolean;
  currentHostname: string;
  currentOrigin: string;
  authorizedDomains: string[];
}

function matchesAuthorizedDomain(hostname: string, protocol: string, expected: string): boolean {
  if (!/^https?:$/.test(protocol)) return false;
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(expected)) {
    return hostname.toLowerCase() === expected.toLowerCase();
  }
  const escaped = expected.replace(/\./g, '\\.');
  const regex = new RegExp(`^(.+\\.${escaped}|${escaped})$`, 'i');
  return regex.test(hostname);
}

export async function checkDomainAuthorized(): Promise<DomainAuthorizationCheck> {
  if (typeof window === 'undefined') {
    return { authorized: true, currentHostname: '', currentOrigin: '', authorizedDomains: [] };
  }
  const currentHostname = window.location.hostname;
  const currentOrigin = window.location.origin;
  const protocol = window.location.protocol;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects?key=${encodeURIComponent(firebaseConfig.apiKey)}`
    );
    if (!res.ok) {
      return { authorized: true, currentHostname, currentOrigin, authorizedDomains: [] };
    }
    const data = (await res.json()) as { authorizedDomains?: unknown };
    const authorizedDomains = Array.isArray(data.authorizedDomains)
      ? data.authorizedDomains.filter((d): d is string => typeof d === 'string')
      : [];
    if (authorizedDomains.length === 0) {
      return { authorized: true, currentHostname, currentOrigin, authorizedDomains: [] };
    }
    const authorized = authorizedDomains.some(domain =>
      matchesAuthorizedDomain(currentHostname, protocol, domain)
    );
    return { authorized, currentHostname, currentOrigin, authorizedDomains };
  } catch {
    return { authorized: true, currentHostname, currentOrigin, authorizedDomains: [] };
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();
