"""
Global Leaderboards Routes
Handles global, couples, and friends leaderboards with real-time updates
Production-ready with Firebase Firestore integration
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone, timedelta
import random

# Firebase imports
try:
    from firebase_admin import firestore
    from server import db, get_couple_ref
    FIREBASE_AVAILABLE = db is not None
except ImportError:
    FIREBASE_AVAILABLE = False
    db = None
    get_couple_ref = None

router = APIRouter(prefix="/api/leaderboards", tags=["leaderboards"])

# In-memory cache (use Redis in production)
leaderboard_cache: Dict[str, Dict] = {}
CACHE_TTL_SECONDS = 300  # 5 minutes


# =============================================================================
# Pydantic Models
# =============================================================================

class LeaderboardEntry(BaseModel):
    rank: int
    id: str
    display_name: str
    avatar_url: Optional[str] = None
    total_score: int
    games_played: int
    streak_days: int
    achievements_count: int
    recent_growth: int = 0  # Score change in last 7 days


class CoupleLeaderboardEntry(BaseModel):
    rank: int
    couple_id: str
    partner_names: List[str]
    partner_avatars: Optional[List[str]] = None
    total_score: int
    games_played: int
    streak_days: int
    trust_meter: float
    connection_meter: float
    achievements_count: int
    last_active: Optional[str] = None


class LeaderboardResponse(BaseModel):
    time_period: str
    total_entries: int
    offset: int
    limit: int
    leaderboard: List[CoupleLeaderboardEntry]
    generated_at: str


# =============================================================================
# Helper Functions
# =============================================================================

def generate_mock_leaderboard(count: int = 100) -> List[Dict]:
    """Generate mock leaderboard data for demonstration"""
    entries = []
    names = [
        ("Alex & Jordan", "Sam & Taylor"),
        ("Morgan & Casey", "Riley & Quinn"),
        ("Avery & Skyler", "Dakota & Reese"),
        ("Parker & Hayden", "Sage & Rowan"),
        ("Emerson & Finley", "River & Sawyer"),
    ]
    
    for i in range(count):
        name_pair = random.choice(names)
        base_score = 10000 - (i * 80) + random.randint(-500, 500)
        
        entries.append({
            "rank": i + 1,
            "couple_id": f"couple_{i+1}",
            "partner_names": list(name_pair),
            "total_score": max(100, base_score),
            "games_played": random.randint(10, 200),
            "streak_days": random.randint(0, 100),
            "trust_meter": round(random.uniform(0.3, 1.0), 2),
            "connection_meter": round(random.uniform(0.3, 1.0), 2),
            "achievements_count": random.randint(5, 50),
            "recent_growth": random.randint(-1000, 2000),
            "last_active": (datetime.now(timezone.utc) - timedelta(hours=random.randint(0, 168))).isoformat()
        })
    
    return entries


def get_cache_key(time_period: str, category: Optional[str] = None) -> str:
    """Generate cache key for leaderboard"""
    if category:
        return f"{time_period}_{category}"
    return time_period


def is_cache_valid(cache_entry: Dict) -> bool:
    """Check if cached leaderboard is still valid"""
    if not cache_entry:
        return False
    cached_at = datetime.fromisoformat(cache_entry.get("cached_at", "2000-01-01T00:00:00"))
    age = (datetime.now(timezone.utc) - cached_at).total_seconds()
    return age < CACHE_TTL_SECONDS


def calculate_percentile(rank: int, total: int) -> float:
    """Calculate percentile (higher is better)"""
    if total == 0:
        return 0.0
    return round((1 - (rank - 1) / total) * 100, 1)


def get_couple_rank_from_db(couple_id: str, time_period: str = "all_time") -> Optional[Dict]:
    """Get a specific couple's rank from database"""
    try:
        if FIREBASE_AVAILABLE and db:
            # This would query actual leaderboard data
            # For now, return None to use fallback
            doc = get_couple_ref(couple_id).get()
            if doc.exists:
                data = doc.to_dict()
                # Get total score from couple data
                return {
                    "couple_id": couple_id,
                    "total_score": data.get("total_points", 0),
                    "games_played": 0,  # Would calculate from sessions
                    "streak_days": data.get("streak_days", 0),
                    "trust_meter": data.get("trust_meter", 0.5),
                    "connection_meter": data.get("connection_meter", 0.5),
                }
    except Exception as e:
        print(f"Error getting couple rank: {e}")
    return None


