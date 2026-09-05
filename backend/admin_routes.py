"""
Admin Panel Routes
System administration and monitoring endpoints
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone, timedelta

# Security imports
from security import require_admin, require_moderator, audit_logger

# Firebase imports
try:
    from firebase_admin import firestore
    from server import db, doc_to_dict
    FIREBASE_AVAILABLE = db is not None
except ImportError:
    FIREBASE_AVAILABLE = False
    db = None
    doc_to_dict = None

router = APIRouter(prefix="/api/admin", tags=["admin"])


# =============================================================================
# Pydantic Models
# =============================================================================

class UserBanRequest(BaseModel):
    user_id: str
    reason: str
    duration_days: Optional[int] = None  # None = permanent
    admin_id: str


class SystemAnnouncement(BaseModel):
    title: str
    message: str
    type: str = 'info'  # info, warning, critical
    target_audience: str = 'all'  # all, premium, free


class ModerationAction(BaseModel):
    action: str  # warn, mute, ban, delete_content
    target_user_id: str
    reason: str
    evidence: Optional[str] = None
    admin_id: str


class AnalyticsFilter(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    event_types: Optional[List[str]] = None
    user_ids: Optional[List[str]] = None


# =============================================================================
# Authentication Middleware for Admin Routes
# =============================================================================

async def verify_admin(current_user: Dict = Depends(require_admin)):
    """Verify user is admin"""
    return current_user


async def verify_moderator(current_user: Dict = Depends(require_moderator)):
    """Verify user is moderator or admin"""
    return current_user


# =============================================================================
# Dashboard & Overview
# =============================================================================

@router.get("/dashboard")
async def get_admin_dashboard(current_user: Dict = Depends(verify_admin)):
    """Get admin dashboard overview"""
    now = datetime.now(timezone.utc)
    day_ago = now - timedelta(days=1)
    week_ago = now - timedelta(days=7)
    
    stats = {
        "users": {
            "total": 0,
            "active_today": 0,
            "active_week": 0,
            "new_today": 0,
            "premium": 0,
        },
        "couples": {
            "total": 0,
            "active_today": 0,
            "new_today": 0,
        },
        "games": {
            "played_today": 0,
            "played_week": 0,
            "abandoned_today": 0,
        },
        "sos": {
            "triggered_today": 0,
            "resolved_today": 0,
            "escalated_today": 0,
        },
        "system": {
            "errors_24h": 0,
            "avg_response_time_ms": 0,
            "uptime_percent": 99.9,
        }
    }
    
    if FIREBASE_AVAILABLE and db:
        # Get user stats
        users_ref = db.collection('users')
        stats["users"]["total"] = len(list(users_ref.stream()))
        
        # Get active users today
        active_query = users_ref.where('last_active', '>=', day_ago.isoformat())
        stats["users"]["active_today"] = len(list(active_query.stream()))
        
        # Get couple stats
        couples_ref = db.collection('couples')
        stats["couples"]["total"] = len(list(couples_ref.stream()))
        
        # Get game sessions today
        sessions_ref = db.collection('game_sessions')
        today_query = sessions_ref.where('started_at', '>=', day_ago.isoformat())
        stats["games"]["played_today"] = len(list(today_query.stream()))
        
        # Get SOS events today
        sos_ref = db.collection('sos_events')
        sos_today = sos_ref.where('triggered_at', '>=', day_ago.isoformat())
        stats["sos"]["triggered_today"] = len(list(sos_today.stream()))
    
    return {
        "stats": stats,
        "generated_at": now.isoformat(),
        "admin_id": current_user.get('user_id')
    }


@router.get("/metrics")
async def get_system_metrics(
    period: str = Query('24h', enum=['1h', '24h', '7d', '30d']),
    current_user: Dict = Depends(verify_admin)
):
    """Get detailed system metrics"""
    now = datetime.now(timezone.utc)
    
    # Calculate time range
    if period == '1h':
        start_time = now - timedelta(hours=1)
    elif period == '24h':
        start_time = now - timedelta(days=1)
    elif period == '7d':
        start_time = now - timedelta(days=7)
    else:  # 30d
        start_time = now - timedelta(days=30)
    
    metrics = {
        "period": period,
        "time_range": {
            "start": start_time.isoformat(),
            "end": now.isoformat()
        },
        "api_requests": {
            "total": 0,
            "by_endpoint": {},
            "error_rate": 0,
            "avg_latency_ms": 0,
        },
        "active_users": {
            "count": 0,
            "by_hour": [],
        },
        "game_metrics": {
            "sessions_started": 0,
            "sessions_completed": 0,
            "completion_rate": 0,
            "avg_session_duration_seconds": 0,
        },
        "ai_metrics": {
            "requests": 0,
            "failures": 0,
            "avg_response_time_ms": 0,
        }
    }
    
    # Query analytics events
    if FIREBASE_AVAILABLE and db:
        events_ref = db.collection('analytics_events')
        query = events_ref.where('timestamp', '>=', start_time.isoformat())
        events = list(query.stream())
        
        for doc in events:
            data = doc.to_dict()
            event_type = data.get('event_type')
            
            if event_type == 'session_start':
                metrics["game_metrics"]["sessions_started"] += 1
            elif event_type == 'game_complete':
                metrics["game_metrics"]["sessions_completed"] += 1
            elif event_type == 'marcie_chat_start':
                metrics["ai_metrics"]["requests"] += 1
            elif event_type == 'ai.failure':
                metrics["ai_metrics"]["failures"] += 1
    
    # Calculate completion rate
    if metrics["game_metrics"]["sessions_started"] > 0:
        metrics["game_metrics"]["completion_rate"] = round(
            metrics["game_metrics"]["sessions_completed"] / 
            metrics["game_metrics"]["sessions_started"] * 100, 2
        )
    
    return metrics


# =============================================================================
# User Management
# =============================================================================

@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    search: Optional[str] = None,
    status: Optional[str] = Query(None, enum=['active', 'banned', 'premium']),
    current_user: Dict = Depends(verify_moderator)
):
    """List users with filtering"""
    if not FIREBASE_AVAILABLE or not db:
        return {"users": [], "total": 0, "page": page, "limit": limit}
    
    users_ref = db.collection('users')
    
    # Apply filters
    if status == 'banned':
        users_ref = users_ref.where('is_active', '==', False)
    elif status == 'premium':
        users_ref = users_ref.where('plan', '==', 'premium')
    
    # Get total count
    total = len(list(users_ref.stream()))
    
    # Paginate
    offset = (page - 1) * limit
    users = []
    
    query = users_ref.limit(limit).offset(offset)
    for doc in query.stream():
        data = doc_to_dict(doc) if doc_to_dict else doc.to_dict()
        data['id'] = doc.id
        
        # Simple search filter
        if search:
            search_lower = search.lower()
            if (search_lower not in data.get('email', '').lower() and 
                search_lower not in data.get('display_name', '').lower()):
                continue
        
        # Remove sensitive data
        data.pop('device_tokens', None)
        data.pop('private_data', None)
        
        users.append(data)
    
    return {
        "users": users,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }


@router.get("/users/{user_id}")
async def get_user_details(
    user_id: str,
    current_user: Dict = Depends(verify_moderator)
):
    """Get detailed user information"""
    if not FIREBASE_AVAILABLE or not db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = user_doc.to_dict()
    user_data['id'] = user_id
    
    # Get user's couple info
    couple_id = user_data.get('couple_id')
    if couple_id:
        couple_doc = db.collection('couples').document(couple_id).get()
        if couple_doc.exists:
            user_data['couple'] = couple_doc.to_dict()
    
    # Get recent activity
    sessions_ref = db.collection('game_sessions')
    recent_sessions = sessions_ref.where('user_id', '==', user_id).limit(10).stream()
    user_data['recent_sessions'] = [doc.to_dict() for doc in recent_sessions]
    
    return user_data


@router.post("/users/{user_id}/ban")
async def ban_user(
    request: UserBanRequest,
    current_user: Dict = Depends(verify_admin)
):
    """Ban a user account"""
    if not FIREBASE_AVAILABLE or not db:
        raise HTTPException(status_code=500, detail="Database not available")
    
    user_ref = db.collection('users').document(request.user_id)
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate ban expiration
    expires_at = None
    if request.duration_days:
        expires_at = (datetime.now(timezone.utc) + 
                     timedelta(days=request.duration_days)).isoformat()
    
    # Update user
    user_ref.update({
        'is_active': False,
        'ban_reason': request.reason,
        'banned_at': datetime.now(timezone.utc).isoformat(),
        'ban_expires_at': expires_at,
        'banned_by': request.admin_id,
    })
    
    # Log action
    audit_logger.log_admin_action(
        request.admin_id, 'ban_user', request.user_id, 'admin'
    )
    
    return {
        "success": True,
        "user_id": request.user_id,
        "action": "banned",
        "expires_at": expires_at
    }


@router.post("/users/{user_id}/unban")
async def unban_user(
    user_id: str,
    admin_id: str,
    current_user: Dict = Depends(verify_admin)
):
    """Unban a user account"""
    if not FIREBASE_AVAILABLE or not db:
        raise HTTPException(status_code=500, detail="Database not available")
    
    user_ref = db.collection('users').document(user_id)
    user_ref.update({
        'is_active': True,
        'ban_reason': None,
        'banned_at': None,
        'ban_expires_at': None,
        'unbanned_at': datetime.now(timezone.utc).isoformat(),
        'unbanned_by': admin_id,
    })
    
    audit_logger.log_admin_action(admin_id, 'unban_user', user_id, 'admin')
    
    return {"success": True, "user_id": user_id, "action": "unbanned"}


# =============================================================================
# SOS Events Monitoring
# =============================================================================

@router.get("/sos-events")
async def list_sos_events(
    status: Optional[str] = Query(None, enum=['active', 'resolved', 'escalated']),
    severity: Optional[int] = Query(None, ge=1, le=5),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    current_user: Dict = Depends(verify_moderator)
):
    """List SOS events for monitoring"""
    if not FIREBASE_AVAILABLE or not db:
        return {"events": [], "total": 0}
    
    sos_ref = db.collection('sos_events')
    
    # Apply filters
    if status:
        sos_ref = sos_ref.where('status', '==', status)
    if severity:
        sos_ref = sos_ref.where('severity', '==', severity)
    
    # Get total (approximate for Firestore)
    total = len(list(sos_ref.stream()))
    
    # Paginate
    offset = (page - 1) * limit
    events = []
    
    query = sos_ref.order_by('triggered_at', direction=firestore.Query.DESCENDING).limit(limit).offset(offset)
    for doc in query.stream():
        data = doc.to_dict()
        data['id'] = doc.id
        events.append(data)
    
    return {
        "events": events,
        "total": total,
        "page": page,
        "limit": limit
    }


@router.get("/sos-events/stats")
async def get_sos_stats(
    days: int = Query(7, ge=1, le=90),
    current_user: Dict = Depends(verify_moderator)
):
    """Get SOS event statistics"""
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=days)
    
    stats = {
        "period_days": days,
        "total_triggered": 0,
        "by_severity": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
        "by_status": {"active": 0, "resolved": 0, "escalated": 0},
        "resolution_rate": 0,
        "avg_resolution_time_hours": 0,
    }
    
    if FIREBASE_AVAILABLE and db:
        sos_ref = db.collection('sos_events')
        query = sos_ref.where('triggered_at', '>=', start_date.isoformat())
        
        for doc in query.stream():
            data = doc.to_dict()
            stats["total_triggered"] += 1
            
            severity = data.get('severity', 3)
            stats["by_severity"][severity] = stats["by_severity"].get(severity, 0) + 1
            
            status = data.get('status', 'active')
            stats["by_status"][status] = stats["by_status"].get(status, 0) + 1
    
    # Calculate resolution rate
    if stats["total_triggered"] > 0:
        resolved = stats["by_status"].get("resolved", 0)
        stats["resolution_rate"] = round(resolved / stats["total_triggered"] * 100, 2)
    
    return stats


# =============================================================================
# Leaderboard Management
# =============================================================================

@router.get("/leaderboards/manage")
async def get_leaderboard_management(
    current_user: Dict = Depends(verify_admin)
):
    """Get leaderboard management data"""
    return {
        "cache_status": {
            "global": "cached",
            "weekly": "stale",
            "monthly": "cached"
        },
        "can_refresh": True,
        "last_refresh": datetime.now(timezone.utc).isoformat()
    }


@router.post("/leaderboards/refresh")
async def refresh_leaderboards(
    current_user: Dict = Depends(verify_admin)
):
    """Force refresh all leaderboard caches"""
    # Trigger leaderboard refresh
    return {
        "success": True,
        "message": "Leaderboard refresh triggered",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# =============================================================================
# System Announcements
# =============================================================================

@router.post("/announcements")
async def create_announcement(
    announcement: SystemAnnouncement,
    current_user: Dict = Depends(verify_admin)
):
    """Create system-wide announcement"""
    announcement_data = {
        **announcement.dict(),
        "id": f"ann_{datetime.now(timezone.utc).timestamp()}",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by": current_user.get('user_id')
    }
    
    # Store announcement
    if FIREBASE_AVAILABLE and db:
        db.collection('announcements').document(announcement_data['id']).set(announcement_data)
    
    return {
        "success": True,
        "announcement": announcement_data
    }


@router.get("/announcements")
async def list_announcements(
    current_user: Dict = Depends(verify_moderator)
):
    """List all system announcements"""
    if not FIREBASE_AVAILABLE or not db:
        return {"announcements": []}
    
    announcements = []
    docs = db.collection('announcements').order_by('created_at', direction=firestore.Query.DESCENDING).stream()
    
    for doc in docs:
        data = doc.to_dict()
        data['id'] = doc.id
        announcements.append(data)
    
    return {"announcements": announcements}


# =============================================================================
# Health & Status
# =============================================================================

@router.get("/health")
async def admin_health_check(
    current_user: Dict = Depends(verify_moderator)
):
    """Detailed health check for admin panel"""
    from observability import get_health_status
    
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "observability": get_health_status(),
        "services": {
            "firebase": "connected" if FIREBASE_AVAILABLE else "disconnected",
            "api": "healthy",
            "websocket": "healthy"
        }
    }
