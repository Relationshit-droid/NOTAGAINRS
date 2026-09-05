"""
Health & meta endpoint tests.

These endpoints are unauthenticated and require no database, so they are
exercised against the exact response shapes the server produces.
"""

from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    """GET /api/health returns the real HealthResponse shape.

    Note: the response has NO "firebase" key. That field only exists on
    /api/health/detailed (components.firebase) and /api/auth/health.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "2.0.0"
    assert "timestamp" in data


def test_detailed_health(client: TestClient):
    response = client.get("/api/health/detailed")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    # With SKIP_FIREBASE=1 the Firestore component reports "fallback".
    assert data["components"]["firebase"] in ("fallback", "connected")


def test_ping(client: TestClient):
    response = client.get("/api/ping")
    assert response.status_code == 200
    assert response.json()["status"] == "pong"


def test_version(client: TestClient):
    response = client.get("/api/version")
    assert response.status_code == 200
    assert response.json()["version"] == "2.0.0"


def test_info(client: TestClient):
    response = client.get("/api/info")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert "auth" in data["features"]


def test_config(client: TestClient):
    response = client.get("/api/config")
    assert response.status_code == 200
    data = response.json()
    # JSON object keys are strings.
    assert set(data["sarcasm_levels"].keys()) == {"1", "2", "3", "4"}


def test_ready(client: TestClient):
    response = client.get("/api/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["ready"] is True
    # Database check is False under SKIP_FIREBASE=1.
    assert data["checks"]["database"] is False


def test_system_status(client: TestClient):
    response = client.get("/api/system/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["database"] == "fallback"


def test_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert any("GET /api/health" in endpoint for endpoint in data["endpoints"])


def test_service_health_endpoints(client: TestClient):
    """Each service exposes its own /health with a database indicator."""
    for path in ("/api/auth/health", "/api/games/health", "/api/sos/health", "/api/users/health"):
        response = client.get(path)
        assert response.status_code == 200, path
        data = response.json()
        assert data["status"] == "healthy"
        assert "database" in data, path
