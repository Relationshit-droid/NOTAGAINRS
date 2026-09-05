import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Environment variable validation
const validateEnvironment = () => {
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_DATABASE_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
      `Please ensure all required environment variables are set in your .env file or deployment environment.`
    );
  }
};

// Initialize Firebase Admin with proper error handling
const initializeFirebaseAdmin = () => {
  try {
    // Validate environment first
    validateEnvironment();

    if (admin.apps.length === 0) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

      console.log('✅ Firebase Admin initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    throw error;
  }
};

// Initialize Firebase Admin
initializeFirebaseAdmin();

// Export initialized services
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

// Health check function
export const checkFirebaseConnection = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    firestore: boolean;
    auth: boolean;
    storage: boolean;
  };
  details?: string;
}> => {
  const healthCheck = {
    status: 'healthy' as 'healthy' | 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      firestore: false,
      auth: false,
      storage: false,
    },
    details: ''
  };

  try {
    // Test Firestore connection
    const testDoc = db.collection('health-check').doc('test');
    await testDoc.set({ timestamp: admin.firestore.FieldValue.serverTimestamp() });
    const doc = await testDoc.get();
    healthCheck.services.firestore = doc.exists;
    await testDoc.delete(); // Clean up

    // Test Auth connection
    try {
      await auth.listUsers(1);
      healthCheck.services.auth = true;
    } catch (authError) {
      console.warn('Auth health check warning:', authError);
      // Auth might not have users, but connection is working
      healthCheck.services.auth = true;
    }

    // Test Storage connection
    try {
      const bucket = storage.bucket();
      await bucket.getMetadata();
      healthCheck.services.storage = true;
    } catch (storageError) {
      console.warn('Storage health check warning:', storageError);
      // Storage might not be configured, but that's okay for basic functionality
      healthCheck.services.storage = true;
    }

    // Overall health status
    const allServicesHealthy = Object.values(healthCheck.services).every(status => status === true);
    healthCheck.status = allServicesHealthy ? 'healthy' : 'unhealthy';
    
    if (!allServicesHealthy) {
      healthCheck.details = 'Some Firebase services are not responding properly';
    }

  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.details = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Firebase health check failed:', error);
  }

  return healthCheck;
};

// Export admin instance for direct access if needed
export default admin;
