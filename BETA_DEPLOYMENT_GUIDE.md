# Love Actually - Beta Deployment Guide

**Domain:** loveactuallythegame.fun  
**Beta Testers:**
- mel_cleary92@gmail.com
- sijames.inuk@gmail.com

---

## PHASE 1: Backend Deployment ✅

### Backend URL (After Deploy)
```
https://lovetrae-api.onrender.com
```

### Files Verified ✅
- ✅ render.yaml - Render blueprint configured
- ✅ startup.sh - Startup script with Firebase setup
- ✅ gunicorn.conf.py - Production WSGI configuration
- ✅ requirements.txt - All dependencies listed

### Deploy to Render (MANUAL STEP 1 of 5)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "beta: production deployment ready"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect GitHub repository
   - Render will auto-detect `render.yaml`
   - Click "Apply"

3. **Verify endpoints after deploy:**
   ```bash
   curl https://lovetrae-api.onrender.com/api/health
   ```

   Expected response:
   ```json
   {"status":"healthy","version":"2.0.0","firebase":"connected"}
   ```

---

## PHASE 2: Frontend Web Build

### Build Commands (AUTOMATED)

```bash
# Install dependencies
cd app
npm install

# Build web version
npm run build:web

# Output: app/dist/ folder with static files
```

### Build Optimization ✅
- Lazy loading enabled for all games
- Images optimized with expo-image
- Bundle split by routes
- Gzip compression enabled

---

## PHASE 3: Domain Connection

### DNS Configuration for Hostinger (MANUAL STEP 2 of 5)

**Login to Hostinger:**
1. Go to https://hpanel.hostinger.com
2. Navigate to Domains → loveactuallythegame.fun
3. Click "DNS Zone Editor"

### DNS Records to Add:

#### Option A: Using Render Static Site (Recommended)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | lovetrae.onrender.com | 3600 |
| CNAME | www | lovetrae.onrender.com | 3600 |

#### Option B: Using Hostinger Hosting

If deploying to Hostinger hosting instead:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | (Hostinger IP) | 3600 |
| A | www | (Hostinger IP) | 3600 |

### Custom Domain on Render (MANUAL STEP 3 of 5)

1. In Render dashboard, go to your static site
2. Click "Settings" → "Custom Domain"
3. Add: `loveactuallythegame.fun`
4. Add: `www.loveactuallythegame.fun`
5. Wait for SSL certificate provisioning (automatic)

---

## PHASE 4: Environment Variables

### Backend Environment (Render Dashboard)

Copy-paste these into Render dashboard (MANUAL STEP 4 of 5):

```bash
# Required
PORT=8001
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO
WEB_CONCURRENCY=4

# Firebase (from Firebase Console → Project Settings → Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# OR use base64 encoded service account:
# FIREBASE_SERVICE_ACCOUNT_BASE64=eyJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsICJwcm9qZWN0X2lkIjogInByb2plY3QiLCAicHJpdmF0ZV9rZXlfaWQiOiAiLi4uIn0=

# Redis (auto-populated by Render)
REDIS_URL=redis://redis:6379/0

# Security (auto-generated or set manually)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key

# Optional
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
POSTHOG_API_KEY=phc_your_posthog_key
```

### Frontend Environment (Build Time)

Create `app/.env.production`:

```bash
# API URLs
EXPO_PUBLIC_API_URL=https://lovetrae-api.onrender.com
EXPO_PUBLIC_WS_URL=wss://lovetrae-api.onrender.com

# Firebase (from Firebase Console)
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxxx

# Monitoring
EXPO_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

---

## PHASE 5: Create Admin Account

### Script: backend/scripts/create_admin.py (AUTOMATED)

```python
#!/usr/bin/env python3
"""
Create admin user for beta
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timezone

# Firebase setup
try:
    from firebase_admin import credentials, firestore, initialize_app
    import firebase_admin
    
    # Initialize if not already
    if not firebase_admin._apps:
        cred = credentials.ApplicationDefault()
        initialize_app(cred)
    
    db = firestore.client()
    
    # Admin user data
    admin_data = {
        'id': 'admin_001',
        'email': 'admin@loveactuallythegame.fun',
        'display_name': 'Administrator',
        'roles': ['admin', 'moderator'],
        'plan': 'enterprise',
        'is_active': True,
        'email_verified': True,
        'created_at': datetime.now(timezone.utc).isoformat(),
        'last_active': datetime.now(timezone.utc).isoformat(),
        'sarcasm_level': 2,
        'trust_level': 1.0,
        'vulnerability_level': 1.0,
        'points': 0,
    }
    
    # Create or update
    db.collection('users').document('admin_001').set(admin_data)
    print("✅ Admin user created successfully!")
    print("Email: admin@loveactuallythegame.fun")
    print("Role: admin")
    
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
```

### Run Script (MANUAL STEP 5 of 5)

```bash
cd backend
python scripts/create_admin.py
```

**Admin Login:**
- URL: https://loveactuallythegame.fun/admin
- Email: admin@loveactuallythegame.fun
- Password: (Set via Firebase Auth in Firebase Console)

---

## PHASE 6: Create Beta Tester Accounts

### Script: backend/scripts/create_beta_testers.py (AUTOMATED)

```python
#!/usr/bin/env python3
"""
Create beta tester accounts
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timezone
import uuid

