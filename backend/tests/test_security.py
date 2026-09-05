"""
Security regression tests: auth enforcement, IDOR guards, and rate limiting.

- Every protected route must return 401 without a bearer token.
- The brute-forceable endpoints (register/login/join) must be wired with the
  rate-limit dependency.
- The in-memory RateLimiter must block once its budget is exhausted.
"""

import pytest
from fastapi.testclient import TestClient

from server import app
from security import RateLimiter

# (method, path) for every route that depends on require_auth / admin / moderator.
PROTECTED_ROUTES = [
    # users
    ("POST", "/api/users/"),
    ("GET", "/api/users/"),
    ("GET", "/api/users/u1"),
    ("PUT", "/api/users/u1"),
    ("DELETE", "/api/users/u1"),
    ("POST", "/api/users/u1/login"),
    ("GET", "/api/users/u1/preferences"),
    ("PUT", "/api/users/u1/preferences"),
    ("POST", "/api/users/u1/report"),
    ("PUT", "/api/users/u1/sarcasm"),
    ("GET", "/api/users/u1/stats"),
    ("PUT", "/api/users/u1/stats"),
    # couples
    ("POST", "/api/couples/create"),
    ("POST", "/api/couples/join"),
    ("GET", "/api/couples/me"),
    ("POST", "/api/couples/regenerate-code"),
    ("POST", "/api/couples/unlink"),
    ("GET", "/api/couples/c1"),
    ("PUT", "/api/couples/c1/meters"),
    ("PUT", "/api/couples/c1/origin-story"),
    ("GET", "/api/couples/c1/presence"),
    ("GET", "/api/couples/c1/stats"),
    # games
    ("GET", "/api/games/couples/c1/sessions"),
    ("POST", "/api/games/sessions"),
    ("GET", "/api/games/sessions/s1"),
    ("PUT", "/api/games/sessions/s1"),
    ("POST", "/api/games/sessions/s1/answers"),
    ("POST", "/api/games/sessions/s1/complete"),
    ("GET", "/api/games/users/u1/sessions"),
    # sos
    ("GET", "/api/sos/couples/c1/sessions"),
    ("POST", "/api/sos/sessions"),
    ("GET", "/api/sos/sessions/s1"),
    ("POST", "/api/sos/sessions/s1/analyze"),
    ("POST", "/api/sos/sessions/s1/repair/complete"),
    ("POST", "/api/sos/sessions/s1/submit"),
    ("POST", "/api/sos/sessions/s1/verdict"),
    # ai / marcie
    ("POST", "/api/marcie/chat"),
    ("POST", "/api/ai/marcie"),
    ("GET", "/api/ai/marcie/conversation/c1"),
    ("POST", "/api/ai/marcie/conversation/c1/clear"),
    # admin
    ("GET", "/api/admin/dashboard"),
    ("GET", "/api/admin/users"),
    ("GET", "/api/admin/metrics"),
    ("POST", "/api/admin/announcements"),
    ("GET", "/api/admin/announcements"),
    ("GET", "/api/admin/leaderboards/manage"),
    ("POST", "/api/admin/leaderboards/refresh"),
    ("GET", "/api/admin/sos-events"),
    ("GET", "/api/admin/sos-events/stats"),
    ("GET", "/api/admin/users/u1"),
    ("POST", "/api/admin/users/u1/ban"),
    ("POST", "/api/admin/users/u1/unban"),
    ("GET", "/api/admin/health"),
]


@pytest.mark.parametrize("method,path", PROTECTED_ROUTES)
def test_protected_route_requires_auth(client: TestClient, method: str, path: str):
    response = getattr(client, method.lower())(path)
    assert response.status_code == 401, f"{method} {path} returned {response.status_code}"


def test_admin_route_rejects_non_admin(client: TestClient, auth_headers):
    """A valid but non-admin token must not access admin routes."""
    response = client.get("/api/admin/dashboard", headers=auth_headers("normal-user"))
    assert response.status_code == 403


def _route_deps(path: str, method: str):
    for route in app.routes:
        methods = getattr(route, "methods", None) or set()
        if getattr(route, "path", None) == path and method in methods:
            return [d.call.__name__ for d in route.dependant.dependencies]
    return []


def test_rate_limit_wired_on_bruteforce_endpoints():
    """register/login/join must all enforce the rate-limit dependency."""
    assert "rate_limit" in _route_deps("/api/auth/register", "POST")
    assert "rate_limit" in _route_deps("/api/auth/login", "POST")
    assert "rate_limit" in _route_deps("/api/couples/join", "POST")


def test_rate_limiter_blocks_after_budget_exhausted():
    limiter = RateLimiter()
    identifier = "unit-test-identifier"
    for _ in range(3):
        allowed, _ = limiter.is_allowed(identifier, "global", max_requests=3, window=3600)
        assert allowed is True

    allowed, info = limiter.is_allowed(identifier, "global", max_requests=3, window=3600)
    assert allowed is False
    assert info["limit"] == 3
    assert info["remaining"] == 0
