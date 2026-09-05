"""
Analytics and Telemetry Routes
Tracks game events, user behavior, and relationship milestones
"""

from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid
import os

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

# Storage for analytics (use proper database in production)
events_db: List[Dict] = []
session_events: Dict[str, List[Dict]] = {}
user_sessions: Dict[str, Dict] = {}


# =============================================================================
# Pydantic Models
# =============================================================================

class AnalyticsEvent(BaseModel):
    event_type: str = Field(..., description="Type of event: game_start, game_complete, etc.")
    user_id: str
    couple_id: Optional[str] = None
    session_id: Optional[str] = None
    game_id: Optional[str] = None
    category_id: Optional[str] = None
    properties: Optional[Dict[str, Any]] = Field(default_factory=dict)
    timestamp: Optional[str] = None
    platform: Optional[str] = "web"  # web, ios, android
    app_version: Optional[str] = None


class SessionStartEvent(BaseModel):
    user_id: str
    couple_id: Optional[str] = None
    session_type: str  # game, sos, ai_chat, etc.
    metadata: Optional[Dict[str, Any]] = None


class SessionEndEvent(BaseModel):
    session_id: str
    duration_seconds: int
    outcome: str  # completed, abandoned, error
    metadata: Optional[Dict[str, Any]] = None


# =============================================================================
# Event Types Reference
# =============================================================================

VALID_EVENT_TYPES = [
    # Game Events
    "game_start",
    "game_complete", 
    "game_abandon",
    "game_rage_quit",
    "answer_submit",
    "achievement_unlock",
    "score_update",
    
    # Session Events
    "session_start",
    "session_end",
    "session_timeout",
    
    # Couple Events
    "couple_link",
    "couple_unlink",
    "partner_join",
    "milestone_reached",
    
    # SOS/Crisis Events
    "sos_trigger",
    "sos_resolve",
    "sos_escalate",
    "crisis_resource_view",
    
    # AI Events
    "marcie_chat_start",
    "marcie_chat_end",
    "marcie_suggestion_click",
    
    # App Events
    "app_open",
    "app_close",
    "app_update",
    "push_notification_receive",
    "push_notification_click",
    
    # Engagement Events
    "streak_maintained",
    "streak_broken",
    "daily_challenge_complete",
    "leaderboard_view",
    "friend_invite_sent"
]


# =============================================================================
# Helper Functions
# =============================================================================

def get_posthog_client():
    """Get PostHog analytics client if configured"""
    try:
        from posthog import Posthog
        api_key = os.environ.get("POSTHOG_API_KEY")
        if api_key:
            return Posthog(api_key, host=os.environ.get("POSTHOG_HOST", "https://app.posthog.com"))
    except ImportError:
        pass
    return None


async def send_to_posthog(event: AnalyticsEvent):
    """Send event to PostHog analytics"""
    posthog = get_posthog_client()
    if posthog:
        try:
            posthog.capture(
                distinct_id=event.user_id,
                event=event.event_type,
                properties={
                    **event.properties,
                    "couple_id": event.couple_id,
                    "game_id": event.game_id,
                    "category_id": event.category_id,
                    "platform": event.platform,
                    "app_version": event.app_version
                }
            )
        except Exception as e:
            print(f"PostHog error: {e}")


async def send_to_segment(event: AnalyticsEvent):
    """Send event to Segment analytics (alternative)"""
    # Implement if needed
    pass


def calculate_session_duration(session_id: str) -> int:
    """Calculate session duration in seconds"""
    if session_id in user_sessions:
        start_time = datetime.fromisoformat(user_sessions[session_id]["started_at"])
        return int((datetime.now(timezone.utc) - start_time).total_seconds())
    return 0


# =============================================================================
# Routes
# =============================================================================

