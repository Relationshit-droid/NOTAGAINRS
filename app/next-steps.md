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
