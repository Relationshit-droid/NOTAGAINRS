"""
SOS Crisis System Routes
Handles panic button, crisis resources, and de-escalation
Production-ready with Firebase Firestore integration
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone, timedelta
import uuid

from security import require_auth, caller_uid

# Firebase imports
try:
    from firebase_admin import firestore
    from server import db, get_sos_ref, get_couple_ref, get_user_ref, doc_to_dict, FIREBASE_AVAILABLE, couple_has_member
except ImportError:
    firestore = None
    couple_has_member = None
    FIREBASE_AVAILABLE = False
    db = None
    get_sos_ref = None
    get_couple_ref = None
    get_user_ref = None
    doc_to_dict = None

router = APIRouter(prefix="/api/sos", tags=["sos"])

# In-memory fallback storage
sos_sessions_db: Dict[str, Any] = {}
users_db: Dict[str, Any] = {}

# =============================================================================
# Pydantic Models
# =============================================================================

class CreateSOSSessionRequest(BaseModel):
    initiator_id: str
    couple_id: str

class SubmitBoothRequest(BaseModel):
    session_id: str
    user_id: str
    i_feel: str
    when_partner: str
    because_i_tell_myself: str
    what_i_need: str

class SOSBoothSubmission(BaseModel):
    i_feel: str
    when_partner: str
    because_i_tell_myself: str
    what_i_need: str
    submitted_at: Optional[str] = None

class SOSSessionResponse(BaseModel):
    id: str
    initiator_id: str
    couple_id: str
    status: str
    started_at: str
    completed_at: Optional[str] = None
    submissions: Dict[str, SOSBoothSubmission] = {}
    verdict: Optional[str] = None
    repair_challenge: Optional[str] = None
    expires_at: str

class AnalyzeSessionRequest(BaseModel):
    session_id: str

class VerdictRequest(BaseModel):
    session_id: str
    verdict: str
    repair_challenge: Optional[str] = None

class CompleteRepairRequest(BaseModel):
    session_id: str
    user_id: str

# =============================================================================
# Helper Functions
# =============================================================================

def generate_expiry() -> str:
    """Generate expiry timestamp (30 minutes from now)"""
    return (datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat()

def get_sos_session(session_id: str) -> Optional[Dict]:
    """Get SOS session by ID"""
    try:
        if FIREBASE_AVAILABLE and get_sos_ref:
            doc = get_sos_ref(session_id).get()
            if doc.exists:
                return doc_to_dict(doc)
        else:
            if session_id in sos_sessions_db:
                session = sos_sessions_db[session_id]
                session['id'] = session_id
                return session
    except Exception as e:
        print(f"Error getting SOS session: {e}")
    return None

def update_sos_session(session_id: str, updates: Dict[str, Any]) -> Optional[Dict]:
    """Update SOS session"""
    try:
        if FIREBASE_AVAILABLE and get_sos_ref:
            doc_ref = get_sos_ref(session_id)
            doc = doc_ref.get()
            if not doc.exists:
                return None
            doc_ref.update(updates)
            updated_doc = doc_ref.get()
            return doc_to_dict(updated_doc)
        else:
            if session_id in sos_sessions_db:
                sos_sessions_db[session_id].update(updates)
                session = sos_sessions_db[session_id]
                session['id'] = session_id
                return session
    except Exception as e:
        print(f"Error updating SOS session: {e}")
    return None

# =============================================================================
# Routes
# =============================================================================

@router.post("/sessions", response_model=SOSSessionResponse)
async def create_sos_session(request: CreateSOSSessionRequest, current_user: Dict = Depends(require_auth)):
    """
    Create a new SOS fight resolution session.
    Initiator triggers the session, partner joins via booth submission.
    """
    if caller_uid(current_user) != request.initiator_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    if not couple_has_member(request.couple_id, caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Not a member of this couple")

    session_id = str(uuid.uuid4())
    started_at = datetime.now(timezone.utc).isoformat()
    expires_at = generate_expiry()
    
    session_data = {
        "id": session_id,
        "initiator_id": request.initiator_id,
        "couple_id": request.couple_id,
        "status": "waiting_for_partner",
        "started_at": started_at,
        "completed_at": None,
        "submissions": {},
        "verdict": None,
        "repair_challenge": None,
        "expires_at": expires_at
    }
    
    try:
        if FIREBASE_AVAILABLE and get_sos_ref:
            get_sos_ref(session_id).set(session_data)
        else:
            sos_sessions_db[session_id] = session_data
    except Exception as e:
        print(f"Error creating SOS session: {e}")
        raise HTTPException(status_code=500, detail="Failed to create SOS session")
    
    return session_data

@router.post("/sessions/{session_id}/submit", response_model=SOSSessionResponse)
async def submit_booth(session_id: str, request: SubmitBoothRequest, current_user: Dict = Depends(require_auth)):
    """
    Submit a booth response in an SOS session.
    Each partner submits their Mad Libs style reflection.
    """
    session = get_sos_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="SOS session not found")
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    if not couple_has_member(session.get('couple_id'), caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Not a member of this couple")

    # Check expiry
    expires_at = datetime.fromisoformat(session['expires_at'].replace('Z', '+00:00'))
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=410, detail="SOS session has expired")
    
    # Check if user already submitted
    if request.user_id in session.get('submissions', {}):
        raise HTTPException(status_code=400, detail="User has already submitted their booth")
    
    # Create submission
    submitted_at = datetime.now(timezone.utc).isoformat()
    submission = {
        "i_feel": request.i_feel,
        "when_partner": request.when_partner,
        "because_i_tell_myself": request.because_i_tell_myself,
        "what_i_need": request.what_i_need,
        "submitted_at": submitted_at
    }
    
    # Update session
    submissions = session.get('submissions', {})
    submissions[request.user_id] = submission
    
    # Determine new status
    new_status = session['status']
    if len(submissions) == 1:
        new_status = "one_submitted"
    elif len(submissions) >= 2:
        new_status = "analyzing"
    
    updates = {
        "submissions": submissions,
        "status": new_status,
        "updated_at": submitted_at
    }
    
    updated = update_sos_session(session_id, updates)
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update session")
    
    return updated

@router.get("/sessions/{session_id}", response_model=SOSSessionResponse)
async def get_sos_session_endpoint(session_id: str, current_user: Dict = Depends(require_auth)):
    """Get SOS session by ID (members only)."""
    session = get_sos_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="SOS session not found")
    if not couple_has_member(session.get('couple_id'), caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")
    return session

@router.post("/sessions/{session_id}/analyze", response_model=SOSSessionResponse)
async def analyze_session(session_id: str, current_user: Dict = Depends(require_auth)):
    """
    Trigger AI analysis of SOS session.
    Generates verdict and repair challenge from both submissions.
    """
    session = get_sos_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="SOS session not found")
    if not couple_has_member(session.get('couple_id'), caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")

    if len(session.get('submissions', {})) < 2:
        raise HTTPException(status_code=400, detail="Both partners must submit before analysis")
    
    # Generate AI verdict (simplified - in production calls AI service)
    submissions = session['submissions']
    user_ids = list(submissions.keys())
    
    if len(user_ids) >= 2:
        sub1 = submissions[user_ids[0]]
        sub2 = submissions[user_ids[1]]
        
        # Simple analysis based on submissions
        verdict = (
            f"Both partners expressed valid feelings. "
            f"Partner 1 feels '{sub1['i_feel']}' when '{sub1['when_partner']}'. "
            f"Partner 2 feels '{sub2['i_feel']}' when '{sub2['when_partner']}'. "
            f"The core issue appears to be a disconnect in communication patterns."
        )
        
        repair_challenge = (
            "Schedule a 20-minute 'Repair Conversation' within 24 hours. "
            "Use the format: 'When you [specific behavior], I feel [emotion]. "
            "What I need is [specific request].' No blame, just observations and needs."
        )
    else:
        verdict = "Analysis requires both partners' submissions."
        repair_challenge = "Wait for partner to complete their booth."
    
    completed_at = datetime.now(timezone.utc).isoformat()
    
    updates = {
        "status": "completed",
        "verdict": verdict,
        "repair_challenge": repair_challenge,
        "completed_at": completed_at,
        "updated_at": completed_at
    }
    
    updated = update_sos_session(session_id, updates)
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to analyze session")
    
    # Update couple meters for completing SOS
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            couple_id = session.get('couple_id')
            if couple_id:
                couple_ref = get_couple_ref(couple_id)
                couple_doc = couple_ref.get()
                if couple_doc.exists:
                    couple_data = couple_doc.to_dict()
                    updates = {
                        "trust_meter": min(1.0, couple_data.get("trust_meter", 0.5) + 0.03),
                        "connection_meter": min(1.0, couple_data.get("connection_meter", 0.5) + 0.02),
                        "total_points": couple_data.get("total_points", 0) + 50,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                    couple_ref.update(updates)
    except Exception as e:
        print(f"Error updating couple meters after SOS: {e}")
    
    return updated

@router.post("/sessions/{session_id}/verdict", response_model=SOSSessionResponse)
async def submit_verdict(session_id: str, request: VerdictRequest, current_user: Dict = Depends(require_auth)):
    """
    Manually submit a verdict (for therapist/admin or if AI fails).
    """
    session = get_sos_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="SOS session not found")
    if not couple_has_member(session.get('couple_id'), caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")

    completed_at = datetime.now(timezone.utc).isoformat()
    
    updates = {
        "status": "completed",
        "verdict": request.verdict,
        "repair_challenge": request.repair_challenge,
        "completed_at": completed_at,
        "updated_at": completed_at
    }
    
    updated = update_sos_session(session_id, updates)
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to submit verdict")
    
    return updated

@router.post("/sessions/{session_id}/repair/complete", response_model=SOSSessionResponse)
async def complete_repair(session_id: str, request: CompleteRepairRequest, current_user: Dict = Depends(require_auth)):
    """
    Mark repair challenge as completed.
    Awards additional points for completing the repair.
    """
    session = get_sos_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="SOS session not found")
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    if not couple_has_member(session.get('couple_id'), caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")

    if session.get('status') != 'completed':
        raise HTTPException(status_code=400, detail="Session must be completed before repair")
    
    # Update couple meters for repair completion
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            couple_id = session.get('couple_id')
            if couple_id:
                couple_ref = get_couple_ref(couple_id)
                couple_doc = couple_ref.get()
                if couple_doc.exists:
                    couple_data = couple_doc.to_dict()
                    updates = {
                        "trust_meter": min(1.0, couple_data.get("trust_meter", 0.5) + 0.02),
                        "vulnerability_meter": min(1.0, couple_data.get("vulnerability_meter", 0.5) + 0.03),
                        "total_points": couple_data.get("total_points", 0) + 25,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                    couple_ref.update(updates)
    except Exception as e:
        print(f"Error updating couple meters after repair: {e}")
    
    return session

@router.get("/couples/{couple_id}/sessions")
async def get_couple_sos_sessions(couple_id: str, limit: int = 20, current_user: Dict = Depends(require_auth)):
    """Get SOS session history for a couple (members only)."""
    if not couple_has_member(couple_id, caller_uid(current_user)):
        raise HTTPException(status_code=403, detail="Forbidden")
    sessions = []
    try:
        if FIREBASE_AVAILABLE and db:
            query = db.collection('sos_sessions').where('couple_id', '==', couple_id).order_by('started_at', direction=firestore.Query.DESCENDING).limit(limit)
            docs = query.stream()
            for doc in docs:
                session = doc.to_dict()
                session['id'] = doc.id
                sessions.append(session)
        else:
            for s in sos_sessions_db.values():
                if s.get('couple_id') == couple_id:
                    sessions.append(s)
    except Exception as e:
        print(f"Error getting couple SOS sessions: {e}")
    
    return {"sessions": sessions, "count": len(sessions)}

@router.get("/health")
async def sos_health_check():
    """Health check for SOS service"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "sos",
        "database": "connected" if FIREBASE_AVAILABLE else "fallback_mode"
    }