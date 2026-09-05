"""
Game Sessions API Routes
Handles game session creation, updates, completion, and history
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid
import os
import json

# Firebase imports
try:
    from firebase_admin import firestore
    from server import db, get_session_ref, get_couple_ref, get_user_ref, doc_to_dict, FIREBASE_AVAILABLE, couple_has_member
except ImportError:
    FIREBASE_AVAILABLE = False
    db = None
    get_session_ref = None
    get_couple_ref = None
    get_user_ref = None
    doc_to_dict = None
    couple_has_member = None

from security import require_auth, caller_uid

router = APIRouter(prefix="/api/games", tags=["games"])

# ---------------------------------------------------------------------------
# Static game catalog (generated from app/src/lib/gameRegistry.ts)
# ---------------------------------------------------------------------------
_GAME_CATALOG: Dict[str, Any] = {"games": {}, "categories": {}, "total_games": 0, "categories_count": 0}
try:
    _CATALOG_PATH = os.path.join(os.path.dirname(__file__), "..", "game_catalog.json")
    with open(_CATALOG_PATH, encoding="utf-8") as _f:
        _GAME_CATALOG = json.load(_f)
except Exception as e:
    print(f"[WARN] game_catalog.json not loaded: {e}")

_CATEGORY_META = {
    "romance-hub": {"name": "Romance Hub", "icon": "heart", "color": "#FF6B9D"},
    "emotional-connection": {"name": "Emotional Connection", "icon": "link", "color": "#4ECDC4"},
    "conflict-resolution": {"name": "Conflict Resolution", "icon": "shield", "color": "#FFD93D"},
    "creative-chaos": {"name": "Creative Chaos", "icon": "sparkles", "color": "#A8E6CF"},
    "healing-hospital": {"name": "Healing Hospital", "icon": "medical", "color": "#FF8B94"},
    "game-show": {"name": "Game Show", "icon": "trophy", "color": "#D4A5FF"},
    "love-arcade": {"name": "Love Arcade", "icon": "game-controller", "color": "#9BF6FF"},
}

# In-memory fallback storage
game_sessions_db: Dict[str, Any] = {}
users_db: Dict[str, Any] = {}

# =============================================================================
# Pydantic Models
# =============================================================================

class CreateSessionRequest(BaseModel):
    user_id: str
    game_id: str
    category_id: str
    couple_id: Optional[str] = None

class UpdateSessionRequest(BaseModel):
    score: Optional[float] = None
    completed: Optional[bool] = None
    responses: Optional[List[Dict[str, Any]]] = None
    game_state: Optional[Dict[str, Any]] = None
    partner_progress: Optional[Dict[str, Any]] = None

class CompleteSessionRequest(BaseModel):
    final_score: float
    responses: Optional[List[Dict[str, Any]]] = None
    game_state: Optional[Dict[str, Any]] = None
    achievements: Optional[List[str]] = None

class SubmitAnswerRequest(BaseModel):
    user_id: str
    question_id: str
    answer: Any
    timestamp: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class GameSessionResponse(BaseModel):
    id: str
    user_id: str
    couple_id: Optional[str] = None
    game_id: str
    category_id: str
    started_at: str
    completed: bool = False
    completed_at: Optional[str] = None
    score: float = 0.0
    responses: List[Dict[str, Any]] = []
    game_state: Optional[Dict[str, Any]] = None
    partner_progress: Optional[Dict[str, Any]] = None
    status: str = "active"
    timeout_at: Optional[str] = None
    achievements: List[str] = []

class GameAnswerResponse(BaseModel):
    id: str
    session_id: str
    user_id: str
    question_id: str
    answer: Any
    is_correct: Optional[bool] = None
    points_earned: int = 0
    submitted_at: str
    metadata: Optional[Dict[str, Any]] = None

# =============================================================================
# Helper Functions
# =============================================================================

def get_game_metadata(game_id: str) -> Dict[str, Any]:
    """Get game metadata from registry"""
    g = _GAME_CATALOG.get("games", {}).get(game_id)
    if g:
        return {
            "id": g["id"],
            "max_score": g.get("max_score", 100),
            "estimated_time": 10,
        }
    return {"id": game_id, "max_score": 100, "estimated_time": 10}


def _owns_session(session_data: Dict[str, Any], uid: Optional[str]) -> bool:
    """True if uid is the session owner or a member of the session's couple."""
    if not uid:
        return False
    if session_data.get("user_id") == uid:
        return True
    return bool(couple_has_member and couple_has_member(session_data.get("couple_id"), uid))

