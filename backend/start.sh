#!/bin/bash
# Backend startup script for local development

set -e

echo "🚀 Starting Relationshit! Backend API..."

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env with your configuration values"
    echo "   Required: GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_* vars"
    echo "   Required: GEMINI_API_KEY"
fi

# Check for service account
if [ ! -f service-account.json ] && [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ] && [ -z "$FIREBASE_PROJECT_ID" ]; then
    echo "⚠️  No Firebase credentials found!"
    echo "   Option 1: Place service-account.json in this directory"
    echo "   Option 2: Set GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json"
    echo "   Option 3: Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
    echo ""
    echo "   Continuing in fallback mode (in-memory storage)..."
fi

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

echo "📦 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing/updating dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "🔥 Starting FastAPI server on port 8001..."
echo "   API docs: http://localhost:8001/docs"
echo "   Health:   http://localhost:8001/api/health"
echo ""

uvicorn server:app --host 0.0.0.0 --port 8001 --reload