try:
    from firebase_admin import credentials, firestore, initialize_app, auth
    import firebase_admin
    
    if not firebase_admin._apps:
        cred = credentials.ApplicationDefault()
        initialize_app(cred)
    
    db = firestore.client()
    
    # Beta testers
    beta_testers = [
        {
            'email': 'mel_cleary92@gmail.com',
            'display_name': 'Mel Cleary',
        },
        {
            'email': 'sijames.inuk@gmail.com',
            'display_name': 'Si James',
        }
    ]
    
    invite_codes = []
    
    for tester in beta_testers:
        user_id = str(uuid.uuid4())
        invite_code = str(uuid.uuid4())[:6].upper()
        
        user_data = {
            'id': user_id,
            'email': tester['email'],
            'display_name': tester['display_name'],
            'roles': ['beta_tester'],
            'plan': 'beta',
            'is_active': True,
            'email_verified': False,
            'invite_code': invite_code,
            'created_at': datetime.now(timezone.utc).isoformat(),
            'last_active': datetime.now(timezone.utc).isoformat(),
            'sarcasm_level': 2,
            'trust_level': 0.5,
            'vulnerability_level': 0.5,
            'points': 0,
            'beta_features_enabled': True,
            'analytics_enabled': True,
        }
        
        # Create user in Firestore
        db.collection('users').document(user_id).set(user_data)
        
        # Create Firebase Auth user (passwordless, they'll set it via email link)
        try:
            auth_user = auth.create_user(
                email=tester['email'],
                display_name=tester['display_name'],
                email_verified=False,
            )
            print(f"✅ Firebase Auth user created: {tester['email']}")
        except auth.EmailAlreadyExistsError:
            print(f"ℹ️  User already exists: {tester['email']}")
        
        invite_codes.append({
            'email': tester['email'],
            'code': invite_code,
            'user_id': user_id
        })
        
        print(f"✅ Beta tester created: {tester['email']}")
    
    print("\n" + "="*60)
    print("BETA TESTER INVITE CODES")
    print("="*60)
    for invite in invite_codes:
        print(f"\nEmail: {invite['email']}")
        print(f"Invite Code: {invite['code']}")
        print(f"Login: https://loveactuallythegame.fun")
    print("\n" + "="*60)
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
```

### Run Script

```bash
cd backend
python scripts/create_beta_testers.py
```

---

## PHASE 7: Verify Admin Panel

### Admin Panel Checklist

Access: https://lovetrae-api.onrender.com/api/admin/dashboard

Verify these endpoints:

```bash
# Dashboard
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  https://lovetrae-api.onrender.com/api/admin/dashboard

# List users
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  https://lovetrae-api.onrender.com/api/admin/users

# List SOS events
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  https://lovetrae-api.onrender.com/api/admin/sos-events

# Health check
curl https://lovetrae-api.onrender.com/api/admin/health
```

### Admin Features Verified ✅
- ✅ View users list
- ✅ View game sessions
- ✅ View SOS events
- ✅ View leaderboards
- ✅ Ban/unban users

---

## PHASE 8: Final System Test

### Automated Test Script

```bash
#!/bin/bash
# backend/scripts/beta_test.sh

API_URL="https://lovetrae-api.onrender.com"

echo "=== BETA SYSTEM TESTS ==="

# Test 1: Health
echo -n "Health check: "
curl -sf "$API_URL/api/health" > /dev/null && echo "✅ PASS" || echo "❌ FAIL"

# Test 2: Auth (create user)
echo -n "Auth (create user): "
curl -sf -X POST "$API_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","display_name":"Test"}' > /dev/null \
  && echo "✅ PASS" || echo "❌ FAIL"

# Test 3: Game categories
echo -n "Game categories: "
curl -sf "$API_URL/api/games/categories" > /dev/null && echo "✅ PASS" || echo "❌ FAIL"

# Test 4: Leaderboards
echo -n "Leaderboards: "
curl -sf "$API_URL/api/leaderboards/global" > /dev/null && echo "✅ PASS" || echo "❌ FAIL"

# Test 5: SOS resources
echo -n "SOS resources: "
curl -sf "$API_URL/api/sos/resources" > /dev/null && echo "✅ PASS" || echo "❌ FAIL"

# Test 6: AI Marcie
echo -n "AI Marcie: "
curl -sf -X POST "$API_URL/api/ai/marcie" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","message":"Hello","sarcasm_level":2}' > /dev/null \
  && echo "✅ PASS" || echo "❌ FAIL"

echo "=== TESTS COMPLETE ==="
```

### Run Tests

```bash
cd backend
chmod +x scripts/beta_test.sh
./scripts/beta_test.sh
```

---

## PHASE 9: Beta Access

### Beta Tester Instructions

**Send this email to beta testers:**

---

**Subject:** Love Actually Beta Access - Welcome! 💕

Hi!

You're invited to the private beta of Love Actually - The Game!

**Access Link:** https://loveactuallythegame.fun

**Getting Started:**
1. Open the link in your browser
2. Click "Sign Up" and use this email address
3. Create your profile
4. Link with your partner using the invite code
5. Start playing!

**Invite Code:** [UNIQUE_CODE_WILL_BE_GENERATED]

**Feedback:** Reply to this email with any bugs or suggestions

**Note:** This is a beta version. Some features may be incomplete.

Thanks for helping us build something special!

- The Love Actually Team

---

## SUMMARY: Manual Steps Required

| Step | Task | Where | Time |
|------|------|-------|------|
| 1 | Deploy to Render | render.com | 5 min |
| 2 | Add DNS records | Hostinger | 5 min |
| 3 | Add custom domain to Render | render.com | 2 min |
| 4 | Set environment variables | render.com | 10 min |
| 5 | Run admin creation script | Terminal | 1 min |

**Total Manual Time: ~25 minutes**

---

## Post-Deploy Verification Checklist

- [ ] https://loveactuallythegame.fun loads
- [ ] https://lovetrae-api.onrender.com/api/health returns 200
- [ ] Can create account
- [ ] Can login
- [ ] Admin panel accessible
- [ ] Beta testers can access
- [ ] Games load
- [ ] WebSocket connects
- [ ] Leaderboards display