# =============================================================================
# Routes
# =============================================================================

@router.get("/categories")
async def get_categories():
    """Get all game categories with their game ids."""
    categories = []
    cat_ids = _GAME_CATALOG.get("categories", {})
    for cid, meta in _CATEGORY_META.items():
        categories.append({
            "id": cid,
            "name": meta["name"],
            "icon": meta["icon"],
            "color": meta["color"],
            "games": cat_ids.get(cid, []),
        })
    return {"categories": categories}


@router.get("/categories/{category_id}")
async def get_category(category_id: str):
    """Get a specific category with its full game details."""
    meta = _CATEGORY_META.get(category_id)
    if not meta:
        raise HTTPException(status_code=404, detail="Category not found")

    game_ids = _GAME_CATALOG.get("categories", {}).get(category_id, [])
    games_detail = []
    for gid in game_ids:
        g = _GAME_CATALOG.get("games", {}).get(gid)
        if g:
            games_detail.append({
                "id": g["id"],
                "name": g["name"],
                "max_score": g.get("max_score", 100),
                "description": g.get("description"),
                "category": g.get("category_id"),
                "category_name": g.get("category_name"),
            })

    return {
        "id": category_id,
        "name": meta["name"],
        "description": f"Games in the {meta['name']} category",
        "icon": meta["icon"],
        "color": meta["color"],
        "games": game_ids,
        "games_detail": games_detail,
    }


@router.get("/registry")
async def get_registry():
    """Get the complete game registry."""
    return {
        "games": _GAME_CATALOG.get("games", {}),
        "total_games": _GAME_CATALOG.get("total_games", 0),
        "categories": _GAME_CATALOG.get("categories_count", len(_CATEGORY_META)),
    }

