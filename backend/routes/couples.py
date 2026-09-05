"""
Couple Linking System Routes
Handles couple creation, joining, and management with invite codes
Production-ready with Firebase Firestore integration
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid
import os
import secrets
import string

from cache import PresenceCache
from security import require_auth, caller_uid, rate_limit

# Firebase imports
try:
    from firebase_admin import firestore
    from server import db, doc_to_dict, get_user_ref, get_couple_ref, couple_has_member
    FIREBASE_AVAILABLE = db is not None
except ImportError:
    FIREBASE_AVAILABLE = False
    db = None
    doc_to_dict = None
    get_user_ref = None
    get_couple_ref = None
    couple_has_member = None

router = APIRouter(prefix="/api/couples", tags=["couples"])

# In-memory fallback storage
couples_db: Dict[str, Any] = {}
users_db: Dict[str, Any] = {}
invite_codes_db: Dict[str, str] = {}  # code -> couple_id


# =============================================================================
# Pydantic Models
# =============================================================================

class CreateCoupleRequest(BaseModel):
    user_id: str
    display_name: Optional[str] = None


class JoinCoupleRequest(BaseModel):
    user_id: str
    invite_code: str = Field(..., min_length=6, max_length=10)


class CoupleResponse(BaseModel):
    id: str
    user1_id: str
    user2_id: Optional[str] = None
    invite_code: str
    created_at: str
    trust_meter: float = 0.5
    vulnerability_meter: float = 0.5
    romance_meter: float = 0.5
    connection_meter: float = 0.5
    total_points: int = 0
    streak_days: int = 0
    status: str = "pending"


class MyCoupleResponse(BaseModel):
    id: str
    partner: Optional[Dict[str, Any]]
    invite_code: Optional[str] = None
    relationship_meters: Dict[str, float]
    total_points: int
    streak_days: int
    games_played: int
    created_at: str
    status: str


class RegenerateInviteCodeRequest(BaseModel):
    user_id: str


class UpdateOriginStoryRequest(BaseModel):
    user_id: str
    origin_story: Dict[str, str]  # meet_cute, first_impression, turning_point, current_status
    first_red_flag: Optional[str] = None


class UnlinkCoupleRequest(BaseModel):
    user_id: str


class CoupleStats(BaseModel):
    couple_id: str
    total_games_played: int
    games_completed_together: int
    favorite_category: Optional[str]
    average_session_duration: int
    last_played_at: Optional[str]


# =============================================================================
# Helper Functions
# =============================================================================

def generate_invite_code() -> str:
    """Generate an 8-character invite code from a 36-symbol alphabet.

    The previous implementation used the first 6 hex chars of a UUID, giving
    only 16^6 (~16.7M) possible codes that are trivially brute-forced. 36^8
    (~2.8 trillion) codes plus rate limiting on /join makes enumeration
    impractical.
    """
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(8))


def get_partner_info(user_id: str, couple_data: Dict) -> Optional[Dict]:
    """Get partner info from couple data"""
    if couple_data.get("user1_id") == user_id:
        partner_id = couple_data.get("user2_id")
    else:
        partner_id = couple_data.get("user1_id")
    
    if not partner_id:
        return None
    
    try:
        if FIREBASE_AVAILABLE and get_user_ref:
            doc = get_user_ref(partner_id).get()
            if doc.exists:
                data = doc.to_dict()
                return {
                    "id": partner_id,
                    "display_name": data.get("display_name", "Unknown"),
                    "email": data.get("email"),
                    "sarcasm_level": data.get("sarcasm_level", 1),
                    "avatar_url": data.get("avatar_url"),
                    "last_active": data.get("last_active")
                }
        else:
            user = users_db.get(partner_id)
            if user:
                return {
                    "id": partner_id,
                    "display_name": user.get("display_name", "Unknown"),
                    "email": user.get("email"),
                    "sarcasm_level": user.get("sarcasm_level", 1),
                    "avatar_url": user.get("avatar_url"),
                    "last_active": user.get("last_active")
                }
    except Exception as e:
        print(f"Error getting partner info: {e}")
    
    return None


def get_user_couple(user_id: str) -> Optional[Dict]:
    """Get the couple that a user belongs to"""
    try:
        if FIREBASE_AVAILABLE and db:
            # Query Firestore for couples where user is member
            couples_ref = db.collection('couples')
            query1 = couples_ref.where('user1_id', '==', user_id).limit(1)
            query2 = couples_ref.where('user2_id', '==', user_id).limit(1)
            
            for doc in query1.stream():
                data = doc.to_dict()
                data['id'] = doc.id
                return data
            
            for doc in query2.stream():
                data = doc.to_dict()
                data['id'] = doc.id
                return data
        else:
            # In-memory fallback
            for couple_id, couple_data in couples_db.items():
                if couple_data.get("user1_id") == user_id or couple_data.get("user2_id") == user_id:
                    couple_data['id'] = couple_id
                    return couple_data
    except Exception as e:
        print(f"Error getting user couple: {e}")
    
    return None


def count_couple_games(couple_id: str) -> int:
    """Count completed games for a couple"""
    try:
        if FIREBASE_AVAILABLE and db:
            sessions_ref = db.collection('game_sessions')
            query = sessions_ref.where('couple_id', '==', couple_id).where('completed', '==', True)
            return len(list(query.stream()))
    except Exception:
        pass
    return 0


def get_couple_favorite_category(couple_id: str) -> Optional[str]:
    """Get the most played category for a couple"""
    try:
        if FIREBASE_AVAILABLE and db:
            sessions_ref = db.collection('game_sessions')
            query = sessions_ref.where('couple_id', '==', couple_id).where('completed', '==', True)
            
            category_counts = {}
            for doc in query.stream():
                data = doc.to_dict()
                cat_id = data.get('category_id')
                if cat_id:
                    category_counts[cat_id] = category_counts.get(cat_id, 0) + 1
            
            if category_counts:
                return max(category_counts, key=category_counts.get)
    except Exception:
        pass
    return None


def _is_member(couple_id: str, user_id: str) -> bool:
    """Return True if user_id is user1 or user2 of the given couple.

    Falls back to the in-memory store when Firestore is unavailable so the
    dev/CI (SKIP_FIREBASE) path behaves consistently with production.
    """
    if not couple_id or not user_id:
        return False
    if FIREBASE_AVAILABLE and couple_has_member:
        return couple_has_member(couple_id, user_id)
    couple = couples_db.get(couple_id)
    if not couple:
        return False
    return user_id in (couple.get('user1_id'), couple.get('user2_id'))


# =============================================================================
# Routes
# =============================================================================

@router.post("/create", response_model=CoupleResponse)
async def create_couple(request: CreateCoupleRequest, current_user: Dict = Depends(require_auth)):
    """
    Create a new couple and generate an invite code.
    User A initiates the couple connection.
    """
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Check if user already has a couple
    existing_couple = get_user_couple(request.user_id)
    if existing_couple:
        raise HTTPException(
            status_code=400, 
            detail="User is already linked to a couple. Unlink first to create a new one."
        )
    
    couple_id = str(uuid.uuid4())
    invite_code = generate_invite_code()
    
    couple_data = {
        "id": couple_id,
        "user1_id": request.user_id,
        "user2_id": None,
        "invite_code": invite_code,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "linked_at": None,
        "trust_meter": 0.5,
        "vulnerability_meter": 0.5,
        "romance_meter": 0.5,
        "connection_meter": 0.5,
        "total_points": 0,
        "streak_days": 0,
        "status": "pending",
        "last_interaction": datetime.now(timezone.utc).isoformat()
    }
    
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            get_couple_ref(couple_id).set(couple_data)
            
            # Update user's couple reference (Firestore raises NotFound if the
            # user document does not exist, so check existence first).
            user_ref = get_user_ref(request.user_id)
            if user_ref is not None and user_ref.get().exists:
                user_ref.update({
                    "couple_id": couple_id,
                    "invite_code": invite_code,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                })
        else:
            couples_db[couple_id] = couple_data
            users_db[request.user_id] = users_db.get(request.user_id, {})
            users_db[request.user_id].update({
                "couple_id": couple_id,
                "invite_code": invite_code
            })
        
        # Store invite code mapping
        invite_codes_db[invite_code] = couple_id
        
    except Exception as e:
        print(f"Error creating couple: {e}")
        raise HTTPException(status_code=500, detail="Failed to create couple")
    
    return couple_data


@router.post("/join", response_model=CoupleResponse)
async def join_couple(request: JoinCoupleRequest, current_user: Dict = Depends(require_auth), _rl: Dict = Depends(rate_limit)):
    """
    Join an existing couple using an invite code.
    User B enters the invite code from User A.
    """
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Check if user already has a couple
    existing_couple = get_user_couple(request.user_id)
    if existing_couple:
        raise HTTPException(
            status_code=400, 
            detail="User is already linked to a couple. Unlink first to join a new one."
        )
    
    invite_code = request.invite_code.upper()
    couple = None
    couple_id = None
    
    try:
        if FIREBASE_AVAILABLE and db:
            # Query Firestore for couple with matching invite_code
            couples_ref = db.collection('couples')
            query = couples_ref.where('invite_code', '==', invite_code).limit(1)
            docs = list(query.stream())
            
            if docs:
                doc = docs[0]
                couple = doc.to_dict()
                couple_id = doc.id
        else:
            couple_id = invite_codes_db.get(invite_code)
            if couple_id and couple_id in couples_db:
                couple = couples_db[couple_id]
    except Exception as e:
        print(f"Error querying couple: {e}")
        raise HTTPException(status_code=500, detail="Failed to query couple")
    
    if not couple:
        raise HTTPException(status_code=404, detail="Invalid invite code")
    
    if couple.get("user2_id"):
        raise HTTPException(status_code=400, detail="Couple already has two members")
    
    if couple.get("user1_id") == request.user_id:
        raise HTTPException(status_code=400, detail="Cannot join your own couple")
    
    # Update couple
    linked_at = datetime.now(timezone.utc).isoformat()
    updates = {
        "user2_id": request.user_id,
        "status": "active",
        "linked_at": linked_at,
        "updated_at": linked_at
    }
    
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            get_couple_ref(couple_id).update(updates)
            
            # Update both users
            get_user_ref(request.user_id).update({
                "couple_id": couple_id,
                "partner_id": couple["user1_id"],
                "updated_at": linked_at
            })
            get_user_ref(couple["user1_id"]).update({
                "couple_id": couple_id,
                "partner_id": request.user_id,
                "updated_at": linked_at
            })
            
            # Get updated couple data
            doc = get_couple_ref(couple_id).get()
            return {**doc.to_dict(), "id": couple_id}
        else:
            couples_db[couple_id].update(updates)
            users_db[request.user_id] = users_db.get(request.user_id, {})
            users_db[couple["user1_id"]] = users_db.get(couple["user1_id"], {})
            
            users_db[request.user_id].update({
                "couple_id": couple_id,
                "partner_id": couple["user1_id"]
            })
            users_db[couple["user1_id"]].update({
                "couple_id": couple_id,
                "partner_id": request.user_id
            })
            
            return {**couples_db[couple_id], "id": couple_id}
    except Exception as e:
        print(f"Error joining couple: {e}")
        raise HTTPException(status_code=500, detail="Failed to join couple")


@router.get("/me", response_model=MyCoupleResponse)
async def get_my_couple(user_id: str, current_user: Dict = Depends(require_auth)):
    """
    Get the couple information for the current user.
    Returns couple data including partner info and relationship meters.
    """
    if caller_uid(current_user) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    couple = get_user_couple(user_id)
    
    if not couple:
        return {
            "id": "",
            "partner": None,
            "invite_code": None,
            "relationship_meters": {
                "trust": 0.5,
                "vulnerability": 0.5,
                "romance": 0.5,
                "connection": 0.5
            },
            "total_points": 0,
            "streak_days": 0,
            "games_played": 0,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "none",
            "message": "No couple linked. Use POST /api/couples/create to create a couple or POST /api/couples/join to join one."
        }
    
    partner = get_partner_info(user_id, couple)
    games_played = count_couple_games(couple["id"])
    
    return {
        "id": couple["id"],
        "partner": partner,
        "invite_code": couple.get("invite_code") if not partner else None,
        "relationship_meters": {
            "trust": couple.get("trust_meter", 0.5),
            "vulnerability": couple.get("vulnerability_meter", 0.5),
            "romance": couple.get("romance_meter", 0.5),
            "connection": couple.get("connection_meter", 0.5)
        },
        "total_points": couple.get("total_points", 0),
        "streak_days": couple.get("streak_days", 0),
        "games_played": games_played,
        "created_at": couple.get("created_at"),
        "status": couple.get("status", "pending")
    }


@router.get("/{couple_id}")
async def get_couple(couple_id: str, current_user: Dict = Depends(require_auth)):
    """Get couple details by ID (members only)."""
    if not _is_member(couple_id, caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")
    if FIREBASE_AVAILABLE and get_couple_ref:
        doc = get_couple_ref(couple_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Couple not found")
        data = doc.to_dict()
        data['id'] = couple_id
        return data

    if couple_id in couples_db:
        data = dict(couples_db[couple_id])
        data['id'] = couple_id
        return data

    raise HTTPException(status_code=404, detail="Couple not found")


@router.get("/{couple_id}/presence")
async def get_couple_presence(couple_id: str, current_user: Dict = Depends(require_auth)):
    """Get online presence for both partners in a couple (members only)."""
    if not _is_member(couple_id, caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")
    if FIREBASE_AVAILABLE and get_couple_ref:
        doc = get_couple_ref(couple_id).get()
        data = doc.to_dict() if doc.exists else {}
    else:
        data = couples_db.get(couple_id) or {}

    user1_id = data.get("user1_id")
    user2_id = data.get("user2_id")

    user1_online = bool(user1_id and PresenceCache.is_online(user1_id, couple_id))
    user2_online = bool(user2_id and PresenceCache.is_online(user2_id, couple_id))

    return {
        "couple_id": couple_id,
        "user1_online": user1_online,
        "user2_online": user2_online,
        "total_connections": (1 if user1_online else 0) + (1 if user2_online else 0),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.post("/regenerate-code")
async def regenerate_invite_code(request: RegenerateInviteCodeRequest, current_user: Dict = Depends(require_auth)):
    """
    Regenerate the invite code for a pending couple.
    Only the creator (user1) can regenerate the code.
    """
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    couple = get_user_couple(request.user_id)
    
    if not couple:
        raise HTTPException(status_code=404, detail="No couple found for user")
    
    if couple.get("user1_id") != request.user_id:
        raise HTTPException(status_code=403, detail="Only the couple creator can regenerate the invite code")
    
    if couple.get("status") != "pending":
        raise HTTPException(status_code=400, detail="Cannot regenerate code for an active couple")
    
    # Generate new code
    old_code = couple.get("invite_code")
    new_code = generate_invite_code()
    
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            get_couple_ref(couple["id"]).update({
                "invite_code": new_code,
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        else:
            couples_db[couple["id"]]["invite_code"] = new_code
        
        # Update invite code mapping
        if old_code in invite_codes_db:
            del invite_codes_db[old_code]
        invite_codes_db[new_code] = couple["id"]
        
        return {
            "success": True,
            "invite_code": new_code,
            "message": "Invite code regenerated successfully"
        }
    except Exception as e:
        print(f"Error regenerating code: {e}")
        raise HTTPException(status_code=500, detail="Failed to regenerate invite code")


@router.post("/unlink")
async def unlink_couple(request: UnlinkCoupleRequest, current_user: Dict = Depends(require_auth)):
    """
    Unlink a couple (soft delete).
    Both users will have their couple references cleared.
    """
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    couple = get_user_couple(request.user_id)
    
    if not couple:
        raise HTTPException(status_code=404, detail="No couple found for user")
    
    couple_id = couple["id"]
    user1_id = couple.get("user1_id")
    user2_id = couple.get("user2_id")
    
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            # Soft delete - mark as unlinked rather than deleting
            get_couple_ref(couple_id).update({
                "status": "unlinked",
                "unlinked_at": datetime.now(timezone.utc).isoformat(),
                "unlinked_by": request.user_id
            })
            
            # Clear couple references from users
            if user1_id:
                get_user_ref(user1_id).update({
                    "couple_id": None,
                    "partner_id": None,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                })
            if user2_id:
                get_user_ref(user2_id).update({
                    "couple_id": None,
                    "partner_id": None,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                })
        else:
            couples_db[couple_id]["status"] = "unlinked"
            couples_db[couple_id]["unlinked_at"] = datetime.now(timezone.utc).isoformat()
            
            if user1_id and user1_id in users_db:
                users_db[user1_id]["couple_id"] = None
                users_db[user1_id]["partner_id"] = None
            if user2_id and user2_id in users_db:
                users_db[user2_id]["couple_id"] = None
                users_db[user2_id]["partner_id"] = None
        
        return {
            "success": True,
            "message": "Couple unlinked successfully. Your game history has been preserved."
        }
    except Exception as e:
        print(f"Error unlinking couple: {e}")
        raise HTTPException(status_code=500, detail="Failed to unlink couple")


@router.get("/{couple_id}/stats")
async def get_couple_stats(couple_id: str, current_user: Dict = Depends(require_auth)):
    """
    Get detailed statistics for a couple (members only).
    """
    if not _is_member(couple_id, caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            doc = get_couple_ref(couple_id).get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="Couple not found")
            couple_data = doc.to_dict()
        else:
            if couple_id not in couples_db:
                raise HTTPException(status_code=404, detail="Couple not found")
            couple_data = couples_db[couple_id]
        
        games_played = count_couple_games(couple_id)
        favorite_category = get_couple_favorite_category(couple_id)
        
        return {
            "couple_id": couple_id,
            "total_games_played": games_played,
            "games_completed_together": games_played,
            "favorite_category": favorite_category,
            "relationship_meters": {
                "trust": couple_data.get("trust_meter", 0.5),
                "vulnerability": couple_data.get("vulnerability_meter", 0.5),
                "romance": couple_data.get("romance_meter", 0.5),
                "connection": couple_data.get("connection_meter", 0.5)
            },
            "total_points": couple_data.get("total_points", 0),
            "streak_days": couple_data.get("streak_days", 0),
            "created_at": couple_data.get("created_at"),
            "linked_at": couple_data.get("linked_at")
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting couple stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get couple stats")


@router.put("/{couple_id}/meters")
async def update_couple_meters(couple_id: str, meters: Dict[str, float], current_user: Dict = Depends(require_auth)):
    """
    Update couple's relationship meters (members only).
    Valid meters: trust_meter, vulnerability_meter, romance_meter, connection_meter
    Values must be between 0 and 1.
    """
    if not _is_member(couple_id, caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")

    valid_meters = ["trust_meter", "vulnerability_meter", "romance_meter", "connection_meter"]
    
    updates = {}
    for key, value in meters.items():
        if key in valid_meters:
            if 0 <= value <= 1:
                updates[key] = value
            else:
                raise HTTPException(status_code=400, detail=f"Value for {key} must be between 0 and 1")
    
    if not updates:
        raise HTTPException(status_code=400, detail="No valid meters to update")
    
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            doc = get_couple_ref(couple_id).get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="Couple not found")
            get_couple_ref(couple_id).update(updates)
            
            doc = get_couple_ref(couple_id).get()
            return doc.to_dict()
        else:
            if couple_id not in couples_db:
                raise HTTPException(status_code=404, detail="Couple not found")
            couples_db[couple_id].update(updates)
            return couples_db[couple_id]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating meters: {e}")
        raise HTTPException(status_code=500, detail="Failed to update meters")


@router.put("/{couple_id}/origin-story")
async def update_origin_story(couple_id: str, request: UpdateOriginStoryRequest, current_user: Dict = Depends(require_auth)):
    """
    Update couple's origin story and first red flag.
    Used during onboarding to save relationship history.
    """
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Verify user is part of this couple
    if FIREBASE_AVAILABLE and db:
        doc = get_couple_ref(couple_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Couple not found")
        couple_data = doc.to_dict()
    else:
        if couple_id not in couples_db:
            raise HTTPException(status_code=404, detail="Couple not found")
        couple_data = couples_db[couple_id]
    
    if couple_data.get("user1_id") != request.user_id and couple_data.get("user2_id") != request.user_id:
        raise HTTPException(status_code=403, detail="User is not a member of this couple")
    
    updates = {
        "origin_story": request.origin_story,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    if request.first_red_flag is not None:
        updates["first_red_flag"] = request.first_red_flag
    
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            get_couple_ref(couple_id).update(updates)
            doc = get_couple_ref(couple_id).get()
            return doc.to_dict()
        else:
            couples_db[couple_id].update(updates)
            return couples_db[couple_id]
    except Exception as e:
        print(f"Error updating origin story: {e}")
        raise HTTPException(status_code=500, detail="Failed to update origin story")

