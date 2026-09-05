"""
Authentication contract tests.

`/api/auth/register` and `/api/auth/login` require Firestore, so under
SKIP_FIREBASE=1 (CI/local) they return 503 "Database not available" — that is
the real, expected behaviour and what we assert here. Pydantic-level validation
(422) still happens before any DB work, and the unauthenticated endpoints
(logout / reset-password / health) are fully exercisable.
"""

from fastapi.testclient import TestClient

VALID_REGISTER = {
    "email": "new@example.com",
    "password": "password123",
    "display_name": "Test User",
}
VALID_LOGIN = {"email": "new@example.com", "password": "password123"}


def test_register_requires_database(client: TestClient):
    """Register cannot proceed without Firestore."""
    response = client.post("/api/auth/register", json=VALID_REGISTER)
    assert response.status_code == 503
    assert response.json()["detail"] == "Database not available"


def test_register_validation_missing_fields(client: TestClient):
    response = client.post("/api/auth/register", json={"email": "new@example.com"})
    assert response.status_code == 422


def test_register_validation_short_password(client: TestClient):
    body = dict(VALID_REGISTER, password="short")
    response = client.post("/api/auth/register", json=body)
    assert response.status_code == 422


def test_register_validation_bad_display_name(client: TestClient):
    body = dict(VALID_REGISTER, display_name="X")  # min_length=2
    response = client.post("/api/auth/register", json=body)
    assert response.status_code == 422


def test_login_requires_database(client: TestClient):
    response = client.post("/api/auth/login", json=VALID_LOGIN)
    assert response.status_code == 503
    assert response.json()["detail"] == "Database not available"


def test_login_validation_missing_password(client: TestClient):
    response = client.post("/api/auth/login", json={"email": "new@example.com"})
    assert response.status_code == 422


def test_logout(client: TestClient):
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_reset_password_is_idempotent(client: TestClient):
    response = client.post("/api/auth/reset-password", json={"email": "new@example.com"})
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_auth_health(client: TestClient):
    response = client.get("/api/auth/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "auth"
    # No Firestore -> reported as unavailable.
    assert data["database"] == "unavailable"