@router.get("/health")
async def games_health_check():
    """Health check for games service"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "games",
        "database": "connected" if FIREBASE_AVAILABLE else "fallback_mode"
    }

@router.get("/{game_id}")
async def get_game(game_id: str):
    """Get specific game details"""
    meta = get_game_metadata(game_id)
    return {
        "id": game_id,
        "name": game_id.replace("-", " ").title(),
        "max_score": meta.get("max_score", 100),
        "min_players": 1,
        "estimated_time": meta.get("estimated_time", 10),
        "category": "emotional-connection"
    }

# =============================================================================
# Session Endpoints
# =============================================================================

@router.post("/sessions", response_model=GameSessionResponse)
async def create_session(request: CreateSessionRequest, current_user: Dict = Depends(require_auth)):
    """Create a new game session."""
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    session_id = str(uuid.uuid4())
    started_at = datetime.now(timezone.utc).isoformat()
    timeout_at = (datetime.now(timezone.utc).replace(hour=23, minute=59, second=59)).isoformat()
    
    session_data = {
        "id": session_id,
        "user_id": request.user_id,
        "couple_id": request.couple_id,
        "game_id": request.game_id,
        "category_id": request.category_id,
        "started_at": started_at,
        "completed": False,
        "completed_at": None,
        "score": 0.0,
        "responses": [],
        "game_state": {},
        "partner_progress": None,
        "status": "active",
        "timeout_at": timeout_at,
        "achievements": []
    }
    
    try:
        if FIREBASE_AVAILABLE and get_session_ref:
            get_session_ref(session_id).set(session_data)
        else:
            game_sessions_db[session_id] = session_data
    except Exception as e:
        print(f"Error creating session: {e}")
        raise HTTPException(status_code=500, detail="Failed to create game session")
    
    return session_data

@router.get("/sessions/{session_id}", response_model=GameSessionResponse)
async def get_session(session_id: str, token: Optional[str] = Header(None), current_user: Dict = Depends(require_auth)):
    """Get game session by ID."""
    try:
        if FIREBASE_AVAILABLE and get_session_ref:
            doc = get_session_ref(session_id).get()
            if doc.exists:
                if not _owns_session(doc.to_dict(), caller_uid(current_user)):
                    raise HTTPException(status_code=403, detail="Forbidden")
                return doc_to_dict(doc)
            else:
                raise HTTPException(status_code=404, detail="Session not found")
        else:
            if session_id in game_sessions_db:
                session = game_sessions_db[session_id]
                session['id'] = session_id
                return session
            else:
                raise HTTPException(status_code=404, detail="Session not found")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting session: {e}")
        raise HTTPException(status_code=500, detail="Failed to get session")

@router.put("/sessions/{session_id}", response_model=GameSessionResponse)
async def update_session(session_id: str, request: UpdateSessionRequest, token: Optional[str] = Header(None), current_user: Dict = Depends(require_auth)):
    """Update a game session."""
    try:
        if FIREBASE_AVAILABLE and get_session_ref:
            doc_ref = get_session_ref(session_id)
            doc = doc_ref.get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="Session not found")
            if not _owns_session(doc.to_dict(), caller_uid(current_user)):
                raise HTTPException(status_code=403, detail="Forbidden")

            updates = request.dict(exclude_unset=True)
            if updates:
                doc_ref.update(updates)
            
            updated_doc = doc_ref.get()
            return doc_to_dict(updated_doc)
        else:
            if session_id not in game_sessions_db:
                raise HTTPException(status_code=404, detail="Session not found")
            
            updates = request.dict(exclude_unset=True)
            game_sessions_db[session_id].update(updates)
            session = game_sessions_db[session_id]
            session['id'] = session_id
            return session
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating session: {e}")
        raise HTTPException(status_code=500, detail="Failed to update session")

@router.post("/sessions/{session_id}/complete", response_model=GameSessionResponse)
async def complete_session(session_id: str, request: CompleteSessionRequest, token: Optional[str] = Header(None), current_user: Dict = Depends(require_auth)):
    """Complete a game session and update couple meters."""
    completed_at = datetime.now(timezone.utc).isoformat()
    
    try:
        if FIREBASE_AVAILABLE and get_session_ref:
            doc_ref = get_session_ref(session_id)
            doc = doc_ref.get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="Session not found")
            if not _owns_session(doc.to_dict(), caller_uid(current_user)):
                raise HTTPException(status_code=403, detail="Forbidden")

            session_data = doc.to_dict()
            session_data['completed'] = True
            session_data['completed_at'] = completed_at
            session_data['score'] = request.final_score
            session_data['status'] = 'completed'
            
            if request.responses:
                session_data['responses'] = request.responses
            if request.game_state:
                session_data['game_state'] = request.game_state
            if request.achievements:
                session_data['achievements'] = request.achievements
            
            doc_ref.update(session_data)
            
            # Update couple meters if couple_id exists
            if session_data.get('couple_id'):
                await _update_couple_meters_from_session(
                    session_data['couple_id'],
                    session_data['game_id'],
                    request.final_score,
                    request.responses or []
                )
            
            updated_doc = doc_ref.get()
            return doc_to_dict(updated_doc)
        else:
            if session_id not in game_sessions_db:
                raise HTTPException(status_code=404, detail="Session not found")
            
            session_data = game_sessions_db[session_id]
            session_data['completed'] = True
            session_data['completed_at'] = completed_at
            session_data['score'] = request.final_score
            session_data['status'] = 'completed'
            
            if request.responses:
                session_data['responses'] = request.responses
            if request.game_state:
                session_data['game_state'] = request.game_state
            if request.achievements:
                session_data['achievements'] = request.achievements
            
            # Update couple meters if couple_id exists
            if session_data.get('couple_id'):
                await _update_couple_meters_from_session(
                    session_data['couple_id'],
                    session_data['game_id'],
                    request.final_score,
                    request.responses or []
                )
            
            session_data['id'] = session_id
            return session_data
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error completing session: {e}")
        raise HTTPException(status_code=500, detail="Failed to complete session")

async def _update_couple_meters_from_session(couple_id: str, game_id: str, score: float, responses: List):
    """Update couple meters based on game completion"""
    try:
        # Calculate meter changes based on game category and score
        # This is a simplified version - in production would use scoring service
        trust_change = min(score / 100.0 * 0.05, 0.05)
        romance_change = min(score / 100.0 * 0.03, 0.03)
        connection_change = min(score / 100.0 * 0.04, 0.04)
        vulnerability_change = min(score / 100.0 * 0.02, 0.02)
        
        if FIREBASE_AVAILABLE and get_couple_ref:
            couple_ref = get_couple_ref(couple_id)
            couple_doc = couple_ref.get()
            if couple_doc.exists:
                couple_data = couple_doc.to_dict()
                
                updates = {
                    "trust_meter": min(1.0, max(0.0, couple_data.get("trust_meter", 0.5) + trust_change)),
                    "romance_meter": min(1.0, max(0.0, couple_data.get("romance_meter", 0.5) + romance_change)),
                    "connection_meter": min(1.0, max(0.0, couple_data.get("connection_meter", 0.5) + connection_change)),
                    "vulnerability_meter": min(1.0, max(0.0, couple_data.get("vulnerability_meter", 0.5) + vulnerability_change)),
                    "total_points": couple_data.get("total_points", 0) + int(score),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
                
                # Check streak
                last_interaction = couple_data.get("last_interaction")
                if last_interaction:
                    try:
                        last_date = datetime.fromisoformat(last_interaction.replace('Z', '+00:00')).date()
                        today = datetime.now(timezone.utc).date()
                        if (today - last_date).days == 1:
                            updates["streak_days"] = couple_data.get("streak_days", 0) + 1
                        elif last_date == today:
                            pass  # same day, no change
                        else:
                            updates["streak_days"] = 1
                    except:
                        pass
                else:
                    updates["streak_days"] = 1
                
                updates["last_interaction"] = datetime.now(timezone.utc).isoformat()
                couple_ref.update(updates)
    except Exception as e:
        print(f"Error updating couple meters: {e}")

@router.post("/sessions/{session_id}/answers", response_model=GameAnswerResponse)
async def submit_answer(session_id: str, request: SubmitAnswerRequest, token: Optional[str] = Header(None), current_user: Dict = Depends(require_auth)):
    """Submit an answer for a game session."""
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    answer_id = str(uuid.uuid4())
    submitted_at = request.timestamp or datetime.now(timezone.utc).isoformat()
    
    # Calculate points based on answer (simplified)
    points_earned = 10
    is_correct = True
    
    answer_data = {
        "id": answer_id,
        "session_id": session_id,
        "user_id": request.user_id,
        "question_id": request.question_id,
        "answer": request.answer,
        "is_correct": is_correct,
        "points_earned": points_earned,
        "submitted_at": submitted_at,
        "metadata": request.metadata or {}
    }
    
    try:
        if FIREBASE_AVAILABLE and db:
            # Save answer to subcollection
            answer_ref = db.collection('game_sessions').document(session_id).collection('answers').document(answer_id)
            answer_ref.set(answer_data)
            
            # Update session score
            session_ref = get_session_ref(session_id)
            session_doc = session_ref.get()
            if session_doc.exists:
                session_data = session_doc.to_dict()
                new_score = session_data.get('score', 0) + points_earned
                session_ref.update({"score": new_score})
        else:
            # In-memory: just return the answer
            pass
    except Exception as e:
        print(f"Error submitting answer: {e}")
    
    return answer_data

@router.get("/users/{user_id}/sessions")
async def get_user_sessions(user_id: str, token: Optional[str] = Header(None), limit: int = 50, current_user: Dict = Depends(require_auth)):
    """Get the authenticated user's own game sessions."""
    if caller_uid(current_user) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    sessions = []
    try:
        if FIREBASE_AVAILABLE and db:
            query = db.collection('game_sessions').where('user_id', '==', user_id).order_by('started_at', direction=firestore.Query.DESCENDING).limit(limit)
            docs = query.stream()
            for doc in docs:
                session = doc.to_dict()
                session['id'] = doc.id
                sessions.append(session)
        else:
            for s in game_sessions_db.values():
                if s.get('user_id') == user_id:
                    sessions.append(s)
    except Exception as e:
        print(f"Error getting user sessions: {e}")
    
    return {"sessions": sessions, "count": len(sessions)}

