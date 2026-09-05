# 🚀 Quick Setup Checklist - Firebase & Google Cloud

**Status:** Fresh Project Setup  
**Timeline:** 4-6 hours total  
**Difficulty:** Medium

---

## ✅ Phase 1: Initial Setup (30 mins)

### Google Cloud Console

- [ ] Go to https://console.cloud.google.com
- [ ] Create new project: `love-actually-the-game`
- [ ] Note Project ID: `________________`
- [ ] Enable billing (required for production APIs)
- [ ] Go to APIs & Services → Library

### Firebase Console

- [ ] Go to https://console.firebase.google.com
- [ ] Create project (uses same Google Cloud project)
- [ ] Wait for provisioning (2-3 mins)
- [ ] Copy Firebase Web Config:
  ```
  API Key: ____________________________
  Auth Domain: ____________________________
  Project ID: ____________________________
  Storage Bucket: ____________________________
  Messaging Sender ID: ____________________________
  App ID: ____________________________
  ```

---

## ✅ Phase 2: Enable Core APIs (30 mins)

In Google Cloud Console → APIs & Services → Library, enable:

**Must Have:**
- [ ] Cloud Firestore API
- [ ] Cloud Storage API
- [ ] Cloud Functions API
- [ ] Cloud Pub/Sub API
- [ ] Identity and Access Management (IAM) API

**Recommended:**
- [ ] Cloud Scheduler API
- [ ] Cloud Logging API
- [ ] Cloud Monitoring API

---

## ✅ Phase 3: Create Service Accounts (30 mins)

In Google Cloud Console → APIs & Services → Credentials:

1. [ ] Create Service Account: `love-actually-app-server`
   - Description: `Backend server and Cloud Functions`
   - Role: `Editor` (change to specific roles in production)

2. [ ] Create Service Account Key
   - Format: JSON
   - Download and save to: `functions/config/service-account-key.json`
   - Add to `.gitignore`

3. [ ] Create API Keys (3 total)
   - [ ] Web Key (restrict to HTTP referrers)
   - [ ] Mobile Key (restrict to app IDs)
   - [ ] Backend Key (restrict to IP addresses)

---

## ✅ Phase 4: Register Apps (45 mins)

### Web App

In Firebase Console → Project Settings → Your apps:

1. [ ] Click **"<>"** to register Web app
2. [ ] App name: `love-actually-web`
3. [ ] Check "Also set up Firebase Hosting"
4. [ ] Copy Web Config (already done above)

### iOS App

1. [ ] Click **"+"** → **"iOS"**
2. [ ] Bundle ID: `com.lovelytrae.loveatually`
3. [ ] Download `GoogleService-Info.plist`
4. [ ] Place in: `ios/LoveActually/GoogleService-Info.plist`

### Android App

1. [ ] Click **"+"** → **"Android"**
2. [ ] Package Name: `com.lovelytrae.loveatually`
3. [ ] Get SHA-1 Fingerprint from your keystore:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
4. [ ] Add SHA-1 to Firebase
5. [ ] Download `google-services.json`
6. [ ] Place in: `android/app/google-services.json`

---

## ✅ Phase 5: Authentication (20 mins)

In Firebase Console → Build → Authentication:

1. [ ] Click "Get Started"
2. [ ] Enable Sign-in Methods:
   - [ ] Email/Password
   - [ ] Google (use default)
   - [ ] Phone Number (optional)

In Google Cloud Console → APIs & Services → OAuth consent screen:

1. [ ] Create OAuth Consent Screen (External)
2. [ ] App Name: `Love Actually - The Game`
3. [ ] Support Email: `support@lovetrae.app`
4. [ ] Create OAuth 2.0 Credentials (Web Application)
5. [ ] Copy Client ID: `____________________________`
6. [ ] Copy Client Secret: `____________________________`

---

## ✅ Phase 6: Firestore Setup (45 mins)

In Firebase Console → Build → Firestore Database:

1. [ ] Create Database
   - Region: `us-central1` (or nearest to users)
   - Mode: Start in production mode
   
2. [ ] Deploy Firestore Rules (copy from GOOGLE_CLOUD_FIREBASE_SETUP.md)
   - Security rules for users, couples, games, etc.

3. [ ] Create Firestore Indexes
   - Index 1: gameSessions (userId ↓, createdAt ↑)
   - Index 2: sosRequests (coupleId ↓, status ↓, createdAt ↑)
   - Index 3: users (createdAt ↑)

4. [ ] Create Firestore Collections
   - [ ] `users`
   - [ ] `couples`
   - [ ] `gameSessions`
   - [ ] `games`
   - [ ] `categories`
   - [ ] `sosRequests`

---

## ✅ Phase 7: Cloud Storage (20 mins)

In Firebase Console → Build → Storage:

1. [ ] Create Bucket
   - Name: `love-actually-the-game.appspot.com`
   - Region: Same as Firestore
   - Mode: Production mode

2. [ ] Deploy Storage Rules (copy from GOOGLE_CLOUD_FIREBASE_SETUP.md)

