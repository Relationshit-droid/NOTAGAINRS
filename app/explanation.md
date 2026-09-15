# What `fix-everything.sh` does — in plain English

This page explains the script without any jargon. Read it once and you will know
exactly what happens when you type `./fix-everything.sh` in the `app/` folder.

The short version: **we first make sure the picture files are where the code
expects them, then we reinstall the libraries at the exact versions Expo wants,
then we look for broken imports and circular imports, then we check the code for
mistakes, then we run the tests, then we clean out the old build junk, then we
ask Expo's own doctor for a health report, and finally we start the app so you
can scan the QR code.**

Every step prints what it is doing, and a complete log is saved to
`fix-everything-report.txt` in the project folder.

---

## The twelve steps, one by one

### Step 1 — Am I in the right place, and are my tools installed?

The script checks that you are standing in the folder that contains `app.json`
and `package.json` (the `app/` folder). If you are somewhere else, it stops and
tells you to `cd` into the right folder.

It then checks that the tools it needs actually exist:

* **node** – the engine that runs JavaScript on your computer. If it is not on
  your PATH, the script looks inside `~/.nvm` and silently uses the Node version
  managed there. If there is no Node at all, it stops and prints the exact
  commands to install it (`nvm install --lts`, `sudo apt install nodejs npm`, or
  `brew install node@20`).
* **npm** and **npx** – the two programs that install and run JavaScript
  libraries. They ship with Node.
* **watchman** – an optional helper that lets Metro notice file changes quickly.
  The script does *not* stop if it is missing; it only warns you and prints how
  to install it (`sudo apt install -y watchman` on Ubuntu, `brew install
  watchman` on macOS).

It also refuses to continue on a Node version older than 18, because Expo SDK 52
needs at least Node 18 (20 LTS is what we recommend).

### Step 2 — The two PNG files Metro cannot find

This is the actual reason your bundle stalls at 56%. The code says, in effect,
"load `assets/logo/RSTRANSPARENTICONNB.png`" and Metro cannot find a file with
exactly that name.

For each of the two important logo files the script does this:

1. **Is the file exactly there?** (`assets/logo/RSTRANSPARENTICONNB.png` and
   `assets/logo/mainlogoone.png`.) If yes, it says OK and moves on.
2. **Is it there but spelled differently?** On Linux and inside Metro, capital
   letters matter: `rstransparenticonnb.png` is a *different file* from
   `RSTRANSPARENTICONNB.png`. If the script finds the file with the wrong
   letters, it **renames it** to the spelling the code expects.
3. **Is it somewhere else in the project?** The same picture sometimes exists in
   the mirrored folder `src/assets/logo/`. The script finds it and copies it into
   `assets/logo/` (the original is left untouched).
4. **Is it nowhere at all?** The script stops, prints the paths the code expects,
   lists everything that *is* in `assets/logo/` so you can spot the typo, and
   exits with a non-zero status. Nothing else can fix a file that does not exist
   — only you can put it there.

### Step 3 — Every other asset, plus huge files

Instead of only checking two files, the script reads **every** `import` and
`require(...)` in `src/`, `App.tsx` and `index.ts`, and works out the real file
each one points to. It resolves `./`, `../` and the `@/` shortcut, and it ignores
lines that are only comments or documentation examples.

* **Missing pictures, fonts, sounds, videos** → these would break the bundle, so
  the script prints them and stops so you can fix them first.
* **Missing code files** → printed as a warning, because Metro only breaks if
  that file is actually reachable from the app's entry point. Dead code and
  stale exports can be ignored; typos in live code cannot.
* **Paths written in `app.json`** (app icon, splash screen, plugin fonts) → also
  checked, as a warning, since Expo Go still runs without them.

It then looks for **any file inside `assets/` bigger than 5 MB** and lists the
largest ones with their size, plus practical advice (compress PNGs, or keep the
big `.webm` clips out of the bundle — `metro.config.js` already excludes the
`assets/videos/` folder and streams those clips from Firebase instead).

