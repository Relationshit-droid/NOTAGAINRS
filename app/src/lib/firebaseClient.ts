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

// Initialize Firebase
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}
const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const isFirebaseConfigured = !!ENV.FIREBASE_API_KEY && ENV.FIREBASE_API_KEY.length > 0;

if (!isFirebaseConfigured) {
  console.warn("Firebase not fully configured. Check EXPO_PUBLIC_FIREBASE_* environment variables.");
}

export { app, auth, db, storage, isFirebaseConfigured };