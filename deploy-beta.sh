#!/bin/bash
# =============================================================================
# Love Actually - Beta Deployment Automation Script
# Usage: ./deploy-beta.sh
# =============================================================================

set -e

echo "=========================================="
echo "  LOVE ACTUALLY - BETA DEPLOYMENT"
echo "  Domain: loveactuallythegame.fun"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_URL="https://lovetrae-api.onrender.com"
FRONTEND_URL="https://loveactuallythegame.fun"

# Step 1: Verify files
echo -e "${BLUE}Step 1: Verifying deployment files...${NC}"

required_files=(
    "render.yaml"
    "backend/startup.sh"
    "backend/gunicorn.conf.py"
    "backend/requirements.txt"
    "backend/server.py"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ Missing: $file"
        exit 1
    fi
done

echo ""
echo -e "${GREEN}✅ All files verified${NC}"

# Step 2: Git status
echo ""
echo -e "${BLUE}Step 2: Checking git status...${NC}"

if [ -d ".git" ]; then
    git status --short
    echo ""
    read -p "Do you want to commit and push changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "beta: prepare for production deployment" || true
        git push origin main
        echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
    fi
else
    echo "  ⚠️  Not a git repository"
fi

# Step 3: Build frontend
echo ""
echo -e "${BLUE}Step 3: Building frontend...${NC}"

if [ -d "app" ]; then
    cd app
    
    echo "  Installing dependencies..."
    npm install --silent
    
    echo "  Building web version..."
    npm run build:web 2>/dev/null || npx expo export:web
    
    if [ -d "dist" ] || [ -d "web-build" ]; then
        echo -e "${GREEN}  ✅ Frontend built successfully${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Build folder not found${NC}"
    fi
    
    cd ..
else
    echo "  ⚠️  app/ directory not found"
fi

# Step 4: Display manual steps
echo ""
echo "=========================================="
echo "  MANUAL STEPS REQUIRED"
echo "=========================================="
echo ""

cat << 'EOF'
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Deploy Backend to Render                       │
├─────────────────────────────────────────────────────────┤
│  1. Go to https://dashboard.render.com                  │
│  2. Click "New +" → "Blueprint"                         │
│  3. Connect your GitHub repository                      │
│  4. Click "Apply" on the blueprint                      │
│  5. Wait for deployment (~5 minutes)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  STEP 2: Configure Environment Variables                │
├─────────────────────────────────────────────────────────┤
│  In Render dashboard, set these secrets:                │
│                                                         │
│  FIREBASE_PROJECT_ID=your-project-id                    │
│  FIREBASE_CLIENT_EMAIL=...                              │
│  FIREBASE_PRIVATE_KEY="-----BEGIN..."                   │
│  OPENAI_API_KEY=sk-...                                  │
│  JWT_SECRET=your-secret-key                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  STEP 3: Configure Domain (Hostinger)                   │
├─────────────────────────────────────────────────────────┤
│  1. Login to https://hpanel.hostinger.com               │
│  2. Go to Domains → loveactuallythegame.fun             │
│  3. Click "DNS Zone Editor"                             │
│  4. Add these records:                                  │
│                                                         │
│  Type: CNAME    Name: @                                 │
│  Value: lovetrae.onrender.com                           │
│                                                         │
│  Type: CNAME    Name: www                               │
│  Value: lovetrae.onrender.com                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  STEP 4: Add Custom Domain to Render                    │
├─────────────────────────────────────────────────────────┤
│  1. In Render dashboard, select your static site        │
│  2. Go to Settings → Custom Domains                     │
│  3. Add: loveactuallythegame.fun                        │
│  4. Add: www.loveactuallythegame.fun                    │
│  5. SSL will auto-provision                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  STEP 5: Create Admin & Beta Users                      │
├─────────────────────────────────────────────────────────┤
│  Run these commands after backend is deployed:          │
│                                                         │
│  cd backend                                             │
│  python scripts/create_admin.py                         │
│  python scripts/create_beta_testers.py                  │
│                                                         │
│  Or run the remote version:                             │
│  curl $API_URL/api/admin/setup -X POST                  │
└─────────────────────────────────────────────────────────┘
EOF

echo ""
echo "=========================================="
echo "  VERIFICATION COMMANDS"
echo "=========================================="
echo ""

cat << EOF
# Check backend health
curl $API_URL/api/health

# Run full system tests
cd backend && ./scripts/beta_test.sh

# Check admin panel
curl $API_URL/api/admin/health

# Expected backend URL: $API_URL
# Expected frontend URL: $FRONTEND_URL
EOF

echo ""
echo "=========================================="
echo "  NEXT STEPS"
echo "=========================================="
echo ""
echo "1. Complete the 5 manual steps above"
echo "2. Verify deployment with: ./backend/scripts/beta_test.sh"
echo "3. Send beta invites to:"
echo "   - mel_cleary92@gmail.com"
echo "   - sijames.inuk@gmail.com"
echo ""
echo "Admin Panel: $FRONTEND_URL/admin"
echo ""
echo "=========================================="
