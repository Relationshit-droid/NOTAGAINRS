import { initializeApp, FirebaseApp, getApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { ENV } from './env';

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
};

const isFirebaseConfigured =
  !!ENV.FIREBASE_API_KEY &&
  ENV.FIREBASE_API_KEY.length > 0 &&
  !ENV.FIREBASE_API_KEY.includes('placeholder');

/**
 * Firebase initialisation must never throw at module scope.
 *
 * This module is imported (directly or transitively) by nearly every screen,
 * so an exception here escapes before React can mount and blanks the whole
 * app with no recoverable UI. That is exactly what happened with an
 * unconfigured project: getAuth() threw `auth/invalid-api-key` and took the
 * entire bundle down.
 *
 * Instead we initialise defensively and expose `isFirebaseConfigured` so
 * callers can degrade gracefully. In DEMO_MODE the app runs fully on local
 * fixture data and never touches these handles.
 */
let app: FirebaseApp | null = null;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

/**
 * Stand-in for the Auth handle when Firebase is unavailable. It satisfies the
 * shape the app actually reads (`currentUser`, `onAuthStateChanged`, `signOut`)
 * so the ~64 existing call sites keep working unmodified and simply observe a
 * signed-out user rather than throwing on a null reference.
 */
const authStub = {
  currentUser: null,
  onAuthStateChanged: (cb: (u: null) => void) => {
    setTimeout(() => cb(null), 0);
    return () => {};
  },
  onIdTokenChanged: (cb: (u: null) => void) => {
    setTimeout(() => cb(null), 0);
    return () => {};
  },
  signOut: async () => {},
} as unknown as Auth;

/**
 * Any Firestore/Storage call made while unconfigured rejects with a clear
 * message. Call sites already wrap these in try/catch, so this surfaces a
 * useful warning instead of a cryptic crash.
 */
const unavailable = (name: string) =>
  new Proxy(
    {},
    {
      get() {
        throw new Error(
          `${name} is unavailable: Firebase is not configured. Set EXPO_PUBLIC_FIREBASE_* in app/.env`
        );
      },
    }
  );

try {
  if (getApps().length === 0) {
    initializeApp(firebaseConfig);
  }
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn(
    '[firebase] Initialisation skipped:',
    error instanceof Error ? error.message : error
  );
  app = null;
  auth = authStub;
  db = unavailable('Firestore') as Firestore;
  storage = unavailable('Storage') as FirebaseStorage;
}

if (!isFirebaseConfigured) {
  console.warn(
    'Firebase not fully configured. Check EXPO_PUBLIC_FIREBASE_* environment variables.'
  );
}

export { app, auth, db, storage, isFirebaseConfigured };
