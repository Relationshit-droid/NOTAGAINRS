# Love Actually - The Game
## Production Deployment Guide

This guide covers deploying the Love Actually platform to production using Render.com.

---

## Prerequisites

- Render.com account
- Firebase project with Blaze plan (for Firestore)
- OpenAI API key (for Dr. Marcie AI)
- PostHog account (optional, for analytics)
- Sentry account (optional, for error tracking)

---

## Step 1: Environment Setup

### Backend Environment Variables (.env)

Create a `.env` file in the `/backend` directory:

```bash
# Server
PORT=8001
ENVIRONMENT=production
DEBUG=false

# Firebase (Option 1: Service Account JSON)
FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json

# OR Firebase (Option 2: Individual vars)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Redis
REDIS_URL=redis://localhost:6379/0

# AI
OPENAI_API_KEY=sk-your-key
EMERGENT_LLM_KEY=your-key  # Optional

# Security
JWT_SECRET=your-super-secret-key

# Analytics (Optional)
POSTHOG_API_KEY=phc_your-key
POSTHOG_HOST=https://app.posthog.com
SENTRY_DSN=https://your-dsn@sentry.io/project
```

### Frontend Environment Variables (.env)

Create a `.env` file in the `/app` directory:

```bash
# API
EXPO_PUBLIC_API_URL=https://your-api.onrender.com
EXPO_PUBLIC_WS_URL=wss://your-api.onrender.com

# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=your-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxxx

# Monitoring
EXPO_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project
EXPO_PUBLIC_POSTHOG_API_KEY=phc_your-key
```

---

## Step 2: Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Firestore Database
   - Enable Firebase Authentication

2. **Generate Service Account Key**:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file

3. **For Render Deployment**:
   - Base64 encode the JSON file:
     ```bash
     base64 -i firebase-service-account.json | pbcopy
     ```
   - Paste into Render environment variable `FIREBASE_SERVICE_ACCOUNT_BASE64`

---

## Step 3: Deploy to Render

### Using render.yaml (Blueprint)

1. Push your code to GitHub
2. Connect repository to Render
3. Render will automatically detect `render.yaml` and create services

### Manual Setup

If not using Blueprint:

1. **Create Web Service**:
   - Name: `lovetrae-api`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn -c gunicorn.conf.py server:app`

2. **Create Redis Instance**:
   - Name: `lovetrae-redis`
   - Plan: Free

3. **Add Environment Variables** in Render Dashboard:
   - All variables from `.env.example`

---

## Step 4: Running Tests

### Backend Tests

```bash
cd backend
pip install -r requirements.txt
pytest -v
```

### Frontend Tests

```bash
cd app
npm install
npm test
```

---

## Step 5: Verify Deployment

1. **Health Check**:
   ```bash
   curl https://your-api.onrender.com/api/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "version": "2.0.0",
     "firebase": "connected"
   }
   ```

2. **Test Endpoints**:
   - Create user: `POST /api/users`
   - Create couple: `POST /api/couples/create`
   - Get leaderboards: `GET /api/leaderboards/global`

---

## Monitoring & Maintenance

### Health Monitoring

- **Render Dashboard**: Monitor service status
- **Sentry**: Error tracking (if configured)
- **PostHog**: Analytics (if configured)
- **Firebase Console**: Database monitoring

### Logs

View logs in Render Dashboard or via CLI:
```bash
render logs --service lovetrae-api
```

### Database Backups

Firestore provides automatic backups. Configure in Firebase Console.

---

## Troubleshooting

### Common Issues

1. **Firebase Connection Failed**:
   - Check service account credentials
   - Verify Firebase project ID

2. **Redis Connection Failed**:
   - Check REDIS_URL environment variable
   - Verify Redis service is running

3. **CORS Errors**:
   - Verify CORS origins in `server.py`
   - Check frontend API URL

4. **WebSocket Not Connecting**:
   - Use `wss://` for production
   - Verify WebSocket URL in frontend

### Support

- Backend issues: Check `/api/health`
- Frontend issues: Check browser console
- Contact: support@lovetrae.app

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Firebase service account created
- [ ] Redis instance created
- [ ] API keys for OpenAI configured
- [ ] Sentry DSN configured (optional)
- [ ] PostHog API key configured (optional)
- [ ] Tests passing
- [ ] Health check endpoint responding
- [ ] WebSocket connections working
- [ ] Error tracking enabled
- [ ] Analytics tracking enabled

---

## API Documentation

Once deployed, API documentation is available at:
- Swagger UI: `https://your-api.onrender.com/docs`
- ReDoc: `https://your-api.onrender.com/redoc`
