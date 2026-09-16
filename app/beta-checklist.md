# Beta-Ready Checklist

Use this list after running `fix-everything-beta.sh` to confirm the app is ready for a beta build or a fresh test run.

## 1. Assets
- [ ] These six canonical logos exist in `assets/logo/` and are not empty:
      `RSBLACKNBBANNER.png`, `RSBLACKNBSQUARE.png`, `RSICONNB.png`,
      `RSTRANSPARENTICONNB.png`, `RSWHITENBBANNER.png`, `RSWHITENBSQUARE.png`.
- [ ] No other logo files exist anywhere in the app. The six above are the only
      sanctioned brand assets.
- [ ] The file names have the exact capitalization shown above.
- [ ] If the script created a placeholder PNG, replace it with the real image before shipping.

## 2. Bundle and Metro
- [ ] The Expo bundler no longer stalls at around 56%.
- [ ] `FailedToResolvePathError` no longer appears for the logo files.
- [ ] The app can start in Expo Go or in a development build.

## 3. Code quality
- [ ] Lint passes with no errors.
- [ ] TypeScript reports no errors.
- [ ] Any remaining lint or TS warnings are intentional and documented.

## 4. Tests
- [ ] Jest runs without crashing.
- [ ] Existing tests still pass.
- [ ] Any placeholder test created by the script is intentional and not shipped forever.

## 5. Expo tooling
- [ ] `npx expo doctor` reports no critical problems.
- [ ] `npx expo install --check` reports all packages are correctly pinned.
- [ ] `package-lock.json` is committed and up to date.

## 6. Environment
- [ ] All required `EXPO_PUBLIC_*` variables are defined in `.env`.
- [ ] `.env` is consistent with `.env.example`.
- [ ] No secrets or keys are hard-coded in the source.

## 7. Platforms
- [ ] The app runs on Android (Emulator or device).
- [ ] The app runs on iOS (Simulator or device, if applicable).
- [ ] The app runs in the web browser if web support is expected.
- [ ] Basic navigation and any login/sign-up flow appear to work.

## 8. Build readiness
- [ ] A dev build can be started.
- [ ] Any app icons, splash screens, or other assets not covered by this script are also present.
- [ ] You are ready to test the real images in place of any placeholder PNGs the script may have created.

# Beta-Ready Checklist

Work through this list **after** `fix-everything-beta.sh` finishes. Tick each
box only when you have personally verified it. When every box is ticked, the
project is beta-ready.

## 1. Assets (the pictures that broke the build)

- [ ] All six canonical logos exist in `app/assets/logo/` and are **not** 0 bytes:
      `RSBLACKNBBANNER.png` (1050x600), `RSBLACKNBSQUARE.png` (1080x1080),
      `RSICONNB.png` (1080x1080), `RSTRANSPARENTICONNB.png` (1080x1080),
      `RSWHITENBBANNER.png` (1050x600), `RSWHITENBSQUARE.png` (1080x1080)
      (note: a 1×1 transparent placeholder is a *temporary* stand-in — replace
      it with the real logo before shipping).
- [ ] No seventh logo has crept in. Only the six files listed above may exist in
      `app/assets/logo/`.
- [ ] All six filenames are spelled **exactly** as above (Linux is
      case-sensitive: `RsIconNb.png` != `RSICONNB.png`).
- [ ] The logos actually *look* correct in the app, not like a blank square
      (a blank square means the placeholder is still in use).

## 2. Checks from the script

- [ ] `fix-everything-beta-report.txt` shows **PASS** for every step you ran
      (or SKIPPED for steps you deliberately turned off).
- [ ] ESLint runs with no errors (warnings are acceptable unless you use
      `--strict`).
- [ ] `npx tsc --noEmit` completes with no output at all.
- [ ] `npx jest` is green (all tests pass).
- [ ] `npx expo-doctor` reports no problems.
- [ ] `npx expo install --check` says **"All packages are up to date"** —
      including `@react-native-async-storage/async-storage`.

## 3. Environment variables

- [ ] `.env` is present and every variable listed in `.env.example` is defined
      in it.
- [ ] No secret/API key from `.env` is committed to git.
- [ ] Every runtime variable is prefixed with `EXPO_PUBLIC_` if the app reads
      it in JavaScript.

## 4. The app actually runs

- [ ] `npx expo start -c` reaches 100% and prints the QR code / URL list
      (no more stall at ~56%).
- [ ] **Android:** app loads in Expo Go / emulator, login screen renders and
      shows both logos.
- [ ] **iOS:** app loads in Expo Go / simulator, login screen renders and
      shows both logos.
- [ ] **Web:** `npx expo start --web` opens in a browser without console
      errors on the login screen.
- [ ] Login **and** sign-up flows can be completed end-to-end.
- [ ] No red-screen/error toast appears during 5 minutes of normal clicking
      around.

## 5. Packaging / repo hygiene

- [ ] `package-lock.json` is committed and matches `package.json`.
- [ ] No stray fix-scripts or logs you don't want in the repo
      (`fix-everything-beta.log` and `-report.txt` are per-run artifacts —
      consider adding them to `.gitignore`).
- [ ] `git status` is clean of unexpected changes.

## 6. If anything above fails

Open `next-steps.md` and follow the bug-report template there.