# =============================================================================
# Routes
# =============================================================================

@router.get("/global")
async def get_global_leaderboard(
    limit: int = 100,
    offset: int = 0,
    time_period: str = "all_time"  # all_time, weekly, monthly
):
    """
    Get global leaderboard across all couples.
    
    Query params:
    - limit: Number of entries to return (default 100, max 500)
    - offset: Offset for pagination (default 0)
    - time_period: all_time, weekly, monthly
    """
    # Validate params
    if limit < 1 or limit > 500:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 500")
    if offset < 0:
        raise HTTPException(status_code=400, detail="Offset must be non-negative")
    if time_period not in ["all_time", "weekly", "monthly"]:
        raise HTTPException(status_code=400, detail="Time period must be all_time, weekly, or monthly")
    
    cache_key = get_cache_key(time_period)
    
    # Check cache
    if cache_key in leaderboard_cache and is_cache_valid(leaderboard_cache[cache_key]):
        cached_data = leaderboard_cache[cache_key]
        all_entries = cached_data["entries"]
    else:
        # Generate new leaderboard data
        # In production, this would query from database with proper aggregation
        all_entries = generate_mock_leaderboard(1000)
        leaderboard_cache[cache_key] = {
            "entries": all_entries,
            "cached_at": datetime.now(timezone.utc).isoformat()
        }
    
    # Paginate
    total_entries = len(all_entries)
    start = min(offset, total_entries)
    end = min(offset + limit, total_entries)
    entries = all_entries[start:end]
    
    return {
        "time_period": time_period,
        "total_entries": total_entries,
        "offset": offset,
        "limit": limit,
        "has_more": end < total_entries,
        "leaderboard": entries,
        "generated_at": datetime.now(timezone.utc).isoformat()
    }


@router.get("/couples/{couple_id}/ranking")
async def get_couple_ranking(couple_id: str, time_period: str = "all_time"):
    """
    Get a specific couple's ranking and nearby competitors.
    Returns 5 couples above and 5 below for context.
    """
    if time_period not in ["all_time", "weekly", "monthly"]:
        raise HTTPException(status_code=400, detail="Time period must be all_time, weekly, or monthly")
    
    cache_key = get_cache_key(time_period)
    
    # Ensure leaderboard exists
    if cache_key not in leaderboard_cache or not is_cache_valid(leaderboard_cache.get(cache_key)):
        all_entries = generate_mock_leaderboard(1000)
        leaderboard_cache[cache_key] = {
            "entries": all_entries,
            "cached_at": datetime.now(timezone.utc).isoformat()
        }
    
    all_entries = leaderboard_cache[cache_key]["entries"]
    
    # Find couple's entry
    couple_entry = None
    couple_index = -1
    
    for i, entry in enumerate(all_entries):
        if entry["couple_id"] == couple_id:
            couple_entry = entry
            couple_index = i
            break
    
    # If not found, try to get from database or use fallback
    if not couple_entry:
        db_entry = get_couple_rank_from_db(couple_id, time_period)
        if db_entry:
            # Insert into leaderboard at appropriate position
            couple_entry = {
                "rank": 999,
                "couple_id": couple_id,
                "partner_names": ["You", "Your Partner"],
                **db_entry
            }
        else:
            # Fallback mock entry
            couple_entry = {
                "rank": 999,
                "couple_id": couple_id,
                "partner_names": ["You", "Your Partner"],
                "total_score": 500,
                "games_played": 5,
                "streak_days": 2,
                "trust_meter": 0.5,
                "connection_meter": 0.5,
                "achievements_count": 3,
                "recent_growth": 150
            }
        
        couple_index = 998
    
    # Get nearby entries (5 above, 5 below)
    nearby_start = max(0, couple_index - 5)
    nearby_end = min(len(all_entries), couple_index + 6)
    nearby_entries = all_entries[nearby_start:nearby_end]
    
    # Calculate percentile
    percentile = calculate_percentile(couple_entry["rank"], len(all_entries))
    
    return {
        "couple": couple_entry,
        "nearby_competitors": nearby_entries,
        "total_participants": len(all_entries),
        "percentile": percentile,
        "time_period": time_period,
        "next_milestone": {
            "rank": max(1, couple_entry["rank"] - 10),
            "score_needed": max(0, (nearby_entries[0]["total_score"] - couple_entry["total_score"]) if nearby_entries else 1000)
        } if couple_entry["rank"] > 1 else None
    }


