import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';

// Firebase configuration - this would normally come from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeDatabase() {
  console.log('Initializing Firebase database for Love Actually game...');
  
  try {
    // Create a test profile to verify the database works
    const testProfile = {
      userId: 'test_user',
      email: 'test@example.com',
      display_name: 'Test User',
      created_at: new Date(),
      updated_at: new Date(),
      partner_id: null,
      couple_code: 'TEST1234',
      sarcasm_level: 1,
      trust_level: 0.5,
      vulnerability_level: 0.5,
      points: 0,
      plan: 'free'
    };
    
    const profileRef = doc(db, 'profiles', 'test_user');
    await setDoc(profileRef, testProfile);
    console.log('✓ Test profile created');
    
    // Create a test couple entry
    const testCouple = {
      id: 'test_couple',
      user1_id: 'user1',
      user2_id: 'user2',
      created_at: new Date(),
      trust_meter: 0.5,
      vulnerability_meter: 0.5,
      romance_meter: 0.5,
      connection_meter: 0.5,
      total_points: 0,
      streak_days: 0,
      last_interaction: new Date()
    };
    
    const coupleRef = doc(db, 'couples', 'test_couple');
    await setDoc(coupleRef, testCouple);
    console.log('✓ Test couple created');
    
    // Create a test game session
    const testSession = {
      userId: 'test_user',
      game_id: 'test_game',
      category_id: 'emotional-connection',
      started_at: new Date(),
      completed: false,
      score: 0,
      responses: [],
      created_at: new Date()
    };
    
    const sessionRef = doc(db, 'game_sessions', 'test_session');
    await setDoc(sessionRef, testSession);
    console.log('✓ Test game session created');
    
    console.log('\nDatabase initialized successfully!');
    console.log('You can now run the app with Firebase backend.');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run initialization
if (require.main === module) {
  initializeDatabase();
}

export { db };