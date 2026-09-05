# 🎯 Firebase & Google Cloud: Step-by-Step Value Collection Guide

**Goal:** Get every API key and configuration value you need  
**Time:** ~2 hours

---

## Part 1: Firebase Web Configuration

**These are your most important values. Start here.**

### Step 1.1: Get Web App Config

1. Go to **https://console.firebase.google.com**
2. Select your project: `love-actually-the-game`
3. Click **Project Settings** (⚙️ icon, top-right)
4. Go to **"Your apps"** section
5. Under Web apps, find your `love-actually-web` app
6. Click the icon that looks like `</>` to copy config
7. Copy the JavaScript snippet - it looks like:

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

**Extract from JSON file:**
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
5. Restrict to **"HTTP referrers (web sites)"**
6. Add these referrers:
   ```
   https://love-actually-the-game.firebaseapp.com/*
   https://yourdomain.com/*
   http://localhost:3000/*
   http://localhost:5173/*
   ```
7. Click **"Save"**
8. Copy key value to: `WEB_API_KEY`

### Step 3.2: Create Mobile API Key

1. Click **"Create Credentials"** → **"API Key"** (again)
2. Edit the new key
3. Rename: `love-actually-mobile-key`
4. Restrict to **"Android apps"** and **"iOS apps"**
5. Add your app fingerprints:
   - iOS Bundle ID: `com.lovelytrae.loveatually`
   - Android Package: `com.lovelytrae.loveatually`
6. Click **"Save"**
7. Copy key value to: `MOBILE_API_KEY`

### Step 3.3: Create Backend API Key

1. Click **"Create Credentials"** → **"API Key"** (once more)
2. Edit the new key
3. Rename: `love-actually-backend-key`
4. Restrict to **"IP addresses"**
5. Add your backend server IPs:
   ```
   123.456.789.0/32          (production)
   127.0.0.1/32              (localhost for testing)
   YOUR_CLOUD_RUN_IP/32      (if using Cloud Run)
   ```
6. Click **"Save"**
7. Copy key value to: `BACKEND_API_KEY`

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
   - **App logo:** (upload company logo if available)
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
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`

---

## Part 6: Third-Party API Keys

### Step 6.1: OpenAI (Chat & AI Analysis)

1. Go to **https://platform.openai.com/account/api-keys**
2. Click **"Create new secret key"**
3. Name: `love-actually-game`
4. Copy key → `EXPO_PUBLIC_OPENAI_API_KEY`
5. Save in `.env.local`

### Step 6.2: Anthropic (Claude)

1. Go to **https://console.anthropic.com/account/keys**
2. Click **"Create Key"**
3. Copy key → `EXPO_PUBLIC_ANTHROPIC_API_KEY`

### Step 6.3: ElevenLabs (Voice for Dr. Marcie)

1. Go to **https://elevenlabs.io/account**
2. Copy: **"API Key"** → `EXPO_PUBLIC_ELEVENLABS_API_KEY`
3. Go to **"Voice Library"**
4. Choose voice for Dr. Marcie character
5. Copy: **"Voice ID"** → `EXPO_PUBLIC_ELEVENLABS_VOICE_ID_MARCIE`

### Step 6.4: Giphy (Game Animations)

1. Go to **https://developers.giphy.com/dashboard**
2. Create new app: `love-actually-game`
3. Accept terms
4. Copy: **"API Key"** → `EXPO_PUBLIC_GIPHY_API_KEY`

### Step 6.5: Mapbox (Location Features - Optional)

1. Go to **https://account.mapbox.com/tokens/**
2. Click **"Create a token"**
3. Name: `love-actually-game`
4. Public scopes needed
5. Copy token → `EXPO_PUBLIC_MAPBOX_API_KEY`

### Step 6.6: PostHog (Analytics)

1. Go to **https://posthog.com** or your self-hosted instance
2. Go to **"Project Settings"**
3. Copy: **"Project API Key"** → `EXPO_PUBLIC_POSTHOG_API_KEY`
4. Note: **"Your PostHog instance"** → `EXPO_PUBLIC_POSTHOG_HOST`

### Step 6.7: Sentry (Error Tracking)

1. Go to **https://sentry.io** or self-hosted Sentry
2. Create project for your app
3. Go to **"Settings"** → **"Projects"** → your project
4. Copy: **"DSN (Client Key)"** → `EXPO_PUBLIC_SENTRY_DSN`

---

## Part 7: Firestore Database Setup

### Step 7.1: Create Database

1. Firebase Console → **"Build"** → **"Firestore Database"**
2. Click **"Create Database"**
3. Location: `us-central1` (or nearest your users)
4. Mode: **"Start in production mode"**
5. Click **"Create"**

### Step 7.2: Get Firestore Connection String

1. Once created, go to **"Firestore Database"** → **"Settings"**
2. Connection String format:
   ```
   projects/{project-id}/databases/(default)
   ```
   This is already embedded in your API config.

---

## Part 8: Cloud Storage Bucket

### Step 8.1: Get Storage Bucket Name

1. Firebase Console → **"Build"** → **"Storage"**
2. If not created yet, click **"Get Started"**
   - Bucket name: `love-actually-the-game.appspot.com`
   - Region: Same as Firestore
   - Mode: Production
3. Once created, you should see bucket name displayed
4. This is already in your: `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`

---

## Part 9: Create a Master Configuration File

Now that you have all values, create `.env.local`:

```bash
# Firebase (from Part 1)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyDOCAbC1234567890...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=love-actually-the-game.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=love-actually-the-game
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=love-actually-the-game.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef1234567890

