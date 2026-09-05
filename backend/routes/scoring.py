"""
Scoring System Routes
Implements the 4-pillar scoring system: Trust Thermometer, Romance Points,
Connection Points, and Vulnerability Points.
Also handles XP, achievements, and daily quests.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone, timedelta, date
import uuid
import random

try:
    from server import db, get_couple_ref, get_user_ref, doc_to_dict
    from firebase_admin import firestore
    FIREBASE_AVAILABLE = db is not None
except ImportError:
    FIREBASE_AVAILABLE = False
    db = None

router = APIRouter(prefix="/api/scoring", tags=["scoring"])


# =============================================================================
# Pydantic Models
# =============================================================================

class ScoreUpdateRequest(BaseModel):
    couple_id: str
    game_id: Optional[str] = None
    trust_change: float = 0.0
    romance_change: float = 0.0
    connection_change: float = 0.0
    vulnerability_change: float = 0.0
    xp_earned: int = 0
    streak_bonus: bool = False
    description: Optional[str] = None


class ScoreResponse(BaseModel):
    trust_thermometer: float
    romance_points: float
    connection_points: float
    vulnerability_points: float
    total_xp: int
    level: int
    streak: int
    achievements_unlocked: List[str]
    message: str


class DailyQuestRequest(BaseModel):
    user_id: str
    couple_id: str


class DailyQuestResponse(BaseModel):
    quest_id: str
    title: str
    description: str
    category: str
    xp_reward: int
    romance_reward: int
    completion_criteria: str
    expires_at: datetime
    completed: bool
    reward_claimed: bool


class ConsequenceRequest(BaseModel):
    couple_id: str
    trigger: str
    trigger_type: str
    severity: int = 1


class ConsequenceResponse(BaseModel):
    penalty_type: str
    message: str
    marcie_commentary: str
    expires_at: Optional[datetime]
    active: bool


# =============================================================================
# Scoring Constants
# =============================================================================

LEADERBOARD_CATEGORIES = [
    'trust', 'romance', 'connection', 'vulnerability',
    'conflict_resolution', 'communication', 'intimacy'
]

DAILY_QUEST_TEMPLATES = [
    {
        "title": "Three Compliments, One Lie",
        "description": "Give your partner 3 genuine compliments and 1 playful fib. They have to guess which is the lie!",
        "category": "romance",
        "xp_reward": 150,
        "romance_reward": 25,
        "completion_criteria": "Submit 3 compliments and 1 playful lie"
    },
    {
        "title": "Vulnerability Drop",
        "description": "Share one thing you've never told your partner about your past. No judgment zone.",
        "category": "vulnerability",
        "xp_reward": 200,
        "vulnerability_reward": 30,
        "completion_criteria": "Submit one vulnerability story"
    },
    {
        "title": "Bid Radar Check",
        "description": "Notice and acknowledge 3 bids for attention from your partner today.",
        "category": "connection",
        "xp_reward": 100,
        "connection_reward": 20,
        "completion_criteria": "Acknowledge 3 bids for attention"
    },
    {
        "title": "The Soft Startup Challenge",
        "description": "Bring up one concern using 'I feel...' language. No blame, just feelings.",
        "category": "conflict_resolution",
        "xp_reward": 175,
        "connection_reward": 25,
        "completion_criteria": "Submit one soft startup statement"
    },
    {
        "title": "Marvie's Minute",
        "description": "Spend 60 seconds making eye contact with your partner. No talking. Just looking.",
        "category": "intimacy",
        "xp_reward": 125,
        "intimacy_reward": 20,
        "completion_criteria": "Complete 60-second eye contact exercise"
    },
]


CONSEQUENCE_PENALTIES = {
    1: {
        "type": "wallpaper_swap",
        "name": "The Wallpaper Swap",
        "description": "App requests wallpaper permission and changes lock screen to accountability message",
        "marcie_commentary": "Your lock screen is now your accountability buddy. You're welcome.",
        "duration_hours": 24
    },
    2: {
        "type": "app_block",
        "name": "The App Block",
        "description": "Push notification bombardment until app is opened",
        "marcie_commentary": "Ignoring your relationship? I'll make sure you can't ignore me.",
        "duration_hours": 48
    },
    3: {
        "type": "public_roast",
        "name": "The Public Roast",
        "description": "Generates shareable 'Certificate of Negligence' (opt-in)",
        "marcie_commentary": "Careful, lovebirds. Neglect isn't cute.",
        "duration_hours": 0
    },
    4: {
        "type": "lockout",
        "name": "The Lockout",
        "description": "Romance Hub games greyed out until Healing Hospital game completed",
        "marcie_commentary": "Work before play, sweetie. Hit the Healing Hospital first.",
        "duration_hours": 0
    }
}


# =============================================================================
# Helper Functions
# =============================================================================

def calculate_level(xp: int) -> int:
    """Calculate player level from XP (1-100+)"""
    if xp < 100:
        return 1
    level = 1
    xp_required = 100
    while xp >= xp_required:
        level += 1
        xp_required = int(xp_required * 1.5)
    return min(level, 100)


def calculate_leaderboard_score(trust: float, romance: float, connection: float, vp: float) -> float:
    """Calculate total leaderboard score using the 4-pillar formula"""
    return (trust * 10) + (romance * 0.1) + (connection * 0.2) + (vp * 0.5)


def get_streak_bonus(current_streak: int) -> float:
    """Calculate XP bonus multiplier based on streak"""
    if current_streak >= 30:
        return 2.0
    elif current_streak >= 14:
        return 1.5
    elif current_streak >= 7:
        return 1.25
    elif current_streak >= 3:
        return 1.1
    return 1.0


# In-memory state for development (Firestore in production)
_in_memory_couples: Dict[str, Dict] = {}


def get_couple_scores(couple_id: str) -> Dict[str, Any]:
    """Get current scores for a couple"""
    if FIREBASE_AVAILABLE and db:
        couple_ref = get_couple_ref(couple_id)
        if couple_ref:
            couple_doc = couple_ref.get()
            if couple_doc.exists:
                return doc_to_dict(couple_doc)
    return _in_memory_couples.get(couple_id, {
        'trust_thermometer': 50.0,
        'romance_points': 0.0,
        'connection_points': 0.0,
        'vulnerability_points': 0.0,
        'total_xp': 0,
        'current_streak': 0,
        'longest_streak': 0,
        'level': 1,
    })


def save_couple_scores(couple_id: str, scores: Dict[str, Any]):
    """Save scores for a couple"""
    if FIREBASE_AVAILABLE and db:
        couple_ref = get_couple_ref(couple_id)
        if couple_ref:
            couple_ref.set(scores, merge=True)
            return
    _in_memory_couples[couple_id] = scores


def check_achievements(scores: Dict[str, Any], game_id: Optional[str], updates: ScoreUpdateRequest) -> List[str]:
    """Check if any achievements were unlocked"""
    unlocked = []
    
    # First game
    if scores.get('total_xp', 0) == 0 and updates.xp_earned > 0:
        unlocked.append('first_game')
    
    # Trust milestones
    trust = scores.get('trust_thermometer', 50)
    if trust >= 75 and scores.get('_last_trust_achieved', 0) < 75:
        unlocked.append('trust_builder')
    if trust >= 90 and scores.get('_last_trust_achieved', 0) < 90:
        unlocked.append('trust_master')
    
    # Streak achievements
    streak = scores.get('current_streak', 0)
    if streak >= 7 and scores.get('_last_streak_achieved', 0) < 7:
        unlocked.append('streak_wizard')
    if streak >= 30 and scores.get('_last_streak_achieved', 0) < 30:
        unlocked.append('consistency_king')
    
    # XP milestones
    xp = scores.get('total_xp', 0) + updates.xp_earned
    if xp >= 1000 and scores.get('total_xp', 0) < 1000:
        unlocked.append('thousand_points')
    
    return unlocked


# =============================================================================
# API Endpoints
# =============================================================================

@router.post("/update", response_model=ScoreResponse)
async def update_scores(request: ScoreUpdateRequest):
    """Update scores for a couple after completing a game or activity."""
    scores = get_couple_scores(request.couple_id)
    
    # Update metrics
    scores['trust_thermometer'] = min(100.0, max(0.0, scores.get('trust_thermometer', 50.0) + request.trust_change))
    scores['romance_points'] = max(0.0, scores.get('romance_points', 0.0) + request.romance_change)
    scores['connection_points'] = max(0.0, scores.get('connection_points', 0.0) + request.connection_change)
    scores['vulnerability_points'] = max(0.0, scores.get('vulnerability_points', 0.0) + request.vulnerability_change)
    
    # XP with streak bonus
    xp_multiplier = get_streak_bonus(scores.get('current_streak', 0)) if request.streak_bonus else 1.0
    earned_xp = int(request.xp_earned * xp_multiplier)
    scores['total_xp'] = scores.get('total_xp', 0) + earned_xp
    scores['level'] = calculate_level(scores['total_xp'])
    
    # Check achievements
    achievements = check_achievements(scores, request.game_id, request)
    
    save_couple_scores(request.couple_id, scores)
    
    # Save score history
    if FIREBASE_AVAILABLE and db:
        try:
            history_ref = db.collection('score_history').document(str(uuid.uuid4()))
            history_ref.set({
                'couple_id': request.couple_id,
                'game_id': request.game_id,
                'trust_change': request.trust_change,
                'romance_change': request.romance_change,
                'connection_change': request.connection_change,
                'vulnerability_change': request.vulnerability_change,
                'xp_earned': earned_xp,
                'timestamp': datetime.now(timezone.utc),
                'description': request.description
            })
        except Exception:
            pass
    
    # Build message
    if achievements:
        message = f"Scores updated! Unlocked: {', '.join(achievements)}"
    else:
        message = "Scores updated successfully."
    
    return ScoreResponse(
        trust_thermometer=scores['trust_thermometer'],
        romance_points=scores['romance_points'],
        connection_points=scores['connection_points'],
        vulnerability_points=scores['vulnerability_points'],
        total_xp=scores['total_xp'],
        level=scores['level'],
        streak=scores.get('current_streak', 0),
        achievements_unlocked=achievements,
        message=message
    )


@router.get("/leaderboard/{category}", response_model=Dict)
async def get_leaderboard(category: str):
    """Get leaderboard for a specific category (trust, romance, connection, vulnerability)."""
    if category not in LEADERBOARD_CATEGORIES and category not in ['overall']:
        raise HTTPException(status_code=400, detail=f"Invalid category: {category}")
    
    if FIREBASE_AVAILABLE and db:
        try:
            if category == 'overall':
                couples_ref = db.collection('couples').order_by('_leaderboard_score', direction=firestore.Query.DESCENDING).limit(50)
            else:
                couples_ref = db.collection('couples').order_by(f'{category}_score', direction=firestore.Query.DESCENDING).limit(50)
            docs = couples_ref.stream()
            return {'rankings': [doc_to_dict(doc) for doc in docs]}
        except Exception as e:
            pass
    
    # Fallback: return empty rankings
    return {'rankings': [], 'message': 'Leaderboard data unavailable'}


@router.get("/couple/{couple_id}")
async def get_couple_scores_endpoint(couple_id: str):
    """Get complete score details for a couple."""
    scores = get_couple_scores(couple_id)
    
    leaderboard_score = calculate_leaderboard_score(
        scores.get('trust_thermometer', 50),
        scores.get('romance_points', 0),
        scores.get('connection_points', 0),
        scores.get('vulnerability_points', 0)
    )
    scores['_leaderboard_score'] = round(leaderboard_score, 2)
    
    return scores


@router.post("/daily-quest", response_model=DailyQuestResponse)
async def get_or_create_daily_quest(request: DailyQuestRequest):
    """Get today's daily quest for the user, or create one if none exists."""
    today = datetime.now(timezone.utc).date().isoformat()
    
    # Check if user already has a quest for today
    if FIREBASE_AVAILABLE and db:
        try:
            quests_ref = db.collection('daily_quests')
            query = quests_ref.where('user_id', '==', request.user_id).where('date', '==', today).stream()
            docs = list(query)
            if docs:
                return doc_to_dict(docs[0])
        except Exception:
            pass
    
    # Create new daily quest
    template = random.choice(DAILY_QUEST_TEMPLATES)
    expires_at = datetime.now(timezone.utc) + timedelta(days=1)
    
    quest = {
        'quest_id': str(uuid.uuid4()),
        'user_id': request.user_id,
        'couple_id': request.couple_id,
        'date': today,
        'title': template['title'],
        'description': template['description'],
        'category': template['category'],
        'xp_reward': template['xp_reward'],
        'romance_reward': template.get('romance_reward', 0),
        'vulnerability_reward': template.get('vulnerability_reward', 0),
        'connection_reward': template.get('connection_reward', 0),
        'completion_criteria': template['completion_criteria'],
        'expires_at': expires_at,
        'completed': False,
        'reward_claimed': False,
    }
    
    if FIREBASE_AVAILABLE and db:
        try:
            db.collection('daily_quests').document(quest['quest_id']).set(quest)
        except Exception:
            pass
    
    return DailyQuestResponse(**quest)


