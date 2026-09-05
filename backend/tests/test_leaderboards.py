"""
Leaderboard contract tests.

The leaderboards are mock-backed and public (no auth), so their exact response
shapes are asserted. Both the plural /api/leaderboards and the singular
compatibility router /api/leaderboard are exercised.
"""

from fastapi.testclient import TestClient


def test_global_leaderboard_shape(client: TestClient):
    response = client.get("/api/leaderboards/global")
    assert response.status_code == 200
    data = response.json()
    assert set(data.keys()) == {
        "time_period",
        "total_entries",
        "offset",
        "limit",
        "has_more",
        "leaderboard",
        "generated_at",
    }
    assert data["time_period"] == "all_time"
    assert data["total_entries"] > 0
    assert len(data["leaderboard"]) > 0

    entry = data["leaderboard"][0]
    assert {"rank", "couple_id", "partner_names", "total_score"} <= set(entry.keys())


def test_global_leaderboard_validates_limit(client: TestClient):
    assert client.get("/api/leaderboards/global?limit=0").status_code == 400
    assert client.get("/api/leaderboards/global?limit=9999").status_code == 400


def test_global_leaderboard_validates_time_period(client: TestClient):
    assert client.get("/api/leaderboards/global?time_period=bogus").status_code == 400


def test_compat_router_global(client: TestClient):
    """The singular /api/leaderboard/global compatibility route still works."""
    response = client.get("/api/leaderboard/global")
    assert response.status_code == 200
    assert "leaderboard" in response.json()


def test_category_leaderboard_shape(client: TestClient):
    response = client.get("/api/leaderboards/categories/emotional-connection")
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "emotional-connection"
    assert "leaderboard" in data
    assert "category_stats" in data


def test_category_leaderboard_unknown(client: TestClient):
    response = client.get("/api/leaderboards/categories/not-a-category")
    assert response.status_code == 404


def test_couple_ranking_shape(client: TestClient):
    response = client.get("/api/leaderboards/couples/couple_1/ranking")
    assert response.status_code == 200
    data = response.json()
    assert data["couple"]["couple_id"] == "couple_1"
    assert "nearby_competitors" in data
    assert "percentile" in data
