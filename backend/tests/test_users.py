"""
User endpoints contract tests.

All /api/users endpoints (except /health) require authentication. Under
SKIP_FIREBASE=1 the DB-backed operations return 503, but the auth (401) and
self-only IDOR (403) guards run first and are fully exercisable.
"""

from fastapi.testclient import TestClient


def test_health_is_public(client: TestClient):
    response = client.get("/api/users/health")
    assert response.status_code == 200
    assert response.json()["service"] == "users"


def test_create_user_requires_auth(client: TestClient):
    response = client.post("/api/users/", json={"email": "a@b.com", "display_name": "Bob"})
    assert response.status_code == 401


def test_list_users_requires_auth(client: TestClient):
    assert client.get("/api/users/").status_code == 401


def test_get_user_requires_auth(client: TestClient):
    assert client.get("/api/users/some-id").status_code == 401


def test_update_user_requires_auth(client: TestClient):
    response = client.put("/api/users/some-id", json={"display_name": "Bob"})
    assert response.status_code == 401


def test_delete_user_requires_auth(client: TestClient):
    assert client.delete("/api/users/some-id").status_code == 401


def test_create_user_rejects_invalid_email(client: TestClient, auth_headers):
    """Email format is validated before any database access."""
    response = client.post(
        "/api/users/",
        headers=auth_headers("u1"),
        json={"email": "not-an-email", "display_name": "Bob"},
    )
    assert response.status_code == 400


def test_create_user_requires_database(client: TestClient, auth_headers):
    response = client.post(
        "/api/users/",
        headers=auth_headers("u1"),
        json={"email": "bob@example.com", "display_name": "Bob"},
    )
    assert response.status_code == 503
    assert response.json()["detail"] == "Database not available"


def test_get_self_requires_database(client: TestClient, auth_headers):
    response = client.get("/api/users/u1", headers=auth_headers("u1"))
    assert response.status_code == 503


def test_get_other_user_is_forbidden(client: TestClient, auth_headers):
    """IDOR guard: a user cannot read another user's record."""
    response = client.get("/api/users/other-user", headers=auth_headers("u1"))
    assert response.status_code == 403


def test_update_other_user_is_forbidden(client: TestClient, auth_headers):
    response = client.put(
        "/api/users/other-user",
        headers=auth_headers("u1"),
        json={"display_name": "Bob"},
    )
    assert response.status_code == 403


def test_update_self_requires_database(client: TestClient, auth_headers):
    response = client.put(
        "/api/users/u1",
        headers=auth_headers("u1"),
        json={"display_name": "Bob"},
    )
    assert response.status_code == 503


def test_delete_self_requires_database(client: TestClient, auth_headers):
    response = client.delete("/api/users/u1", headers=auth_headers("u1"))
    assert response.status_code == 503


def test_sarcasm_update_uses_json_body(client: TestClient, auth_headers):
    """The sarcasm endpoint takes a JSON body {level: 1-4}, not a query param."""
    response = client.put(
        "/api/users/u1/sarcasm",
        headers=auth_headers("u1"),
        json={"level": 3},
    )
    assert response.status_code == 503  # guarded, then DB-unavailable

    # A query-param style call is rejected by validation.
    response = client.put(
        "/api/users/u1/sarcasm?level=3",
        headers=auth_headers("u1"),
    )
    assert response.status_code == 422


def test_sarcasm_level_out_of_range_is_rejected(client: TestClient, auth_headers):
    response = client.put(
        "/api/users/u1/sarcasm",
        headers=auth_headers("u1"),
        json={"level": 5},
    )
    assert response.status_code == 422


def test_preferences_get_requires_database(client: TestClient, auth_headers):
    # Under SKIP_FIREBASE this endpoint reports the user as not found (404).
    response = client.get("/api/users/u1/preferences", headers=auth_headers("u1"))
    assert response.status_code == 404


def test_stats_require_auth(client: TestClient):
    assert client.get("/api/users/u1/stats").status_code == 401
