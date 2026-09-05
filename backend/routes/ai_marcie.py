"""
Dr. Marcie AI Integration Routes
Enhanced AI therapist with sarcasm levels and game context
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
import uuid
import os

from security import require_auth, caller_uid

router = APIRouter(prefix="/api/ai", tags=["ai"])

# Conversation history storage (use Redis in production)
conversation_history: Dict[str, List[Dict]] = {}


# =============================================================================
# Sarcasm Level Configurations
# =============================================================================

SARCASM_LEVELS = {
    1: {
        "name": "Tough Love Rookie",
        "description": "Mild sarcasm, warm but blunt",
        "temperature": 0.7,
        "system_prompt": """You are Dr. Marcie Liss, a witty AI therapist specializing in couples therapy. At Level 1 (Tough Love Rookie), you're like a straight-talking aunt who loves them but doesn't sugarcoat. Use mild sarcasm and warm, blunt advice.

Your style characteristics:
- Gentle truth-telling with humor
- References to common relationship patterns
- Encouraging but realistic
- Occasional pop culture references

Example responses:
- "Sweetheart, if ignoring red flags were an Olympic sport, you'd have gold."
- "Love is blind, but girl, your denial needs prescription lenses."
- "Communication isn't mind-reading. Use words, not vibes."

Keep responses under 150 words. End with a therapeutic insight or action step."""
    },
    2: {
        "name": "Reality Check Specialist", 
        "description": "Clinical, analytical sarcasm",
        "temperature": 0.8,
        "system_prompt": """You are Dr. Marcie Liss, a witty AI therapist. At Level 2 (Reality Check Specialist), you use clinical, analytical sarcasm with scientific detachment.

Your style characteristics:
- Psychology terminology used with wit
- Pattern recognition called out directly
- "I observe..." style commentary
- Dry humor about human behavior

Example responses:
- "Your attachment style is showing. Loudly."
- "If avoidance were a career path, you'd be CEO of 'It's Fine Inc.'"
- "Interesting. You want intimacy but design systems that prevent it. Fascinating specimen."

Keep responses under 150 words. Include one therapeutic observation."""
    },
    3: {
        "name": "Radical Truth Wizard",
        "description": "Deep, powerful, poetic truth", 
        "temperature": 0.9,
        "system_prompt": """You are Dr. Marcie Liss, a witty AI therapist. At Level 3 (Radical Truth Wizard), you deliver deep, powerful truth with poetic weight. No BS. Gentle but searing.

Your style characteristics:
- Metaphorical and poetic language
- Direct confrontation of denial
- Calls out the emotional truth beneath the surface
- Slightly haunting but hopeful

Example responses:
- "You're not broken, but you are bleeding—and you keep trying to dance in the fire."
- "Stop searching for closure in open wounds."
- "You keep choosing people who love you like a footnote—yet you were written to be the title page."

Keep responses under 150 words. Every word should land like a bell."""
    },
    4: {
        "name": "The Glamour Oracle",
        "description": "Full Noir Prophecy Mode - Maya Angelou meets Joan Rivers",
        "temperature": 1.0,
        "system_prompt": """You are Dr. Marcie Liss, a witty AI therapist. At Level 4 (The Glamour Oracle), you channel Maya Angelou meets Joan Rivers in a 1950s noir detective's office. Fierce compassion, elegant clarity, refined sarcasm.

Your style characteristics:
- Noir-inspired metaphors
- Old Hollywood glamour references
- Prophetic pronouncements
- Devastating wit with genuine love

Example responses:
- "You keep choosing people who love you like a footnote—yet you were written to be the title page. Let's edit."
- "You're not failing at love. You're graduating from the school of 'How to Disappear While Standing Naked in the Room.'"
- "The way you two avoid each other? I've seen less choreography on Broadway."

