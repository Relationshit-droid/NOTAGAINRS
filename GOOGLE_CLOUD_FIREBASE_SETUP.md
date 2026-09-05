# Google Cloud & Firebase Setup Guide - Complete

**Project Name:** Love Actually - The Game  
**Created:** June 2026  
**Environment:** Production Ready

---

## 📋 Table of Contents

1. [Firebase Project Setup](#firebase-project-setup)
2. [Google Cloud Console APIs](#google-cloud-console-apis)
3. [Environment Variables](#environment-variables)
4. [Step-by-Step Configuration](#step-by-step-configuration)
5. [Firestore Configuration](#firestore-configuration)
6. [Cloud Functions Setup](#cloud-functions-setup)
7. [Security & Access](#security--access)
8. [Third-Party Integrations](#third-party-integrations)

---

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project in Google Cloud Console

**URL:** https://console.firebase.google.com/

1. Click **"Create Project"** or **"Add Project"**
2. Enter Project Name: `love-actually-the-game`
3. Accept default settings
4. Click **"Create Project"**
5. Wait for provisioning (2-3 minutes)

### Step 2: Register Web Application

1. In Firebase Console, click **"<>"** (Web icon)
2. App Name: `love-actually-web`
3. Check **"Also set up Firebase Hosting"**
4. Click **"Register App"**
5. Copy the Firebase Config (see section below)

### Step 3: Register Native Applications

**For iOS:**
1. Click **"+"** → **"iOS"**
2. iOS Bundle ID: `com.lovelytrae.loveatually`
3. Click **"Register App"**
4. Download `GoogleService-Info.plist`
5. Place in Xcode project

**For Android:**
1. Click **"+"** → **"Android"**
2. Android Package Name: `com.lovelytrae.loveatually`
3. SHA-1 Fingerprint: (Get from keystore - see Security section)
4. Click **"Register App"**
5. Download `google-services.json`
6. Place in `android/app/` directory

---

## 📦 Firebase Config Values

**After registering the web app, you'll receive:**

```javascript
// Copy these from Firebase Console → Project Settings → Your apps
{
  apiKey: "AIzaSy...",
  authDomain: "love-actually-the-game.firebaseapp.com",
  projectId: "love-actually-the-game",
  storageBucket: "love-actually-the-game.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
}
```

---

## ☁️ Google Cloud Console APIs

### Step 1: Access Google Cloud Console

**URL:** https://console.cloud.google.com/

1. Sign in with same Google account as Firebase
2. Select your project: `love-actually-the-game`
3. Go to **"APIs & Services"** → **"Library"**

### Step 2: Enable Required APIs

Enable these APIs (search, click, enable):

#### Core APIs:
- ✅ **Cloud Firestore API**
- ✅ **Cloud Storage API**
- ✅ **Cloud Functions API**
- ✅ **Cloud Pub/Sub API**
- ✅ **Cloud Scheduler API**
- ✅ **Identity and Access Management (IAM) API**

#### Optional but Recommended:
- ✅ **Cloud Vision API** (if using image analysis)
- ✅ **Cloud Natural Language API** (for sentiment analysis)
- ✅ **Cloud Translation API** (for i18n)
- ✅ **Google Analytics Admin API** (for analytics)

### Step 3: Create Service Accounts

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"Service Account"**
3. Service Account Name: `love-actually-app-server`
4. Description: `Backend server and Cloud Functions`
5. Click **"Create and Continue"**
6. Grant Role: **"Editor"** (for development)
   - In production: use more restrictive roles
7. Click **"Continue"** → **"Done"**

### Step 4: Create Service Account Key

1. Click on the newly created service account
2. Go to **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Select **"JSON"** format
5. Click **"Create"** (file auto-downloads)
6. **Save as:** `functions/config/service-account-key.json`

### Step 5: Create API Keys

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Create THREE keys:

**API Key 1 - Web:**
1. Name: `love-actually-web-key`
2. Restrict to: **"HTTP referrers"**
3. Add referrers:
   - `https://love-actually-the-game.firebaseapp.com/*`
   - `https://yourdomain.com/*`
   - `http://localhost:3000/*` (development)

**API Key 2 - Mobile:**
1. Name: `love-actually-mobile-key`
2. Restrict to: **"Android apps"** and **"iOS apps"**
3. Add your app fingerprints

**API Key 3 - Backend:**
1. Name: `love-actually-backend-key`
2. Restrict to: **"IP addresses"**
3. Add backend IP ranges

---

## 🔐 Authentication Setup

### Step 1: Enable Authentication Methods

1. Firebase Console → **"Build"** → **"Authentication"**
2. Click **"Get Started"**
3. Enable these Sign-in Methods:

- ✅ **Email/Password**
  - Check: "Enable"
  - Click "Save"

- ✅ **Google**
  - Click "Enable"
  - Use default Google Cloud project
  - Click "Save"

- ✅ **Phone Number** (Optional)
  - Click "Enable"
  - Configure reCAPTCHA v3
  - Click "Save"

### Step 2: Configure OAuth Consent Screen

1. Google Cloud Console → **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"**
3. Click **"Create"**
4. Fill in App Information:
   - App name: `Love Actually - The Game`
   - User support email: `support@lovetrae.app`
   - Developer contact: `dev@lovetrae.app`
5. Scopes: Keep default (email, profile, openid)
6. Click **"Save and Continue"** through remaining screens

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Application Type: **"Web application"**
4. Name: `love-actually-oauth`
5. Authorized JavaScript origins:
   - `https://love-actually-the-game.firebaseapp.com`
   - `https://yourdomain.com`
   - `http://localhost:3000`
6. Authorized redirect URIs:
   - `https://love-actually-the-game.firebaseapp.com/__/auth/callback`
   - `https://yourdomain.com/__/auth/callback`
7. Click **"Create"**
8. Copy: **Client ID** and **Client Secret**

---

## 🗄️ Firestore Database

### Step 1: Create Database

1. Firebase Console → **"Build"** → **"Firestore Database"**
2. Click **"Create Database"**
3. Select Region:
   - Production: `us-central1` (or nearest to users)
   - Development: `us-central1`
4. Security Rules: **"Start in production mode"**
5. Click **"Create"**

### Step 2: Create Collections

```
users/
├── {userId}/
│   ├── profile
│   ├── settings
│   ├── gameSessions[]
│   └── achievements[]

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

### Step 3: Set Firestore Rules

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

### Step 4: Create Firestore Indexes

1. Go to **"Firestore Database"** → **"Indexes"** tab
2. Create Composite Indexes for queries:

```
Index 1: gameSessions
- userId (Ascending)
- createdAt (Descending)

Index 2: sosRequests
- coupleId (Ascending)
- status (Ascending)
- createdAt (Descending)

Index 3: users
- createdAt (Descending)
```

---

## ☁️ Cloud Storage

### Step 1: Create Storage Bucket

1. Firebase Console → **"Build"** → **"Storage"**
2. Click **"Get Started"**
3. Bucket Name: `love-actually-the-game.appspot.com`
4. Region: Same as Firestore
5. Security Rules: **"Start in production mode"**
6. Click **"Create"**

### Step 2: Configure Storage Rules

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

---

## ⚡ Cloud Functions

### Step 1: Initialize Functions

```bash
cd functions
npm init -y
npm install firebase-admin firebase-functions
```

### Step 2: Deploy Service Account Key

1. Copy `service-account-key.json` to `functions/config/`
2. Add to `.gitignore`: `config/service-account-key.json`

### Step 3: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

### Step 4: Essential Cloud Functions to Deploy

See `functions/src/index.ts` - includes:

- `getAiAnalysis` - Calls OpenAI/Anthropic for game logic
- `recordGameSession` - Logs session data
- `sendNotification` - Firebase Cloud Messaging
- `analyticsWebhook` - Receives analytics data

---

## 📧 Cloud Messaging (Push Notifications)

### Step 1: Get Messaging Credentials

1. Firebase Console → **"Project Settings"** (⚙️)
2. Go to **"Cloud Messaging"** tab
3. Note: **Server Key** and **Sender ID**

### Step 2: Configure Web Push

1. Firebase Console → **"Build"** → **"Messaging"**
2. Click **"Web configuration"**
3. Generate new key pair
4. Save **Public Key** and **Private Key**

### Step 3: Update app.json (Expo)

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#DB147C"
        }
      ]
    ]
  }
}
```

---

## 📊 Environment Variables

### Create `.env.local` (Web/Backend)

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=love-actually-the-game.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=love-actually-the-game
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=love-actually-the-game.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef1234567890

# Backend API
EXPO_PUBLIC_API_URL=https://api.lovetrae.app
EXPO_PUBLIC_WS_URL=wss://api.lovetrae.app

# Third-party Services
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
EXPO_PUBLIC_POSTHOG_API_KEY=phc_...
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
EXPO_PUBLIC_ELEVENLABS_API_KEY=...
EXPO_PUBLIC_ELEVENLABS_VOICE_ID_MARCIE=...
EXPO_PUBLIC_GIPHY_API_KEY=...

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
EXPO_PUBLIC_ENABLE_BETA_FEATURES=false
```

### Create `app.json` (Expo Config)

```json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_FIREBASE_API_KEY": "AIzaSy...",
      "EXPO_PUBLIC_FIREBASE_PROJECT_ID": "love-actually-the-game",
      "EXPO_PUBLIC_API_URL": "https://api.lovetrae.app"
    }
  }
}
```

### Create `functions/.env` (Cloud Functions)

```bash
# Service Account (from JSON file)
FIREBASE_PROJECT_ID=love-actually-the-game
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@love-actually-the-game.iam.gserviceaccount.com

# External APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🔧 Step-by-Step Configuration Checklist

### Phase 1: Core Setup (Day 1)

- [ ] Create Firebase project
- [ ] Enable Firestore, Storage, Auth
- [ ] Create service account & download key
- [ ] Enable Cloud Functions API
- [ ] Create API keys (Web, Mobile, Backend)
- [ ] Configure OAuth consent screen

### Phase 2: Database & Security (Day 2)

- [ ] Create Firestore collections
- [ ] Deploy Firestore rules
- [ ] Create Firestore indexes
- [ ] Deploy Storage rules
- [ ] Set up authentication methods

### Phase 3: Deployment (Day 3)

- [ ] Deploy Cloud Functions
- [ ] Configure messaging
- [ ] Test end-to-end flow
- [ ] Monitor with Cloud Logging

### Phase 4: Monitoring (Day 4)

- [ ] Set up Cloud Logging
- [ ] Create Cloud Monitoring alerts
- [ ] Configure error reporting
- [ ] Test backup procedures

---

## 🔐 Security Checklist

### Development
```
✓ Use service account key only on secure servers
✓ Keep API keys restricted by origin/package
✓ Enable 2FA on Firebase project
✓ Use production mode for Firestore rules
✓ Rotate service account keys quarterly
```

### Production

```
✓ Restrict API keys to approved domains only
✓ Use separate keys for web, mobile, backend
✓ Enable Cloud Armor for DDoS protection
✓ Monitor all API usage in Cloud Console
✓ Set up alerts for suspicious activity
✓ Regularly audit IAM permissions
✓ Use VPC for backend connections
✓ Implement rate limiting in Cloud Functions
```

---

## 📱 iOS & Android Specific

### iOS Setup

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
   ```

### Android Setup

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
   }
   ```

---

## 🎯 Quick Reference: Where to Find Values

| Value | Location | Purpose |
|-------|----------|---------|
| **API Key** | Firebase Console → Project Settings | Authentication |
| **Auth Domain** | Firebase Console → Project Settings | Firebase auth endpoint |
| **Project ID** | Google Cloud Console | Firestore & Storage bucket |
| **Storage Bucket** | Google Cloud Console → Cloud Storage | File uploads |
| **Messaging Sender ID** | Firebase Console → Cloud Messaging | Push notifications |
| **App ID** | Firebase Console → Project Settings | App identification |
| **Service Account Key** | Google Cloud → Service Accounts | Backend server access |
| **Server Key** | Firebase → Cloud Messaging | Push notification server |
| **Web Push Key** | Firebase → Cloud Messaging | Web notifications |

---

## 🚀 Testing Your Configuration

### Test Firebase Connection

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const snapshot = await getDocs(collection(db, "games"));
console.log("✓ Firestore connected:", snapshot.docs.length, "games");
```

### Test Authentication

```typescript
import { getAuth, signInAnonymously } from 'firebase/auth';

const auth = getAuth();
const result = await signInAnonymously(auth);
console.log("✓ Auth working:", result.user.uid);
```

### Test Cloud Functions

```bash
curl -X POST https://us-central1-love-actually-the-game.cloudfunctions.net/getAiAnalysis \
  -H "Content-Type: application/json" \
  -d '{"promptText": "test"}'
```

---

## 📞 Support Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Google Cloud Docs:** https://cloud.google.com/docs
- **Cloud Functions Guide:** https://firebase.google.com/docs/functions
- **Firestore Rules Guide:** https://firebase.google.com/docs/firestore/security
- **Firebase Console:** https://console.firebase.google.com
- **Google Cloud Console:** https://console.cloud.google.com

---

## 📝 Notes

- All API keys should be restricted by origin/platform in production
- Service account keys should never be committed to version control
- Firestore regional placement affects latency - choose region close to users
- Free tier quotas: 50K reads, 20K writes, 20K deletes per day
- Monitor usage in Google Cloud Console → Billing

**Created:** June 2026  
**Last Updated:** June 2026
