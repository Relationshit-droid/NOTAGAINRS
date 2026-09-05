
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Path to your service account key file
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const seedDatabase = async () => {
  console.log('Seeding database...');

  // Dummy Data
  const users = [
    {
      uid: 'user1',
      email: 'user1@example.com',
      coupleId: 'couple1',
      onboarding_data: { q1: 'a', q2: 'b' },
      settings: { marcieSarcasmLevel: 5, notifications: { push: true, email: false } }
    },
    {
      uid: 'user2',
      email: 'user2@example.com',
      coupleId: 'couple1',
      onboarding_data: { q1: 'c', q2: 'd' },
      settings: { marcieSarcasmLevel: 8, notifications: { push: true, email: true } }
    }
  ];

  const couples = [
    {
      id: 'couple1',
      partners: ['user1', 'user2'],
      linking_code: '123456',
      trust_thermometer: 75
    }
  ];

  const game_sessions = [
    {
      coupleId: 'couple1',
      game_type: 'TheNewlywedGame',
      current_turn: 'user1',
      scores: { user1: 10, user2: 5 },
      status: 'in_progress',
      history: []
    }
  ];

  const sos_fights = [
    {
      coupleId: 'couple1',
      user1_input: 'She never listens to me!',
      user2_input: 'He always exaggerates!',
      verdict: 'You both need to work on your communication.',
      timestamp: new Date()
    }
  ];

  // Users
  for (const user of users) {
    await db.collection('users').doc(user.uid).set(user);
  }

  // Couples
  for (const couple of couples) {
    await db.collection('couples').doc(couple.id).set(couple);
  }

  // Game Sessions
  for (const session of game_sessions) {
    await db.collection('game_sessions').add(session);
  }

  // SOS Fights
  for (const fight of sos_fights) {
    await db.collection('sos_fights').add(fight);
  }

  console.log('Database seeded!');
};

seedDatabase().catch(console.error);
