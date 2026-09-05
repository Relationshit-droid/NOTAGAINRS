"""
Pytest configuration and shared fixtures.

The backend is imported here so that tests run against the REAL application
contract (same server module, same routers, same guards) rather than mocks.

Environment is pinned *before* `server` is imported so the no-Firestore path is
taken deterministically in CI/local runs:
  - SKIP_FIREBASE=1  -> Firestore is not required; endpoints that need the DB
                        return 503 "Database not available" (the real contract).
  - JWT_SECRET        -> a stable, >=32-char secret so locally-signed JWTs are
                        deterministic across test runs.
"""

import os

os.environ.setdefault("SKIP_FIREBASE", "1")
os.environ.setdefault("JWT_SECRET", "test-secret-key-0123456789abcdef0123456789abcdef")
os.environ.setdefault("ENVIRONMENT", "development")
os.environ.setdefault("REDIS_URL", "")  # force in-memory rate limiter

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import pytest
from fastapi.testclient import TestClient

from server import app
from security import create_jwt_token


@pytest.fixture(scope="module")
def client():
    """A FastAPI TestClient for the real application."""
    with TestClient(app) as c:
        yield c


def make_auth_headers(user_id: str, email: str | None = None) -> dict:
    """Build an Authorization header carrying a valid, locally-signed JWT.

    Mirrors the client's local-JWT path (decode_bearer_token -> verify_jwt_token).
    """
    token = create_jwt_token(user_id, email or f"{user_id}@example.com")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers():
    """Factory fixture: auth_headers("user-123") -> {"Authorization": ...}."""
    return make_auth_headers
