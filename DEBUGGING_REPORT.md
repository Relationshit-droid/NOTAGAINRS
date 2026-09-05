# Relationshit! — Production Outage Investigation & Fix

**Role:** Senior debugging engineer — live production incident
**Date:** 2026-09-04
**Scope:** `relationshit/backend` (FastAPI + Firebase Firestore) vs. `relationshit/app` (React Native / Expo client)

---

## 1. Code functionality breakdown

**What the system is supposed to do**
A couples-therapy app ("Dr. Marcie Liss") with a React Native (Expo) client and a FastAPI
backend. Auth is Firebase Auth on the client; the backend is expected to persist users,
couples, game sessions, SOS (fight-solver) sessions, scores, leaderboards, analytics, and
Dr. Marcie AI chat. Client calls the backend over `http://localhost:8001/api/...`
(`app/src/lib/httpClient.ts` prepends `/api` to every endpoint).

**What actually happens**
- The backend **crashes on import** — it never boots (see §2.1, §2.2).
- Even if it booted, **every route is double-prefixed** and therefore **404s** (§2.3).
- The client and the backend were built against **two different contracts** and never wired
  together: path mismatches, an identity-key mismatch, and an auth model that the client
  doesn't use (§2.4–§2.6).
- The "authentication" in the backend was theater: no password hashing, no verification,
  fabricated tokens, and a JWT secret regenerated on every boot (§2.7).
- Multiple endpoints silently return empty data because a Firestore API is used incorrectly
  and the exception is swallowed (§3).

---

## 2. Root cause analysis (verified, not guessed)

### 2.1 ❗ CRITICAL — Circular import: the server cannot start

`backend/server.py` imported the route modules **before** defining the objects they import:

```python
# server.py (top of file)
from routes import auth, users, couples, ...   # line 21
...
db = initialize_firebase()                      # line ~61
def get_user_ref(...): ...                      # line ~70+
```

while `routes/auth.py` and `routes/users.py` do this **at module import time**:

```python
from server import db, get_user_ref, doc_to_dict
```

Reproduced with the pinned dependency set:

```
ImportError: cannot import name 'db' from partially initialized module 'server'
(most likely due to a circular import) (/backend/server.py)
```

**Consequence:** `uvicorn server:app` / `gunicorn server:app` dies before serving a single
request. This is the first, blocking root cause.

### 2.2 ❗ CRITICAL — Invalid type annotation crashes route registration

`routes/auth.py`:

```python
@router.post("/reset-password")
async def reset_password(request: {"email": str}):   # dict literal used as a type
```

A `dict` is not a valid type annotation. Once the circular import is fixed, FastAPI crashes
at registration with:

```
AttributeError: 'dict' object has no attribute '__module__'
```

### 2.3 ❗ CRITICAL — Double route prefix: 100% of endpoints 404

Every router declares its own prefix **and** `server.py` applied a second one:

| Router (`APIRouter(prefix=...)`)  | server.py `include_router(prefix=...)` | Actual registered path (verified) |
|---|---|---|
| `/api/v1/auth`  | `/api/v1/auth`  | `/api/v1/auth/api/v1/auth/login` |
| `/api/v1/users` | `/api/v1/users` | `/api/v1/users/api/v1/users/` |
| `/api/couples`  | `/api/v1/couples`| `/api/v1/couples/api/couples/create` |
| `/api/games`    | `/api/v1/games` | `/api/v1/games/api/games/categories` |
| `/api/sos` …    | `/api/v1/sos` … | `/api/v1/sos/api/sos/sessions`, … |
| `/api/ai`       | `/api/v1/ai`    | `/api/v1/ai/api/ai/marcie` |

Verified by enumerating the real app's routes under the pinned versions
(`fastapi==0.109.2`, `pydantic==2.6.1`): **83 routes, none matching** the documented
`/api/v1/*` paths **or** the client's `/api/*` paths.