### Step 4 — Reinstall the libraries at Expo's exact versions

Expo works best when every Expo-related package is on the version that belongs to
SDK 52. The script asks Expo for its own list of "managed" packages
(`node_modules/expo/bundledNativeModules.json`), keeps only the ones your
`package.json` actually uses, and reinstalls them with `npx expo install`, in
small batches so you can see what is happening.

It then deals specifically with the warning you kept seeing:

* **`@react-native-async-storage/async-storage`** is compared with the version
  Expo SDK 52 expects (1.23.1). If yours differs, the exact version is installed
  and the warning disappears.
* A final ordinary `npm install` runs so `package-lock.json` and `node_modules`
  agree with each other. If npm refuses to run install scripts (a common npm 11+
  behaviour), the script retries with `--ignore-scripts` instead of giving up.

At the end it compares **every** installed version against Expo's list and warns
about any that still do not match, telling you to run `npx expo install --fix`.

Use `--skip-install` if you do not want `node_modules` touched at all.

### Step 5 — Circular imports

A circular import is when file A imports file B, and file B imports file A. The
app usually still runs, but the shared values can arrive as `undefined` at
runtime, which produces mysterious bugs.

The script builds a map of the whole `src/` folder (who imports whom) and reports
any loops it finds, with the full chain printed, e.g.
`src/lib/api.ts -> src/lib/httpClient.ts -> ... -> src/lib/api.ts`.

**The script never edits your code.** It asks *you* to break the loop by moving
the shared piece into a small new file that both sides import. If `madge` is
installed it also shows madge's report as a cross-check.

### Step 6 — Lint (ESLint with Expo's own rules)

