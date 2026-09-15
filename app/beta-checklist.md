# Beta-Ready Checklist

Work through this list **after** `fix-everything-beta.sh` finishes. Tick each
box only when you have personally verified it. When every box is ticked, the
project is beta-ready.

## 1. Assets (the pictures that broke the build)

- [ ] `app/assets/logo/RSTRANSPARENTICONNB.png` exists and is **not** 0 bytes
      (note: a 1×1 transparent placeholder is a *temporary* stand-in — replace
      it with the real logo before shipping).
- [ ] `app/assets/logo/mainlogoone.png` exists and is not 0 bytes.
- [ ] Both filenames are spelled **exactly** as above (Linux is
      case-sensitive: `MainLogoOne.png` != `mainlogoone.png`).
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
