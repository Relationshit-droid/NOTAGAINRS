# Beta-Ready Checklist

Run `./fix-everything.sh` first. Then walk down this list. Tick a box only when
you have seen the evidence yourself — the script prints every piece of evidence
you need, and `fix-everything-report.txt` keeps a copy of it.

Beta date: ______________   Tester: ______________   Build/commit: ______________

---

## 1. Assets

- [ ] `assets/logo/RSTRANSPARENTICONNB.png` exists with exactly that capitalisation
      (the script prints `OK    present: assets/logo/RSTRANSPARENTICONNB.png`).
- [ ] `assets/logo/mainlogoone.png` exists with exactly that capitalisation.
- [ ] The script's asset scan says
      `OK    Every asset referenced by src/, App.tsx and index.ts resolves to a real file.`
      (no `FAIL` line about missing assets — that is what caused the 56% stall).
- [ ] Any `relative code module(s) could not be resolved` warning has been read.
      (In this project the known one is `src/navigation/index.ts -> ./AdminNavigator`,
      which has no matching file. Decide whether that file is dead code or a typo.)
- [ ] No asset inside `assets/` is larger than 5 MB, **or** every file the script
      listed has a reason to stay. The ~30 `assets/videos/*.webm` clips are
      already excluded from the bundle by `metro.config.js`'s `resolver.blockList`
      and streamed from Firebase at runtime — keep it that way.
- [ ] `assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash-icon.png` and
      `assets/favicon.png` all exist (they are referenced by `app.json`).

## 2. Code quality

- [ ] No TypeScript errors: `npx tsc --noEmit` prints nothing.
      *Current status: **not yet clean** — the project has many pre-existing type
      errors (e.g. `src/screens/sos/VerdictScreen.tsx`,
      `src/screens/settings/SubscriptionSettingsScreen.tsx`,
      `src/state/Provider.tsx`). This box stays unticked until those are fixed or
      consciously accepted for the beta.*
- [ ] No lint errors: `npx eslint .` prints nothing (warnings are acceptable).
- [ ] No circular imports: the script prints
      `OK    No circular imports detected.`
      *Current status: **3 cycles found** —
      `src/lib/api.ts → src/lib/httpClient.ts → src/lib/firestoreRouter.ts → src/lib/demoData.ts → src/lib/api.ts`,
      plus two around `src/components/ui/index.ts` ⇄ `src/layout/...`. Break them by
      moving the shared piece into its own module.*
- [ ] All Jest tests pass: `npm test` (or `npx jest --ci`) ends with
      `Tests: N passed, N total`.
- [ ] The placeholder test `__tests__/placeholder.test.ts` has been replaced with
      real tests, or you accept that it only proves the runner works.

## 3. Expo health

- [ ] `npx expo doctor` reports **no** cross (✖) lines.
- [ ] `npx expo install --check` says every dependency matches SDK 52
      (or `npx expo install --fix` was run and the check now passes).
- [ ] `@react-native-async-storage/async-storage` is exactly **1.23.1** — the
      mismatch warning is gone. Verify with:
      `node -p "require('@react-native-async-storage/async-storage/package.json').version"`
- [ ] `react-native-gesture-handler` is at the SDK 52 pin (`~2.20.2`) **and** is
      wired into the app: `App.tsx` imports `GestureHandlerRootView` from it (line 2)
      and the tree is wrapped in `<GestureHandlerRootView>`. Without that wrapper
      the gesture-based games crash silently on Android.
- [ ] `expo` is 52.x (`node -p "require('expo/package.json').version"`).

## 4. Environment variables

- [ ] `.env` exists (`cp .env.example .env` if not) and is **not** committed to git.
- [ ] Every `EXPO_PUBLIC_*` variable the code reads is defined. The script lists
      any that are missing. Known gaps in the current `.env` (all optional — they
      only disable the matching feature):
      - `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
      - `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID`
      - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
      - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
      - `EXPO_PUBLIC_APPLE_CLIENT_ID`
      - `EXPO_PUBLIC_SENTRY_RELEASE`
- [ ] Variables that are defined but empty are intentional — the script lists them
      (Firebase, Sentry, PostHog, Gemini, Giphy, Mapbox, API/WS URLs). Any feature
      you want in the beta must have a real value here.

## 5. It actually runs

Complete all three platforms from the same commit.

- [ ] **Android** — `npx expo start -c`, press `a` (or scan the QR code with the
      Expo Go app). The app opens, shows the logo, and the login screen renders.
- [ ] **iOS (Expo Go)** — scan the QR code with Expo Go on an iPhone.
      The app opens and the login screen renders.
- [ ] **Web** — press `w`, then open `http://localhost:8081` in the browser.
      The page loads without a red error overlay.
- [ ] No red screen and no `FailedToResolvePathError` on any platform.
- [ ] Metro reaches `Bundling complete` (or `Android Bundled`) with no errors.
- [ ] Cold start works: stop the bundler (Ctrl+C), start it again, reload the app.
- [ ] The core beta journey works end to end on a real device:
      create account → log in → reach the dashboard → open one game → log out.

## 6. Final admin

- [ ] `fix-everything-report.txt` shows `failures: 0` (warnings: review them).
- [ ] `git status` shows no accidental `node_modules/`, `.env` or `dist/` commits.
- [ ] `rm -rf .expo .metro` was done right before the build, so the bundle came
      from a clean cache.
- [ ] Beta testers know how to report a crash: screenshot + the last Metro line.

---

## Sign-off table

| # | Check | Result | Notes |
| --- | --- | --- | --- |
| 1 | Assets verified (case-sensitive, present, not oversized) | pass / fail | |
| 2 | No lint errors | pass / fail | |
| 3 | No TypeScript errors | pass / fail | |
| 4 | All Jest tests pass | pass / fail | |
| 5 | `expo doctor` reports no errors | pass / fail | |
| 6 | Runs on Android | pass / fail | |
| 7 | Runs on iOS via Expo Go | pass / fail | |
| 8 | Runs on Web | pass / fail | |
| 9 | All required `EXPO_PUBLIC_*` variables defined | pass / fail | |
| 10 | async-storage version warning resolved | pass / fail | |
| 11 | No circular imports detected | pass / fail | |

**Beta approved by:** ____________________  **Date:** ____________