@router.post("/track")
async def track_event(
    event: AnalyticsEvent,
    background_tasks: BackgroundTasks,
    request: Request
):
    """
    Track a generic analytics event.
    
    Events are sent to configured analytics providers in the background.
    """
    # Validate event type
    if event.event_type not in VALID_EVENT_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid event type. Valid types: {', '.join(VALID_EVENT_TYPES)}"
        )
    
    # Prepare event data
    event_data = {
        "id": str(uuid.uuid4()),
        "event_type": event.event_type,
        "user_id": event.user_id,
        "couple_id": event.couple_id,
        "session_id": event.session_id,
        "game_id": event.game_id,
        "category_id": event.category_id,
        "properties": event.properties or {},
        "timestamp": event.timestamp or datetime.now(timezone.utc).isoformat(),
        "platform": event.platform or "web",
        "app_version": event.app_version,
        "ip_address": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent")
    }
    
    # Store event
    events_db.append(event_data)
    
    # Send to external analytics in background
    background_tasks.add_task(send_to_posthog, event)
    
    return {"success": True, "event_id": event_data["id"]}


@router.post("/session/start")
async def start_session(event: SessionStartEvent):
    """
    Start tracking a user session.
    """
    session_id = str(uuid.uuid4())
    
    session_data = {
        "id": session_id,
        "user_id": event.user_id,
        "couple_id": event.couple_id,
        "session_type": event.session_type,
        "started_at": datetime.now(timezone.utc).isoformat(),
        "metadata": event.metadata or {},
        "events": []
    }
    
    user_sessions[session_id] = session_data
    
    # Also track as analytics event
    events_db.append({
        "id": str(uuid.uuid4()),
        "event_type": "session_start",
        "user_id": event.user_id,
        "couple_id": event.couple_id,
        "session_id": session_id,
        "properties": {"session_type": event.session_type, **(event.metadata or {})},
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "success": True,
        "session_id": session_id,
        "started_at": session_data["started_at"]
    }


@router.post("/session/{session_id}/end")
async def end_session(session_id: str, event: SessionEndEvent):
    """
    End a tracked session and record metrics.
    """
    if session_id not in user_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = user_sessions[session_id]
    
    # Calculate duration if not provided
    duration = event.duration_seconds
    if duration == 0:
        duration = calculate_session_duration(session_id)
    
    session["ended_at"] = datetime.now(timezone.utc).isoformat()
    session["duration_seconds"] = duration
    session["outcome"] = event.outcome
    session["end_metadata"] = event.metadata or {}
    
    # Track session end event
    events_db.append({
        "id": str(uuid.uuid4()),
        "event_type": "session_end",
        "user_id": session["user_id"],
        "couple_id": session.get("couple_id"),
        "session_id": session_id,
        "properties": {
            "duration_seconds": duration,
            "outcome": event.outcome,
            "session_type": session["session_type"],
            **(event.metadata or {})
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "success": True,
        "session_id": session_id,
        "duration_seconds": duration,
        "outcome": event.outcome
    }


@router.post("/session/{session_id}/event")
async def add_session_event(session_id: str, event: AnalyticsEvent):
    """
    Add an event to an active session.
    """
    if session_id not in user_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    event_data = {
        "event_type": event.event_type,
        "timestamp": event.timestamp or datetime.now(timezone.utc).isoformat(),
        "properties": event.properties or {}
    }
    
    user_sessions[session_id]["events"].append(event_data)
    
    return {"success": True}


@router.get("/user/{user_id}/activity")
async def get_user_activity(
    user_id: str,
    days: int = 30,
    event_type: Optional[str] = None
):
    """
    Get activity summary for a user.
    """
    cutoff_date = datetime.now(timezone.utc).timestamp() - (days * 24 * 60 * 60)
    
    # Filter events
    user_events = [
        e for e in events_db
        if e["user_id"] == user_id
        and datetime.fromisoformat(e["timestamp"]).timestamp() > cutoff_date
        and (event_type is None or e["event_type"] == event_type)
    ]
    
    # Calculate metrics
    game_completions = len([e for e in user_events if e["event_type"] == "game_complete"])
    game_abandons = len([e for e in user_events if e["event_type"] == "game_abandon"])
    total_sessions = len([e for e in user_events if e["event_type"] == "session_start"])
    
    # Calculate total play time
    total_play_time = sum(
        e.get("properties", {}).get("duration_seconds", 0)
        for e in user_events
        if e["event_type"] == "session_end"
    )
    
    return {
        "user_id": user_id,
        "period_days": days,
        "total_events": len(user_events),
        "metrics": {
            "games_completed": game_completions,
            "games_abandoned": game_abandons,
            "completion_rate": game_completions / (game_completions + game_abandons) if (game_completions + game_abandons) > 0 else 0,
            "total_sessions": total_sessions,
            "total_play_time_seconds": total_play_time,
            "total_play_time_hours": round(total_play_time / 3600, 2)
        },
        "events": user_events[:100]  # Limit for performance
    }


@router.get("/couple/{couple_id}/milestones")
async def get_couple_milestones(couple_id: str):
    """
    Get relationship milestones for a couple.
    """
    # Filter milestone events
    milestone_events = [
        e for e in events_db
        if e.get("couple_id") == couple_id
        and e["event_type"] == "milestone_reached"
    ]
    
    # Sort by timestamp
    milestone_events.sort(key=lambda x: x["timestamp"])
    
    milestones = [
        {
            "type": e.get("properties", {}).get("milestone_type"),
            "title": e.get("properties", {}).get("title"),
            "description": e.get("properties", {}).get("description"),
            "achieved_at": e["timestamp"]
        }
        for e in milestone_events
    ]
    
    return {
        "couple_id": couple_id,
        "milestone_count": len(milestones),
        "milestones": milestones
    }


@router.get("/admin/events")
async def get_all_events(
    event_type: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
):
    """
    Admin endpoint to query all events.
    """
    filtered_events = events_db
    
    if event_type:
        filtered_events = [e for e in filtered_events if e["event_type"] == event_type]
    
    # Sort by timestamp descending
    filtered_events.sort(key=lambda x: x["timestamp"], reverse=True)
    
    total = len(filtered_events)
    paginated = filtered_events[offset:offset + limit]
    
    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "events": paginated
    }


@router.get("/admin/summary")
async def get_analytics_summary():
    """
    Admin endpoint to get analytics summary.
    """
    # Calculate summary stats
    total_events = len(events_db)
    
    # Event type breakdown
    event_type_counts = {}
    for e in events_db:
        et = e["event_type"]
        event_type_counts[et] = event_type_counts.get(et, 0) + 1
    
    # Recent activity (last 24 hours)
    day_ago = datetime.now(timezone.utc).timestamp() - (24 * 60 * 60)
    recent_events = [
        e for e in events_db
        if datetime.fromisoformat(e["timestamp"]).timestamp() > day_ago
    ]
    
    return {
        "total_events_tracked": total_events,
        "events_last_24h": len(recent_events),
        "event_type_breakdown": event_type_counts,
        "unique_users": len(set(e["user_id"] for e in events_db)),
        "generated_at": datetime.now(timezone.utc).isoformat()
    }


@router.post("/milestone")
async def track_milestone(
    couple_id: str,
    milestone_type: str,
    title: str,
    description: Optional[str] = None,
    user_id: Optional[str] = None
):
    """
    Track a relationship milestone.
    """
    milestone_event = {
        "id": str(uuid.uuid4()),
        "event_type": "milestone_reached",
        "user_id": user_id or "system",
        "couple_id": couple_id,
        "properties": {
            "milestone_type": milestone_type,
            "title": title,
            "description": description
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    events_db.append(milestone_event)
    
    return {
        "success": True,
        "milestone_id": milestone_event["id"],
        "message": f"Milestone '{title}' recorded for couple {couple_id}"
    }
