# 🚀 Complete Firebase & Google Cloud Setup Guide

**Project Name:** Love Actually - The Game  
**Status:** Fresh Project Setup  
**Timeline:** 4-6 hours total  
**Difficulty:** Medium

---

## 📋 Table of Contents

1. [Quick Start Checklist](#quick-start-checklist)
2. [Phase 1: Initial Setup](#phase-1-initial-setup-30-mins)
3. [Phase 2: Enable APIs](#phase-2-enable-core-apis-30-mins)
4. [Phase 3: Create Service Accounts](#phase-3-create-service-accounts-30-mins)
5. [Phase 4: Register Applications](#phase-4-register-apps-45-mins)
6. [Phase 5: Authentication Setup](#phase-5-authentication-20-mins)
7. [Phase 6: Firestore Database](#phase-6-firestore-setup-45-mins)
8. [Phase 7: Cloud Storage](#phase-7-cloud-storage-20-mins)
9. [Phase 8: Cloud Messaging](#phase-8-cloud-messaging-20-mins)
10. [Phase 9: Environment Variables](#phase-9-environment-variables-15-mins)
11. [Phase 10: Testing](#phase-10-test-everything-30-mins)
12. [Step-by-Step API Key Collection](#step-by-step-api-key-collection)
13. [Third-Party API Keys](#third-party-api-keys)
14. [Security Checklist](#security-checklist)
15. [Troubleshooting](#troubleshooting)

---

# 🎯 QUICK START CHECKLIST

## Values to Collect (Keep Handy!)

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

API Keys (3):
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

# Phase 1: Initial Setup (30 mins)

## Google Cloud Console

1. Go to **https://console.cloud.google.com**
2. Click **"Create Project"**
3. Project Name: `love-actually-the-game`
4. **Note Project ID:** `________________`
5. Click **"Create"** and wait for provisioning
6. Enable billing (required for production APIs)

## Firebase Console

1. Go to **https://console.firebase.google.com**
2. Click **"Create Project"** or **"Add Project"**
3. Select your Google Cloud project
4. Name: `love-actually-the-game`
5. Wait for provisioning (2-3 mins)
6. **Copy these values immediately:**
   ```
   API Key: ____________________________
   Auth Domain: ____________________________
   Project ID: ____________________________
   Storage Bucket: ____________________________
   Messaging Sender ID: ____________________________
   App ID: ____________________________
   Measurement ID: ____________________________
   ```

---

# Phase 2: Enable Core APIs (30 mins)

## In Google Cloud Console

1. Go to **https://console.cloud.google.com**
2. Select project: `love-actually-the-game`
3. Left sidebar → **"APIs & Services"** → **"Library"**

## Enable These APIs

**REQUIRED:**
- [ ] Cloud Firestore API
- [ ] Cloud Storage API
- [ ] Cloud Functions API
- [ ] Cloud Pub/Sub API
- [ ] Identity and Access Management (IAM) API

**RECOMMENDED:**
- [ ] Cloud Scheduler API
- [ ] Cloud Logging API
- [ ] Cloud Monitoring API
- [ ] Cloud Vision API
- [ ] Cloud Natural Language API

---

# Phase 3: Create Service Accounts (30 mins)

## Create Service Account

1. Go to **Google Cloud Console** → **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"Service Account"**
3. Fill in:
   - Service Account name: `love-actually-app-server`
   - Description: `Backend server and Cloud Functions`
4. Click **"Create and Continue"**
5. Grant role: **"Editor"** (for development; restrict in production)
6. Click **"Continue"** then **"Done"**

## Create Service Account Key (IMPORTANT!)

1. Go back to **"APIs & Services"** → **"Credentials"**
2. Under **"Service Accounts"**, click on `love-actually-app-server`
3. Go to **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Choose **"JSON"** format
6. Click **"Create"** (JSON file auto-downloads)
7. **Save to:** `functions/config/service-account-key.json`
8. **Add to `.gitignore`** immediately!

## Extract from JSON file:
```
FIREBASE_PROJECT_ID = project_id
FIREBASE_CLIENT_EMAIL = client_email
FIREBASE_PRIVATE_KEY = private_key (keep \n characters)
```

---

# Phase 4: Register Apps (45 mins)

## Register Web App

1. Firebase Console → **"Project Settings"** (⚙️ icon, top-right)
2. Go to **"Your apps"** section
3. Click **"<>"** (Web icon) to register Web app
4. App name: `love-actually-web`
5. Check **"Also set up Firebase Hosting"**
6. Click **"Register App"**
7. Copy the Firebase Config (you already have this)

## Register iOS App

1. Click **"+"** → **"iOS"**
2. iOS Bundle ID: `com.lovelytrae.loveatually`
3. Click **"Register App"**
4. Download `GoogleService-Info.plist`
5. Place in: `ios/LoveActually/GoogleService-Info.plist`

## Register Android App

1. Click **"+"** → **"Android"**
2. Android Package Name: `com.lovelytrae.loveatually`
3. Get SHA-1 Fingerprint:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
4. Add SHA-1 to Firebase
5. Click **"Register App"**
6. Download `google-services.json`
7. Place in: `android/app/google-services.json`

---

# Phase 5: Authentication (20 mins)

## Enable Sign-in Methods

1. Firebase Console → **"Build"** → **"Authentication"**
2. Click **"Get Started"**
3. Enable these methods:
   - [ ] **Email/Password** (Check "Enable", Click "Save")
   - [ ] **Google** (Click "Enable", use default, Click "Save")
   - [ ] **Phone Number** (Optional - Click "Enable")

## Configure OAuth Consent Screen

1. **Google Cloud Console** → **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"**
3. Click **"Create"**
4. Fill in:
   - App name: `Love Actually - The Game`
   - User support email: `support@lovetrae.app`
   - Developer contact: `dev@lovetrae.app`
   - App logo: (optional)
5. Scopes: Keep default (email, profile, openid)
6. Click **"Save and Continue"** through all screens
7. Add test user (yourself)

## Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Application type: **"Web application"**
4. Name: `love-actually-oauth`
5. **Authorized JavaScript origins:**
   - `https://love-actually-the-game.firebaseapp.com`
   - `https://yourdomain.com`
   - `http://localhost:3000`
   - `http://localhost:5173`
6. **Authorized redirect URIs:**
   - `https://love-actually-the-game.firebaseapp.com/__/auth/callback`
   - `https://yourdomain.com/__/auth/callback`
   - `http://localhost:3000/__/auth/callback`
7. Click **"Create"**
8. Copy and save:
   - `EXPO_PUBLIC_OAUTH_CLIENT_ID`
   - `EXPO_PUBLIC_OAUTH_CLIENT_SECRET`

---

# Phase 6: Firestore Setup (45 mins)

## Create Database

1. Firebase Console → **"Build"** → **"Firestore Database"**
2. Click **"Create Database"**
3. Select Region: `us-central1` (or nearest to users)
4. Mode: **"Start in production mode"**
5. Click **"Create"** and wait

## Create Collections

In Firestore, these collections will be created:

```
users/
├── {userId}/
│   ├── profile
│   ├── settings
│   └── gameSessions[]

couples/
├── {coupleId}/
│   ├── members[]
│   ├── gameHistory[]
│   └── relationshipData

gameSessions/
├── {sessionId}/
│   ├── gameId
│   ├── participants[]
│   ├── score
│   └── timestamp

games/
├── {gameId}/
│   ├── metadata
│   ├── questions[]
│   └── categoryId

categories/
├── {categoryId}/
│   ├── name
│   ├── description
│   └── games[]

sosRequests/
├── {requestId}/
│   ├── initiatorId
│   ├── partnerId
│   ├── severity
│   └── status
```

## Deploy Firestore Rules

1. Go to **"Firestore Database"** → **"Rules"** tab
2. Replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Couples accessible to members
    match /couples/{coupleId} {
      allow read: if request.auth.uid in resource.data.members;
      allow write: if request.auth.uid in resource.data.members;
    }
    
    // Games readable by all
    match /games/{gameId} {
      allow read: if true;
      allow write: if request.auth.uid in request.auth.token.admins;
    }
    
    // Categories readable by all
    match /categories/{categoryId} {
      allow read: if true;
    }
    
    // SOS requests
    match /sosRequests/{requestId} {
      allow read, write: if request.auth.uid in resource.data.members;
    }
  }
}
```

3. Click **"Publish"**

## Create Firestore Indexes

1. Go to **"Firestore Database"** → **"Indexes"** tab
2. Create Composite Indexes:

**Index 1: gameSessions**
- userId (Ascending)
- createdAt (Descending)

**Index 2: sosRequests**
- coupleId (Ascending)
- status (Ascending)
- createdAt (Descending)

**Index 3: users**
- createdAt (Descending)

---

# Phase 7: Cloud Storage (20 mins)

## Create Storage Bucket

1. Firebase Console → **"Build"** → **"Storage"**
2. Click **"Get Started"**
3. Bucket Name: `love-actually-the-game.appspot.com`
4. Region: Same as Firestore (usually `us-central1`)
5. Mode: **"Start in production mode"**
6. Click **"Create"** and wait

## Deploy Storage Rules

1. Go to **"Storage"** → **"Rules"** tab
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User avatars - readable by all, writable by owner
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId && request.resource.size < 5 * 1024 * 1024; // 5MB
    }
    
    // Game media
    match /games/{gameId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid in request.auth.token.admins;
    }
    
    // User game recordings
    match /recordings/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId && request.resource.size < 50 * 1024 * 1024; // 50MB
    }
  }
}
```

3. Click **"Publish"**

## Create Storage Folders

- [ ] `/avatars`
- [ ] `/games`
- [ ] `/recordings`

---

# Phase 8: Cloud Messaging (20 mins)

## Get Messaging Credentials

1. Firebase Console → **"Project Settings"** (⚙️)
2. Go to **"Cloud Messaging"** tab
3. Copy: **"Server Key"** → `FIREBASE_SERVER_KEY`
4. Copy: **"Sender ID"** → `FIREBASE_SENDER_ID`

## Configure Web Push

1. Firebase Console → **"Build"** → **"Messaging"**
2. Go to **"Web configuration"** tab
3. Click **"Generate key pair"** if you don't have one
4. Copy: **"Public Key"** → `FIREBASE_WEB_PUSH_PUBLIC_KEY`
5. Copy: **"Private Key"** → `FIREBASE_WEB_PUSH_PRIVATE_KEY`

---

# Phase 9: Environment Variables (15 mins)

## Create `.env.local` File

In your project root, create `.env.local` and fill with your values:

```bash
# ==========================================
# FIREBASE CONFIGURATION (from Phase 1)
# ==========================================
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyDOCAbC1234567890...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=love-actually-the-game.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=love-actually-the-game
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=love-actually-the-game.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef1234567890
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ==========================================
# SERVICE ACCOUNT (from Phase 3 JSON file)
# ==========================================
FIREBASE_PROJECT_ID=love-actually-the-game
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@love-actually-the-game.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# ==========================================
# API KEYS (from Phase 3)
# ==========================================
EXPO_PUBLIC_WEB_API_KEY=AIzaSyDOCAbC1234567890...
EXPO_PUBLIC_MOBILE_API_KEY=AIzaSyDOCAbC1234567890...
EXPO_PUBLIC_BACKEND_API_KEY=AIzaSyDOCAbC1234567890...

# ==========================================
# CLOUD MESSAGING (from Phase 8)
# ==========================================
FIREBASE_SERVER_KEY=AAAAA1234567890:BBBBB...
FIREBASE_SENDER_ID=123456789
FIREBASE_WEB_PUSH_PUBLIC_KEY=BCxxx...
FIREBASE_WEB_PUSH_PRIVATE_KEY=xxx...

# ==========================================
# OAUTH 2.0 (from Phase 5)
# ==========================================
EXPO_PUBLIC_OAUTH_CLIENT_ID=123456789.apps.googleusercontent.com
EXPO_PUBLIC_OAUTH_CLIENT_SECRET=GOCSPX-...

# ==========================================
# THIRD-PARTY APIS (from Step-by-Step Guide)
# ==========================================
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
EXPO_PUBLIC_ELEVENLABS_API_KEY=...
EXPO_PUBLIC_ELEVENLABS_VOICE_ID_MARCIE=...
EXPO_PUBLIC_GIPHY_API_KEY=...
EXPO_PUBLIC_MAPBOX_API_KEY=pk_...
EXPO_PUBLIC_POSTHOG_API_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# ==========================================
# BACKEND & FEATURE FLAGS
# ==========================================
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
EXPO_PUBLIC_WS_URL=wss://api.yourdomain.com
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
EXPO_PUBLIC_ENABLE_BETA_FEATURES=false
```

## Important!

- [ ] Add `.env.local` to `.gitignore`
- [ ] Add `functions/config/service-account-key.json` to `.gitignore`
- [ ] NEVER commit these files to version control

---

# Phase 10: Test Everything (30 mins)

## Test Firebase Connection

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const snapshot = await getDocs(collection(db, "games"));
console.log("✓ Firestore working. Games:", snapshot.docs.length);
```

## Test Authentication

```typescript
import { getAuth, signInAnonymously } from 'firebase/auth';

const auth = getAuth();
const result = await signInAnonymously(auth);
console.log("✓ Auth working. UID:", result.user.uid);
```

## Test Cloud Storage

```typescript
import { getStorage, ref, listAll } from 'firebase/storage';

const storage = getStorage();
const listRef = ref(storage, 'avatars');
const result = await listAll(listRef);
console.log("✓ Storage working. Items:", result.items.length);
```

## Test Cloud Functions

```bash
curl -X POST https://us-central1-love-actually-the-game.cloudfunctions.net/getAiAnalysis \
  -H "Content-Type: application/json" \
  -d '{"promptText": "test"}'
```

---

# 🎯 STEP-BY-STEP API KEY COLLECTION

## Part 1: Firebase Web Configuration

### Step 1.1: Get Web App Config

1. Go to **https://console.firebase.google.com**
2. Select your project: `love-actually-the-game`
3. Click **Project Settings** (⚙️ icon, top-right)
4. Go to **"Your apps"** section
5. Under Web apps, find your `love-actually-web` app
6. Click the icon that looks like `</>` to open config
7. Copy the JavaScript snippet:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDOCAbC1234567890...",
  authDomain: "love-actually-the-game.firebaseapp.com",
  projectId: "love-actually-the-game",
  storageBucket: "love-actually-the-game.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

**Extract these values:**
- `EXPO_PUBLIC_FIREBASE_API_KEY` = `apiKey`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` = `authDomain`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID` = `projectId`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` = `storageBucket`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `messagingSenderId`
- `EXPO_PUBLIC_FIREBASE_APP_ID` = `appId`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` = `measurementId` (optional)

---

## Part 2: Service Account & Admin Keys

### Step 2.1: Create Service Account

1. Go to **Google Cloud Console:** https://console.cloud.google.com
2. Select project: `love-actually-the-game`
3. Left sidebar → **"APIs & Services"** → **"Credentials"**
4. Click **"Create Credentials"** → **"Service Account"**
5. Fill in:
   - Service Account name: `love-actually-app-server`
   - Description: `Backend server and Cloud Functions`
6. Click **"Create and Continue"**
7. Grant role: **"Editor"** (for development; restrict in production)
8. Click **"Continue"** then **"Done"**

### Step 2.2: Create Service Account Key

1. Go back to **"APIs & Services"** → **"Credentials"**
2. Under **"Service Accounts"**, click on `love-actually-app-server`
3. Go to **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Choose **"JSON"** format
6. Click **"Create"** (JSON file auto-downloads)
7. **Save to:** `functions/config/service-account-key.json`
8. Open JSON file and extract:
   - `FIREBASE_PROJECT_ID` = `project_id`
   - `FIREBASE_CLIENT_EMAIL` = `client_email`
   - `FIREBASE_PRIVATE_KEY` = `private_key` (keep `\n` characters)

---

## Part 3: API Keys (3 Different Keys)

### Step 3.1: Create Web API Key

1. Go to **Google Cloud Console** → **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. New key created - click the edit icon (pencil)
4. Rename: `love-actually-web-key`
5. Under "API restrictions", set to use specific APIs (optional)
6. Under "Application restrictions":
   - Choose **"HTTP referrers (web sites)"**
7. Add these referrers:
   ```
   https://love-actually-the-game.firebaseapp.com/*
   https://yourdomain.com/*
   http://localhost:3000/*
   http://localhost:5173/*
   ```
8. Click **"Save"**
9. Copy key value → `EXPO_PUBLIC_WEB_API_KEY`

### Step 3.2: Create Mobile API Key

1. Click **"Create Credentials"** → **"API Key"** (again)
2. Edit the new key
3. Rename: `love-actually-mobile-key`
4. Under "Application restrictions":
   - Choose **"Android apps"** OR **"iOS apps"** (create two keys if needed)
5. For Android:
   - Add Package Name: `com.lovelytrae.loveatually`
   - Add SHA-1 fingerprint (from keystore)
6. For iOS:
   - Add Bundle ID: `com.lovelytrae.loveatually`
7. Click **"Save"**
8. Copy key value → `EXPO_PUBLIC_MOBILE_API_KEY`

### Step 3.3: Create Backend API Key

1. Click **"Create Credentials"** → **"API Key"** (once more)
2. Edit the new key
3. Rename: `love-actually-backend-key`
4. Under "Application restrictions":
   - Choose **"IP addresses"**
5. Add your backend server IPs:
   ```
   123.456.789.0/32          (production)
   127.0.0.1/32              (localhost for testing)
   YOUR_CLOUD_RUN_IP/32      (if using Cloud Run)
   ```
6. Click **"Save"**
7. Copy key value → `EXPO_PUBLIC_BACKEND_API_KEY`

---

## Part 4: Cloud Messaging & Push Notifications

### Step 4.1: Get Server Key

1. Go to **Firebase Console** → **"Project Settings"** (⚙️)
2. Go to **"Cloud Messaging"** tab
3. Copy: **"Server Key"** → `FIREBASE_SERVER_KEY`
4. Copy: **"Sender ID"** → `FIREBASE_SENDER_ID`

### Step 4.2: Set Up Web Push

1. In Firebase Console → **"Build"** → **"Messaging"**
2. Go to **"Web configuration"** tab
3. Click **"Generate key pair"** if you don't have one
4. Copy: **"Public Key"** → `FIREBASE_WEB_PUSH_PUBLIC_KEY`
5. Copy: **"Private Key"** → `FIREBASE_WEB_PUSH_PRIVATE_KEY`

---

## Part 5: OAuth 2.0 for Google Sign-In

### Step 5.1: Configure OAuth Consent Screen

1. **Google Cloud Console** → **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"**
3. Click **"Create"**
4. Fill in:
   - **App name:** `Love Actually - The Game`
   - **User support email:** `support@lovetrae.app`
   - **App logo:** (upload if available)
5. Click **"Save and Continue"**
6. **Scopes:** Keep default (email, profile, openid)
7. Click **"Save and Continue"**
8. **Test users:** Add yourself
9. Click **"Save and Continue"** → **"Back to Dashboard"**

### Step 5.2: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `love-actually-oauth`
5. **Authorized JavaScript origins:**
   ```
   https://love-actually-the-game.firebaseapp.com
   https://yourdomain.com
   http://localhost:3000
   http://localhost:5173
   ```
6. **Authorized redirect URIs:**
   ```
   https://love-actually-the-game.firebaseapp.com/__/auth/callback
   https://yourdomain.com/__/auth/callback
   http://localhost:3000/__/auth/callback
   ```
7. Click **"Create"**
8. Copy:
   - `EXPO_PUBLIC_OAUTH_CLIENT_ID` = Client ID
   - `EXPO_PUBLIC_OAUTH_CLIENT_SECRET` = Client Secret

---

# 🎨 THIRD-PARTY API KEYS

## Part 6.1: OpenAI (Chat & AI Analysis)

1. Go to **https://platform.openai.com/account/api-keys**
2. Click **"Create new secret key"**
3. Name: `love-actually-game`
4. Copy key → `EXPO_PUBLIC_OPENAI_API_KEY`

## Part 6.2: Anthropic (Claude)

1. Go to **https://console.anthropic.com/account/keys**
2. Click **"Create Key"**
3. Copy key → `EXPO_PUBLIC_ANTHROPIC_API_KEY`

## Part 6.3: ElevenLabs (Voice for Dr. Marcie)

1. Go to **https://elevenlabs.io/account**
2. Copy: **"API Key"** → `EXPO_PUBLIC_ELEVENLABS_API_KEY`
3. Go to **"Voice Library"**
4. Choose voice for Dr. Marcie character
5. Copy: **"Voice ID"** → `EXPO_PUBLIC_ELEVENLABS_VOICE_ID_MARCIE`

## Part 6.4: Giphy (Game Animations)

1. Go to **https://developers.giphy.com/dashboard**
2. Create new app: `love-actually-game`
3. Accept terms
4. Copy: **"API Key"** → `EXPO_PUBLIC_GIPHY_API_KEY`

## Part 6.5: Mapbox (Location Features - Optional)

1. Go to **https://account.mapbox.com/tokens/**
2. Click **"Create a token"**
3. Name: `love-actually-game`
4. Scopes: Public scopes
5. Copy token → `EXPO_PUBLIC_MAPBOX_API_KEY`

## Part 6.6: PostHog (Analytics)

1. Go to **https://posthog.com** (or your self-hosted instance)
2. Go to **"Project Settings"**
3. Copy: **"Project API Key"** → `EXPO_PUBLIC_POSTHOG_API_KEY`
4. Note: **"Your PostHog instance URL"** → `EXPO_PUBLIC_POSTHOG_HOST`

## Part 6.7: Sentry (Error Tracking)

1. Go to **https://sentry.io** (or self-hosted Sentry)
2. Create project for your app
3. Go to **"Settings"** → **"Projects"** → your project
4. Copy: **"DSN (Client Key)"** → `EXPO_PUBLIC_SENTRY_DSN`

---

# 🔐 SECURITY CHECKLIST

## Development

- [ ] Service account key ONLY in `functions/config/`
- [ ] `.env.local` added to `.gitignore`
- [ ] No API keys committed to Git
- [ ] All API keys restricted by origin/platform
- [ ] Enable 2FA on Google account
- [ ] Firestore rules use production mode
- [ ] Storage rules restrict access appropriately

## Production

- [ ] Restrict API keys to approved domains only
- [ ] Use separate keys for web, mobile, backend
- [ ] Enable Cloud Armor for DDoS protection
- [ ] Monitor all API usage in Cloud Console
- [ ] Set up alerts for suspicious activity
- [ ] Regularly audit IAM permissions
- [ ] Use VPC for backend connections
- [ ] Implement rate limiting in Cloud Functions
- [ ] Rotate keys every 90 days
- [ ] Use different keys for dev/staging/production

---

# 🔧 TROUBLESHOOTING

## Firestore not connecting?

- Check API key in `.env.local`
- Verify Firestore is enabled in Google Cloud APIs
- Check Firestore Rules allow your authentication method
- Confirm `EXPO_PUBLIC_FIREBASE_PROJECT_ID` matches your project

## Storage bucket not found?

- Verify bucket name in `.env.local` matches exactly
- Check Storage Rules are published
- Ensure Cloud Storage API is enabled
- Wait a few minutes for changes to propagate

## Cloud Functions not deploying?

- Check Cloud Functions API is enabled
- Verify service account has appropriate permissions
- Check `functions/package.json` dependencies
- Verify service account key is in correct location

## Push Notifications not working?

- Verify Cloud Messaging is enabled
- Check `google-services.json` in correct Android location
- Check `GoogleService-Info.plist` in correct iOS location
- Verify Messaging Sender ID in `.env.local`
- Check notification permissions on device

## API Key restrictions not working?

- Wait 5-10 minutes for restrictions to take effect
- Check exact domain/IP format matches
- Verify correct API selected in restrictions

## Service Account has no permissions?

- Go to Google Cloud → IAM & Admin
- Check service account has "Editor" role
- May need to wait 5 minutes for role to apply

## OAuth not working?

- Verify OAuth consent screen is "External"
- Check authorized origins match your domain exactly
- Verify redirect URIs are correct
- Check client ID and secret in `.env.local`

---

# 📊 QUICK REFERENCE TABLE

| Value | Source | Storage | Used By |
|-------|--------|---------|---------|
| Firebase Config | Firebase Console | `.env.local` | Frontend App |
| Service Account | Google Cloud | `functions/config/` | Cloud Functions |
| API Keys (3) | Google Cloud | `.env.local` | Various services |
| OAuth 2.0 | Google Cloud | `.env.local` | Google Sign-In |
| Cloud Messaging | Firebase | `.env.local` | Push notifications |
| Third-party APIs | Each service | `.env.local` | AI, Voice, Analytics |
| Firestore | Firebase | Auto-configured | Database |
| Cloud Storage | Firebase | Auto-configured | File uploads |

---

# 🔗 Important Links

| Task | URL |
|------|-----|
| Firebase Console | https://console.firebase.google.com |
| Google Cloud Console | https://console.cloud.google.com |
| Firebase Docs | https://firebase.google.com/docs |
| Cloud Functions | https://firebase.google.com/docs/functions |
| Firestore Rules | https://firebase.google.com/docs/firestore/security |
| Google Cloud APIs | https://console.cloud.google.com/apis |
| OAuth Consent | https://console.cloud.google.com/apis/consent |
| Service Accounts | https://console.cloud.google.com/iam-admin/serviceaccounts |
| OpenAI API | https://platform.openai.com/account/api-keys |
| Anthropic API | https://console.anthropic.com/account/keys |
| ElevenLabs API | https://elevenlabs.io/account |

---

# 📱 iOS & Android Specific Setup

## iOS Setup

1. **GoogleService-Info.plist** location:
   ```
   ios/LoveActually/GoogleService-Info.plist
   ```

2. Add to Xcode:
   - Target: LoveActually
   - Build Phases → Copy Bundle Resources
   - Add `GoogleService-Info.plist`

3. Update `ios/Podfile`:
   ```ruby
   pod 'Firebase/Core'
   pod 'Firebase/Auth'
   pod 'Firebase/Firestore'
   pod 'Firebase/Storage'
   pod 'Firebase/Messaging'
   ```

## Android Setup

1. **google-services.json** location:
   ```
   android/app/google-services.json
   ```

2. Update `android/build.gradle`:
   ```gradle
   classpath 'com.google.gms:google-services:4.3.15'
   ```

3. Update `android/app/build.gradle`:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   
   dependencies {
     implementation 'com.google.firebase:firebase-core:21.1.1'
     implementation 'com.google.firebase:firebase-auth:21.1.0'
     implementation 'com.google.firebase:firebase-firestore:24.4.4'
     implementation 'com.google.firebase:firebase-storage:20.1.0'
     implementation 'com.google.firebase:firebase-messaging:23.1.1'
   }
   ```

---

# ⏱️ Timeline Summary

| Phase | Duration | Task |
|-------|----------|------|
| Phase 1 | 30 min | Initial Setup |
| Phase 2 | 30 min | Enable APIs |
| Phase 3 | 30 min | Service Accounts |
| Phase 4 | 45 min | Register Apps |
| Phase 5 | 20 min | Authentication |
| Phase 6 | 45 min | Firestore Setup |
| Phase 7 | 20 min | Cloud Storage |
| Phase 8 | 20 min | Cloud Messaging |
| Phase 9 | 15 min | Environment Variables |
| Phase 10 | 30 min | Testing |
| **Total** | **4-5 hours** | 🚀 Ready! |

---

## 📝 Final Notes

- All API keys should be restricted by origin/platform in production
- Service account keys should never be committed to version control
- Firestore regional placement affects latency - choose region close to users
- Free tier quotas: 50K reads, 20K writes, 20K deletes per day
- Monitor usage in Google Cloud Console → Billing

---

**Created:** June 2026  
**Next Steps After Checklist:**
1. Populate initial game data in Firestore
2. Deploy Cloud Functions
3. Set up monitoring & alerts
4. Configure backup strategy
5. Test end-to-end user journey

🚀 **You're ready to start!**