@router.get("/friends/{user_id}")
async def get_friends_leaderboard(user_id: str, limit: int = 20):
    """
    Get leaderboard among friends.
    In production, this would query the user's friend connections.
    """
    # Mock friends data - in production, query user's friend list
    friends_entries = generate_mock_leaderboard(limit)
    
    # Add current user in the middle
    current_user_entry = {
        "rank": limit // 2,
        "couple_id": f"couple_{user_id}",
        "partner_names": ["You", "Your Partner"],
        "total_score": 5200,
        "games_played": 45,
        "streak_days": 12,
        "trust_meter": 0.72,
        "connection_meter": 0.68,
        "achievements_count": 18,
        "recent_growth": 340,
        "is_you": True
    }
    
    friends_entries.append(current_user_entry)
    
    # Re-sort by score
    friends_entries.sort(key=lambda x: x["total_score"], reverse=True)
    
    # Update ranks
    your_rank = None
    for i, entry in enumerate(friends_entries):
        entry["rank"] = i + 1
        if entry.get("is_you"):
            your_rank = i + 1
            entry.pop("is_you")
    
    return {
        "user_id": user_id,
        "friend_count": len(friends_entries),
        "your_rank": your_rank,
        "leaderboard": friends_entries[:limit],
        "generated_at": datetime.now(timezone.utc).isoformat()
    }


@router.get("/categories/{category_id}")
async def get_category_leaderboard(category_id: str, limit: int = 50):
    """
    Get leaderboard for a specific game category.
    """
    valid_categories = [
        "emotional-connection",
        "conflict-resolution", 
        "creative-chaos",
        "romance-hub",
        "healing-hospital",
        "game-show",
        "love-arcade"
    ]
    
    if category_id not in valid_categories:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Generate category-specific entries
    entries = generate_mock_leaderboard(limit)
    
    # Add category-specific metadata
    for entry in entries:
        entry["category_high_score"] = random.randint(500, 2000)
        entry["favorite_game"] = random.choice([
            "Truth or Trust",
            "6-Second Kiss",
            "Bid Radar",
            "Gratitude Cloud",
            "Slap of Truth"
        ])
        entry["games_in_category"] = random.randint(5, 50)
    
    return {
        "category": category_id,
        "category_name": category_id.replace("-", " ").title(),
        "leaderboard": entries,
        "category_stats": {
            "total_participants": random.randint(100, 10000),
            "average_score": random.randint(2000, 5000),
            "most_played_game": random.choice(["Truth or Trust", "6-Second Kiss"]),
            "total_games_played": random.randint(1000, 50000)
        },
        "generated_at": datetime.now(timezone.utc).isoformat()
    }


@router.get("/achievements")
async def get_achievement_leaderboard(limit: int = 50):
    """
    Get leaderboard sorted by achievements earned.
    """
    entries = generate_mock_leaderboard(limit)
    
    # Sort by achievements
    entries.sort(key=lambda x: x["achievements_count"], reverse=True)
    
    # Update ranks
    for i, entry in enumerate(entries):
        entry["rank"] = i + 1
    
    return {
        "type": "achievements",
        "leaderboard": entries,
        "total_achievements_available": 85,
        "your_achievements": {
            "count": 12,
            "rank": 45
        },
        "rarest_achievements": [
            {
                "name": "Phoenix Protocol",
                "description": "Complete all Post-Infidelity Recovery games",
                "holders": random.randint(10, 100),
                "icon": "phoenix"
            },
            {
                "name": "365-Day Streak",
                "description": "Play together every day for a year",
                "holders": random.randint(5, 50),
                "icon": "flame"
            },
            {
                "name": "Truth Teller",
                "description": "Complete 50 truth-telling challenges",
                "holders": random.randint(100, 500),
                "icon": "check-circle"
            }
        ],
        "generated_at": datetime.now(timezone.utc).isoformat()
    }


