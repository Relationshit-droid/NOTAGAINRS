const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./service-account.json');

initializeApp({
  credential: cert(serviceAccount)
});

// Replace with the UID of the user you want to make an admin
// You can find this in Firebase Console > Authentication > Users
const uid = process.env.ADMIN_UID || 'YOUR_USER_UID_HERE';

if (uid === 'YOUR_USER_UID_HERE') {
  console.error('❌ Please provide a UID:');
  console.error('   Option 1: Set env var: ADMIN_UID=your-uid-here node make-admin.js');
  console.error('   Option 2: Edit this file and replace YOUR_USER_UID_HERE');
  process.exit(1);
}

console.log(`Setting admin claim for user: ${uid}...`);

getAuth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Success! User ${uid} is now an admin.`);
    console.log('📝 Note: The user must sign out and back in (or call getIdToken(true)) for the claim to take effect.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error setting claim:', error);
    process.exit(1);
  });