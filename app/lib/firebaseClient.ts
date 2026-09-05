// Firebase Client Configuration for React Native Expo
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Get Firebase configuration from environment variables
const getEnvVar = (key: string): string => {
  // Try process.env first (for Node.js environments)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] || '';
  }
  return '';
};

const firebaseConfig = {
  apiKey: getEnvVar('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvVar('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getEnvVar('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID') // Optional for Analytics
};

// Check if Firebase is properly configured
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0 && firebaseConfig.apiKey !== 'YOUR_API_KEY';

let app: any;
let auth: any;
let db: any;

if (isFirebaseConfigured) {
  // Initialize Firebase only if config is present
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth
  auth = getAuth(app);
  
  db = getFirestore(app);
  
  console.log("✅ Firebase initialized successfully with environment variables");
} else {
  // Create mock objects when Firebase is not configured
  console.warn("⚠️  Firebase not configured. Using mock objects for development.");
  
  // Create mock implementations
  app = {
    name: '[DEFAULT]',
    options: firebaseConfig,
    delete: function() { return { then: function(cb: any) { cb(); } }; },
    automaticDataCollectionEnabled: false
  };
  
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: function() {
      console.warn("Mock auth: signInWithEmailAndPassword called");
      return {
        then: function(cb: any) {
          cb({ user: { uid: 'mock-user-id', email: 'mock@example.com' } });
          return { catch: function() {} };
        }
      };
    },
    createUserWithEmailAndPassword: function() {
      console.warn("Mock auth: createUserWithEmailAndPassword called");
      return {
        then: function(cb: any) {
          cb({ user: { uid: 'mock-user-id', email: 'mock@example.com' } });
          return { catch: function() {} };
        }
      };
    },
    signOut: function() {
      console.warn("Mock auth: signOut called");
      return { then: function(cb: any) { cb(); } };
    },
    onAuthStateChanged: function(callback: any) {
      console.warn("Mock auth: onAuthStateChanged listener set up");
      // Call callback immediately with null user (logged out state)
      setTimeout(function() { callback(null); }, 0);
      // Return unsubscribe function
      return function() { console.warn("Mock auth: onAuthStateChanged unsubscribed"); };
    }
  };
  
  db = {
    // Mock Firestore methods
    collection: function() {
      return {
        doc: function() {
          return {
            get: function() {
              return { then: function(cb: any) { cb({ exists: false, data: function() { return null; } }); } };
            },
            set: function() {
              console.warn("Mock firestore: document set called");
              return { then: function(cb: any) { cb(); } };
            },
            update: function() {
              console.warn("Mock firestore: document update called");
              return { then: function(cb: any) { cb(); } };
            }
          };
        },
        add: function() {
          console.warn("Mock firestore: document add called");
          return { then: function(cb: any) { cb(); } };
        }
      };
    }
  };
}

// Export initialized services for use throughout the app
export { auth, db };
export default app;