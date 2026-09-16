# Next steps / Bug-report template

If `fix-everything-beta.sh` still leaves the app unable to bundle or start, copy and fill in the template below and send it back to the LLM or maintainer.

## What to paste back

```text
## Environment
- OS: <your OS and version>
- Node version: <output of node -v>
- npm version: <output of npm -v>
- Expo SDK / package versions: <relevant parts of package.json, or npx expo --version>
- Device / platform: <Android / iOS / Web, with emulator or physical device if known>

## What I was trying to do
<one or two sentences>

## Command I ran
<exact command, for example: EXPO_DEBUG=true npx expo start -c>

## Flags I passed to the script
<for example: --no-start --strict, or none>

## Last Metro / bundler output
<paste the last 30 to 60 lines around the stall or error>

## Asset state
- assets/logo/RSICONNB.png: <exists, missing, or placeholder>
- assets/logo/RSTRANSPARENTICONNB.png: <exists, missing, or placeholder>
- assets/logo/RSBLACKNBBANNER.png: <exists, missing, or placeholder>
- assets/logo/RSBLACKNBSQUARE.png: <exists, missing, or placeholder>
- assets/logo/RSWHITENBBANNER.png: <exists, missing, or placeholder>
- assets/logo/RSWHITENBSQUARE.png: <exists, missing, or placeholder>
- Other logo files found in the repo: <list paths and names — there should be none outside the six canonical files>

## What the script reported
- fix-everything-beta.log: <paste relevant excerpts or say "attached">
- fix-everything-beta-report.txt: <paste relevant excerpts or say "attached">
- Did any step fail? Which ones?

## What I already tried
<list any manual fixes, cache clears, file renames, reinstalls, etc.>

## What I expected to happen
<short description>

## What actually happened
<short description>
```

## Safe things to try first

1. Confirm all six canonical logo files exist with the exact names:
   `assets/logo/RSBLACKNBBANNER.png`, `assets/logo/RSBLACKNBSQUARE.png`,
   `assets/logo/RSICONNB.png`, `assets/logo/RSTRANSPARENTICONNB.png`,
   `assets/logo/RSWHITENBBANNER.png`, `assets/logo/RSWHITENBSQUARE.png`.
2. If any of them is a placeholder, replace it with the real image and clear
   caches again.
3. Run the script again with `--strict` to surface any hidden lint or TS
   warnings.
4. If only one platform fails, mention that explicitly in the report.

## What not to paste

- Real API keys, secrets, or personal data from `.env`.
- Large binary files or full screenshots unless they are necessary.

# Next steps — and what to send back if the script still fails

## If the script finished successfully

1. Run the checks in `beta-checklist.md` and tick every box.
2. When everything is green, you're beta-ready.

## If the script failed — build your bug report

Copy the template below, fill in every `<...>` placeholder, and paste it back
to the LLM (or attach it to your issue tracker). The more of it you fill in,
the faster the problem gets diagnosed.

---

```text
=== NOTAGAINRS BUG REPORT ===

-- ENVIRONMENT --
OS / version:            <e.g. Ubuntu 22.04 / macOS 14.5 / Windows 11 + WSL2>
Shell:                   <bash --version first line>
Node version:            <output of: node -v>
npm version:             <output of: npm -v>
Watchman version:        <output of: watchman -v, or "not installed">
Expo CLI version:        <output of: npx expo --version>
Expo SDK version:        <the "expo" entry in app/package.json>
React Native version:    <the "react-native" entry in app/package.json>

-- COMMAND RUN --
<exact command, e.g.: ./fix-everything-beta.sh --no-start --strict>

-- EXIT CODE --
<the number the script printed at the end, e.g. 1>

-- LAST 20 LINES OF CONSOLE OUTPUT --
<paste here — especially the last Metro line if it stalled, e.g.
"Bundle failed... 56%" or a FailedToResolvePathError block>

-- SCRIPT REPORT --
<paste the full contents of app/fix-everything-beta-report.txt>

-- WHICH STEP FAILED --
<one of: 1-asset-repair | 2-expo-install-pins | 3-npm-install |
4-clear-caches | 5-lint | 6-typecheck | 7-jest | 8-expo-doctor |
9-expo-start>

-- ERROR MESSAGE(S) --
<paste the full error text, including any FailedToResolvePathError,
"Unable to resolve module", or TypeScript error blocks>

-- ASSET FOLDER LISTING --
<output of: ls -la app/assets/logo/>

-- ENV FILE CHECK --
<output of: grep -c EXPO_PUBLIC_ app/.env — plus say "yes"/"no" for:
every var in app/.env.example also exists in app/.env>

-- WHAT I ALREADY TRIED --
<e.g. "ran the script twice", "deleted node_modules manually", ...>

-- NOTES / GUESSES --
<anything else you noticed>
```

---

## Quick triage cheat-sheet (while you wait for help)

| Symptom | Likely cause | First thing to try |
| --- | --- | --- |
| Metro stalls at ~56% with `FailedToResolvePathError` | Missing / wrongly-cased asset file | Run the script again; check `ls -la assets/logo/` for exact spelling |
| `expo install --fix` keeps changing versions | Package added outside `npx expo install` | Remove it, re-add with `npx expo install <pkg>` |
| `tsc --noEmit` errors | Real type errors in recent code | Fix the first reported error first — later ones are often cascades |
| Jest fails on a module that imports assets | Jest doesn't understand `.png` imports | Ensure the asset mock in `__mocks__/` or `jest.setup.ts` still exists |
| `expo-doctor` flags a version | Manual edit of `package.json` | Run `npx expo install --fix` again |
| Metro hangs even after cache clear | Watchman stale or low file-watch limit | `watchman shutdown-server`, then rerun; on Linux raise `fs.inotify.max_user_watches` |

## Useful one-liners

```bash
# What exactly did the script record?
grep -E 'STEP_(PASS|FAIL)|RUN_RESULT|ASSET_' app/fix-everything-beta.log

# Are the assets there, with exact byte sizes?
ls -la app/assets/logo/

# Reproduce the original bundler failure on its own:
cd app && EXPO_DEBUG=true npx expo start -c
```
