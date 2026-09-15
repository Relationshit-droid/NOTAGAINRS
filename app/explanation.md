# What the script does — `fix-everything-beta.sh`

This script is like a **pit crew for the app**. You run it once from the `app/`
folder, and it fixes the things that were breaking the build, then checks that
everything is healthy, and finally starts the app's development server.

Run it like this (from the `app/` folder):

```bash
./fix-everything-beta.sh
```

or, if you don't want the dev server to start at the end:

```bash
./fix-everything-beta.sh --no-start
```

## Step by step, in plain English

**1. Repair the two missing logo pictures.**
The app was crashing because two image files could not be found
(`RSTRANSPARENTICONNB.png` and `mainlogoone.png`). The script:

- Leaves them alone if they already exist with the correct name (running it
  twice never overwrites a good file).
- If a file with the same name exists somewhere else in the project (even with
  different capital letters or in a different folder), it copies it to the
  exact place and exact name the app expects.
- If the picture truly does not exist anywhere, it creates a tiny 1×1
  transparent placeholder image so the app can at least build.

**2. Reinstall dependencies with the versions Expo approves of.**
Expo works best when every library is at the exact version it expects. The
script asks Expo to fix any version mismatches automatically (including the
async-storage warning). If everything already matches, this step does nothing.

**3. Sync the lock file.**
It runs a normal `npm install` so the project's "shopping list"
(`package-lock.json`) agrees with what's actually installed.

**4. Clear every cache.**
Old cached build data can make the bundler hang at ~56%. The script wipes
Watchman's memory, the `.expo` folder, Metro caches, and temporary Metro files
so the next build starts fresh.

**5. Run the linter (code style checker).**
ESLint reads the code and reports style mistakes. Errors stop the script;
warnings just get noted. If you add `--strict`, even warnings stop the script.
(This project doesn't have ESLint installed yet, so the script politely skips
this step and tells you.)

**6. Run the TypeScript type-checker.**
`tsc --noEmit` reads all the code and verifies there are no type errors
without producing any output files. Any error stops the script.

**7. Run the automated tests.**
Jest runs the project's tests. If a project had no tests at all, the script
creates one tiny placeholder test so the suite can still run.

**8. Run the Expo health check.**
`expo-doctor` and `expo install --check` verify the project configuration and
that every dependency is at the correct Expo-approved version.

**9. Start the app.**
Finally, it launches the development server (`EXPO_DEBUG=true npx expo start
-c`) with a clean cache. Press **Ctrl-C** when you're done. If you passed
`--no-start`, this step is skipped.

## Optional flags

| Flag | What it does |
| --- | --- |
| `--no-start` | Do all checks, but don't launch the dev server |
| `--skip-lint` | Skip step 5 |
| `--skip-typecheck` | Skip step 6 |
| `--skip-tests` | Skip step 7 |
| `--skip-doctor` | Skip step 8 |
| `--strict` | Treat warnings as fatal errors |
| `--continue-on-error` | Always exit with code 0, even if something failed |

## The two output files

- **`fix-everything-beta.log`** — a timestamped, machine-readable log of every
  event (step started / passed / failed, what was repaired, final result).
- **`fix-everything-beta-report.txt`** — a short human-readable summary:
  which steps passed, which failed, and whether the two logo files are in place.

## Exit codes

- `0` — everything succeeded (or `--continue-on-error` was used).
- `1` — something failed.
- `2` — you passed a flag the script doesn't recognise.
