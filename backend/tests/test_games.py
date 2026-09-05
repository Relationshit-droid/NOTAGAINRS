"""
Games catalog & session contract tests.

Catalog endpoints are public and read the generated game_catalog.json, so they
are asserted against the real totals. Session endpoints require authentication
and fall back to an in-memory store under SKIP_FIREBASE=1.
"""

from fastapi.testclient import TestClient

CATEGORY_COUNT = 7
TOTAL_GAMES = 80


def test_categories(client: TestClient):
    response = client.get("/api/games/categories")
    assert response.status_code == 200
    categories = response.json()["categories"]
    assert len(categories) == CATEGORY_COUNT
    for category in categories:
        assert set(category.keys()) >= {"id", "name", "icon", "color", "games"}


def test_category_detail(client: TestClient):
    response = client.get("/api/games/categories/emotional-connection")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "emotional-connection"
    assert len(data["games_detail"]) == len(data["games"])


def test_category_not_found(client: TestClient):
    response = client.get("/api/games/categories/does-not-exist")
    assert response.status_code == 404


def test_registry(client: TestClient):
    response = client.get("/api/games/registry")
    assert response.status_code == 200
    data = response.json()
    assert data["total_games"] == TOTAL_GAMES
    assert data["categories"] == CATEGORY_COUNT
    assert isinstance(data["games"], dict)


def test_game_detail_metadata(client: TestClient):
    response = client.get("/api/games/any-game-id")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "any-game-id"
    assert "max_score" in data


def test_love_arcade_games(client: TestClient):
    response = client.get("/api/love-arcade/games")
    assert response.status_code == 200
    games = response.json()["games"]
    assert len(games) == 6
    assert all(g["id"] for g in games)


def test_love_arcade_questions(client: TestClient):
    games = client.get("/api/love-arcade/games").json()["games"]
    game_id = games[0]["id"]
    response = client.get(f"/api/love-arcade/games/{game_id}/questions")
    assert response.status_code == 200
    data = response.json()
    assert data["game_id"] == game_id
    assert data["total_questions"] == 0  # content is authored client-side


def test_love_arcade_questions_unknown_game(client: TestClient):
    response = client.get("/api/love-arcade/games/nope/questions")
    assert response.status_code == 404


def test_create_session_requires_auth(client: TestClient):
    response = client.post(
        "/api/games/sessions",
        json={"user_id": "g1", "game_id": "g", "category_id": "c"},
    )
    assert response.status_code == 401


def test_session_lifecycle(client: TestClient, auth_headers):
    user = "ga-user"
    created = client.post(
        "/api/games/sessions",
        headers=auth_headers(user),
        json={"user_id": user, "game_id": "truth-or-trust", "category_id": "emotional-connection"},
    )
    assert created.status_code == 200, created.text
    session = created.json()
    session_id = session["id"]
    assert session["completed"] is False
    assert session["status"] == "active"

    fetched = client.get(f"/api/games/sessions/{session_id}", headers=auth_headers(user))
    assert fetched.status_code == 200
    assert fetched.json()["id"] == session_id

    updated = client.put(
        f"/api/games/sessions/{session_id}",
        headers=auth_headers(user),
        json={"score": 50},
    )
    assert updated.status_code == 200
    assert updated.json()["score"] == 50.0

    answer = client.post(
        f"/api/games/sessions/{session_id}/answers",
        headers=auth_headers(user),
        json={"user_id": user, "question_id": "q1", "answer": "yes"},
    )
    assert answer.status_code == 200
    assert answer.json()["points_earned"] == 10

    completed = client.post(
        f"/api/games/sessions/{session_id}/complete",
        headers=auth_headers(user),
        json={"final_score": 120},
    )
    assert completed.status_code == 200
    assert completed.json()["completed"] is True
    assert completed.json()["status"] == "completed"


def test_create_session_rejects_caller_mismatch(client: TestClient, auth_headers):
    response = client.post(
        "/api/games/sessions",
        headers=auth_headers("attacker"),
        json={"user_id": "victim", "game_id": "g", "category_id": "c"},
    )
    assert response.status_code == 403


def test_user_sessions_list(client: TestClient, auth_headers):
    user = "ga-list"
    client.post(
        "/api/games/sessions",
        headers=auth_headers(user),
        json={"user_id": user, "game_id": "g", "category_id": "c"},
    )
    response = client.get(f"/api/games/users/{user}/sessions", headers=auth_headers(user))
    assert response.status_code == 200
    assert response.json()["count"] >= 1