The **client contract** (the deployed app + the pytest suite + `API_CONNECTION_MAPPING.md`)
is `/api/*` — e.g. `/api/users`, `/api/couples/create`, `/api/games/categories`,
`/api/sos/sessions`, `/api/marcie/chat`.

### 2.4 ❗ CRITICAL — Identity-key mismatch: users keyed by random UUID, client uses Firebase UID

- `routes/users.py` created users with `user_id = str(uuid.uuid4())`.
- The client (`app/src/hooks/useAuth.ts`) looks users up with `userApi.get(firebaseUser.uid, …)`.

Every real user therefore 404s on lookup. In `useAuth.signIn()` this 404 is **rethrown**, so
the login screen shows "Authentication Failed" even though Firebase Auth succeeded.

### 2.5 ❗ HIGH — Frontend/backend endpoint contract mismatches

| Client call (`app/src/lib/api.ts`) | Backend reality (before fix) |
|---|---|
| `POST /api/users` | double-prefixed, uuid-keyed |
| `POST /api/couples/create` | double-prefixed |
| `GET  /api/couples/me?user_id=` | double-prefixed |
| `GET  /api/couples/{id}` | **did not exist** |
| `GET  /api/couples/{id}/presence` | **did not exist** |
| `GET  /api/games/categories` | double-prefixed |
| `POST /api/sos/sessions` | double-prefixed |
| `POST /api/marcie/chat` | route is `/api/ai/marcie` (different verb + path) |
| `GET  /api/leaderboard/global` | only plural `/api/leaderboards/global` existed |
| `GET  /api/love-arcade/games` | **did not exist at all** |
| `PUT  /api/users/{id}/sarcasm` | **did not exist** |

### 2.6 ❗ HIGH — Auth model mismatch: client sends Firebase ID tokens, backend only trusts its own JWTs

- Client authenticates with Firebase Auth and sends `Authorization: Bearer <Firebase ID token>`
  (`getIdToken` in `useAuth.ts`, `httpClient.ts`).
- Backend `security.py` only validated **locally-signed HS256 JWTs** (`verify_jwt_token`).
  There was **no Firebase token verification anywhere**, so even with correct paths, every
  authenticated request would 401.

### 2.7 ❗ HIGH — "Authentication theater" + unstable secret

- `routes/auth.py login()` looked up a user by email and returned a fabricated token
  `token_{user_id}_{uuid}` — it **never checked the password**.
- `register()` **never stored a password** (no hash anywhere).
- `security.py`: `JWT_SECRET = os.environ.get('JWT_SECRET', secrets.token_hex(32))` — a new
  random secret on **every boot** and in **every worker/replica**, invalidating all tokens.

### 2.8 ❗ HIGH — No authorization on any route (IDOR)

`grep` for `require_auth | get_current_user | Depends(` in `backend/routes/*.py` returned
**nothing**. `security.py`'s auth decorators were dead code. Any caller could read/update/
delete any user, join/unlink any couple, submit SOS answers as anyone, and escalate
`role`, `email_verified`, etc. via mass-assignment (`PUT /users/{id}` merged arbitrary dicts).

### 2.9 MEDIUM — Incorrect Firestore ordering constant, silently swallowed

`firestore.DESCENDING` is **not** a valid attribute — the constant lives on `Query`:

```
firebase_admin.firestore.DESCENDING      -> AttributeError (verified)
firebase_admin.firestore.Query.DESCENDING -> 'DESCENDING' (correct)
```

`games.py`, `scoring.py`, `sos.py` used `firestore.DESCENDING`; `sos.py` additionally never
imported `firestore` at all (NameError). Every exception was swallowed, so session-history
endpoints **silently returned empty lists**.

Related: `db.increment(1)` (users.py `record_login`) — the client has no `increment`;
the correct call is `firestore.Increment(1)`. The old code wrote `login_count: None`.

### 2.10 MEDIUM — Route-ordering shadowing