3. [ ] Create folders:
   - [ ] `/avatars`
   - [ ] `/games`
   - [ ] `/recordings`

---

## ✅ Phase 8: Cloud Messaging (20 mins)

In Firebase Console → Build → Messaging:

1. [ ] Note Server Key: `____________________________`
2. [ ] Note Sender ID: `____________________________`
3. [ ] Configure Web Push
   - [ ] Generate public/private key pair
   - [ ] Save Public Key: `____________________________`

In Firebase Console → Project Settings → Cloud Messaging:

1. [ ] Get credentials for push notifications setup

---

## ✅ Phase 9: Environment Variables (15 mins)

1. [ ] Copy `.env.template` to `.env.local`
2. [ ] Fill in all Firebase values
3. [ ] Fill in third-party API keys (OpenAI, etc.)
4. [ ] Save (DO NOT commit to version control)
5. [ ] Add `.env.local` to `.gitignore` if not already there

---

## ✅ Phase 10: Test Everything (30 mins)

### Test Firebase Connection

```bash
cd app
npm install
npm test -- firebaseClient.test.ts
```

### Test Firestore

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const snapshot = await getDocs(collection(db, "games"));
console.log("✓ Firestore working. Games:", snapshot.docs.length);
```

### Test Authentication

```typescript
import { getAuth, signInAnonymously } from 'firebase/auth';

const auth = getAuth();
const result = await signInAnonymously(auth);
console.log("✓ Auth working. UID:", result.user.uid);
```

### Test Storage

```typescript
import { getStorage, ref, listAll } from 'firebase/storage';

const storage = getStorage();
const listRef = ref(storage, 'avatars');
const result = await listAll(listRef);
console.log("✓ Storage working. Items:", result.items.length);
```

---

## 📋 Values to Collect

**Keep these in a secure location:**

```
Firebase Web Config:
  - API Key: _____________________________________
  - Auth Domain: _________________________________
  - Project ID: __________________________________
  - Storage Bucket: ______________________________
  - Messaging Sender ID: _________________________
  - App ID: ______________________________________

Service Account:
  - Email: _______________________________________
  - Private Key: (in JSON file)

API Keys:
  - Web Key: _____________________________________
  - Mobile Key: __________________________________
  - Backend Key: _________________________________

OAuth 2.0:
  - Client ID: ____________________________________
  - Client Secret: _______________________________

Push Notifications:
  - Server Key: __________________________________
  - Sender ID: ___________________________________
  - Web Push Public Key: _________________________

Third-Party Services:
  - OpenAI API Key: ______________________________
  - Anthropic API Key: ___________________________
  - PostHog API Key: _____________________________
  - Sentry DSN: __________________________________
```

---

## 🚨 Security Reminders

- [ ] Service account key stored only in `functions/config/`
- [ ] `.env.local` added to `.gitignore`
- [ ] No API keys committed to Git
- [ ] All API keys restricted by origin/platform
- [ ] Enable 2FA on Google account
- [ ] Firestore rules use production mode
- [ ] Storage rules restrict access appropriately

---

## 🔗 Important Links

| Task | URL |
|------|-----|
| Firebase Console | https://console.firebase.google.com |
| Google Cloud Console | https://console.cloud.google.com |
| Firebase Docs | https://firebase.google.com/docs |
| Cloud Functions | https://firebase.google.com/docs/functions |
| Firestore Rules | https://firebase.google.com/docs/firestore/security |

---

## ⏱️ Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Initial Setup | 30 min | ⏳ |
| Phase 2: Enable APIs | 30 min | ⏳ |
| Phase 3: Service Accounts | 30 min | ⏳ |
| Phase 4: Register Apps | 45 min | ⏳ |
| Phase 5: Authentication | 20 min | ⏳ |
| Phase 6: Firestore Setup | 45 min | ⏳ |
| Phase 7: Cloud Storage | 20 min | ⏳ |
| Phase 8: Cloud Messaging | 20 min | ⏳ |
| Phase 9: Environment Variables | 15 min | ⏳ |
| Phase 10: Testing | 30 min | ⏳ |
| **Total** | **~4-5 hours** | 🚀 |

---

## 📞 Troubleshooting

**Firestore not connecting?**
- Check API key in Firebase Config
- Verify Firestore is enabled in Google Cloud APIs
- Check Firestore Rules allow your authentication method

**Storage bucket not found?**
- Verify bucket name in Firebase Config
- Check Storage Rules are published
- Ensure Cloud Storage API is enabled

**Cloud Functions not deploying?**
- Check Cloud Functions API is enabled
- Verify service account has appropriate permissions
- Check functions/package.json dependencies

**Push Notifications not working?**
- Verify Cloud Messaging is enabled
- Check `google-services.json` is in correct location
- Verify Messaging Sender ID in Firebase Config

---

**Next Steps After This Checklist:**

1. Populate initial game data in Firestore
2. Deploy Cloud Functions
3. Set up monitoring & alerts
4. Configure backup strategy
5. Test end-to-end user journey

