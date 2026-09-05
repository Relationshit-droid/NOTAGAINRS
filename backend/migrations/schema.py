"""
Database Schema Definitions
Collection and field specifications
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum


class FieldType(Enum):
    STRING = 'string'
    INTEGER = 'integer'
    FLOAT = 'float'
    BOOLEAN = 'boolean'
    TIMESTAMP = 'timestamp'
    ARRAY = 'array'
    MAP = 'map'
    REFERENCE = 'reference'
    GEOPOINT = 'geopoint'


@dataclass
class Field:
    name: str
    type: FieldType
    required: bool = False
    default: Any = None
    index: bool = False
    description: str = ''


@dataclass
class Collection:
    name: str
    fields: List[Field]
    indexes: List[List[str]] = None
    description: str = ''
    
    def __post_init__(self):
        if self.indexes is None:
            self.indexes = []


# =============================================================================
# Schema Definitions
# =============================================================================

USERS_COLLECTION = Collection(
    name='users',
    description='User accounts and profiles',
    fields=[
        Field('id', FieldType.STRING, required=True, description='Unique user ID'),
        Field('email', FieldType.STRING, required=True, index=True, description='User email'),
        Field('display_name', FieldType.STRING, required=True, description='Display name'),
        Field('photo_url', FieldType.STRING, description='Profile photo URL'),
        Field('couple_id', FieldType.STRING, index=True, description='Linked couple ID'),
        Field('partner_id', FieldType.STRING, index=True, description='Partner user ID'),
        Field('invite_code', FieldType.STRING, index=True, description='Couple invite code'),
        Field('sarcasm_level', FieldType.INTEGER, default=1, description='Dr. Marcie sarcasm level'),
        Field('trust_level', FieldType.FLOAT, default=0.5, description='Trust meter value'),
        Field('vulnerability_level', FieldType.FLOAT, default=0.5, description='Vulnerability meter'),
        Field('points', FieldType.INTEGER, default=0, description='Total points earned'),
        Field('plan', FieldType.STRING, default='free', description='Subscription plan'),
        Field('roles', FieldType.ARRAY, default=[], description='User roles'),
        Field('device_tokens', FieldType.ARRAY, default=[], description='Push notification tokens'),
        Field('last_active', FieldType.TIMESTAMP, description='Last activity timestamp'),
        Field('created_at', FieldType.TIMESTAMP, required=True, description='Account creation time'),
        Field('updated_at', FieldType.TIMESTAMP, description='Last update time'),
        Field('deleted_at', FieldType.TIMESTAMP, description='Soft deletion time'),
        Field('is_active', FieldType.BOOLEAN, default=True, description='Account status'),
        Field('email_verified', FieldType.BOOLEAN, default=False, description='Email verification status'),
        Field('privacy_settings', FieldType.MAP, default={}, description='Privacy preferences'),
        Field('notification_settings', FieldType.MAP, default={}, description='Notification preferences'),
    ],
    indexes=[
        ['email'],
        ['couple_id'],
        ['invite_code'],
        ['created_at'],
        ['last_active'],
    ]
)

COUPLES_COLLECTION = Collection(
    name='couples',
    description='Couple relationships',
    fields=[
        Field('id', FieldType.STRING, required=True, description='Unique couple ID'),
        Field('user1_id', FieldType.STRING, required=True, index=True, description='First partner ID'),
        Field('user2_id', FieldType.STRING, index=True, description='Second partner ID'),
        Field('invite_code', FieldType.STRING, index=True, description='Join invite code'),
        Field('status', FieldType.STRING, default='pending', description='Couple status'),
        Field('trust_meter', FieldType.FLOAT, default=0.5, description='Trust meter (0-1)'),
        Field('vulnerability_meter', FieldType.FLOAT, default=0.5, description='Vulnerability meter (0-1)'),
        Field('romance_meter', FieldType.FLOAT, default=0.5, description='Romance meter (0-1)'),
        Field('connection_meter', FieldType.FLOAT, default=0.5, description='Connection meter (0-1)'),
        Field('total_points', FieldType.INTEGER, default=0, description='Combined points'),
        Field('streak_days', FieldType.INTEGER, default=0, description='Current streak'),
        Field('longest_streak', FieldType.INTEGER, default=0, description='Longest streak achieved'),
        Field('games_played', FieldType.INTEGER, default=0, description='Total games completed'),
        Field('created_at', FieldType.TIMESTAMP, required=True, description='Creation time'),
        Field('linked_at', FieldType.TIMESTAMP, description='When both partners joined'),
        Field('last_interaction', FieldType.TIMESTAMP, description='Last activity'),
        Field('unlinked_at', FieldType.TIMESTAMP, description='When unlinked'),
        Field('unlinked_by', FieldType.STRING, description='User who initiated unlink'),
        Field('goals', FieldType.ARRAY, default=[], description='Relationship goals'),
        Field('milestones', FieldType.ARRAY, default=[], description='Achieved milestones'),
    ],
    indexes=[
        ['user1_id'],
        ['user2_id'],
        ['invite_code'],
        ['status'],
        ['total_points'],
    ]
)

GAME_SESSIONS_COLLECTION = Collection(
    name='game_sessions',
    description='Active and completed game sessions',
    fields=[
        Field('id', FieldType.STRING, required=True, description='Session ID'),
        Field('user_id', FieldType.STRING, required=True, index=True, description='Player ID'),
        Field('couple_id', FieldType.STRING, index=True, description='Couple ID'),
        Field('game_id', FieldType.STRING, required=True, index=True, description='Game type ID'),
        Field('category_id', FieldType.STRING, required=True, index=True, description='Game category'),
        Field('status', FieldType.STRING, default='active', description='Session status'),
        Field('started_at', FieldType.TIMESTAMP, required=True, description='Start time'),
        Field('completed_at', FieldType.TIMESTAMP, description='Completion time'),
        Field('timeout_at', FieldType.TIMESTAMP, description='Auto-timeout time'),
        Field('score', FieldType.INTEGER, default=0, description='Final score'),
        Field('responses', FieldType.ARRAY, default=[], description='Player answers'),
        Field('game_state', FieldType.MAP, default={}, description='Game-specific state'),
        Field('partner_progress', FieldType.MAP, description='Partner sync data'),
        Field('achievements', FieldType.ARRAY, default=[], description='Earned achievements'),
        Field('metadata', FieldType.MAP, default={}, description='Additional metadata'),
        Field('device_info', FieldType.MAP, description='Client device info'),
    ],
    indexes=[
        ['user_id', 'created_at'],
        ['couple_id', 'completed'],
        ['game_id', 'score'],
        ['category_id'],
        ['status'],
    ]
)

ANSWERS_COLLECTION = Collection(
    name='answers',
    description='Individual question answers',
    fields=[
        Field('id', FieldType.STRING, required=True, description='Answer ID'),
        Field('session_id', FieldType.STRING, required=True, index=True, description='Game session ID'),
        Field('user_id', FieldType.STRING, required=True, index=True, description='Player ID'),
        Field('question_id', FieldType.STRING, required=True, description='Question identifier'),
        Field('answer', FieldType.MAP, required=True, description='Answer data'),
        Field('is_correct', FieldType.BOOLEAN, description='Correctness flag'),
        Field('points_earned', FieldType.INTEGER, default=0, description='Points for this answer'),
        Field('time_spent_ms', FieldType.INTEGER, description='Time to answer'),
        Field('submitted_at', FieldType.TIMESTAMP, required=True, description='Submission time'),
        Field('metadata', FieldType.MAP, default={}, description='Additional context'),
    ],
    indexes=[
        ['session_id'],
        ['user_id', 'submitted_at'],
    ]
)

LEADERBOARDS_COLLECTION = Collection(
    name='leaderboards',
    description='Cached leaderboard data',
    fields=[
        Field('id', FieldType.STRING, required=True, description='Leaderboard ID'),
        Field('type', FieldType.STRING, required=True, description='Leaderboard type'),
        Field('period', FieldType.STRING, required=True, description='Time period'),
        Field('category', FieldType.STRING, description='Game category'),
        Field('entries', FieldType.ARRAY, required=True, description='Ranked entries'),
        Field('generated_at', FieldType.TIMESTAMP, required=True, description='Generation time'),
        Field('expires_at', FieldType.TIMESTAMP, description='Cache expiration'),
        Field('total_participants', FieldType.INTEGER, description='Total count'),
    ],
    indexes=[
        ['type', 'period'],
        ['expires_at'],
    ]
)

SOS_EVENTS_COLLECTION = Collection(
    name='sos_events',
    description='SOS crisis events',
    fields=[
        Field('id', FieldType.STRING, required=True, description='Event ID'),
        Field('user_id', FieldType.STRING, required=True, index=True, description='Triggering user'),
        Field('couple_id', FieldType.STRING, index=True, description='Couple context'),
        Field('status', FieldType.STRING, default='active', description='Event status'),
        Field('severity', FieldType.INTEGER, required=True, description='Severity 1-5'),
        Field('trigger', FieldType.STRING, description='What triggered it'),
        Field('triggered_at', FieldType.TIMESTAMP, required=True, description='Trigger time'),
        Field('resolved_at', FieldType.TIMESTAMP, description='Resolution time'),
        Field('escalated_at', FieldType.TIMESTAMP, description='Escalation time'),
        Field('resolved_by', FieldType.STRING, description='Resolver user ID'),
        Field('resolution_notes', FieldType.STRING, description='Resolution details'),
        Field('used_resources', FieldType.ARRAY, default=[], description='Resources accessed'),
        Field('booth_submissions', FieldType.MAP, default={}, description='Iceberg method data'),
        Field('location', FieldType.STRING, description='Geographic location'),
        Field('ip_address', FieldType.STRING, description='Client IP'),
    ],
    indexes=[
        ['user_id', 'triggered_at'],
        ['couple_id'],
        ['status'],
    ]
)

ANALYTICS_EVENTS_COLLECTION = Collection(
    name='analytics_events',
    description='Telemetry and analytics data',
    fields=[
        Field('id', FieldType.STRING, required=True, description='Event ID'),
        Field('event_type', FieldType.STRING, required=True, index=True, description='Event category'),
        Field('user_id', FieldType.STRING, index=True, description='User context'),
        Field('couple_id', FieldType.STRING, index=True, description='Couple context'),
        Field('session_id', FieldType.STRING, index=True, description='Session context'),
        Field('game_id', FieldType.STRING, index=True, description='Game context'),
        Field('category_id', FieldType.STRING, index=True, description='Category context'),
        Field('properties', FieldType.MAP, default={}, description='Event properties'),
        Field('timestamp', FieldType.TIMESTAMP, required=True, description='Event time'),
        Field('platform', FieldType.STRING, description='Client platform'),
        Field('app_version', FieldType.STRING, description='App version'),
        Field('device_id', FieldType.STRING, description='Anonymous device ID'),
    ],
    indexes=[
        ['event_type', 'timestamp'],
        ['user_id', 'timestamp'],
        ['timestamp'],
    ]
)

AI_CONVERSATIONS_COLLECTION = Collection(
    name='ai_conversations',
    description='Dr. Marcie conversation history',
    fields=[
        Field('id', FieldType.STRING, required=True, description='Conversation ID'),
        Field('user_id', FieldType.STRING, required=True, index=True, description='User'),
        Field('session_id', FieldType.STRING, index=True, description='Game session link'),
        Field('sarcasm_level', FieldType.INTEGER, description='Personality level'),
        Field('messages', FieldType.ARRAY, required=True, description='Message history'),
        Field('context', FieldType.STRING, description='Game/crisis context'),
        Field('emotion_signals', FieldType.MAP, description='Detected emotions'),
        Field('started_at', FieldType.TIMESTAMP, required=True, description='Start time'),
        Field('last_message_at', FieldType.TIMESTAMP, description='Last activity'),
        Field('summary', FieldType.STRING, description='AI-generated summary'),
    ],
    indexes=[
        ['user_id', 'started_at'],
        ['session_id'],
    ]
)


class Schema:
    """Schema manager"""
    
    COLLECTIONS = [
        USERS_COLLECTION,
        COUPLES_COLLECTION,
        GAME_SESSIONS_COLLECTION,
        ANSWERS_COLLECTION,
        LEADERBOARDS_COLLECTION,
        SOS_EVENTS_COLLECTION,
        ANALYTICS_EVENTS_COLLECTION,
        AI_CONVERSATIONS_COLLECTION,
    ]
    
    @classmethod
    def get_collection(cls, name: str) -> Optional[Collection]:
        """Get collection by name"""
        for collection in cls.COLLECTIONS:
            if collection.name == name:
                return collection
        return None
    
    @classmethod
    def validate_document(cls, collection_name: str, data: Dict) -> List[str]:
        """Validate document against schema"""
        errors = []
        collection = cls.get_collection(collection_name)
        
        if not collection:
            errors.append(f'Unknown collection: {collection_name}')
            return errors
        
        field_map = {f.name: f for f in collection.fields}
        
        # Check required fields
        for field in collection.fields:
            if field.required and field.name not in data:
                errors.append(f'Missing required field: {field.name}')
        
        # Check for unknown fields
        for key in data.keys():
            if key not in field_map:
                errors.append(f'Unknown field: {key}')
        
        return errors
