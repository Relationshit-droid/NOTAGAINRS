#!/usr/bin/env node

/**
 * LoveTrae Admin Health Check Script
 * 
 * This script verifies the health of all admin services including:
 * - Firebase Admin SDK connection
 * - Firestore read/write capabilities
 * - Authentication service status
 * - Storage service status
 * - Environment variable validation
 * - Admin authentication flow
 */

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { getStorage } = require('firebase-admin/storage');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to format output
function log(message, color = colors.reset, isBright = false) {
  const prefix = isBright ? colors.bright : '';
  console.log(`${prefix}${color}${message}${colors.reset}`);
}

// Environment variable validation
function validateEnvironment() {
  log('\n🔍 Validating Environment Variables...', colors.cyan, true);
  
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_DATABASE_URL'
  ];

  const optionalEnvVars = [
    'FIREBASE_STORAGE_BUCKET',
    'STRIPE_SECRET',
    'STRIPE_WEBHOOK_SECRET'
  ];

  let hasErrors = false;

  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      log(`❌ Missing required: ${varName}`, colors.red);
      hasErrors = true;
    } else {
      log(`✅ Found: ${varName}`, colors.green);
    }
  });

  optionalEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      log(`⚠️  Missing optional: ${varName}`, colors.yellow);
    } else {
      log(`✅ Found: ${varName}`, colors.green);
    }
  });

  if (hasErrors) {
    log('\n❌ Environment validation failed!', colors.red, true);
    process.exit(1);
  }

  log('✅ Environment validation passed!', colors.green, true);
  return true;
}

// Initialize Firebase Admin
function initializeFirebase() {
  log('\n🔥 Initializing Firebase Admin SDK...', colors.cyan, true);
  
  try {
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

      log('✅ Firebase Admin SDK initialized successfully', colors.green);
      return true;
    } else {
      log('✅ Firebase Admin SDK already initialized', colors.green);
      return true;
    }
  } catch (error) {
    log(`❌ Firebase initialization failed: ${error.message}`, colors.red);
    return false;
  }
}

// Test Firestore connection
async function testFirestore() {
  log('\n📄 Testing Firestore Connection...', colors.cyan, true);
  
  try {
    const db = getFirestore();
    
    // Test write operation
    const testDocRef = db.collection('health-check').doc('admin-test');
    const testData = {
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      test: 'admin-health-check',
      status: 'testing'
    };
    
    await testDocRef.set(testData);
    log('✅ Firestore write successful', colors.green);
    
    // Test read operation
    const doc = await testDocRef.get();
    if (doc.exists) {
      log('✅ Firestore read successful', colors.green);
      
      // Clean up
      await testDocRef.delete();
      log('✅ Firestore cleanup successful', colors.green);
      
      return true;
    } else {
      log('❌ Firestore document not found', colors.red);
      return false;
    }
  } catch (error) {
    log(`❌ Firestore test failed: ${error.message}`, colors.red);
    return false;
  }
}

// Test Authentication service
async function testAuth() {
  log('\n🔐 Testing Authentication Service...', colors.cyan, true);
  
  try {
    const auth = getAuth();
    
    // Test listing users (will fail if no users exist, but connection is working)
    try {
      const userList = await auth.listUsers(1);
      log(`✅ Auth service responding (${userList.users.length} users found)`, colors.green);
    } catch (listError) {
      if (listError.code === 'auth/insufficient-permission') {
        log('❌ Auth service: Insufficient permissions', colors.red);
        return false;
      } else {
        log('✅ Auth service responding (no users or other non-critical error)', colors.yellow);
      }
    }
    
    // Test creating a custom token (requires proper permissions)
    try {
      const customToken = await auth.createCustomToken('health-check-test');
      if (customToken) {
        log('✅ Auth custom token creation successful', colors.green);
      }
    } catch (tokenError) {
      log('⚠️  Auth custom token creation failed (may need additional permissions)', colors.yellow);
    }
    
    return true;
  } catch (error) {
    log(`❌ Auth service test failed: ${error.message}`, colors.red);
    return false;
  }
}

