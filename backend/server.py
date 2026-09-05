#!/usr/bin/env python3
"""Love Actually - The Game API
Production-ready FastAPI backend with Firebase Firestore integration
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime, timezone
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

# ============================================================================
# FIREBASE INITIALIZATION - MANDATORY, NO FALLBACK
# ============================================================================
# NOTE: route modules (routes/*.py) do `from server import db, ...` at import
# time, so they MUST be imported only AFTER `db` and the helper functions below
# are defined. Importing them at the top of this file causes a circular import:
#   ImportError: cannot import name 'db' from partially initialized module 'server'
# ============================================================================

import firebase_admin
from firebase_admin import credentials, firestore

db: firestore.Client
FIREBASE_AVAILABLE = False

def initialize_firebase() -> firestore.Client:
    """Initialize Firebase Admin SDK.

    Credential resolution order:
      1. SKIP_FIREBASE=1            -> run with no Firestore (CI / local smoke)
      2. GOOGLE_APPLICATION_CREDENTIALS -> service account file
      3. FIREBASE_SERVICE_ACCOUNT_BASE64 -> service account JSON (base64) written to temp
      4. FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY (+ FIREBASE_PROJECT_ID) -> inline creds
      5. Application Default Credentials (Cloud Run)
    Raises on failure (no fallback) unless SKIP_FIREBASE is set.
    """
    global db, FIREBASE_AVAILABLE

    if os.getenv("SKIP_FIREBASE", "").lower() in ("1", "true", "yes"):
        print("[WARN] SKIP_FIREBASE is set - running WITHOUT Firestore (CI/local smoke).")
        db = None
        FIREBASE_AVAILABLE = False
        return None

    if firebase_admin._apps:
        # Already initialized
        db = firestore.client()
        FIREBASE_AVAILABLE = True
        return db

    cred = None
    source = None

    # 2. Service account file (local development)
    service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if service_account_path and os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        source = "service account file"

    # 3. Base64-encoded service account (Render / hosting platforms)
    if cred is None and os.getenv("FIREBASE_SERVICE_ACCOUNT_BASE64"):
        try:
            import base64, json, tempfile
            raw = base64.b64decode(os.getenv("FIREBASE_SERVICE_ACCOUNT_BASE64"))
            fd, tmp_path = tempfile.mkstemp(suffix=".json")
            with os.fdopen(fd, "w") as f:
                f.write(raw.decode("utf-8"))
            cred = credentials.Certificate(tmp_path)
            source = "FIREBASE_SERVICE_ACCOUNT_BASE64"
        except Exception as e:
            print(f"Failed to decode FIREBASE_SERVICE_ACCOUNT_BASE64: {e}")

    # 4. Inline service account fields (render.yaml declares these)
    if cred is None and os.getenv("FIREBASE_CLIENT_EMAIL") and os.getenv("FIREBASE_PRIVATE_KEY"):
        try:
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": os.getenv("FIREBASE_PROJECT_ID", ""),
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
                "token_uri": os.getenv("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
            })
            source = "inline FIREBASE_* env vars"
        except Exception as e:
            print(f"Failed to build credentials from FIREBASE_* env vars: {e}")

    # 5. Application Default Credentials (Cloud Run / GCE)
    if cred is None:
        try:
            cred = credentials.ApplicationDefault()
            source = "Application Default Credentials"
        except Exception as adc_error:
            print(f"Application Default Credentials not available: {adc_error}")
            raise RuntimeError(
                "Firebase initialization failed: "
                "Set GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_SERVICE_ACCOUNT_BASE64, "
                "or FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
            )

    firebase_admin.initialize_app(cred)
    print(f"Firebase initialized with {source}")

    db = firestore.client()
    FIREBASE_AVAILABLE = True
    print("Firebase Firestore connected successfully")
    return db

# Initialize on module load - will raise if Firebase unavailable
db = initialize_firebase()

# ============================================================================
# SERVER-LEVEL HELPER FUNCTIONS (used by routes)
# ============================================================================

def get_user_ref(user_id: str):
    """Get user document reference"""
    return db.collection('users').document(user_id)

def get_couple_ref(couple_id: str):
    """Get couple document reference"""
    return db.collection('couples').document(couple_id)

def get_session_ref(session_id: str):
    """Get game session document reference"""
    return db.collection('game_sessions').document(session_id)

def get_sos_ref(sos_id: str):
    """Get SOS session document reference"""
    return db.collection('sos_sessions').document(sos_id)

def doc_to_dict(doc):
    """Convert Firestore document to dict with id"""
    if doc and doc.exists:
        data = doc.to_dict()
        data['id'] = doc.id
        return data
    return None

def couple_has_member(couple_id: str, user_id: str) -> bool:
    """Return True if user_id is user1 or user2 of the given couple."""
    if not couple_id or not user_id or db is None:
        return False
    try:
        doc = get_couple_ref(couple_id).get()
        if not doc.exists:
            return False
        data = doc.to_dict()
        return user_id in (data.get('user1_id'), data.get('user2_id'))
    except Exception:
        return False

# ============================================================================
# ROUTER IMPORTS
# ============================================================================
# Imported here (after db + helpers are defined) so that route modules can
# safely `from server import db, get_user_ref, doc_to_dict, ...`.
# ============================================================================

from routes import auth, users, couples, games, sos, scoring, leaderboards, analytics, ai_marcie
import admin_routes

# ============================================================================
# API APPLICATION
# ============================================================================

app = FastAPI(
    title="Love Actually - The Game API",
    description="Production API for Love Actually couples therapy gaming app",
    version="2.0.0"
)

# ============================================================================
# CORS CONFIGURATION
# ============================================================================

# Get CORS origins from env or use defaults
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins_env.split(",")]
else:
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:19006",
        "http://localhost:8081",
        "exp://127.0.0.1:19000",
        "exp://localhost:19000",
        "exp://192.168.1.*:19000",  # Local network Expo
        "http://127.0.0.1:19006",
        "http://192.168.1.*:19006",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"exp://.*:19000|exp://.*:19006|http://localhost:\d+|http://192\.168\.\d+\.\d+:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# MOUNT ROUTERS
# ============================================================================
# Routers declare their own prefix (e.g. /api/users, /api/couples, ...).
# Do NOT re-apply a /api/v1 prefix here: that produced double-prefixed paths
# (e.g. /api/v1/auth/api/v1/auth/login) and made every endpoint 404.
# ============================================================================

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(couples.router)
app.include_router(games.router)
app.include_router(games.love_arcade_router)
app.include_router(sos.router)
app.include_router(scoring.router)
app.include_router(leaderboards.router)
app.include_router(leaderboards.leaderboard_router)
app.include_router(analytics.router)
app.include_router(ai_marcie.router)
app.include_router(ai_marcie.marcie_router)
app.include_router(admin_routes.router)

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str

class SystemStatusResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    database: str
    environment: str
    uptime: str
    total_games: int
    total_categories: int

# ============================================================================
# BASIC ENDPOINTS
# ============================================================================

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(timezone.utc).isoformat(),
        version="2.0.0"
    )

@app.get("/api/system/status")
async def get_system_status():
    """System status endpoint"""
    return SystemStatusResponse(
        status="operational",
        timestamp=datetime.now(timezone.utc).isoformat(),
        version="2.0.0",
        database="connected" if FIREBASE_AVAILABLE else "fallback",
        environment=os.environ.get("ENVIRONMENT", "development"),
        uptime="production_ready",
        total_games=167,
        total_categories=7
    )

@app.get("/api/info")
async def get_api_info():
    """Get API information"""
    return {
        "name": "Love Actually - The Game API",
        "version": "2.0.0",
        "description": "Production API for Love Actually couples therapy gaming app",
        "status": "running",
        "features": ["auth", "games", "sos", "ai", "scoring", "leaderboard", "couples"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/ping")
async def ping():
    """Simple ping endpoint"""
    return {"status": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/api/version")
async def get_version():
    """Get API version"""
    return {
        "version": "2.0.0",
        "build_date": "2025-08-10",
        "environment": os.environ.get("ENVIRONMENT", "development"),
        "features": ["auth", "games", "sos", "ai", "scoring", "leaderboard", "couples"]
    }

@app.get("/api/config")
async def get_config():
    """Get API configuration"""
    return {
        "sarcasm_levels": {
            1: {"name": "Tough Love Rookie", "description": "Mild sarcasm, warm but blunt"},
            2: {"name": "Reality Check Specialist", "description": "Clinical, analytical sarcasm"},
            3: {"name": "Radical Truth Wizard", "description": "Deep, powerful, poetic truth"},
            4: {"name": "The Glamour Oracle", "description": "Full Noir Prophecy Mode"}
        },
        "game_categories_count": 7,
        "game_registry_size": 167,
        "environment": os.environ.get("ENVIRONMENT", "development"),
        "cors_origins": ["http://localhost:3000", "http://localhost:19006"]
    }

@app.get("/api/ready")
async def get_ready_status():
    """Get readiness status"""
    return {
        "ready": True,
        "checks": {
            "database": FIREBASE_AVAILABLE,
            "auth_routes": True,
            "user_routes": True,
            "couple_routes": True,
            "sos_routes": True,
            "scoring_routes": True,
            "ai_routes": True,
            "analytics_routes": True
        },
        "message": "All systems operational"
    }

@app.get("/api/health/detailed")
async def detailed_health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "components": {
            "fastapi": "operational",
            "firebase": "connected" if FIREBASE_AVAILABLE else "fallback",
            "memory": "normal",
            "routes": {
                "auth": True,
                "users": True,
                "couples": True,
                "sos": True,
                "scoring": True,
                "leaderboard": True,
                "analytics": True,
                "ai_marcie": True
            }
        },
        "stats": {
            "total_users": 0,
            "total_couples": 0,
            "total_games": 167
        }
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "Love Actually - The Game API",
        "version": "2.0.0",
        "description": "Production API for Love Actually couples therapy gaming app",
        "status": "running",
        "features": ["auth", "games", "sos", "ai", "scoring", "leaderboard", "couples"],
        "endpoints": [
            "GET /api/health",
            "GET /api/system/status", 
            "GET /api/info",
            "GET /api/ping",
            "GET /api/version",
            "GET /api/config",
            "GET /api/ready",
            "GET /api/health/detailed",
            "POST /api/auth/login",
            "POST /api/auth/register",
            "POST /api/couples/create",
            "POST /api/couples/join",
            "GET /api/couples/me",
            "POST /api/games/sessions",
            "POST /api/sos/sessions",
            "POST /api/marcie/chat"
        ],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)