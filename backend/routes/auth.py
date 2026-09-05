"""Authentication API
Handles user registration, login, and authentication.
"""

from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import uuid

import bcrypt
from firebase_admin import firestore

# Firebase imports - mandatory, no fallback
from server import db, get_user_ref, doc_to_dict
from security import create_jwt_token, rate_limit

FIREBASE_AVAILABLE = db is not None

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ============================================================================
# Pydantic Models
# ============================================================================

class LoginRequest(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6)


class RegisterRequest(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6)
    display_name: str = Field(..., min_length=2, max_length=50)
    # Optional: the Firebase Auth UID, when the client signs up via Firebase
    # and wants the backend record keyed by the same id it authenticates with.
    firebase_uid: Optional[str] = None


class ResetPasswordRequest(BaseModel):
    email: str = Field(..., example="user@example.com")


class AuthResponse(BaseModel):
    user: Dict[str, Any]
    token: str
    expires_at: str


# ============================================================================
# Helpers
# ============================================================================

def hash_password(password: str) -> str:
    """Hash a password with bcrypt (never store plaintext)."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against a stored bcrypt hash (constant-time)."""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    except (ValueError, TypeError):
        return False


def _get_user_by_email(email: str):
    """Return (user_id, user_dict) for an email, or (None, None)."""
    if not db:
        return None, None
    query = db.collection('users').where('email', '==', email).limit(1)
    docs = list(query.stream())
    if not docs:
        return None, None
    doc = docs[0]
    data = doc.to_dict()
    data['id'] = doc.id
    return doc.id, data


def _public_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Strip secrets (password_hash) before returning a user to the client."""
    return {k: v for k, v in user_data.items() if k not in ('password_hash',)}


# ============================================================================
# Endpoints
# ============================================================================

@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest, _rl: Dict = Depends(rate_limit)):
    """Register a new user with a hashed password and return a signed JWT."""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    # Validate email format
    from security import validate_email
    if not validate_email(request.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Validate password strength
    if len(request.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters",
        )

    # Check if user already exists
    try:
        existing_id, _ = _get_user_by_email(request.email)
        if existing_id:
            raise HTTPException(status_code=400, detail="Email already registered")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error checking user existence: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user account")

    # Key the user record by the Firebase UID when available so the backend
    # record is addressable by the same id the client authenticates with.
    user_id = request.firebase_uid or str(uuid.uuid4())

    now = datetime.now(timezone.utc).isoformat()
    user_data = {
        'id': user_id,
        'firebase_uid': request.firebase_uid,
        'email': request.email,
        'password_hash': hash_password(request.password),
        'display_name': request.display_name,
        'created_at': now,
        'last_login': None,
        'role': 'user',
        'status': 'active',
        'email_verified': False,
        'login_count': 0,
        'sarcasm_level': 1,
        'preferences': {
            'language': 'en',
            'theme': 'dark',
            'notifications': True,
        },
    }

    try:
        db.collection('users').document(user_id).set(user_data)
    except Exception as e:
        print(f"Error saving user to Firebase: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user account")

    token = create_jwt_token(user_id, request.email)
    expires_at = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()

    return {
        'user': _public_user(user_data),
        'token': token,
        'expires_at': expires_at,
    }


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, _rl: Dict = Depends(rate_limit)):
    """Authenticate a user by email + password and return a signed JWT."""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    try:
        user_id, user_data = _get_user_by_email(request.email)
    except Exception as e:
        print(f"Error querying Firebase users: {e}")
        raise HTTPException(status_code=500, detail="Authentication service error")

    if not user_id or not user_data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify the password against the stored bcrypt hash.
    password_hash = user_data.get('password_hash')
    if not password_hash or not verify_password(request.password, password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Record login activity
    try:
        db.collection('users').document(user_id).update({
            'last_login': datetime.now(timezone.utc).isoformat(),
            'login_count': firestore.Increment(1),
        })
    except Exception as e:
        print(f"Error recording login: {e}")

    token = create_jwt_token(user_id, request.email)
    expires_at = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()

    return {
        'user': _public_user(user_data),
        'token': token,
        'expires_at': expires_at,
    }


@router.post("/logout")
async def logout(user_id: str = Header(None)):
    """Logout. (Token denylisting / refresh-token revocation is a TODO.)"""
    return {"success": True, "message": "Logged out successfully"}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Send a password reset email (same response regardless of account existence)."""
    # TODO: integrate SendGrid/SES and always return the same message to avoid
    # leaking which email addresses are registered.
    return {"success": True, "message": "Password reset email sent if account exists"}


@router.get("/health")
async def auth_health_check():
    """Health check for auth service"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "auth",
        "database": "connected" if db else "unavailable",
    }
