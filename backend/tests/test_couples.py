"""
Couple linking contract tests.

The couple endpoints run against the real in-memory fallback store under
SKIP_FIREBASE=1, so the full create -> join -> meters -> origin-story ->
regenerate -> unlink lifecycle is exercised end-to-end. Each test uses its own
user ids so module-global fallback state does not leak between tests.
"""

from fastapi.testclient import TestClient


def _create(client: TestClient, auth_headers, user_id: str):
    response = client.post(
        "/api/couples/create",
        headers=auth_headers(user_id),
        json={"user_id": user_id},
    )
    assert response.status_code == 200, response.text
    return response.json()


def test_create_requires_auth(client: TestClient):
    response = client.post("/api/couples/create", json={"user_id": "x"})
    assert response.status_code == 401


def test_me_requires_auth(client: TestClient):
    assert client.get("/api/couples/me", params={"user_id": "x"}).status_code == 401


def test_create_returns_couple_shape(client: TestClient, auth_headers):
    couple = _create(client, auth_headers, "ca-shape")
    assert couple["user1_id"] == "ca-shape"
    assert couple["user2_id"] is None
    assert couple["status"] == "pending"
    assert len(couple["invite_code"]) == 8
    # Meters default to neutral.
    assert couple["trust_meter"] == 0.5


def test_create_rejects_caller_mismatch(client: TestClient, auth_headers):
    """The caller's JWT uid must match the body user_id."""
    response = client.post(
        "/api/couples/create",
        headers=auth_headers("attacker"),
        json={"user_id": "victim"},
    )
    assert response.status_code == 403


def test_me_without_couple(client: TestClient, auth_headers):
    response = client.get(
        "/api/couples/me", headers=auth_headers("ca-no-couple"), params={"user_id": "ca-no-couple"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "none"
    assert data["partner"] is None


def test_cannot_create_twice(client: TestClient, auth_headers):
    _create(client, auth_headers, "ca-twice")
    response = client.post(
        "/api/couples/create",
        headers=auth_headers("ca-twice"),
        json={"user_id": "ca-twice"},
    )
    assert response.status_code == 400


def test_full_lifecycle(client: TestClient, auth_headers):
    """create -> me -> join -> me(partner) -> meters -> stats -> origin-story."""
    user_a, user_b = "ca-a", "ca-b"
    couple = _create(client, auth_headers, user_a)
    couple_id, code = couple["id"], couple["invite_code"]

    # Creator sees a pending couple with no partner.
    me = client.get(
        "/api/couples/me", headers=auth_headers(user_a), params={"user_id": user_a}
    ).json()
    assert me["status"] == "pending"
    assert me["partner"] is None

    # Members can read the couple by id; strangers cannot.
    assert client.get(f"/api/couples/{couple_id}", headers=auth_headers(user_a)).status_code == 200
    assert client.get(f"/api/couples/{couple_id}", headers=auth_headers("ca-stranger")).status_code == 403

    # Partner joins with the invite code.
    joined = client.post(
        "/api/couples/join",
        headers=auth_headers(user_b),
        json={"user_id": user_b, "invite_code": code},
    )
    assert joined.status_code == 200
    assert joined.json()["status"] == "active"
    assert joined.json()["user2_id"] == user_b

    # Partner now sees the creator as their partner.
    me_b = client.get(
        "/api/couples/me", headers=auth_headers(user_b), params={"user_id": user_b}
    ).json()
    assert me_b["status"] == "active"
    assert me_b["partner"]["id"] == user_a

    # Membership-restricted endpoints accept members.
    meters = client.put(
        f"/api/couples/{couple_id}/meters",
        headers=auth_headers(user_a),
        json={"trust_meter": 0.8},
    )
    assert meters.status_code == 200
    assert meters.json()["trust_meter"] == 0.8

    stats = client.get(f"/api/couples/{couple_id}/stats", headers=auth_headers(user_b))
    assert stats.status_code == 200
    assert stats.json()["couple_id"] == couple_id

    presence = client.get(f"/api/couples/{couple_id}/presence", headers=auth_headers(user_a))
    assert presence.status_code == 200
    assert presence.json()["couple_id"] == couple_id

    origin = client.put(
        f"/api/couples/{couple_id}/origin-story",
        headers=auth_headers(user_a),
        json={
            "user_id": user_a,
            "origin_story": {
                "meet_cute": "at a cafe",
                "first_impression": "chaotic",
                "turning_point": "the trip",
                "current_status": "thriving",
            },
        },
    )
    assert origin.status_code == 200
    assert origin.json()["origin_story"]["meet_cute"] == "at a cafe"


def test_meters_reject_invalid_value(client: TestClient, auth_headers):
    user = "ca-meters"
    couple = _create(client, auth_headers, user)
    response = client.put(
        f"/api/couples/{couple['id']}/meters",
        headers=auth_headers(user),
        json={"trust_meter": 1.5},
    )
    assert response.status_code == 400


def test_meters_reject_unknown_key(client: TestClient, auth_headers):
    user = "ca-meters-unknown"
    couple = _create(client, auth_headers, user)
    response = client.put(
        f"/api/couples/{couple['id']}/meters",
        headers=auth_headers(user),
        json={"bogus_meter": 0.5},
    )
    assert response.status_code == 400


def test_join_rejects_invalid_code(client: TestClient, auth_headers):
    response = client.post(
        "/api/couples/join",
        headers=auth_headers("ca-badcode"),
        json={"user_id": "ca-badcode", "invite_code": "ZZZZZZZZ"},
    )
    assert response.status_code == 404


def test_join_rejects_short_code(client: TestClient, auth_headers):
    response = client.post(
        "/api/couples/join",
        headers=auth_headers("ca-shortcode"),
        json={"user_id": "ca-shortcode", "invite_code": "ABC"},
    )
    assert response.status_code == 422


def test_regenerate_code_while_pending(client: TestClient, auth_headers):
    user = "ca-regen"
    couple = _create(client, auth_headers, user)
    response = client.post(
        "/api/couples/regenerate-code",
        headers=auth_headers(user),
        json={"user_id": user},
    )
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["invite_code"] != couple["invite_code"]


def test_unlink(client: TestClient, auth_headers):
    user = "ca-unlink"
    _create(client, auth_headers, user)
    response = client.post(
        "/api/couples/unlink",
        headers=auth_headers(user),
        json={"user_id": user},
    )
    assert response.status_code == 200
    assert response.json()["success"] is True