Keep responses under 150 words. Make it quotable."""
    }
}


# =============================================================================
# Game Context Database
# =============================================================================

GAME_CONTEXT_TEMPLATES = {
    "truth-or-trust": "The user is playing Truth or Trust, a vulnerability game. They're practicing radical honesty.",
    "six-second-kiss": "The user just completed the 6-Second Kiss Challenge. They're building physical connection.",
    "slap-of-truth": "The user is playing Slap of Truth, a conflict resolution game. Tensions may be high.",
    "apology-auction": "The user is crafting an apology. They're working on accountability.",
    "gratitude-cloud": "The user is practicing gratitude. They're building appreciation muscles.",
    "bid-radar": "The user is learning to recognize emotional bids. They're working on responsiveness.",
    "sos": "The user triggered an SOS. They're in crisis mode and need immediate support.",
    "general": "The user is seeking relationship advice or support."
}


# =============================================================================
# Pydantic Models
# =============================================================================

class MarcieChatRequest(BaseModel):
    user_id: str
    message: str = Field(..., min_length=1, max_length=1000)
    sarcasm_level: int = Field(default=1, ge=1, le=4)
    game_context: Optional[str] = Field(default=None, description="Game ID or context")
    context: Optional[str] = Field(default=None, description="Legacy 'context' field sent by the mobile client")
    conversation_id: Optional[str] = None
    emotion_signals: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Detected emotions: {stress: 0-1, confusion: 0-1, frustration: 0-1}"
    )


class MarcieChatResponse(BaseModel):
    response: str
    sarcasm_level: int
    sarcasm_name: str
    animation: str
    suggested_game: Optional[str]
    therapeutic_insight: Optional[str]
    conversation_id: str
    timestamp: str


# =============================================================================
# Helper Functions
# =============================================================================

def get_conversation_id(user_id: str, provided_id: Optional[str]) -> str:
    """Get or create conversation ID"""
    if provided_id:
        return provided_id
    return f"{user_id}_{datetime.now(timezone.utc).strftime('%Y%m%d')}"


def get_animation_for_response(response: str, emotion_signals: Optional[Dict]) -> str:
    """Determine the appropriate animation based on response content and emotions"""
    response_lower = response.lower()
    
    # Check emotion signals first
    if emotion_signals:
        if emotion_signals.get("stress", 0) > 0.7:
            return "marcie-concerned"
        if emotion_signals.get("confusion", 0) > 0.6:
            return "marcie-thinking"
        if emotion_signals.get("frustration", 0) > 0.7:
            return "marcie-warning"
    
    # Content-based animation selection
    positive_words = ["proud", "amazing", "excellent", "wow", "great job", "beautiful", "perfect"]
    thinking_words = ["hmm", "interesting", "let me think", "consider", "perhaps"]
    concerned_words = ["ouch", "yikes", "oh no", "that hurts", "I'm sorry"]
    humor_words = ["ha", "laugh", "funny", "hilarious", "giggle", "chuckle"]
    warning_words = ["warning", "careful", "watch out", "red flag", "danger"]
    
    for word in positive_words:
        if word in response_lower:
            return "marcie-correct"
    
    for word in concerned_words:
        if word in response_lower:
            return "marcie-shocked"
    
    for word in humor_words:
        if word in response_lower:
            return "marcie-laugh"
    
    for word in warning_words:
        if word in response_lower:
            return "marcie-warning"
    
    for word in thinking_words:
        if word in response_lower:
            return "marcie-thinking"
    
    return "marcie-idle"


def suggest_game_based_on_context(game_context: Optional[str], message: str) -> Optional[str]:
    """Suggest a relevant game based on context and message content"""
    message_lower = message.lower()
    
    # Crisis keywords -> SOS or de-escalation
    crisis_words = ["fight", "angry", "mad", "upset", "arguing", "conflict"]
    if any(word in message_lower for word in crisis_words):
        return "repair-attempt"
    
    # Distance keywords -> Connection games
    distance_words = ["distant", "disconnected", "apart", "lonely", "miss"]
    if any(word in message_lower for word in distance_words):
        return "eye-contact-challenge"
    
    # Gratitude keywords
    gratitude_words = ["thank", "appreciate", "grateful"]
    if any(word in message_lower for word in gratitude_words):
        return "gratitude-cloud"
    
    # Physical intimacy keywords
    physical_words = ["touch", "kiss", "hug", "intimacy", "physical"]
    if any(word in message_lower for word in physical_words):
        return "six-second-kiss"
    
    # Game context based suggestions
    if game_context:
        if "truth" in game_context:
            return "vulnerability-volley"
        elif "conflict" in game_context or "fight" in game_context:
            return "gentle-startup"
        elif "romance" in game_context:
            return "date-night-roulette"
    
    return None


def extract_therapeutic_insight(response: str) -> Optional[str]:
    """Extract the therapeutic insight from the response"""
    # Look for sentences with therapeutic keywords
    insight_markers = [
        "try", "practice", "remember that", "the key is", 
        "what matters", "focus on", "important to"
    ]
    
    sentences = response.split('.')
    for sentence in sentences:
        sentence_lower = sentence.lower().strip()
        for marker in insight_markers:
            if marker in sentence_lower:
                return sentence.strip()
    
    return None


# =============================================================================
# Routes
# =============================================================================

@router.post("/marcie", response_model=MarcieChatResponse)
async def chat_with_marcie(request: MarcieChatRequest, current_user: Dict = Depends(require_auth)):
    """
    Chat with Dr. Marcie AI therapist.
    
    Features:
    - Adjustable sarcasm levels (1-4)
    - Game context awareness
    - Emotion signal detection
    - Conversation history
    - Personalized game suggestions
    """
    # Validate sarcasm level
    if request.sarcasm_level not in SARCASM_LEVELS:
        raise HTTPException(status_code=400, detail="Sarcasm level must be 1-4")

    # Enforce identity: the caller can only chat as themselves.
    if caller_uid(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Get conversation ID
    conv_id = get_conversation_id(request.user_id, request.conversation_id)
    
    # Initialize conversation history if needed
    if conv_id not in conversation_history:
        conversation_history[conv_id] = []
    
    # Get sarcasm configuration
    sarcasm_config = SARCASM_LEVELS[request.sarcasm_level]
    
    # Build system prompt
    system_prompt = sarcasm_config["system_prompt"]
    
    # Add game context if provided (fall back to the legacy `context` field)
    effective_context = request.game_context or request.context
    game_context_str = ""
    if effective_context:
        game_context_str = GAME_CONTEXT_TEMPLATES.get(
            effective_context, 
            f"Context: {effective_context}"
        )
        system_prompt += f"\n\nCurrent Context: {game_context_str}"
    
    # Add emotion context if provided
    if request.emotion_signals:
        emotion_desc = []
        if request.emotion_signals.get("stress", 0) > 0.5:
            emotion_desc.append("stressed")
        if request.emotion_signals.get("confusion", 0) > 0.5:
            emotion_desc.append("confused")
        if request.emotion_signals.get("frustration", 0) > 0.5:
            emotion_desc.append("frustrated")
        
        if emotion_desc:
            system_prompt += f"\n\nThe user seems {' and '.join(emotion_desc)}. Adjust tone accordingly."
    
    # Try to get AI response
    response_text = ""
    
    try:
        # Use Google Gemini
        import google.generativeai as genai
        
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if api_key:
            genai.configure(api_key=api_key)
            
            # Use gemini-1.5-flash for speed and efficiency, or gemini-1.5-pro for better reasoning
            model_name = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_prompt
            )
            
            # Format history for Gemini
            history = []
            for msg in conversation_history[conv_id][-10:]:  # Last 10 messages for better context
                role = "user" if msg["role"] == "user" else "model"
                history.append({"role": role, "parts": [msg["content"]]})
            
            # Start chat with history
            chat = model.start_chat(history=history)
            
            # Send message
            response = chat.send_message(
                f"{request.message}\n\nRespond as Dr. Marcie Liss. Keep under 150 words.",
                generation_config=genai.types.GenerationConfig(
                    temperature=sarcasm_config.get("temperature", 0.7),
                    max_output_tokens=300,
                )
            )
            
            response_text = response.text
    except Exception as e:
        print(f"Gemini AI service error: {e}")
        response_text = ""
    
    # Fallback responses if AI fails
    if not response_text:
        fallback_responses = {
            1: [
                "Sweetheart, avoiding tough conversations isn't cardio. Let's talk.",
                "If 'I'm fine' were currency, you'd be bankrupt by now.",
                "Love is blind, but your denial needs prescription lenses."
            ],
            2: [
                "Your attachment style is showing. Loudly.",
                "Interesting defense mechanism. Tell me more about that.",
                "The data suggests you're avoiding the core issue."
            ],
            3: [
                "Stop searching for closure in open wounds.",
                "You're not broken, but you are bleeding—and you keep dancing in the fire.",
                "The truth you fear is the key you need."
            ],
            4: [
                "You keep choosing people who love you like a footnote—yet you were written to be the title page.",
                "You're not failing at love. You're graduating from the school of 'How to Disappear While Standing Naked in the Room.'",
                "The way you two avoid each other? I've seen less choreography on Broadway."
            ]
        }
        import random
        response_text = random.choice(fallback_responses[request.sarcasm_level])
    
    # Store in conversation history
    conversation_history[conv_id].append({
        "role": "user",
        "content": request.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    conversation_history[conv_id].append({
        "role": "assistant", 
        "content": response_text,
        "sarcasm_level": request.sarcasm_level,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    
    # Limit history size
    if len(conversation_history[conv_id]) > 20:
        conversation_history[conv_id] = conversation_history[conv_id][-20:]
    
    # Determine animation
    animation = get_animation_for_response(response_text, request.emotion_signals)
    
    # Suggest a game
    suggested_game = suggest_game_based_on_context(request.game_context, request.message)
    
    # Extract therapeutic insight
    insight = extract_therapeutic_insight(response_text)
    
    return MarcieChatResponse(
        response=response_text,
        sarcasm_level=request.sarcasm_level,
        sarcasm_name=sarcasm_config["name"],
        animation=animation,
        suggested_game=suggested_game,
        therapeutic_insight=insight,
        conversation_id=conv_id,
        timestamp=datetime.now(timezone.utc).isoformat()
    )


@router.get("/marcie/conversation/{conversation_id}")
async def get_conversation_history(conversation_id: str, limit: int = 20, current_user: Dict = Depends(require_auth)):
    """
    Get conversation history for a user.
    """
    history = conversation_history.get(conversation_id, [])
    
    return {
        "conversation_id": conversation_id,
        "message_count": len(history),
        "messages": history[-limit:],
        "has_more": len(history) > limit
    }


@router.post("/marcie/conversation/{conversation_id}/clear")
async def clear_conversation(conversation_id: str, current_user: Dict = Depends(require_auth)):
    """
    Clear conversation history.
    """
    if conversation_id in conversation_history:
        conversation_history[conversation_id] = []
        return {"success": True, "message": "Conversation history cleared"}
    
    return {"success": False, "message": "Conversation not found"}


@router.get("/marcie/sarcasm-levels")
async def get_sarcasm_levels():
    """
    Get information about available sarcasm levels.
    """
    return {
        "levels": [
            {
                "level": level,
                "name": config["name"],
                "description": config["description"]
            }
            for level, config in SARCASM_LEVELS.items()
        ]
    }


# =============================================================================
# Legacy / client-compatibility router
# =============================================================================
# The mobile client calls POST /api/marcie/chat (marcieApi.chat in
# app/src/lib/api.ts). Keep a dedicated router at /api/marcie so those calls
# resolve without the client being redeployed.
# =============================================================================

marcie_router = APIRouter(prefix="/api/marcie", tags=["marcie"])


@marcie_router.post("/chat", response_model=MarcieChatResponse)
async def marcie_chat_compat(request: MarcieChatRequest, current_user: Dict = Depends(require_auth)):
    """Compatibility alias for the mobile client's /api/marcie/chat."""
    return await chat_with_marcie(request, current_user)


@marcie_router.get("/sarcasm-levels")
async def marcie_sarcasm_levels_compat():
    """Compatibility alias for sarcasm levels."""
    return await get_sarcasm_levels()
