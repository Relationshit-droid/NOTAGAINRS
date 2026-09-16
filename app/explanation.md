# What the script does

This is a single automation script (`fix-everything-beta.sh`) that repairs an Expo app when its bundler fails because image files are missing or have the wrong capitalization.

The main steps are:

1. **Make sure `assets/logo/` exists.**  
   If the folder is not there, the script creates it.

2. **Fix the six canonical logo files.**
   The script looks for each of the six sanctioned brand logos
   (`RSBLACKNBBANNER.png`, `RSBLACKNBSQUARE.png`, `RSICONNB.png`,
   `RSTRANSPARENTICONNB.png`, `RSWHITENBBANNER.png`, `RSWHITENBSQUARE.png`),
   ignoring capital letters. If one turns up elsewhere in the project it is
   copied into `assets/logo/` under the canonical name. If no copy exists
   anywhere, it creates a tiny invisible 1×1 transparent PNG with the right name
   so Metro can bundle without crashing.

3. **Verify the logo files.**  
   The script checks that all six files now exist, that they are real PNG images, and it logs their sizes.

4. **Reinstall the exact Expo dependency versions.**  
   It runs `npx expo install --fix` so every Expo-related package matches the version the project expects.

5. **Run `npm install`.**  
   This refreshes `package-lock.json` and makes sure the remaining packages are in sync.

6. **Delete all caches.**  
   The script removes Expo, Metro, Jest, and Node cache folders, and tells watchman to forget all watched folders. This clears the stale state that was causing the bundler to stall around 56%.

7. **Run the linter.**  
   It runs ESLint on all TypeScript and TSX files. If there are errors, the script can stop or continue depending on the flags you pass.

8. **Run the TypeScript type checker.**  
   It runs `npx tsc --noEmit` to confirm the code type-checks cleanly.

9. **Run the Jest tests.**  
    If no tests exist at all, the script creates one tiny placeholder test so Jest can still run. Then it runs the whole test suite.

10. **Run `expo doctor` and `npx expo install --check`.**  
    These commands confirm that the Expo SDK and its pinned packages are installed correctly.

11. **Start Metro or print a final report.**  
    By default, the script ends by starting the Expo bundler in debug mode. If you pass `--no-start`, it stops after printing a friendly summary.

The script writes two files you can look at later:
- `fix-everything-beta.log` for machines and debugging.
- `fix-everything-beta-report.txt` for a human-readable summary.

You can control the script with flags such as `--no-start`, `--skip-lint`, `--skip-typecheck`, `--skip-tests`, `--skip-doctor`, `--strict`, and `--continue-on-error`.

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

**1. Repair the missing logo pictures.**
The app was crashing because its brand images could not be found. Only six logos
are sanctioned: `RSBLACKNBBANNER.png`, `RSBLACKNBSQUARE.png`, `RSICONNB.png`,
`RSTRANSPARENTICONNB.png`, `RSWHITENBBANNER.png`, `RSWHITENBSQUARE.png`.
The script:

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
