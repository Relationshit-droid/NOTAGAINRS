#!/bin/bash
# =============================================================================
# Love Actually - The Game
# Render.com Startup Script
# =============================================================================

set -e

echo "=================================="
echo "Starting Love Actually API Server"
echo "=================================="

# Check environment
echo "Environment: ${ENVIRONMENT:-development}"
echo "Port: ${PORT:-8001}"

# Verify Firebase credentials
echo "Checking Firebase configuration..."
if [ -n "$FIREBASE_SERVICE_ACCOUNT_BASE64" ]; then
    echo "Firebase service account provided via environment variable"
    echo "$FIREBASE_SERVICE_ACCOUNT_BASE64" | base64 -d > firebase-service-account.json
    export FIREBASE_CREDENTIALS_PATH="firebase-service-account.json"
elif [ -n "$FIREBASE_PROJECT_ID" ] && [ -n "$FIREBASE_CLIENT_EMAIL" ] && [ -n "$FIREBASE_PRIVATE_KEY" ]; then
    echo "Firebase credentials provided via individual environment variables"
else
    echo "Warning: No Firebase credentials found. Running in fallback mode."
fi

# Check Redis
echo "Checking Redis connection..."
if [ -n "$REDIS_URL" ]; then
    echo "Redis URL configured"
else
    echo "Warning: REDIS_URL not set. Using in-memory fallback."
fi

# Check AI services
echo "Checking AI service configuration..."
if [ -n "$GEMINI_API_KEY" ]; then
    echo "Gemini API key configured"
else
    echo "Warning: Gemini API key not set. Dr. Marcie will use fallback responses."
fi

# Check analytics
echo "Checking analytics configuration..."
if [ -n "$POSTHOG_API_KEY" ]; then
    echo "PostHog API key configured"
fi

if [ -n "$SENTRY_DSN" ]; then
    echo "Sentry DSN configured"
fi

# Run database migrations or setup if needed
echo "Running pre-start checks..."

# Health check endpoint will be available at /api/health
echo "=================================="
echo "Starting Gunicorn server..."
echo "=================================="

# Start Gunicorn with Uvicorn workers
exec gunicorn \
    -c gunicorn.conf.py \
    server:app
