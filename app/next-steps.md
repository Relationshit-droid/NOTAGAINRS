# Next steps if something still fails

You ran `./fix-everything.sh` and something is still wrong. Work through this
page in order — the first three sections solve 95% of cases.

The script already left you two files with all the evidence:

* `fix-everything-report.txt` — every step, every OK/WARN/FAIL line of that run.
* the terminal output itself (scroll up; the `FAIL`/`WARN` lines say what broke).

---

## 1. See every single command the script ran

Run it again with shell tracing switched on:

```bash
bash -x ./fix-everything.sh 2>&1 | tee trace.log
```

* `-x` prints each command just before it runs, prefixed with `+`.
* `tee trace.log` keeps a copy so you can search it (`grep -n "expo install" trace.log`).
* If you only want the app on screen and no checks, use
  `./fix-everything.sh --preview`. To keep the checks but not launch, use
  `--no-start`. To make warnings fatal, use `--strict`.

## 2. Find Metro's last printed line — it names the guilty file

Metro prints the file it is working on, then the error. The **last line before
the error** and the two or three lines above it are what matter.

```bash
# Start Metro and keep the whole log:
EXPO_DEBUG=true npx expo start -c 2>&1 | tee metro.log
```

Then, in another terminal, search the log for the interesting bits:

```bash
grep -nE "FailedToResolvePathError|Unable to resolve|error:|Requiring module" metro.log | tail -20
tail -40 metro.log
```

Typical messages and what they mean:

| Message | Meaning | Fix |
| --- | --- | --- |
| `Unable to resolve module ../../assets/logo/X.png` | The file is not where the import says it is, or the capitalisation differs | `ls -l assets/logo/` and correct the file name or the import path |
| `FailedToResolvePathError` | Same as above, newer Metro wording | same |
| `SyntaxError: ... unexpected token` | A genuine code typo in that file | open the file at the printed line |
| `EADDRINUSE :8081` | Another Metro is already running | `pkill -f "expo start"` then retry |
| Stuck at the same % with no error | Cache or watcher gremlin | `rm -rf .expo .metro node_modules/.cache && npx expo start -c` |

**Copy the last 10 lines of `metro.log` into your bug report.** That single
snippet usually identifies the problem immediately.

## 3. Check a suspicious file by hand

```bash
# Does the file exist, and with exactly this spelling?
ls -l assets/logo/RSTRANSPARENTICONNB.png
ls -l assets/logo/mainlogoone.png

# What is in the folder, really? (spot case differences)
ls -1 assets/logo
find assets -iname "rstransparenticonnb*"     # any spelling anywhere

# Is there more than one copy?
find . -name "RSTRANSPARENTICONNB.png" -not -path "./node_modules/*"
```

Then compare the file name with the import in the code:

```bash
grep -rn "RSTRANSPARENTICONNB" src App.tsx | head
grep -rn "mainlogoone" src App.tsx | head
```

Fix whichever side is wrong, and remember: `Logo.png` and `logo.png` are two
different files on Linux, even though they look the same on Windows/macOS.

## 4. Run Expo's doctor and paste its output

```bash
npx expo doctor            # or, on newer CLIs:
npx expo-doctor
npx expo install --check   # offline version check, shows version drift
```

If it reports version drift, let Expo repair it, then re-run this script:

```bash
npx expo install --fix
./fix-everything.sh
```

## 5. When it is a dependency problem

```bash
# What does Expo expect vs what is installed?
npx expo install --check
node -p "require('@react-native-async-storage/async-storage/package.json').version"   # want 1.23.1
node -p "require('react-native-gesture-handler/package.json').version"

# Nuclear option (slow but reliable), then re-run the script:
rm -rf node_modules package-lock.json .expo .metro
npm install --ignore-scripts
npx expo install --fix
./fix-everything.sh
```

If `npm install` complains about a peer dependency, add `--legacy-peer-deps`.
If it complains about blocked install scripts (npm 11+), use `--ignore-scripts`.

## 6. When it is a Metro/cache problem

```bash
pkill -f "expo start"                 # make sure nothing old is running
watchman watch-del-all || true        # if watchman is installed
rm -rf .expo .metro .cache node_modules/.cache
rm -rf /tmp/metro-* /tmp/haste-map-*  # temp maps Metro keeps
EXPO_DEBUG=true npx expo start -c     # -c clears Metro's own cache
```

If it *still* fails, shut watchman's daemon down completely and try once more:
`watchman shutdown-server`.

## 7. Useful one-liners

```bash
node -v; npm -v; npx expo --version                 # versions for the bug report
npx tsc --noEmit | head -40                          # first type errors only
npx eslint . --fix                                   # auto-fix lint problems
npx jest --ci -t "part of a test name"               # run a single test
EXPO_DEBUG=true npx expo start -c --max-workers 1    # slower, clearer errors
npx expo start --tunnel                              # device cannot reach the PC
```

## 8. Report it back

Copy the block below, fill in the blanks, and paste it (plus the files listed)
into the chat. The more you paste, the faster the answer will be.

Attachments to include:

1. `fix-everything-report.txt` — produced by the script.
2. The last **10 lines** of Metro output (`tail -10 metro.log`).
3. The full output of `npx expo doctor`.

### Bug report

```
### Bug report
- OS / hardware: Ubuntu 22.04 on NucBox-G10
- Node version: <output of node -v>
- npm version: <output of npm -v>
- Expo CLI version: <output of npx expo --version>
- Project root: /home/c-jay69/Documents/TAB/NOTAGAINRS/app
- Command run: ./fix-everything.sh <flags I used>
- What I expected: the bundler starts and I get a QR code
- What happened instead: <one sentence>
- Which step failed: <the STEP x/12 line from the script>
- Last 10 lines of Metro output:
  <paste here>
- Full output of `./fix-everything.sh` (include the part where it stopped):
  <paste here>
- Any additional console errors (Metro, Android logcat, browser console):
  <paste here>
- `npx expo doctor` output:
  <paste here>
```

### Android logcat, if the app crashes after it opens

```bash
adb devices
adb logcat -c                 # clear
adb logcat | grep -iE "ReactNative|Expo|FATAL|AndroidRuntime"
```

Paste the lines around `FATAL EXCEPTION`.

### Web console, if the browser page is blank or red

Open the browser dev tools (F12) → **Console** tab → copy the red errors. The
first one is usually the cause; the rest are knock-on effects.

---

## Reminder: what "fixed" looks like

The run is healthy when the summary says `failures: 0`, Metro prints
`Bundling complete`, and the app opens on Android, iOS (Expo Go) and Web. Any
remaining `WARN` lines are the things from `beta-checklist.md` that you
consciously accepted (for example the pre-existing TypeScript errors, or the
oversized videos that are streamed from Firebase instead of bundled).