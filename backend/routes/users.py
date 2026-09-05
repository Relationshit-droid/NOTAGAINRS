"""User Management API
Handles user operations, profiles, and data management.
Users are keyed by their Firebase Auth UID so the backend record is
addressable by the same id the mobile app authenticates with.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid

# Firebase imports
from firebase_admin import firestore
from server import db, get_user_ref, get_couple_ref, get_session_ref, doc_to_dict
from security import require_auth, caller_uid, ensure_self, validate_email

FIREBASE_AVAILABLE = db is not None

router = APIRouter(prefix="/api/users", tags=["users"])

# In-memory storage only for transient stats (not user data)
user_stats: Dict[str, Any] = {}


# ============================================================================
# Pydantic Models
# ============================================================================

class CreateUserRequest(BaseModel):
    email: str = Field(..., example="user@example.com")
    display_name: str = Field(..., min_length=2, max_length=50)
    password: Optional[str] = Field(None, min_length=6)
    avatar_url: Optional[str] = None


class UpdateUserRequest(BaseModel):
    display_name: Optional[str] = Field(None, min_length=2, max_length=50)
    avatar_url: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None


class UpdateSarcasmRequest(BaseModel):
    level: int = Field(..., ge=1, le=4)


class UserProfile(BaseModel):
    id: str
    email: str
    display_name: str
    avatar_url: Optional[str]
    created_at: str
    last_login: Optional[str]
    login_count: int
    preferences: Dict[str, Any]
    stats: Dict[str, Any]


class UserStats(BaseModel):
    user_id: str
    games_played: int
    games_completed: int
    average_score: float
    streak_days: int
    favorite_category: Optional[str]
    achievements_unlocked: List[str]
    total_points: int
    last_active: str


class UserReport(BaseModel):
    user_id: str
    generated_at: str
    report_type: str
    data: Dict[str, Any]


# ============================================================================
# Helper Functions
# ============================================================================

def generate_user_stats(user_id: str) -> Dict[str, Any]:
    """Generate user statistics"""
    return {
        'user_id': user_id,
        'games_played': 0,
        'games_completed': 0,
        'average_score': 0.0,
        'streak_days': 0,
        'favorite_category': None,
        'achievements_unlocked': [],
        'total_points': 0,
        'last_active': datetime.now(timezone.utc).isoformat()
    }


def _is_admin(uid: str) -> bool:
    """Check whether a user record has the admin role."""
    if not db:
        return False
    try:
        doc = get_user_ref(uid).get()
        if doc.exists:
            return (doc.to_dict().get('role') == 'admin')
    except Exception as e:
        print(f"Error checking admin role: {e}")
    return False


# ============================================================================
# Endpoints
# ============================================================================

@router.get("/health")
async def users_health_check():
    """Health check for users service (registered before /{user_id} to avoid
    being shadowed by the path-param route)."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "users",
        "database": "connected" if db else "unavailable",
    }