# Service Account (from Part 2 - for Cloud Functions only)
# Note: Store in functions/.env, not here
FIREBASE_PROJECT_ID=love-actually-the-game
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@love-actually-the-game.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# API Keys (from Part 3)
EXPO_PUBLIC_WEB_API_KEY=AIzaSyDOCAbC1234567890...
EXPO_PUBLIC_MOBILE_API_KEY=AIzaSyDOCAbC1234567890...
EXPO_PUBLIC_BACKEND_API_KEY=AIzaSyDOCAbC1234567890...

# Cloud Messaging (from Part 4)
FIREBASE_SERVER_KEY=AAAAA1234567890:BBBBB...
FIREBASE_SENDER_ID=123456789

# OAuth 2.0 (from Part 5)
EXPO_PUBLIC_OAUTH_CLIENT_ID=123456789.apps.googleusercontent.com
EXPO_PUBLIC_OAUTH_CLIENT_SECRET=GOCSPX-...

# Third-Party APIs (from Part 6)
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
EXPO_PUBLIC_ELEVENLABS_API_KEY=...
EXPO_PUBLIC_ELEVENLABS_VOICE_ID_MARCIE=...
EXPO_PUBLIC_GIPHY_API_KEY=...
EXPO_PUBLIC_MAPBOX_API_KEY=pk_...
EXPO_PUBLIC_POSTHOG_API_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Backend
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
EXPO_PUBLIC_WS_URL=wss://api.yourdomain.com

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
```

---

## 🔒 Security Checklist

After collecting all values:

- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit `.env.local` to version control
- [ ] Service account key is only in `functions/config/`
- [ ] API keys are restricted by origin/platform
- [ ] All production keys use limited scopes
- [ ] Backup your API keys in secure location
- [ ] Rotate keys every 90 days
- [ ] Use different keys for dev/staging/production

---

## ✅ Verification Checklist

After setting up everything:

- [ ] Firebase Web Config values match your project
- [ ] Service Account Key saved securely
- [ ] 3 API Keys created and restricted
- [ ] OAuth 2.0 configured
- [ ] Cloud Messaging values copied
- [ ] Third-party API keys obtained
- [ ] `.env.local` file created with all values
- [ ] Firestore database created
- [ ] Cloud Storage bucket created
- [ ] `.env.local` NOT committed to Git

---

## 📞 Common Issues

**"Cannot find Firebase Config"**
- Check Firebase Console → Project Settings → Your apps section
- Make sure you registered a Web app

**"API Key restrictions not working"**
- Wait 5-10 minutes for restrictions to take effect
- Check exact domain/IP format matches

**"Service Account has no permissions"**
- Verify service account has "Editor" or appropriate role
- Go to Google Cloud → IAM & Admin → check role assignment

**"Firestore queries failing"**
- Check Firestore Rules in Firebase Console
- Verify Cloud Firestore API is enabled
- Check authentication is working

---

## 📋 Summary Table

| Configuration | Source | Storage | Used By |
|---|---|---|---|
| Firebase Config | Firebase Console | `.env.local` | Frontend App |
| Service Account | Google Cloud | `functions/config/` | Cloud Functions |
| API Keys (3) | Google Cloud | `.env.local` | Various services |
| OAuth 2.0 | Google Cloud | `.env.local` | Google Sign-In |
| Cloud Messaging | Firebase | `.env.local` | Push notifications |
| Third-party APIs | Each service | `.env.local` | AI, Voice, Analytics |
| Firestore | Firebase | Auto-configured | Database |
| Cloud Storage | Firebase | Auto-configured | File uploads |

---

**Next:** Use these values in your `.env.local` file and start deploying!

