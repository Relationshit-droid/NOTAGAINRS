"""
Redis Cache Integration
Session cache and distributed locking
"""

import os
import json
import pickle
from typing import Optional, Any, Union
from functools import wraps
import hashlib

# Redis client
try:
    import redis
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    redis_client = redis.from_url(REDIS_URL, decode_responses=False)
    # Test connection
    redis_client.ping()
    REDIS_AVAILABLE = True
except Exception as e:
    print(f"Redis not available: {e}")
    redis_client = None
    REDIS_AVAILABLE = False


class Cache:
    """Cache wrapper with fallback to in-memory"""
    
    def __init__(self):
        self.memory_cache: dict = {}
        self.default_ttl = 300  # 5 minutes
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if REDIS_AVAILABLE:
            try:
                data = redis_client.get(key)
                if data:
                    return pickle.loads(data)
            except Exception as e:
                print(f"Redis get error: {e}")
        
        # Fallback to memory
        return self.memory_cache.get(key)
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set value in cache"""
        ttl = ttl or self.default_ttl
        
        if REDIS_AVAILABLE:
            try:
                serialized = pickle.dumps(value)
                redis_client.setex(key, ttl, serialized)
                return True
            except Exception as e:
                print(f"Redis set error: {e}")
        
        # Fallback to memory
        self.memory_cache[key] = value
        return True
    
    def delete(self, key: str) -> bool:
        """Delete value from cache"""
        if REDIS_AVAILABLE:
            try:
                redis_client.delete(key)
            except Exception as e:
                print(f"Redis delete error: {e}")
        
        self.memory_cache.pop(key, None)
        return True
    
    def exists(self, key: str) -> bool:
        """Check if key exists"""
        if REDIS_AVAILABLE:
            try:
                return redis_client.exists(key) > 0
            except Exception as e:
                print(f"Redis exists error: {e}")
        
        return key in self.memory_cache
    
    def increment(self, key: str, amount: int = 1) -> int:
        """Increment counter"""
        if REDIS_AVAILABLE:
            try:
                return redis_client.incrby(key, amount)
            except Exception as e:
                print(f"Redis increment error: {e}")
        
        current = self.memory_cache.get(key, 0)
        new_value = current + amount
        self.memory_cache[key] = new_value
        return new_value
    
    def expire(self, key: str, ttl: int) -> bool:
        """Set expiration on key"""
        if REDIS_AVAILABLE:
            try:
                return redis_client.expire(key, ttl)
            except Exception as e:
                print(f"Redis expire error: {e}")
        return True
    
    def clear_pattern(self, pattern: str) -> int:
        """Clear all keys matching pattern"""
        count = 0
        
        if REDIS_AVAILABLE:
            try:
                for key in redis_client.scan_iter(match=pattern):
                    redis_client.delete(key)
                    count += 1
            except Exception as e:
                print(f"Redis clear pattern error: {e}")
        
        # Clear from memory too
        keys_to_delete = [k for k in self.memory_cache.keys() if pattern in k or pattern == "*"]
        for k in keys_to_delete:
            del self.memory_cache[k]
            count += 1
        
        return count


# Global cache instance
cache = Cache()


def cached(ttl: int = 300, key_prefix: str = ""):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:"
            cache_key += hashlib.md5(
                str(args).encode() + str(kwargs).encode()
            ).hexdigest()
            
            # Try to get from cache
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # Call function
            result = await func(*args, **kwargs)
            
            # Store in cache
            cache.set(cache_key, result, ttl)
            
            return result
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            cache_key = f"{key_prefix}:{func.__name__}:"
            cache_key += hashlib.md5(
                str(args).encode() + str(kwargs).encode()
            ).hexdigest()
            
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            
            return result
        
        return async_wrapper if func.__code__.co_flags & 0x80 else sync_wrapper
    return decorator


def invalidate_cache(key_prefix: str):
    """Invalidate all cache entries with given prefix"""
    return cache.clear_pattern(f"{key_prefix}:*")


# Session cache helpers
class SessionCache:
    """Game session caching"""
    
    @staticmethod
    def get_session(session_id: str) -> Optional[dict]:
        return cache.get(f"session:{session_id}")
    
    @staticmethod
    def set_session(session_id: str, data: dict, ttl: int = 7200):
        return cache.set(f"session:{session_id}", data, ttl)
    
    @staticmethod
    def delete_session(session_id: str):
        return cache.delete(f"session:{session_id}")
    
    @staticmethod
    def update_session_field(session_id: str, field: str, value: Any):
        session = SessionCache.get_session(session_id)
        if session:
            session[field] = value
            SessionCache.set_session(session_id, session)
            return True
        return False


# Leaderboard cache helpers
class LeaderboardCache:
    """Leaderboard caching"""
    
    @staticmethod
    def get_leaderboard(period: str) -> Optional[list]:
        return cache.get(f"leaderboard:{period}")
    
    @staticmethod
    def set_leaderboard(period: str, data: list, ttl: int = 300):
        return cache.set(f"leaderboard:{period}", data, ttl)
    
    @staticmethod
    def invalidate():
        return cache.clear_pattern("leaderboard:*")


# User presence cache
class PresenceCache:
    """User online presence tracking"""
    
    @staticmethod
    def set_online(user_id: str, couple_id: str, ttl: int = 60):
        return cache.set(f"presence:{couple_id}:{user_id}", {
            "user_id": user_id,
            "online_at": cache.get(f"presence:{couple_id}:{user_id}", {}).get("online_at", cache.increment("timestamp"))
        }, ttl)
    
    @staticmethod
    def is_online(user_id: str, couple_id: str) -> bool:
        return cache.exists(f"presence:{couple_id}:{user_id}")
    
    @staticmethod
    def get_online_users(couple_id: str) -> list:
        # This would require Redis scan in production
        return []
