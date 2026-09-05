# MVP Repair Report — Phase 2 (post-outage)

**Date:** 2026-09-04
**Scope:** turn the bootable-but-broken app into an MVP that actually works end-to-end.
**Decisions (from product):** fix **all P0 blockers**, and standardize game-session persistence **through the backend** (no direct client→Firestore writes).

---

## What was still broken (verified, not assumed)

1. **Auth/state wiring in the client** — `useAuth.ts` stored "authenticated" in the
   *beta* flag (`setBeta`), `setUserId` was a no-op selector, and sign-in had no
   create-on-404 path, so any Firebase user not already in the backend was shown
   "Authentication Failed". `HomeScreen` had the same get-without-fallback problem.
2. **Game catalog was empty** — `HomeScreen`/`CategoryDetailScreen`/`GameSearch`/
   `RecommendedGames` called `gamesApi.getCategories()/getCategory()/getRegistry()`
   and the backend returned `games: []` / `{"games": {}}`. The library and search
   rendered nothing.
3. **Two competing session systems** — some games persisted via `gamesApi` (backend),
   others wrote Firestore directly (`useGameStore`, `GameContainer`) with a different
   schema and were **denied by the security rules**.
4. **Firestore rules/indexes matched neither schema** (`partners`, `coupleId`,
   `status` vs the real `user1_id/user2_id/couple_id/started_at`).
5. **Backend write routes were unauthenticated (IDOR)** — `couples`, `sos`,
   `games/sessions`, `ai/marcie` trusted `user_id` from the request body.