@router.post("/")
async def create_user(
    request: CreateUserRequest,
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Create a new user record keyed by the authenticated Firebase UID."""
    if not validate_email(request.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    # Identity comes from the verified Firebase ID token, not from the body.
    uid = caller_uid(current_user)
    user_id = uid or str(uuid.uuid4())

    # Check whether the user already exists (idempotent create).
    try:
        existing = get_user_ref(user_id).get()
        if existing.exists:
            data = existing.to_dict()
            data.pop('password_hash', None)
            data['id'] = user_id
            return data
    except Exception as e:
        print(f"Error checking existing user: {e}")

    avatar_url = request.avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_id}"

    user_data = {
        'id': user_id,
        'firebase_uid': uid,
        'email': request.email,
        'display_name': request.display_name,
        'avatar_url': avatar_url,
        'partner_id': None,
        'couple_code': None,
        'couple_id': None,
        'sarcasm_level': 1,
        'trust_level': 0.65,
        'vulnerability_level': 0.42,
        'points': 0,
        'plan': 'free',
        'created_at': datetime.now(timezone.utc).isoformat(),
        'last_login': None,
        'login_count': 0,
        'status': 'active',
        'role': 'user',
        'email_verified': True,
        'preferences': {
            'language': 'en',
            'theme': 'dark',
            'notifications': True,
            'sound': True,
            'music': False,
        }
    }

    try:
        get_user_ref(user_id).set(user_data)
    except Exception as e:
        print(f"Error creating user in Firebase: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")

    # Create user stats
    user_stats[user_id] = generate_user_stats(user_id)

    return user_data


@router.get("/")
async def list_users(
    limit: int = 50,
    offset: int = 0,
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """List users with pagination (admin only)."""
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    uid = caller_uid(current_user)
    if not _is_admin(uid or ""):
        raise HTTPException(status_code=403, detail="Admin access required")

    query = db.collection('users').order_by('created_at').offset(offset).limit(limit)
    docs = list(query.stream())

    users = []
    for doc in docs:
        user_data = doc.to_dict()
        user_data['id'] = doc.id
        user_data.pop('password_hash', None)
        users.append(user_data)

    return {
        'users': users,
        'pagination': {
            'limit': limit,
            'offset': offset,
            'has_more': len(users) == limit,
        }
    }


@router.get("/{user_id}")
async def get_user(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Get user by ID (self or admin)."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    doc = get_user_ref(user_id).get()
    if doc.exists:
        user_data = doc.to_dict()
        user_data.pop('password_hash', None)
        user_data['id'] = doc.id
        return user_data
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.put("/{user_id}")
async def update_user(
    user_id: str,
    request: UpdateUserRequest,
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Update user profile (self or admin). Mass-assignment safe."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    doc = get_user_ref(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    # Only allow specific, whitelisted fields (no role/status/email escalation).
    updates = {k: v for k, v in request.dict(exclude_unset=True).items() if v is not None}
    if updates:
        updates['updated_at'] = datetime.now(timezone.utc).isoformat()
        get_user_ref(user_id).update(updates)

    updated = get_user_ref(user_id).get().to_dict()
    updated.pop('password_hash', None)
    updated['id'] = user_id
    return updated


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Delete user account (self or admin)."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    user_doc = get_user_ref(user_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    get_user_ref(user_id).delete()

    if user_id in user_stats:
        del user_stats[user_id]

    # Delete game sessions
    sessions = db.collection('game_sessions').where('user_id', '==', user_id).stream()
    for session in sessions:
        session.reference.delete()

    # Soft-unlink any couples
    couples = db.collection('couples').where('user1_id', '==', user_id).stream()
    for couple in couples:
        db.collection('couples').document(couple.id).update({
            'status': 'unlinked',
            'unlinked_at': datetime.now(timezone.utc).isoformat()
        })

    return {"success": True, "message": "User account deleted successfully"}


@router.get("/{user_id}/stats")
async def get_user_stats(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Get user statistics (self or admin)."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    stats_doc = db.collection('user_stats').document(user_id).get()
    if stats_doc.exists:
        return stats_doc.to_dict()

    stats_data = generate_user_stats(user_id)
    db.collection('user_stats').document(user_id).set(stats_data)
    return stats_data


@router.put("/{user_id}/stats")
async def update_user_stats(
    user_id: str,
    stats_update: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Update user statistics (self or admin)."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    stats_doc = db.collection('user_stats').document(user_id).get()
    if stats_doc.exists:
        stats_data = stats_doc.to_dict()
    else:
        stats_data = generate_user_stats(user_id)

    for key, value in stats_update.items():
        if key in stats_data:
            stats_data[key] = value
    stats_data['last_updated'] = datetime.now(timezone.utc).isoformat()

    db.collection('user_stats').document(user_id).set(stats_data)
    return stats_data


@router.post("/{user_id}/login")
async def record_login(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Record user login activity (self or admin)."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    get_user_ref(user_id).update({
        'last_login': datetime.now(timezone.utc).isoformat(),
        'login_count': firestore.Increment(1),
    })

    return {"success": True, "message": "Login recorded"}


@router.put("/{user_id}/sarcasm")
async def update_sarcasm_level(
    user_id: str,
    request: UpdateSarcasmRequest,
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Update the user's Dr. Marcie sarcasm level (1-4), self or admin."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    doc = get_user_ref(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    level = request.level
    names = {
        1: "Tough Love Rookie",
        2: "Reality Check Specialist",
        3: "Radical Truth Wizard",
        4: "The Glamour Oracle",
    }
    get_user_ref(user_id).update({
        'sarcasm_level': level,
        'updated_at': datetime.now(timezone.utc).isoformat(),
    })

    return {"success": True, "sarcasm_level": level, "name": names[level]}


@router.post("/{user_id}/report")
async def generate_user_report(
    user_id: str,
    report_type: str = "summary",
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Generate user report (self or admin)."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    user_doc = get_user_ref(user_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_doc.to_dict()
    user_data.pop('password_hash', None)

    sessions = []
    total_score = 0
    games_completed = 0
    category_counts = {}

    query = db.collection('game_sessions').where('user_id', '==', user_id).stream()
    for session in query:
        session_data = session.to_dict()
        session_data['id'] = session.id
        sessions.append(session_data)

        if session_data.get('completed'):
            games_completed += 1
            total_score += session_data.get('score', 0)

        category = session_data.get('category_id')
        if category:
            category_counts[category] = category_counts.get(category, 0) + 1

    favorite_category = None
    if category_counts:
        favorite_category = max(category_counts.items(), key=lambda x: x[1])[0]

    return {
        'user_info': user_data,
        'activity_summary': {
            'total_sessions': len(sessions),
            'games_completed': games_completed,
            'total_score': total_score,
            'average_score': total_score / games_completed if games_completed > 0 else 0,
            'completion_rate': games_completed / len(sessions) if sessions else 0,
            'favorite_category': favorite_category,
        },
        'recent_sessions': sessions[-10:],
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'report_type': report_type,
    }


@router.get("/{user_id}/preferences")
async def get_user_preferences(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Get user preferences (self or admin)."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=404, detail="User not found")

    doc = get_user_ref(user_id).get()
    if doc.exists:
        return doc.to_dict().get('preferences', {})
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.put("/{user_id}/preferences")
async def update_user_preferences(
    user_id: str,
    preferences: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(require_auth),
):
    """Update user preferences (self or admin)."""
    ensure_self(current_user, user_id)

    if not db:
        raise HTTPException(status_code=503, detail="Database not available")

    doc = get_user_ref(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    get_user_ref(user_id).update({
        'preferences': preferences,
        'updated_at': datetime.now(timezone.utc).isoformat(),
    })

    return preferences
