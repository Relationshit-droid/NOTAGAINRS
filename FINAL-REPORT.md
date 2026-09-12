# RELATIONSHIT! — Final Report

**Branch:** `arena/01a07148-notagainrs` · **Tagline:** "Who said therapy?"
**Baseline:** `21eded12` · **Head:** `d59fdf6` · **17 commits**

---

## 1. Executive summary

The app now **launches, navigates, and plays end to end with zero console errors**.

| Signal | Baseline | Now |
|---|---|---|
| Jest suites | 4 passed / 16 failed | **20 passed / 0 failed** |
| Jest tests | — | **130 passed**, 14 skipped |
| Route render sweep | crashes | **123/123 render** |
| TypeScript errors | 1199 | **752** (and now type-checking test files too) |
| Prohibited SDKs | Supabase, Stripe, backend service | **0** |
| Playable categories | 0 reachable | **6/6** |

Verified journey, driven against the real Metro bundle:

```
splash → dashboard → category detail → game lobby → "Question 1 of 3"
533 DOM nodes · 0 console errors
```

---

## 2. Compliance matrix

| Requirement | Status | Evidence / note |
|---|:--:|---|
| App launches without crashes | ✅ | `smoke-jsdom.js`: splash renders, 0 errors |
| Onboarding + couple linking | ✅ | `CoupleLinking`, `CoupleCode` reachable (`CoupleCode` was unregistered — fixed) |
| ≥1 playable game per major category | ✅ | 6/6 categories reach gameplay (`smoke-categories.js`) |
| Trust Thermometer updates in real time | ✅ | Now an `onSnapshot` subscription on `couples/{id}` |
| Dr. Marcie renders, correct style | ✅ | `DrMarcieOverlay` implements all 16 named states |
| Dr. Marcie's 16 WebM animations | ⚠️ | Code complete; assets resolve from Firebase Storage URLs that must be uploaded. 49 local videos exist in `app/src/assets/animations/` but are not wired to those paths |
| Firebase only (Auth/Firestore/RTDB/Storage/Functions/Hosting/FCM) | ✅ | 0 prohibited deps in any `package.json` |
| Gemini for all AI | ✅ | `vertex-ai-functions.ts`, Gemini 1.5 Pro |
| Google Cloud TTS for voice | ✅ | `@google-cloud/text-to-speech` in Functions |
| No Supabase / Stripe / ElevenLabs / AWS | ✅ | Verified by grep across app + functions |
| No hardcoded API keys | ✅ | All 28 vars via `src/lib/env.ts`; `app/.env.example` documents each |
| Branding `RELATIONSHIT!` + tagline | ✅ | Rendered text asserted in smoke test |
| Design system (gradients, Inter, accents) | ✅ | `src/theme/index.ts` |
| Content preserved verbatim | ✅ | No dialogue/question/score edits; only routing + wiring touched |
| WCAG AA contrast | ⚠️ | **Spec conflict:** mandated gradient end `#f05d68` gives 3.25:1 on white vs the 4.5:1 AA floor. Needs a product decision — not silently changed |
| 60fps / <2s load | ⚠️ | Not measured; no device profiling available in this environment |
| `src/lib/supabase.ts` filename | ⚠️ | **Firebase implementation**, no Supabase SDK. Kept to avoid editing ~30 game screens and risking verbatim content. Documented in its header |

---

## 3. Bugs fixed (all found by testing, not assumed)

**Production defects**

1. **Skip button dead in every game.** `GameContainer` called `enforceSkipPenalty(1)` against a `(coupleId, token, hours)` signature; it threw inside `async skip()` so `onSkip()` never ran — silently.
2. **Category cards dead on the home dashboard.** Every card navigated to `GameLibrary`, a route no navigator handles. No category was reachable.
3. **Game completion went nowhere.** `GameResults` — the destination for **25 game screens** — was never registered.
4. **Every category showed "No Games Yet."** The demo router hardcoded `games_detail: []`.
5. **Analytics identifiers stripped.** `capture()` spread `...event.properties` then overwrote `game_id`/`category_id` with `undefined`.
6. **HTTP retries dead.** `fetchWithRetry` threw a bare `Error`; `isRetryable()` reads `error.status`, so 503/429 never retried.
7. **Trust Thermometer never updated live.** One-time read replaced with a Firestore subscription.
8. Plus `RepairReportCard`/`CoupleCode` unregistered, and `PlayTruthOrTrust`/`NextRound`/`DailyQuest` pointing at non-existent routes.

**Test/infra defects**

9. `jest.setup.ts` called `resetAllMocks()` globally, stripping `jest.mock` factory implementations — suites passed test 1 then failed.
10. `expo-asset`, `@expo/vector-icons`, `expo-linking`, RN `Settings` unmocked → suite-level import crashes.
11. `navigation.test.tsx` asserted all 7 stack screens were simultaneously visible (only the top screen ever is) and elsewhere asserted string literals were defined — now checks the routes actually registered in `AppNavigator`.
12. `tsconfig` `types: ["nativewind/types"]` suppressed jest/node globals, manufacturing ~370 phantom errors.

---

## 4. Running it

```bash
cd app
npm install --legacy-peer-deps
cp .env.example .env        # fill in Firebase values, or leave EXPO_PUBLIC_DEMO_MODE=true
npx expo start              # QR for Expo Go; press w for web, a/i for emulators
```

Demo mode needs no Firebase project — data comes from `src/lib/demoData.ts`.

**Tests**

```bash
npx jest                    # 20 suites, 130 tests

# End-to-end (no browser binary needed)
npx expo start --web --port 8081 --offline --clear
curl -s -o /tmp/bundle.js "http://localhost:8081/index.bundle?platform=web&dev=true&minify=false"
node smoke-jsdom.js         # boot
node smoke-nav.js           # full journey
node smoke-categories.js    # playability per category
```

---

## 5. Manual steps (unavoidable)

1. **Create the Firebase project**, enable Auth / Firestore / Realtime DB / Storage / Functions, and paste the config into `app/.env`.
2. **Enable the Gemini (Vertex AI) API** and Cloud TTS; set Functions secrets — these are server-side and must never go in `EXPO_PUBLIC_*`.
3. **Upload Dr. Marcie's animations** to Storage under `animations/` and `videos/` to match `src/utils/assets.ts`.
4. **Deploy rules/functions:** `firebase deploy --only firestore:rules,storage,functions`.
5. **Decide the contrast conflict** in the ⚠️ row above.

---

## 6. Honest gaps

- **752 TypeScript errors remain.** They do not block Metro (Babel strips types) and the app runs, but the codebase is not type-clean.
- **No screenshots.** Chromium could not be downloaded in this sandbox; verification is DOM-text assertions from the real bundle instead. Run the app locally for visuals.
- **60fps/<2s unverified** — needs a real device.
- Deeper gameplay (scoring, multi-round completion, SOS flow, payments) was not exercised beyond the first question.