6. **Backend Firebase init ignored Render's env vars** (`FIREBASE_SERVICE_ACCOUNT_BASE64`,
   `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).

---

## What I changed

### Backend (all verified: compiles, imports, 111 routes, smoke tests pass)

- **`server.py`**
  - Firebase init now resolves credentials from `GOOGLE_APPLICATION_CREDENTIALS` →
    `FIREBASE_SERVICE_ACCOUNT_BASE64` → inline `FIREBASE_*` → ADC, with a
    `SKIP_FIREBASE=1` escape hatch for CI/local smoke.
  - Added `couple_has_member(couple_id, user_id)` membership helper.
- **`routes/games.py`**
  - Serves the real catalog (80 games / 7 categories) from `backend/game_catalog.json`
    (generated from `app/src/lib/gameRegistry.ts` — the client's source of truth).
  - Love Arcade list now derives from the catalog.
  - `create/get/update/complete/answers` + session-history endpoints now require a
    valid token and enforce ownership/couple-membership.
- **`routes/couples.py`** — `require_auth` + self/member checks on create/join/me/
  get/presence/regenerate/unlink/stats/meters/origin-story.
- **`routes/sos.py`** — token required on every endpoint; identity and couple
  membership enforced.
- **`routes/ai_marcie.py`** — token required; caller may only chat as themselves.
- **`routes/users.py`** — fixed a `password_hash` leak in the idempotent create path.
- **`firestore.rules`** — backend-only posture: clients may read only their own
  `users/{uid}` doc; no client writes anywhere.
- **`firestore.indexes.json`** — composite indexes for the real query shapes
  (`game_sessions`, `sos_sessions`, `daily_quests`).

### Frontend (Expo app)

- **`state/store.ts`** — added a real `setUserId` setter; `user_id` default is
  `undefined` (populated from Firebase Auth) instead of the hardcoded `'preview'`.
- **`hooks/useAuth.ts`** — removed the `setBeta` misuse and the no-op selector; added
  a `getOrCreateBackendUser()` that creates the backend record on 404; `setUserId`
  is now the single place identity is written.
- **`screens/HomeScreen.tsx`** — create-or-get user sync (no more spurious
  "Connection Error" for legacy users).
- **`lib/game-store.ts`** — all persistence (init/update/submit/buzz/end) now goes
  through `gamesApi` (backend). Direct Firestore writes removed; realtime sync is a
  documented no-op (deferred, not MVP).
- **`components/games/engine/GameContainer.tsx`** — completion goes through
  `gamesApi.completeSession`; direct Firestore read/write removed.
- **`lib/gating.ts`** — removed the broken `firebaseAuth`/`firestore` imports (those
  names don't exist on `firebaseClient`) and the now-denied direct profile write;
  beta state stays in AsyncStorage for the MVP.

---

## Verification

- `py_compile` on all 11 backend modules → **OK**.
- Import + route enumeration under pinned deps (`fastapi==0.109.2`) → **111 routes**,
  all at correct `/api/*` paths.
- Smoke test → categories/registry/love-arcade return **real data**
  (80 games; per-category counts 8/14/15/14/17/6/6); every protected endpoint returns
  **401 without a token**; register returns **200 + signed JWT**; bad password **401**.

---

## P1 Hardening — follow-up batch

### Rate limiting (brute-force protection)

`security.py` already shipped an in-memory/Redis `RateLimiter` plus a `rate_limit`
FastAPI dependency; it was simply never wired to the brute-forceable endpoints.
It is now attached to:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/couples/join` (invite-code enumeration)

Tunable via `RATE_LIMIT_REQUESTS` (default 100) / `RATE_LIMIT_WINDOW` (default
3600s) env vars.

### Environment documentation

Added `backend/.env.example` and `app/.env.example` covering every env var the
code actually reads (verified by grepping `os.environ.get` / `env.ts`).

### Backend tests rewritten against the real contract

`backend/tests/*` now target the actual 111-route API — auth guards, IDOR
guards, real response shapes — instead of nonexistent routes such as
unauthenticated `POST /api/users` or `POST /api/sos/trigger`.

- `conftest.py` pins `SKIP_FIREBASE=1` + a stable `JWT_SECRET` before import.
- New/rewritten: `test_health.py`, `test_auth.py`, `test_users.py`,
  `test_couples.py`, `test_games.py`, `test_sos.py`, `test_leaderboards.py`,
  `test_security.py` (401 matrix over every protected route, rate-limit wiring,
  `RateLimiter` unit test).
- `pytest.ini` no longer forces `--cov` in `addopts` (pytest-cov isn't installed
  in every CI job); coverage flags are passed explicitly in `ci-cd.yml`.
- Fallback consistency fix: `routes/couples.py` resolves membership through a
  local `_is_member()` helper that falls back to the in-memory store under
  `SKIP_FIREBASE=1`, so `GET /{couple_id}`, stats, presence, and meters behave
  consistently in CI/local.
- **Result: 130 tests pass** under `SKIP_FIREBASE=1`.

### CI: backend tests are now blocking

- `test-backend.yml` and `deploy-backend.yml` removed the `|| echo "No tests yet"`
  soft-fail; pytest now runs for real with `SKIP_FIREBASE=1` + a stable
  `JWT_SECRET`.
- `ci-cd.yml` backend pytest (already blocking) now also sets `SKIP_FIREBASE=1`
  and a 32-char `JWT_SECRET`.
- Still intentionally soft (`|| true`): frontend lint/tsc/test/build and
  `black --check` (unverifiable in this environment). Tighten once the app
  builds cleanly.

### ⚠️ CRITICAL — leaked service-account keys

Two valid Google/Firebase service-account private keys were committed to this
**public** repo at the initial commit and pushed to GitHub:

- `backend/firebase-service-account.json`
- `functions/gcp-credentials.json`

Both were removed from the index/working tree and added to `.gitignore`
(`*-service-account.json`, `*-credentials.json`, `*.pem`, `*.key`, `id_rsa*`, …).
**They remain in git history**, so removal alone is not sufficient.

**ACTION REQUIRED (do not skip):**

1. Rotate both keys in Google Cloud Console (IAM & Admin → Service Accounts →
   the affected service accounts → Keys → delete old, create new).
2. Treat the old keys as compromised until rotated.
3. Purge the files from history (e.g. `git filter-repo`) and force-push, or
   accept public history and rely on rotation.

`server.py` already supports the safe alternative (`FIREBASE_SERVICE_ACCOUNT_BASE64`
or `FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY`, declared in `render.yaml`), so
the repo never needs to contain a key file.

## Remaining (explicitly out of MVP scope, do next)

- Rotate + purge the two leaked service-account keys (see above) — P0 security.
- Real-time partner sync (`/ws`) — currently a documented no-op.
- OAuth (Google/Apple) native providers — `signInWithPopup` is web-only; the email
  flow is the MVP path.
- `routes/scoring.py` and `routes/analytics.py` are still unauthenticated; audit
  and add auth/membership guards next.
- Tighten the still-soft CI steps (frontend lint/tsc/test/build, `black --check`).
- `backend/game_catalog.json` is generated from the client registry — re-run the
  generator when games change.