@router.get("/couples/{couple_id}/sessions")
async def get_couple_sessions(couple_id: str, token: Optional[str] = Header(None), limit: int = 50, current_user: Dict = Depends(require_auth)):
    """Get a couple's game sessions (members only)."""
    if not couple_has_member(couple_id, caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")
    sessions = []
    try:
        if FIREBASE_AVAILABLE and db:
            query = db.collection('game_sessions').where('couple_id', '==', couple_id).order_by('started_at', direction=firestore.Query.DESCENDING).limit(limit)
            docs = query.stream()
            for doc in docs:
                session = doc.to_dict()
                session['id'] = doc.id
                sessions.append(session)
        else:
            for s in game_sessions_db.values():
                if s.get('couple_id') == couple_id:
                    sessions.append(s)
    except Exception as e:
        print(f"Error getting couple sessions: {e}")
    
    return {"sessions": sessions, "count": len(sessions)}

# NOTE: /health is registered above the /{game_id} catch-all route to avoid
# being shadowed by it (the path-param route would otherwise match "health").

# =============================================================================
# Love Arcade
# =============================================================================
# The mobile client calls GET /api/love-arcade/games and
# GET /api/love-arcade/games/{game_id}/questions. These live on a dedicated
# router so their prefix stays independent from /api/games.
# Game metadata mirrors app/src/lib/gameRegistry.ts (source of truth on the client).
# =============================================================================

love_arcade_router = APIRouter(prefix="/api/love-arcade", tags=["love-arcade"])

_LOVE_ARCADE_FORMATS = {
    "relational-jeopardy": {"format": "jeopardy", "has_daily_double": True, "has_final_jeopardy": True},
    "echo-chamber-escape": {"format": "escape-room"},
    "intimacy-feud-arcade": {"format": "game-show"},
    "family-forge": {"format": "multi-stage"},
    "harbor-storm": {"format": "multi-stage"},
    "truth-teller-tower": {"format": "tower"},
}

_LOVE_ARCADE_GAMES = [
    {
        "id": g["id"],
        "name": g["name"],
        "phase": "championship",
        "max_score": g.get("max_score", 100),
        **_LOVE_ARCADE_FORMATS.get(g["id"], {"format": "arcade"}),
    }
    for g in _GAME_CATALOG.get("games", {}).values()
    if g.get("category_id") == "love-arcade"
]


@love_arcade_router.get("/games")
async def get_love_arcade_games():
    """List Love Arcade championship games."""
    return {"games": _LOVE_ARCADE_GAMES}


@love_arcade_router.get("/games/{game_id}/questions")
async def get_love_arcade_questions(game_id: str):
    """Get questions for a Love Arcade game.

    Question content is authored client-side (app/src/components/games); the
    backend returns the canonical id plus an empty question set until content
    is migrated server-side.
    """
    game = next((g for g in _LOVE_ARCADE_GAMES if g["id"] == game_id), None)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"game_id": game_id, "questions": [], "total_questions": 0}
