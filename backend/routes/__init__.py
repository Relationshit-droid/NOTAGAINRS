"""
Routes Package
Exports all route modules
"""

from .couples import router as couples_router
from .sos import router as sos_router
from .leaderboards import router as leaderboards_router
from .ai_marcie import router as ai_marcie_router
from .analytics import router as analytics_router
from .scoring import router as scoring_router

__all__ = [
    'couples_router',
    'sos_router', 
    'leaderboards_router',
    'ai_marcie_router',
    'analytics_router',
    'scoring_router',
]