@router.post("/daily-quest/complete")
async def complete_daily_quest(quest_id: str, couple_id: str):
    """Mark a daily quest as completed and award rewards."""
    quest = None
    
    if FIREBASE_AVAILABLE and db:
        try:
            quest_doc = db.collection('daily_quests').document(quest_id).get()
            if quest_doc.exists:
                quest = doc_to_dict(quest_doc)
                if quest.get('reward_claimed'):
                    return {'message': 'Reward already claimed', 'already_claimed': True}
        except Exception:
            pass
    else:
        # Fallback: create a quest response
        template = random.choice(DAILY_QUEST_TEMPLATES)
        quest = {
            'quest_id': quest_id,
            'date': datetime.now(timezone.utc).date().isoformat(),
            'title': template['title'],
            'description': template['description'],
            'category': template['category'],
            'xp_reward': template['xp_reward'],
            'romance_reward': template.get('romance_reward', 0),
            'vulnerability_reward': template.get('vulnerability_reward', 0),
            'connection_reward': template.get('connection_reward', 0),
            'completion_criteria': template['completion_criteria'],
            'completed': True,
            'reward_claimed': False,
        }
    
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    
    # Update quest status
    if FIREBASE_AVAILABLE and db:
        try:
            db.collection('daily_quests').document(quest_id).update({
                'completed': True,
                'reward_claimed': True,
                'completed_at': datetime.now(timezone.utc)
            })
        except Exception:
            pass
    
    # Apply score updates
    score_response = await update_scores(ScoreUpdateRequest(
        couple_id=couple_id,
        trust_change=2.0 if quest.get('category') in ['trust', 'conflict_resolution'] else 0,
        romance_change=quest.get('romance_reward', 0),
        connection_change=quest.get('connection_reward', 0),
        vulnerability_change=quest.get('vulnerability_reward', 0),
        xp_earned=quest.get('xp_reward', 0),
        streak_bonus=False,
        description=f"Daily Quest: {quest.get('title', '')}"
    ))
    
    # Update streak
    scores = get_couple_scores(couple_id)
    scores['current_streak'] = scores.get('current_streak', 0) + 1
    scores['longest_streak'] = max(scores.get('longest_streak', 0), scores['current_streak'])
    save_couple_scores(couple_id, scores)
    
    return {
        'message': 'Daily quest completed!',
        'quest_id': quest_id,
        'rewards': {
            'xp': quest.get('xp_reward', 0),
            'romance': quest.get('romance_reward', 0),
            'connection': quest.get('connection_reward', 0),
            'vulnerability': quest.get('vulnerability_reward', 0),
        },
        'new_streak': scores['current_streak'],
        'score_update': score_response
    }