Lint means "check the code for suspicious patterns". If your `package.json`
already has a `lint` script, the script runs it. If not, it installs ESLint plus
`eslint-config-expo` (Expo's official rules), creates a small `eslint.config.js`
the first time, and runs `npx eslint .`.

A long list of lint warnings is normal the first time a project is linted. Lint
problems **never** stop the app, so they are reported as a warning with the
autofix command (`npx eslint . --fix`). Use `--skip-lint` to silence the step.

### Step 7 — TypeScript check

TypeScript is the "types" layer of your code: it catches things like passing a
number where a piece of text is expected. The script runs `npx tsc --noEmit`,
which checks everything and writes no new files.

If errors are found you get the first 60 lines of the report. This project
currently has **many** pre-existing type errors; Metro ignores types completely
when it bundles, so the script **prints them, counts them as a failure and still
starts the app** so you get your preview. The command exits with status 1 so
scripts and CI know the code is not clean yet. If you would rather stop dead at
the first error, add `--strict`.

### Step 8 — Jest tests

Jest is the test runner. If `package.json` has a `test` script the script runs
`npm test`; otherwise it creates a tiny placeholder test
(`__tests__/placeholder.test.ts` — only if that file does not already exist) so
that a test suite always exists, and runs Jest directly.

Passing tests are reported with a summary line. Failing tests print the failing
test names and are counted as a failure, but the app still launches afterwards so
you can see it running. `--skip-tests` skips the whole step.

### Step 9 — Environment variables

The app reads settings such as API keys from `.env` (all the `EXPO_PUBLIC_*`
names). The script collects every variable that is *used* — both from
`.env.example` and from `process.env.EXPO_PUBLIC_...` in the code — and compares
that with what is actually defined in `.env`, then reports two lists:

* **referenced but not defined** — e.g. the four `EXPO_PUBLIC_GOOGLE_*` client
  IDs and `EXPO_PUBLIC_SENTRY_RELEASE`. Only the social-login buttons and Sentry
  release tagging are affected; the rest of the app is fine.
* **defined but left empty** — those features simply switch themselves off at
  runtime (Firebase, Sentry, PostHog, Gemini, Giphy, Mapbox...).

It also reminds you that `.env` is git-ignored: commit `.env.example`, never real
keys.

### Step 10 — Clear every cache

Old caches are the number-one cause of "it still shows the old error". The script:

* tells `watchman` to forget every folder it was watching (only if installed),
* deletes `.expo/`, `.metro/`, `.cache/` and `node_modules/.cache/`,
* deletes leftover Metro/Haste map files from `/tmp`.

Nothing here can break your project: all of it is regenerated on the next start.
The bundler is started with `-c` too, which clears Metro's own cache again.

### Step 11 — Expo's doctor and the dependency check

`expo doctor` is Expo's own health check. It looks at your config, your
dependencies and your project layout and prints a tick or a cross for each check.

* If it reports problems, the script prints the doctor output, suggests
  `npx expo install --fix`, counts it as a failure and (unless `--strict`)
  carries on to launch.
* If the doctor cannot run at all (no internet, or the package cannot be
  downloaded), the script says so and falls back to the offline check
  `npx expo install --check`, which compares versions without going online.

### Step 12 — Start the app

Finally the bundler starts with `EXPO_DEBUG=true npx expo start -c`, and you get
the familiar instructions:

* press **a** for Android,
* press **i** for iOS (simulator) or scan the QR code with **Expo Go**,
* press **w** for the web preview (`http://localhost:8081`),
* press **r** to reload, **j** for the debugger, **Ctrl+C** to stop.

The summary at the bottom shows how many warnings and failures there were, and
`fix-everything-report.txt` contains the same information plus a ready-made
bug-report template you can paste back into the chat.

---

## How the script decides to stop or carry on

| Situation | What happens |
| --- | --- |
| No Node/npm, wrong folder, a required PNG that is nowhere to be found, a referenced asset missing under `src/`, `npm install` failing twice | **Hard stop** — the app cannot run, so the script exits immediately with a clear message and status 1. |
| TypeScript errors, failing Jest tests, `expo doctor` problems, lint errors | **Reported** — printed in full, counted as a failure (status 1 at the end), but the bundler still starts so you always get a preview. Add `--strict` to stop instead. |
| Circular imports, oversized assets, missing optional environment variables, no watchman | **Warning** — printed with instructions, exit status stays 0. |

## Handy flags

| Flag | What it is for |
| --- | --- |
| `--preview` | Skip lint, type check and tests; go straight to the bundler. Fastest way to see the app. |
| `--no-start` | Do every check but do not launch the bundler. |
| `--skip-install`, `--skip-lint`, `--skip-typecheck`, `--skip-tests`, `--skip-doctor` | Leave out individual steps. |
| `--strict` | Treat every warning and every soft failure as a fatal error. |
| `--continue-on-error` | Never stop, and exit with status 0 even when checks failed. |
| `--one-by-one` | Run `npx expo install` once per package instead of in batches (slower, easier to read). |
| `--help` | Show the flag list again.

The same switches exist as environment variables for CI use:
`FIX_SKIP_INSTALL=1`, `FIX_SKIP_LINT=1`, `FIX_SKIP_TYPECHECK=1`,
`FIX_SKIP_TESTS=1`, `FIX_SKIP_DOCTOR=1`, `FIX_SKIP_START=1`.

## Is it safe to run twice?

Yes. Everything is written so that a second run changes nothing: an asset is only
renamed when the spelling is wrong, a missing file is only copied when it is
really absent, the placeholder test and the ESLint config are only created when
they do not exist, and caches are simply deleted and rebuilt. The script never
rewrites your application code.

## What the script creates or deletes

Created (only when needed): `__tests__/placeholder.test.ts`,
`eslint.config.js` (or `.eslintrc.json`), `fix-everything-report.txt`, plus the
usual `node_modules` / `package-lock.json` updates from the install step.

Deleted: `.expo/`, `.metro/`, `.cache/`, `node_modules/.cache/` and stray Metro
temp files in `/tmp`.

Nothing else is touched.