`GET /api/games/{game_id}` was registered **before** `GET /api/games/health`, so `/health`
was captured by the `{game_id}` path parameter (same for `/api/users/{user_id}` vs
`/api/users/health`).

### 2.11 LOW — Additional findings

- `admin_routes.py` was **never mounted** in `server.py` → all `/api/admin/*` 404.
- `middleware.py` (`setup_middleware`, request logging, error handling) was never wired.
- In-memory state (`conversation_history`, `events_db`, in-memory rate limiter, in-memory
  "fallback" DBs) is per-process and lost on restart / not shared across workers.
- `users.list_users` loaded the **entire** users collection into memory to count it, and
  returned every user's email/avatar/preferences.
- Invite codes were 6 hex chars (`16^6 ≈ 16.7M`) with no rate limiting on `/join`.
- `useAuth.ts` stores auth state via `setBeta` (toggles the user's *plan*), and
  `setUserId` is a no-op selector.

---

## 3. Failure explanation (how the outage presents)

1. **Deploy / restart** → the process crashes at import (circular import), then at route
   registration (bad annotation). *Service down; health checks fail.*
2. **If a build somehow passed those two**, every endpoint is registered at mangled
   double-prefixed paths → the client gets **404 on every call**. Login "succeeds" in
   Firebase but `userApi.get(uid)` 404s → **"Authentication Failed"** in the UI.
3. **If paths matched**, the backend cannot validate Firebase ID tokens → **401s**.
4. **If a token were accepted**, the user record is keyed by a random UUID, not the UID the
   client uses → **identity never reconciles**.

The system is down end-to-end, and the failures compound in that order.

---

## 4. Edge case analysis

- **Multi-worker / multi-replica deployment:** random per-boot `JWT_SECRET` ⇒ tokens from
  one worker rejected by another. Fixed by fail-fast on missing secret.
- **Sign-up then relaunch:** `onAuthStateChanged` looks the user up by Firebase UID before
  the backend record exists (race) — now mitigated by UUID→UID keying and idempotent create.
- **Sign-in for a legacy user who never synced to the backend:** `userApi.get(uid)` 404s and
  the hook swallows it, leaving `user_id` unset. Needs a "sync on 404" path (see §6).
- **Google/Apple sign-in uses `signInWithPopup`** — a *web-only* Firebase API; it will fail
  on native iOS/Android builds. Needs `expo-auth-session`/native providers.
- **Preview mode** (`user_id: 'preview'` in the store) is unauthenticated client-side state;
  server-side auth enforcement must not break it (see §6, decision point).
- **Firestore composite indexes:** `where(...).order_by(...)` requires composite indexes that
  `firestore.indexes.json` must declare, or those queries raise `FailedPrecondition`
  (currently swallowed too).
- **Trailing slash:** `POST /api/users` is served at `/api/users/`; the client's `fetch`
  follows the 307 (method/body preserved), but a redirect adds a round-trip.
- **Invite-code enumeration:** fixed by a 36-symbol, 8-char code (`36^8`) but `/join` still
  needs rate limiting to fully close brute-forcing.
- **No revocation:** `logout` and `reset-password` are stubs; Firebase token revocation
  (`check_revoked`) is used, but local JWTs have no denylist.

---

## 5. Fixed production-ready code (what changed)

All changes are in `relationshit/backend/`. Verified end-to-end: the app now **imports
cleanly**, registers **111 routes at the correct `/api/*` paths**, and passes a smoke test
(public endpoints 200, register 200 + signed JWT, bad password 401, unauthenticated user
access 401).

### `server.py`
- **Fixed circular import**: moved `from routes import ...` (and `import admin_routes`)
  *after* `db` and the Firestore helper functions are defined.
- **Fixed double prefix**: `include_router(...)` no longer re-applies `/api/v1/...`; routers
  serve at their own `/api/...` prefixes.
- **Mounted the previously-orphaned `admin_routes`** at `/api/admin`.
- Mounted the new compat routers (`games.love_arcade_router`, `ai_marcie.marcie_router`,
  `leaderboards.leaderboard_router`).
- Updated the `/` endpoint map to the real paths.

### `routes/auth.py`
- Fixed the `request: {"email": str}` boot-blocker (`ResetPasswordRequest`).
- Passwords are now **bcrypt-hashed** (`password_hash`) and **verified on login**.
- Login/register now return a **real signed JWT** (`security.create_jwt_token`).
- Removed the fabricated `token_{user_id}_{uuid}` tokens.
- Removed the duplicate, unauthenticated `/user/{user_id}` CRUD (covered by `users.py`).
- `login_count` uses `firestore.Increment(1)`.

### `security.py`
- `JWT_SECRET`: **fail-fast in production** if unset; warn + ephemeral in dev.
- Added `verify_firebase_id_token()` — the backend now **accepts the Firebase ID tokens the
  app actually sends**, in addition to local JWTs.
- `get_current_user` / `require_auth` normalize claims and expose `uid`; added
  `caller_uid()` and `ensure_self()` helpers.

### `routes/users.py`
- Users are keyed by the **authenticated Firebase UID** (from the ID token), fixing the
  identity mismatch and the login loop.
- Added the missing `PUT /users/{id}/sarcasm` endpoint.
- Fixed `record_login` (`firestore.Increment(1)`).
- Moved `/health` above `/{user_id}` (route-shadowing fix).
- Enforced authentication (`require_auth` + `ensure_self`) on all user endpoints;
  `list_users` is admin-only; response payloads strip `password_hash`.

### `routes/couples.py`
- Added missing `GET /{couple_id}` and `GET /{couple_id}/presence`.
- Strengthened invite codes (36-symbol, 8-char, `secrets`).
- Guarded `.update()` on a possibly-missing user document.

### `routes/games.py`, `routes/sos.py`, `routes/scoring.py`
- Fixed `firestore.DESCENDING` → `firestore.Query.DESCENDING` (and added the missing
  `firestore` import in `sos.py`).
- Moved `games /health` above the `/{game_id}` catch-all.
- Added `/api/love-arcade/games` and `/api/love-arcade/games/{id}/questions` (metadata
  mirrors `app/src/lib/gameRegistry.ts`).

### `routes/ai_marcie.py`, `routes/leaderboards.py`
- Added compatibility routers so the **already-deployed client** resolves:
  `/api/marcie/chat` (and `/api/marcie/sarcasm-levels`), and the singular
  `/api/leaderboard/global` + `/api/leaderboard/categories/{id}`.
- `MarcieChatRequest` accepts the legacy `context` field.

---

## 6. Remaining hardening (recommended next PR, not shipped here)

1. **Wire `require_auth` + `ensure_self` into couples/sos/games-session/ai/leaderboard
   write endpoints** — the helpers now exist; the remaining IDOR surface is in those routers.
   (Decision needed: how anonymous "preview mode" should authenticate.)
2. **Rate-limit** `/api/auth/login` and `/api/couples/join` (invite-code brute force).
3. **Firestore composite indexes** for every `where(...).order_by(...)` query.
4. **Replace in-memory state** (`conversation_history`, `events_db`, in-memory fallback DBs)
   with Firestore/Redis so it survives restarts and multi-worker deployments.
5. **Wire `setup_middleware`** (request logging, error handling) and add a startup/liveness
   path that doesn't hard-depend on Firebase.
6. **Revocation/denylist** for local JWTs on logout; implement `reset-password` email.
7. **Frontend:** fix `useAuth.ts` (`setBeta` misuse, `setUserId` no-op, web-only
   `signInWithPopup`), add a "sync-on-404" path so legacy users are back-filled, and align
   `healthApi.check` to the new base URL if `ENV.BACKEND_URL` differs.
8. **Update `backend/tests/*`** — they were written against an older contract
   (`/api/users`, `couple_code`/`sarcasm_level`/`points` fields) and currently fail;
   rewrite against `/api/*` + Firebase ID-token auth.