@router.get("/daily-quests/history/{couple_id}")
async def get_quest_history(couple_id: str, limit: int = 30):
    """Get daily quest history for a couple."""
    if FIREBASE_AVAILABLE and db:
        try:
            quests_ref = db.collection('daily_quests') \
                .where('couple_id', '==', couple_id) \
                .order_by('date', direction=firestore.Query.DESCENDING) \
                .limit(limit)
            docs = quests_ref.stream()
            return {'quests': [doc_to_dict(doc) for doc in docs]}
        except Exception:
            pass
    return {'quests': []}


@router.get("/daily-quests/active/{user_id}")
async def get_active_quest(user_id: str):
    """Get the active (incomplete, non-expired) daily quest for a user."""
    today = datetime.now(timezone.utc).date().isoformat()
    
    if FIREBASE_AVAILABLE and db:
        try:
            quests_ref = db.collection('daily_quests')
            query = quests_ref.where('user_id', '==', user_id).where('date', '==', today).where('completed', '==', False)
            docs = list(query.stream())
            if docs:
                return doc_to_dict(docs[0])
        except Exception:
            pass
    
    return {'quest': None, 'message': 'No active quest. Request one to start.'}


@router.post("/consequence", response_model=ConsequenceResponse)
async def trigger_consequence(request: ConsequenceRequest):
    """Trigger a consequence penalty for missed activities."""
    scores = get_couple_scores(request.couple_id)
    
    # Determine penalty severity based on trigger
    penalty = CONSEQUENCE_PENALTIES.get(request.severity, CONSEQUENCE_PENALTIES[1])
    
    # Track penalty count for escalation
    penalty_count = scores.get('_penalty_count', 0) + 1
    next_penalty = CONSEQUENCE_PENALTIES.get(min(penalty_count + 1, 4), penalty)
    
    # Apply penalty
    if penalty['type'] == 'wallpaper_swap':
        scores['lockout_romance_hub'] = True
    elif penalty['type'] == 'app_block':
        scores['app_notification_bomb'] = True
        scores['app_notification_bomb_until'] = (datetime.now(timezone.utc) + timedelta(hours=48)).isoformat()
    elif penalty['type'] == 'lockout':
        scores['lockout_romance_hub'] = True
        scores['lockout_until'] = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
    
    scores['_penalty_count'] = penalty_count
    save_couple_scores(request.couple_id, scores)
    
    # Save consequence record
    if FIREBASE_AVAILABLE and db:
        try:
            consequence_ref = db.collection('consequences').document()
            consequence_ref.set({
                'couple_id': request.couple_id,
                'trigger': request.trigger,
                'trigger_type': request.trigger_type,
                'severity': request.severity,
                'penalty_type': penalty['type'],
                'message': penalty['description'],
                'marcie_commentary': penalty['marcie_commentary'],
                'created_at': datetime.now(timezone.utc),
                'resolved': False,
            })
        except Exception:
            pass
    
    expires_at = None
    if penalty.get('duration_hours', 0) > 0:
        expires_at = datetime.now(timezone.utc) + timedelta(hours=penalty['duration_hours'])
    
    return ConsequenceResponse(
        penalty_type=penalty['type'],
        message=penalty['description'],
        marcie_commentary=penalty['marcie_commentary'],
        expires_at=expires_at,
        active=True
    )


@router.get("/consequences/{couple_id}")
async def get_active_consequences(couple_id: str):
    """Get active consequences for a couple."""
    scores = get_couple_scores(couple_id)
    active_consequences = []
    
    if scores.get('lockout_romance_hub'):
        lockout_until = scores.get('lockout_until')
        if lockout_until:
            try:
                until_date = datetime.fromisoformat(lockout_until.replace('Z', '+00:00'))
                if datetime.now(timezone.utc) < until_date:
                    active_consequences.append({
                        'type': 'lockout',
                        'message': "Romance Hub is locked. Complete a Healing Hospital game to unlock.",
                        'expires_at': lockout_until
                    })
            except (ValueError, TypeError):
                pass
    
    return {'consequences': active_consequences}
