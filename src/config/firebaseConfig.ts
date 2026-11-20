export interface SmartSchoolFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

function readEnv(key: string, fallback: string): string {
  const raw = import.meta.env?.[key];
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : fallback;
}

export const firebaseConfig: SmartSchoolFirebaseConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY', 'AIzaSyDGT580xVAp9BkxAnIX5TR3Yg-lUUMfoOU'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN', 'multi-etablissements.firebaseapp.com'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID', 'multi-etablissements'),
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET', 'multi-etablissements.firebasestorage.app'),
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', '880934793289'),
  appId: readEnv('VITE_FIREBASE_APP_ID', '1:880934793289:web:01c70220e3e2d62a9e0f98'),
};

export const firebaseDatabaseId = readEnv('VITE_FIREBASE_DATABASE_ID', '(default)');

export const firebaseVapidKey = readEnv(
  'VITE_FIREBASE_VAPID_KEY',
  'BFbY3W3DlfQkm1afpJahtTqxc9Nw360cpVNwzWn3W_GPFTFevSczTW-Km0JiInrfjw4zc85_pSWWcx92MAE3RDU'
);
