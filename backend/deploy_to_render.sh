#!/bin/bash
# LoveTrae Backend Deployment Script for Render
# Usage: ./deploy_to_render.sh

set -e

echo "🚀 LoveTrae Backend Deployment Script"
echo "======================================"
echo ""

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Please install it first:"
    echo "   npm install -g @render-cloud/cli"
    exit 1
fi

# Check if logged in
if ! render auth status &> /dev/null; then
    echo "❌ Not logged in to Render. Please run: render auth login"
    exit 1
fi

echo "✅ Render CLI is installed and authenticated"
echo ""

# Deploy
echo "📦 Deploying to Render..."
render up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to Render Dashboard to set environment variables:"
echo "   - GEMINI_API_KEY"
echo "   - GEMINI_MODEL (optional, default: gemini-1.5-flash)"
echo "   - FIREBASE_CREDENTIALS_PATH (or upload service account key)"
echo ""
echo "2. Update your frontend .env with the new backend URL"
echo ""
echo "3. Test the health endpoint:"
echo "   curl https://your-backend.onrender.com/api/health"