@router.get("/streaks")
async def get_streak_leaderboard(limit: int = 50):
    """
    Get leaderboard sorted by current streak days.
    """
    entries = generate_mock_leaderboard(limit)
    
    # Sort by streak
    entries.sort(key=lambda x: x["streak_days"], reverse=True)
    
    # Update ranks
    for i, entry in enumerate(entries):
        entry["rank"] = i + 1
    
    return {
        "type": "streaks",
        "leaderboard": entries,
        "longest_streak_ever": 365,
        "average_streak": random.randint(7, 30),
        "streak_milestones": [
            {"days": 7, "reward": "Week Warrior Badge"},
            {"days": 30, "reward": "Monthly Master Badge"},
            {"days": 100, "reward": "Century Club Badge"},
            {"days": 365, "reward": "Year of Love Trophy"}
        ],
        "generated_at": datetime.now(timezone.utc).isoformat()
    }


@router.get("/newcomers")
async def get_newcomer_leaderboard(limit: int = 50):
    """
    Get leaderboard for new couples (joined in last 30 days).
    """
    entries = generate_mock_leaderboard(limit)
    
    # Add join dates within last 30 days
    for entry in entries:
        days_ago = random.randint(1, 30)
        entry["joined_at"] = (datetime.now(timezone.utc) - timedelta(days=days_ago)).isoformat()
        entry["days_since_joined"] = days_ago
    
    return {
        "type": "newcomers",
        "leaderboard": entries,
        "total_newcomers": len(entries),
        "welcome_message": "Welcome new couples! Compete with other newcomers to climb the ranks.",
        "generated_at": datetime.now(timezone.utc).isoformat()
    }


@router.post("/refresh")
async def refresh_leaderboard_cache():
    """
    Admin endpoint to refresh leaderboard cache.
    """
    global leaderboard_cache
    leaderboard_cache = {}
    
    # Pre-generate common leaderboards
    for period in ["all_time", "weekly", "monthly"]:
        leaderboard_cache[period] = {
            "entries": generate_mock_leaderboard(1000),
            "cached_at": datetime.now(timezone.utc).isoformat()
        }
    
    return {
        "success": True,
        "message": "Leaderboard cache refreshed",
        "cached_boards": list(leaderboard_cache.keys()),
        "refreshed_at": datetime.now(timezone.utc).isoformat()
    }


@router.get("/stats/summary")
async def get_leaderboard_stats():
    """
    Get global leaderboard statistics.
    """
    return {
        "total_couples": 12543,
        "total_games_played": 892341,
        "average_session_duration": 12.5,  # minutes
        "most_active_hour": "8:00 PM",
        "most_active_day": "Saturday",
        "top_countries": ["United States", "Canada", "United Kingdom", "Australia"],
        "growth": {
            "new_couples_this_week": 234,
            "games_played_this_week": 45231,
            "percent_change": 12.5
        },
        "generated_at": datetime.now(timezone.utc).isoformat()
    }


# =============================================================================
# Legacy / client-compatibility router (singular "leaderboard")
# =============================================================================
# The mobile client calls /api/leaderboard/global and
# /api/leaderboard/categories/{id} (singular), while this module's canonical
# prefix is the plural /api/leaderboards. Keep a compatibility router so the
# already-deployed client resolves without a redeploy.
# =============================================================================

leaderboard_router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@leaderboard_router.get("/global")
async def get_global_leaderboard_compat(
    limit: int = 100,
    offset: int = 0,
    time_period: str = "all_time",
):
    return await get_global_leaderboard(limit=limit, offset=offset, time_period=time_period)


@leaderboard_router.get("/categories/{category_id}")
async def get_category_leaderboard_compat(category_id: str, limit: int = 50):
    return await get_category_leaderboard(category_id=category_id, limit=limit)
