"""
SOS (fight-resolution) contract tests.

There is NO `/api/sos/trigger` route (an old test suite asserted one). The real
endpoints are all under /api/sos/sessions and require authentication plus
couple membership.
"""

from fastapi.testclient import TestClient


def test_health(client: TestClient):
    response = client.get("/api/sos/health")
    assert response.status_code == 200
    assert response.json()["service"] == "sos"


def test_trigger_route_does_not_exist(client: TestClient):
    """Regression guard: the legacy /api/sos/trigger route was never real."""
    assert client.post("/api/sos/trigger", json={}).status_code == 404


def test_create_session_requires_auth(client: TestClient):
    response = client.post(
        "/api/sos/sessions",
        json={"initiator_id": "s1", "couple_id": "c1"},
    )
    assert response.status_code == 401


def test_create_session_rejects_caller_mismatch(client: TestClient, auth_headers):
    """The initiator_id must match the authenticated caller."""
    response = client.post(
        "/api/sos/sessions",
        headers=auth_headers("attacker"),
        json={"initiator_id": "victim", "couple_id": "c1"},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Forbidden"


def test_create_session_requires_membership(client: TestClient, auth_headers):
    """Under SKIP_FIREBASE=1 there is no Firestore couple record, so the
    membership check reports the caller is not a member."""
    response = client.post(
        "/api/sos/sessions",
        headers=auth_headers("s-member"),
        json={"initiator_id": "s-member", "couple_id": "c-unknown"},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Not a member of this couple"


def test_session_endpoints_require_auth(client: TestClient):
    session_id = "sos-123"
    assert client.get(f"/api/sos/sessions/{session_id}").status_code == 401
    assert client.post(f"/api/sos/sessions/{session_id}/submit", json={}).status_code == 401
    assert client.post(f"/api/sos/sessions/{session_id}/analyze", json={}).status_code == 401
    assert client.post(f"/api/sos/sessions/{session_id}/verdict", json={}).status_code == 401
    assert client.post(f"/api/sos/sessions/{session_id}/repair/complete", json={}).status_code == 401
    assert client.get("/api/sos/couples/c1/sessions").status_code == 401