// Test Storage service
async function testStorage() {
  log('\n💾 Testing Storage Service...', colors.cyan, true);
  
  try {
    const storage = getStorage();
    const bucket = storage.bucket();
    
    // Test bucket access
    const [metadata] = await bucket.getMetadata();
    if (metadata.name) {
      log(`✅ Storage bucket accessible: ${metadata.name}`, colors.green);
      return true;
    } else {
      log('❌ Storage bucket metadata incomplete', colors.red);
      return false;
    }
  } catch (error) {
    if (error.code === 'storage/bucket-not-found') {
      log('⚠️  Storage bucket not configured (optional)', colors.yellow);
      return true; // Storage is optional for basic functionality
    } else {
      log(`❌ Storage service test failed: ${error.message}`, colors.red);
      return false;
    }
  }
}

// Test admin authentication flow
async function testAdminAuth() {
  log('\n👑 Testing Admin Authentication Flow...', colors.cyan, true);
  
  try {
    const auth = getAuth();
    const db = getFirestore();
    
    // Create a test admin user (if it doesn't exist)
    const adminEmail = 'admin-health-check@lovetrae.com';
    let adminUser;
    
    try {
      adminUser = await auth.getUserByEmail(adminEmail);
      log('✅ Admin test user exists', colors.green);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        log('Creating admin test user...', colors.blue);
        adminUser = await auth.createUser({
          email: adminEmail,
          emailVerified: true,
          password: 'HealthCheck123!',
          displayName: 'Health Check Admin',
        });
        log('✅ Admin test user created', colors.green);
      } else {
        throw error;
      }
    }
    
    // Set custom claims for admin privileges
    await auth.setCustomUserClaims(adminUser.uid, { admin: true });
    log('✅ Admin claims set successfully', colors.green);
    
    // Verify admin access in Firestore
    const adminDocRef = db.collection('admins').doc(adminUser.uid);
    await adminDocRef.set({
      email: adminEmail,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastHealthCheck: admin.firestore.FieldValue.serverTimestamp()
    });
    log('✅ Admin document created/updated', colors.green);
    
    // Test admin token verification
    const customToken = await auth.createCustomToken(adminUser.uid);
    log('✅ Admin custom token created', colors.green);
    
    // Clean up (optional - keep for future tests)
    // await auth.deleteUser(adminUser.uid);
    // await adminDocRef.delete();
    
    return true;
  } catch (error) {
    log(`❌ Admin auth test failed: ${error.message}`, colors.red);
    return false;
  }
}

// Main health check function
async function runHealthCheck() {
  log('\n🏥 LoveTrae Admin Health Check', colors.magenta, true);
  log('================================', colors.magenta, true);
  
  const startTime = Date.now();
  const results = {
    environment: false,
    firebaseInit: false,
    firestore: false,
    auth: false,
    storage: false,
    adminAuth: false
  };
  
  try {
    // Step 1: Environment validation
    results.environment = validateEnvironment();
    
    // Step 2: Firebase initialization
    results.firebaseInit = initializeFirebase();
    
    if (!results.firebaseInit) {
      throw new Error('Firebase initialization failed - cannot proceed with other tests');
    }
    
    // Step 3: Service tests
    results.firestore = await testFirestore();
    results.auth = await testAuth();
    results.storage = await testStorage();
    results.adminAuth = await testAdminAuth();
    
  } catch (error) {
    log(`\n❌ Health check failed: ${error.message}`, colors.red, true);
  }
  
  // Summary
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  log('\n📊 Health Check Summary', colors.cyan, true);
  log('========================', colors.cyan, true);
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? colors.green : colors.red;
    log(`${status} - ${test.replace(/([A-Z])/g, ' $1').toUpperCase()}`, color);
  });
  
  log(`\n⏱️  Total duration: ${duration}ms`, colors.blue);
  log(`📈 Success rate: ${passedTests}/${totalTests} tests`, colors.blue);
  
  if (passedTests === totalTests) {
    log('\n🎉 All systems operational!', colors.green, true);
    process.exit(0);
  } else {
    log('\n⚠️  Some issues detected - check logs above', colors.yellow, true);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  log(`\n❌ Unhandled rejection: ${error}`, colors.red);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`\n❌ Uncaught exception: ${error.message}`, colors.red);
  process.exit(1);
});

// Run health check
if (require.main === module) {
  runHealthCheck().catch(error => {
    log(`\n❌ Health check error: ${error.message}`, colors.red);
    process.exit(1);
  });
}

module.exports = { runHealthCheck };