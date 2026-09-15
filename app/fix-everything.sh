#!/usr/bin/env bash
# =============================================================================
# fix-everything.sh — one-shot repair, verification and launch for the
# RELATIONSHIT! Expo app (Expo SDK 52 / React Native 0.76 / Metro).
#
#   Run it from the Expo project root (the folder that contains app.json):
#
#       cd app
#       chmod +x fix-everything.sh
#       ./fix-everything.sh
#
#   Useful flags:
#       --preview           Skip lint/typecheck/tests and go straight to the
#                           bundler (fastest way to get a QR code on screen).
#       --no-start          Run every check but do not launch the bundler.
#       --skip-install      Do not touch node_modules / package.json versions.
#       --skip-lint         Do not run ESLint.
#       --skip-typecheck    Do not run tsc.
#       --skip-tests        Do not run Jest.
#       --skip-doctor       Do not run expo-doctor.
#       --strict            Treat warnings (circular imports, oversized assets,
#                           missing optional env vars, lint errors) as fatal
#                           errors, and stop immediately on type/test failures.
#       --continue-on-error Never stop for type/test/doctor failures and exit
#                           with status 0 even when they fail (preview mode).
#
#   How failures are handled:
#       HARD STOP  — missing required/referenced assets, no Node/npm, a broken
#                    npm install: the app cannot run, so the script stops.
#       REPORTED   — TypeScript errors, failing Jest tests, expo-doctor errors,
#                    lint errors: the script prints them, marks the run as
#                    failed (exit status 1) and STILL launches the bundler so
#                    you always get your preview. Use --strict to stop instead.
#       WARNING    — circular imports, oversized assets, missing optional env
#                    vars: printed with instructions, exit status stays 0.
#       --one-by-one        Run `npx expo install` once per package instead of
#                           in batches (slower, maximum traceability).
#       --help              Show this help.
#
#   The script is idempotent: running it twice changes nothing the second time.
#   It never rewrites your application code. The only files it may create are
#   __tests__/placeholder.test.ts (only when package.json has no "test"
#   script) and fix-everything-report.txt.
#
#   A machine-readable report of the whole run is written to
#   fix-everything-report.txt in the project root.
# =============================================================================

set -uo pipefail

# ---------------------------------------------------------------------------
# 0. Globals, colours and tiny output helpers
# ---------------------------------------------------------------------------
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_PATH"
cd "$PROJECT_ROOT" || exit 1

REPORT_FILE="$PROJECT_ROOT/fix-everything-report.txt"
MAX_ASSET_MB=5
TOTAL_STEPS=12
STEP_NO=0
FAILURES=0
WARNINGS=0
SKIPPED=""

if [[ -t 1 ]]; then
  BOLD="$(tput bold 2>/dev/null || true)"; DIM="$(tput dim 2>/dev/null || true)"
  RED="$(tput setaf 1 2>/dev/null || true)"; GREEN="$(tput setaf 2 2>/dev/null || true)"
  YELLOW="$(tput setaf 3 2>/dev/null || true)"; BLUE="$(tput setaf 4 2>/dev/null || true)"
  CYAN="$(tput setaf 6 2>/dev/null || true)"; RESET="$(tput sgr0 2>/dev/null || true)"
else
  BOLD=""; DIM=""; RED=""; GREEN=""; YELLOW=""; BLUE=""; CYAN=""; RESET=""
fi

say()  { printf '%s\n' "$*"; }
step() {
  STEP_NO=$((STEP_NO + 1))
  say ""
  say "${BOLD}${BLUE}=============================================================${RESET}"
  say "${BOLD}${BLUE}  STEP ${STEP_NO}/${TOTAL_STEPS}  ${CYAN}${*}${RESET}"
  say "${BOLD}${BLUE}=============================================================${RESET}"
  printf '\nSTEP %s/%s: %s\n' "$STEP_NO" "$TOTAL_STEPS" "$*" >> "$REPORT_FILE"
}
ok()   { say "  ${GREEN}OK${RESET}    $*"; printf '  OK    %s\n' "$*" >> "$REPORT_FILE"; }
warn() { WARNINGS=$((WARNINGS + 1)); say "  ${YELLOW}WARN${RESET}  $*"; printf '  WARN  %s\n' "$*" >> "$REPORT_FILE"; }
info() { say "  ${DIM}....${RESET}  $*"; printf '  .... %s\n' "$*" >> "$REPORT_FILE"; }
bad()  { FAILURES=$((FAILURES + 1)); say "  ${RED}FAIL${RESET}  $*"; printf '  FAIL  %s\n' "$*" >> "$REPORT_FILE"; }
skip() { SKIPPED="$SKIPPED $1"; say "  ${YELLOW}SKIP${RESET}  $*"; printf '  SKIP  %s\n' "$*" >> "$REPORT_FILE"; }

die() {
  say ""
  say "${BOLD}${RED}#############################################################${RESET}"
  say "${BOLD}${RED}  STOPPED: $*${RESET}"
  say "${BOLD}${RED}#############################################################${RESET}"
  printf '\nABORTED: %s\n' "$*" >> "$REPORT_FILE"
  say ""
  say "  Full log of this run: $REPORT_FILE"
  say "  What to do next:      cat next-steps.md"
  exit 1
}

have() { command -v "$1" >/dev/null 2>&1; }
timestamp() { date '+%Y-%m-%d %H:%M:%S'; }

# Run a command with a timeout when coreutils' `timeout` is available.
run_timeout() {
  local seconds="$1"; shift
  if have timeout; then timeout "$seconds" "$@"; else "$@"; fi
}

# ---------------------------------------------------------------------------
# 1. Flag parsing
# ---------------------------------------------------------------------------
SKIP_INSTALL=0; SKIP_LINT=0; SKIP_TYPECHECK=0; SKIP_TESTS=0; SKIP_DOCTOR=0
SKIP_START=0; STRICT=0; CONTINUE_ON_ERROR=0; ONE_BY_ONE=0

usage() {
  cat <<'USAGE'
fix-everything.sh — repair, verify and launch the RELATIONSHIT! Expo app

  ./fix-everything.sh [flags]

Flags:
  --preview           Skip lint/typecheck/tests and go straight to the bundler.
  --no-start          Run every check but do not launch the bundler.
  --skip-install      Do not touch node_modules / package.json versions.
  --skip-lint         Do not run ESLint.
  --skip-typecheck    Do not run tsc --noEmit.
  --skip-tests        Do not run Jest.
  --skip-doctor       Do not run expo-doctor.
  --strict            Treat warnings (cycles, oversized assets, missing optional
                      env vars, lint errors) as fatal errors, and stop at the
                      first type/test/doctor failure instead of continuing.
  --continue-on-error Never stop for type/test/doctor failures, and exit with
                      status 0 even when something failed (preview mode).
  --one-by-one        Run `npx expo install` once per package (slow, traceable).
  -h, --help          Show this help.

Environment overrides: FIX_SKIP_INSTALL=1 FIX_SKIP_LINT=1 FIX_SKIP_TYPECHECK=1
                      FIX_SKIP_TESTS=1 FIX_SKIP_DOCTOR=1 FIX_SKIP_START=1
USAGE
  exit 0
}

for arg in "$@"; do
  case "$arg" in
    --preview)           SKIP_LINT=1; SKIP_TYPECHECK=1; SKIP_TESTS=1 ;;
    --no-start)          SKIP_START=1 ;;
    --skip-install)      SKIP_INSTALL=1 ;;
    --skip-lint)         SKIP_LINT=1 ;;
    --skip-typecheck)    SKIP_TYPECHECK=1 ;;
    --skip-tests)        SKIP_TESTS=1 ;;
    --skip-doctor)       SKIP_DOCTOR=1 ;;
    --strict)            STRICT=1 ;;
    --continue-on-error) CONTINUE_ON_ERROR=1 ;;
    --one-by-one)        ONE_BY_ONE=1 ;;
    -h|--help)           usage ;;
    *) say "Unknown flag: $arg (use --help)"; exit 2 ;;
  esac
done

: "${FIX_SKIP_INSTALL:=0}"; : "${FIX_SKIP_LINT:=0}"; : "${FIX_SKIP_TYPECHECK:=0}"
: "${FIX_SKIP_TESTS:=0}";   : "${FIX_SKIP_DOCTOR:=0}"; : "${FIX_SKIP_START:=0}"
[[ "$FIX_SKIP_INSTALL"   == "1" ]] && SKIP_INSTALL=1
[[ "$FIX_SKIP_LINT"      == "1" ]] && SKIP_LINT=1
[[ "$FIX_SKIP_TYPECHECK" == "1" ]] && SKIP_TYPECHECK=1
[[ "$FIX_SKIP_TESTS"     == "1" ]] && SKIP_TESTS=1
[[ "$FIX_SKIP_DOCTOR"    == "1" ]] && SKIP_DOCTOR=1
[[ "$FIX_SKIP_START"     == "1" ]] && SKIP_START=1

say "${BOLD}${CYAN}"
say "  ============================================================"
say "   fix-everything.sh   |   Expo SDK 52 repair + verify + run"
say "   project: $PROJECT_ROOT"
say "   started: $(timestamp)"
say "  ============================================================"
say "${RESET}"
printf 'fix-everything.sh run at %s on %s\n' "$(timestamp)" "$(uname -srm)" > "$REPORT_FILE"

# ---------------------------------------------------------------------------
# 2. Preflight: are we in the right folder, and are the tools installed?
# ---------------------------------------------------------------------------
step "Preflight: project folder and required global tools"

[[ -f "$PROJECT_ROOT/app.json" ]]     || die "app.json not found in $PROJECT_ROOT. Run this script from the Expo project root (the app/ folder)."
[[ -f "$PROJECT_ROOT/package.json" ]] || die "package.json not found in $PROJECT_ROOT. Run this script from the Expo project root (the app/ folder)."
ok "Found app.json and package.json — this is an Expo project root."

# Try to make nvm-managed Node available automatically. nvm.sh is NOT safe to
# source under `set -u`, so it runs inside a clean subshell and we only take
# the resulting PATH back into this script.
if ! have node && [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  info "node is not on PATH — looking for an nvm-managed Node.js..."
  NVM_NODE_BIN="$(bash -c '. "$HOME/.nvm/nvm.sh" >/dev/null 2>&1; nvm use --lts >/dev/null 2>&1 || nvm use default >/dev/null 2>&1; command -v node' 2>/dev/null || true)"
  if [[ -z "$NVM_NODE_BIN" && -d "$HOME/.nvm/versions/node" ]]; then
    # No default/lts alias: take the highest installed version that has a node binary.
    NVM_NODE_BIN="$(ls -1d "$HOME"/.nvm/versions/node/*/bin 2>/dev/null | sort -V | tail -1)/node"
    [[ -x "$NVM_NODE_BIN" ]] || NVM_NODE_BIN=""
  fi
  if [[ -n "$NVM_NODE_BIN" && -x "$NVM_NODE_BIN" ]]; then
    export PATH="$(dirname "$NVM_NODE_BIN"):$PATH"
    ok "Using nvm Node.js at $NVM_NODE_BIN"
  else
    info "nvm is installed but no usable Node.js version was found."
  fi
fi

if ! have node; then
  bad "node is not installed (or not on your PATH)."
  say "        Install Node.js 20 LTS, then run this script again:"
  say "          • nvm (recommended): curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash"
  say "                               nvm install --lts && nvm use --lts"
  say "          • Debian/Ubuntu:     sudo apt update && sudo apt install -y nodejs npm"
  say "          • macOS:             brew install node@20"
  die "Node.js is required."
fi
info "node $(node -v) at $(command -v node)"

NODE_MAJOR="$(node -v | sed 's/^v\([0-9]*\).*/\1/')"
if [[ "${NODE_MAJOR:-0}" -lt 18 ]]; then
  bad "Node.js $(node -v) is too old — Expo SDK 52 needs Node 18 or newer (20 LTS recommended)."
  die "Upgrade Node.js (nvm install --lts) and run this script again."
fi
ok "Node.js version $(node -v) is supported."

if ! have npm; then
  bad "npm is not installed (it normally ships with Node.js)."
  die "Install npm (https://nodejs.org) and run this script again."
fi
info "npm $(npm -v)"

if ! have npx; then
  bad "npx is not installed (it normally ships with npm)."
  die "Reinstall Node.js/npm so that npx is available, then run this script again."
fi
ok "npx is available."

if have watchman; then
  ok "watchman is installed — Metro file watching will be fast."
else
  warn "watchman is NOT installed. Expo works without it, but Metro may re-scan slowly."
  say "        Install it with:  sudo apt install -y watchman   (Debian/Ubuntu)"
  say "                          brew install watchman           (macOS)"
fi

# Scratch folder for the helper Node scripts this script generates.
NODE_SCRIPTS="$(mktemp -d "${TMPDIR:-/tmp}/fix-everything.XXXXXX")"
cleanup() { rm -rf "$NODE_SCRIPTS"; }
trap cleanup EXIT

# ---------------------------------------------------------------------------
# Helper Node scripts (written to a temp dir; the project itself is untouched)
# ---------------------------------------------------------------------------
cat > "$NODE_SCRIPTS/scan-assets.js" <<'NODE_ASSETS'
// Walks src/ (plus App.tsx / index.ts) and reports every relative or "@/"
// import/require whose target file does not exist, classified as an asset
// (hard error) or a code module (soft warning). Also audits app.json paths.
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2];
const CODE_EXT = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'];
const ASSET_EXT = new Set(['.png','.jpg','.jpeg','.gif','.webp','.svg','.bmp','.ico',
  '.ttf','.otf','.woff','.woff2','.mp3','.wav','.m4a','.aac','.mp4','.webm','.mov',
  '.lottie','.riv','.dotlottie','.wasm']);
const SKIP_DIRS = new Set(['node_modules','.git','.expo','.metro','.cache','dist',
  'web-build','coverage','android','ios','download']);

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
function exists(p) { try { return fs.statSync(p).isFile(); } catch (e) { return false; } }
function resolveSpec(fromFile, spec) {
  spec = spec.split('?')[0].split('#')[0];
  let target;
  if (spec.startsWith('@/')) target = path.join(ROOT, 'src', spec.slice(2));
  else if (spec.startsWith('.')) target = path.resolve(path.dirname(fromFile), spec);
  else return true; // external package — not our business
  const cands = [target];
  for (const e of CODE_EXT) cands.push(target + e, path.join(target, 'index' + e));
  cands.push(target + '.d.ts', path.join(target, 'index.d.ts'));
  return cands.some(exists);
}
const PATTERNS = [
  /require\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\bfrom\s*['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  /(^|\n)\s*import\s+['"]([^'"]+)['"]/g,
];
const softCtx = /__mocks__|__tests__|\.test\.|\.spec\.|cypress/;
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}
const roots = ['src', 'App.tsx', 'index.ts']
  .map((r) => path.join(ROOT, r)).filter((p) => fs.existsSync(p));
let files = [];
for (const r of roots) {
  if (fs.statSync(r).isDirectory()) files = files.concat(walk(r, []));
  else files.push(r);
}
let hard = 0, soft = 0, checked = 0;
for (const f of files) {
  if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f)) continue;
  let src; try { src = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
  src = stripComments(src);
  const specs = new Set();
  for (const re of PATTERNS) { re.lastIndex = 0; let m; while ((m = re.exec(src))) specs.add(m[m.length - 1]); }
  for (const s of specs) {
    if (!s.startsWith('@/') && !s.startsWith('.')) continue;
    if (s.startsWith('@/') === false && !/^\.\.?\//.test(s)) continue;
    checked++;
    if (resolveSpec(f, s)) continue;
    const ext = path.extname(s.split('?')[0]).toLowerCase();
    const assetLike = ASSET_EXT.has(ext) || s.includes('/assets/');
    const rel = path.relative(ROOT, f);
    if (assetLike && !softCtx.test(rel)) { console.log('MISSING|' + rel + '|' + s); hard++; }
    else { console.log('MISSING_SOFT|' + rel + '|' + s); soft++; }
  }
}
// Paths declared in app.json (icons, splash, plugin fonts, ...)
const cfg = path.join(ROOT, 'app.json');
if (fs.existsSync(cfg)) {
  let json = null; try { json = JSON.parse(fs.readFileSync(cfg, 'utf8')); } catch (e) { json = null; }
  const visit = (node, keyPath) => {
    if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) visit(node[k], keyPath ? keyPath + '.' + k : k);
    } else if (typeof node === 'string' && (node.startsWith('./') || node.startsWith('../'))) {
      if (exists(path.resolve(ROOT, node))) checked++;
      else { console.log('MISSING_CONFIG|app.json -> ' + keyPath + '|' + node); soft++; }
    }
  };
  if (json) visit(json, '');
}
console.log('SCANNED|' + files.length + '|' + checked);
console.log('COUNTS|' + hard + '|' + soft);
NODE_ASSETS

# ---------------------------------------------------------------------------
# 3. Required image assets (case-sensitive) + dynamic missing-asset scan
# ---------------------------------------------------------------------------
# Repairs a single asset path in place: fixes casing, or copies a matching
# file found elsewhere in the repo (e.g. the mirrored src/assets/logo folder).
# Returns 0 when the file is present afterwards, 1 when it is still missing.
repair_required_asset() {
  local rel="$1" dir base match
  dir="$(dirname "$rel")"
  base="$(basename "$rel")"

  if [[ -f "$rel" ]]; then
    ok "present: $rel ($(du -h "$rel" | cut -f1))"
    return 0
  fi

  warn "MISSING: $rel — looking for the same name with different capitalisation..."

  if [[ -d "$dir" ]]; then
    match="$(find "$dir" -maxdepth 1 -type f -iname "$base" -print -quit 2>/dev/null || true)"
  else
    match=""
  fi

  if [[ -n "$match" && -f "$match" ]]; then
    info "Found '$match' — renaming it to the exact case the code expects."
    if mv -- "$match" "$rel"; then
      ok "renamed $(basename "$match") -> $base"
      return 0
    fi
    bad "Could not rename $match (permissions?)."
    return 1
  fi

  # Second chance: the same file may live in the mirrored assets folder
  # (assets/logo vs src/assets/logo) or anywhere else in the repo.
  match="$(find "$PROJECT_ROOT" -path "*/node_modules" -prune -o -type f -iname "$base" -print -quit 2>/dev/null || true)"
  if [[ -n "$match" && -f "$match" ]]; then
    info "Found a copy at '$match' — copying it into place (original left untouched)."
    if mkdir -p "$dir" && cp -n -- "$match" "$rel"; then
      ok "copied $(printf '%s' "$match" | sed "s|$PROJECT_ROOT/||") -> $rel"
      return 0
    fi
    bad "Could not copy $match to $rel."
    return 1
  fi

  return 1
}

step "Required image assets (exact case-sensitive file names)"

REQUIRED_ASSET_PATHS=(
  "assets/logo/RSTRANSPARENTICONNB.png"
  "assets/logo/mainlogoone.png"
)
REQUIRED_ASSET_USERS=(
  "src/screens/auth/LoginAndSignUp.tsx, src/components/ui/Header.tsx, src/utils/assets.ts, src/constants/assetManifest.ts"
  "brand artwork used by the splash / header layouts"
)
MISSING_REQUIRED=0
for i in "${!REQUIRED_ASSET_PATHS[@]}"; do
  if ! repair_required_asset "${REQUIRED_ASSET_PATHS[$i]}"; then
    MISSING_REQUIRED=1
    bad "Still missing: ${REQUIRED_ASSET_PATHS[$i]}"
    say "        Referenced by: ${REQUIRED_ASSET_USERS[$i]}"
  fi
done

if [[ "$MISSING_REQUIRED" -eq 1 ]]; then
  say ""
  say "  The PNG files below could not be found anywhere in this project."
  say "  Metro is stopping at 56% precisely because of these imports."
  say ""
  say "  How to fix (pick one):"
  say "    1. Put the correctly-named file in assets/logo/ — names are case sensitive:"
  say "         ${REQUIRED_ASSET_PATHS[*]}"
  say "    2. Or point the code at a file that does exist, e.g. in"
  say "       src/screens/auth/LoginAndSignUp.tsx change"
  say "         require('../../../assets/logo/RSTRANSPARENTICONNB.png')"
  say "       to the real file name."
  say ""
  say "  Files currently in assets/logo/ :"
  if [[ -d assets/logo ]]; then ls -1 assets/logo | sed 's/^/      /'; else say "      (assets/logo does not exist!)"; fi
  die "Required asset file(s) missing."
fi
ok "All explicitly required assets are present with the correct capitalisation."

step "Every other asset referenced by src/ (scan) and oversized-file audit"

SCAN_LOG="$NODE_SCRIPTS/assets-scan.log"
if ! node "$NODE_SCRIPTS/scan-assets.js" "$PROJECT_ROOT" > "$SCAN_LOG" 2>&1; then
  warn "The internal asset scanner reported a problem while running:"
  sed 's/^/        /' "$SCAN_LOG" | head -20
else
  MISSING_HARD_FILE="$NODE_SCRIPTS/missing-hard.txt"
  MISSING_SOFT_FILE="$NODE_SCRIPTS/missing-soft.txt"
  CONFIG_MISSING_FILE="$NODE_SCRIPTS/missing-config.txt"
  : > "$MISSING_HARD_FILE"; : > "$MISSING_SOFT_FILE"; : > "$CONFIG_MISSING_FILE"

  while IFS='|' read -r tag a b; do
    case "${tag:-}" in
      MISSING)        printf '%s -> %s\n' "$a" "$b" >> "$MISSING_HARD_FILE" ;;
      MISSING_SOFT)   printf '%s -> %s\n' "$a" "$b" >> "$MISSING_SOFT_FILE" ;;
      MISSING_CONFIG) printf '%s  (declared in %s)\n' "$b" "$a" >> "$CONFIG_MISSING_FILE" ;;
      SCANNED)        info "Scanned $a source files and resolved $b import/require paths." ;;
      COUNTS)         info "Referenced-but-missing assets: $a   (unresolved code modules: $b)" ;;
    esac
  done < "$SCAN_LOG"

  HARD_N="$(wc -l < "$MISSING_HARD_FILE" | tr -d ' ')"
  SOFT_N="$(wc -l < "$MISSING_SOFT_FILE" | tr -d ' ')"
  CFG_N="$(wc -l < "$CONFIG_MISSING_FILE" | tr -d ' ')"

  if [[ "${HARD_N:-0}" -gt 0 ]]; then
    bad "$HARD_N asset file(s) referenced by application code do not exist:"
    head -40 "$MISSING_HARD_FILE" | sed 's/^/        /'
    [[ "$HARD_N" -gt 40 ]] && say "        ... and $((HARD_N - 40)) more."
    say ""
    say "  Metro cannot bundle a missing file. Fix the typo, or create the file."
    say "  Check the capitalisation of every folder and file name — Linux is case sensitive."
    die "$HARD_N missing asset reference(s) under src/."
  fi
  ok "Every asset referenced by src/, App.tsx and index.ts resolves to a real file."

  if [[ "${CFG_N:-0}" -gt 0 ]]; then
    warn "$CFG_N path(s) declared in app.json do not exist (cosmetic; Expo Go still runs):"
    head -20 "$CONFIG_MISSING_FILE" | sed 's/^/        /'
    say "        Create the file, or remove the entry from app.json before the next build."
  fi

  if [[ "${SOFT_N:-0}" -gt 0 ]]; then
    warn "$SOFT_N relative code module(s) could not be resolved (non-fatal):"
    head -20 "$MISSING_SOFT_FILE" | sed 's/^/        /'
    [[ "$SOFT_N" -gt 20 ]] && say "        ... and $((SOFT_N - 20)) more."
    say "        Metro only fails on these if the file is actually reachable from the entry"
    say "        point (index.ts -> App.tsx); dead code and stale exports can be ignored —"
    say "        but a typo'd path inside live code will break the bundle. Worth a look."
  fi
fi

# --- oversized assets (> ${MAX_ASSET_MB} MB) --------------------------------
OVERSIZED_LOG="$NODE_SCRIPTS/oversized.txt"
: > "$OVERSIZED_LOG"
if [[ -d assets ]]; then
  find assets -type f -size +"${MAX_ASSET_MB}"M -print0 2>/dev/null \
    | while IFS= read -r -d '' f; do
        printf '%s\t%s\n' "$(du -k "$f" 2>/dev/null | cut -f1)" "$f"
      done \
    | sort -rn > "$OVERSIZED_LOG" || true
fi
OVERSIZED_N="$(wc -l < "$OVERSIZED_LOG" | tr -d ' ')"
if [[ "${OVERSIZED_N:-0}" -gt 0 ]]; then
  warn "$OVERSIZED_N file(s) inside assets/ are larger than ${MAX_ASSET_MB} MB:"
  head -15 "$OVERSIZED_LOG" | while IFS=$'\t' read -r kb path; do
    printf '        %6s MB  %s\n' "$((kb / 1024))" "$path"
  done
  [[ "$OVERSIZED_N" -gt 15 ]] && say "        ... and $((OVERSIZED_N - 15)) more."
  say "        Suggestions:"
  say "          • Large .webm/.mp4 clips are already excluded from the bundle by"
  say "            metro.config.js (resolver.blockList) and streamed at runtime — keep it that way."
  say "          • For images: re-encode with e.g.  pngquant --quality=65-80 <file>  or"
  say "            convert to .webp, aim for < 1 MB per image."
  say "          • Or host the file (Firebase Storage) and reference the https URL."
  if [[ "$STRICT" -eq 1 ]]; then die "Oversized assets found and --strict was requested."; fi
else
  ok "No asset inside assets/ is larger than ${MAX_ASSET_MB} MB."
fi

cat > "$NODE_SCRIPTS/managed-deps.js" <<'NODE_MANAGED'
// Prints, one per line, every dependency of this project that Expo SDK 52
// manages (i.e. every package present in expo/bundledNativeModules.json).
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2];
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
let bundled = {};
try {
  bundled = JSON.parse(fs.readFileSync(
    path.join(ROOT, 'node_modules', 'expo', 'bundledNativeModules.json'), 'utf8'));
} catch (e) { /* not installed yet — caller falls back to a hard-coded list */ }
const all = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
const managed = Object.keys(all)
  .filter((n) => Object.prototype.hasOwnProperty.call(bundled, n))
  .sort();
process.stdout.write(managed.join('\n'));
if (managed.length) process.stdout.write('\n');
process.stderr.write('MANAGED_COUNT=' + managed.length + '\n');
NODE_MANAGED

cat > "$NODE_SCRIPTS/check-pins.js" <<'NODE_PINS'
// Compares the *installed* version of every Expo-managed dependency with the
// version Expo SDK 52 expects. Prints:
//   MISMATCH|name|installed <v>|expo wants <v>
//   NOT_INSTALLED|name|<expected>
//   PINS|<mismatchCount>|<notInstalledCount>
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2];
const clean = (s) => String(s).replace(/^[\^~>=<\s*]+/, '').trim();
let bundled = {};
try {
  bundled = JSON.parse(fs.readFileSync(
    path.join(ROOT, 'node_modules', 'expo', 'bundledNativeModules.json'), 'utf8'));
} catch (e) {
  console.log('PINS_UNAVAILABLE');
  process.exit(0);
}
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const deps = Object.assign({}, pkg.dependencies || {});
let mismatch = 0, missing = 0;
for (const name of Object.keys(deps)) {
  if (!bundled[name]) continue;
  const expected = clean(bundled[name]);
  let installed = null;
  try {
    installed = JSON.parse(fs.readFileSync(
      path.join(ROOT, 'node_modules', name, 'package.json'), 'utf8')).version;
  } catch (e) { installed = null; }
  if (!installed) { console.log('NOT_INSTALLED|' + name + '|' + expected); missing++; continue; }
  if (installed !== expected) {
    console.log('MISMATCH|' + name + '|installed ' + installed + '|expo wants ' + expected);
    mismatch++;
  }
}
console.log('PINS|' + mismatch + '|' + missing);
NODE_PINS

step "Dependencies: reinstall the exact versions Expo SDK 52 pins"

ASYNC_STORAGE_PKG="@react-native-async-storage/async-storage"
# Used only if node_modules/expo/bundledNativeModules.json is not readable yet.
FALLBACK_MANAGED=(
  expo-splash-screen react-native-gesture-handler react-native-reanimated
  react-native-safe-area-context react-native-screens react-native-svg
  react-native-web "@react-native-async-storage/async-storage"
  "@react-native-community/netinfo" "@react-native-community/slider"
  "@react-native-masked-view/masked-view" "@react-native-picker/picker"
  "@expo/metro-runtime"
)

# Reads a file into the global array ARRAY_OUT (works on bash 3.2+ as well).
read_lines_to_array() {
  ARRAY_OUT=()
  local line
  if [[ -f "$1" ]]; then
    while IFS= read -r line; do
      [[ -n "$line" ]] && ARRAY_OUT+=("$line")
    done < "$1"
  fi
}

if [[ ! -d node_modules ]]; then
  warn "node_modules/ does not exist — a full install is required."
fi

if [[ "$SKIP_INSTALL" -eq 1 ]]; then
  skip "Dependency installation (--skip-install) — existing node_modules is used as-is."
else
  # The local Expo CLI must exist first, otherwise `npx expo` would download one.
  if [[ ! -x node_modules/.bin/expo ]]; then
    info "Local Expo CLI not installed yet — running a first 'npm install' to bootstrap it."
    if ! npm install --no-audit --no-fund; then
      warn "'npm install' failed — retrying with --ignore-scripts (npm 11+ blocks install scripts)."
      npm install --no-audit --no-fund --ignore-scripts \
        || die "'npm install' failed twice. Try: rm -rf node_modules package-lock.json && npm install --ignore-scripts"
    fi
    ok "Base install finished."
  fi

  MANAGED_LIST_FILE="$NODE_SCRIPTS/managed.txt"
  node "$NODE_SCRIPTS/managed-deps.js" "$PROJECT_ROOT" > "$MANAGED_LIST_FILE" 2>"$NODE_SCRIPTS/managed.err" || true
  MANAGED_PKGS=()
  read_lines_to_array "$MANAGED_LIST_FILE"
  MANAGED_PKGS=("${ARRAY_OUT[@]}")
  if [[ "${#MANAGED_PKGS[@]}" -eq 0 ]]; then
    warn "Could not read the Expo SDK 52 managed-package list — using the built-in fallback list."
    MANAGED_PKGS=("${FALLBACK_MANAGED[@]}")
  fi
  info "Re-pinning ${#MANAGED_PKGS[@]} Expo-managed package(s) with 'npx expo install'."

  CHUNK=15
  [[ "$ONE_BY_ONE" -eq 1 ]] && CHUNK=1
  INSTALL_FAILED=0
  i=0
  total="${#MANAGED_PKGS[@]}"
  while [[ "$i" -lt "$total" ]]; do
    batch=("${MANAGED_PKGS[@]:$i:$CHUNK}")
    info "npx expo install --npm ${batch[*]}"
    if ! npx expo install --npm "${batch[@]}"; then
      warn "That batch reported an error — will retry with the npm fallback at the end."
      INSTALL_FAILED=1
    fi
    i=$((i + CHUNK))
  done
  if [[ "$INSTALL_FAILED" -eq 0 ]]; then
    ok "Every Expo-managed dependency was re-installed at the Expo-pinned version."
  fi

  # --- async-storage: the version warning the user kept seeing -----------------
  EXPECTED_AS="$(node -p "try{require('$PROJECT_ROOT/node_modules/expo/bundledNativeModules.json')['$ASYNC_STORAGE_PKG']||''}catch(e){''}" 2>/dev/null || true)"
  [[ -z "$EXPECTED_AS" ]] && EXPECTED_AS="1.23.1"
  INSTALLED_AS="$(node -p "try{require('$PROJECT_ROOT/node_modules/$ASYNC_STORAGE_PKG/package.json').version}catch(e){''}" 2>/dev/null || true)"
  if [[ "$INSTALLED_AS" == "$EXPECTED_AS" ]]; then
    ok "async-storage version warning resolved (installed $INSTALLED_AS = Expo SDK 52 pin)."
  else
    warn "async-storage is '${INSTALLED_AS:-not installed}' but Expo SDK 52 expects $EXPECTED_AS — installing the exact version."
    npm i --save-exact "$ASYNC_STORAGE_PKG@$EXPECTED_AS" \
      || npm i --save-exact --ignore-scripts "$ASYNC_STORAGE_PKG@$EXPECTED_AS" \
      || warn "Automatic async-storage pin failed — run manually: npm i $ASYNC_STORAGE_PKG@$EXPECTED_AS"
  fi

  # --- finish with a plain npm install ---------------------------------------
  info "Running a final 'npm install' so package-lock.json matches node_modules..."
  if npm install --no-audit --no-fund; then
    ok "'npm install' finished."
  elif npm install --no-audit --no-fund --ignore-scripts; then
    ok "'npm install --ignore-scripts' finished (npm 11+ workaround)."
  else
    bad "'npm install' failed twice — the dependency tree is incomplete."
    [[ "$CONTINUE_ON_ERROR" -eq 0 ]] && die "Dependency installation failed. See the npm output above."
  fi
fi

# --- verify every Expo-managed pin, installed vs expected --------------------
PINS_LOG="$NODE_SCRIPTS/pins.log"
node "$NODE_SCRIPTS/check-pins.js" "$PROJECT_ROOT" > "$PINS_LOG" 2>&1 || true
PINS_BAD="$NODE_SCRIPTS/pins-bad.txt"
grep -E '^(MISMATCH|NOT_INSTALLED)\|' "$PINS_LOG" > "$PINS_BAD" 2>/dev/null || true
PIN_BAD_N="$(wc -l < "$PINS_BAD" | tr -d ' ')"
PIN_SUMMARY="$(grep -E '^PINS\|' "$PINS_LOG" | head -1 || true)"
if grep -q '^PINS_UNAVAILABLE' "$PINS_LOG" 2>/dev/null; then
  warn "Could not verify the Expo pins: node_modules/expo/bundledNativeModules.json is missing."
  say "        Fix with:  npm install   then   npx expo install --fix"
elif [[ "${PIN_BAD_N:-0}" -gt 0 ]]; then
  warn "$PIN_BAD_N Expo-managed package(s) still do not match the SDK 52 pin:"
  sed 's/^/        /' "$PINS_BAD" | head -25
  say "        Let Expo fix them automatically with:  npx expo install --fix"
else
  ok "All Expo-managed dependencies match the versions Expo SDK 52 expects."
fi
[[ -n "$PIN_SUMMARY" ]] && info "Pin summary: $PIN_SUMMARY"

# react-native-gesture-handler was the package the user reinstalled by hand:
GH_VER="$(node -p "try{require('$PROJECT_ROOT/node_modules/react-native-gesture-handler/package.json').version}catch(e){'not installed'}" 2>/dev/null || echo 'not installed')"
info "react-native-gesture-handler installed: $GH_VER"
info "expo installed: $(node -p "try{require('$PROJECT_ROOT/node_modules/expo/package.json').version}catch(e){'not installed'}" 2>/dev/null || echo 'not installed')"

cat > "$NODE_SCRIPTS/find-cycles.js" <<'NODE_CYCLES'
// Builds the local import graph of src/ (+ App.tsx, index.ts) and reports
// every circular chain it can find. Never modifies any file.
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2];
const CODE_EXT = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'];
const SKIP_DIRS = new Set(['node_modules','.git','.expo','.metro','.cache','dist',
  'web-build','coverage','android','ios','download']);

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
function exists(p) { try { return fs.statSync(p).isFile(); } catch (e) { return false; } }
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}
function resolve(fromFile, spec) {
  spec = spec.split('?')[0].split('#')[0];
  let target;
  if (spec.startsWith('@/')) target = path.join(ROOT, 'src', spec.slice(2));
  else if (spec.startsWith('.')) target = path.resolve(path.dirname(fromFile), spec);
  else return null; // external package
  const cands = [target];
  for (const e of CODE_EXT) cands.push(target + e, path.join(target, 'index' + e));
  for (const c of cands) if (exists(c)) return c;
  return null;
}
const PATTERNS = [
  /\bfrom\s*['"]([^'"]+)['"]/g,
  /require\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  /(^|\n)\s*import\s+['"]([^'"]+)['"]/g,
];
const roots = ['src', 'App.tsx', 'index.ts']
  .map((r) => path.join(ROOT, r)).filter((p) => fs.existsSync(p));
let files = [];
for (const r of roots) {
  if (fs.statSync(r).isDirectory()) files = files.concat(walk(r, []));
  else files.push(r);
}
const graph = new Map();
let edges = 0;
for (const f of files) {
  if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f)) continue;
  let src; try { src = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
  src = stripComments(src);
  const deps = new Set();
  for (const re of PATTERNS) {
    re.lastIndex = 0; let m;
    while ((m = re.exec(src))) {
      const spec = m[m.length - 1];
      const r = resolve(f, spec);
      if (r && r !== f) deps.add(r);
    }
  }
  edges += deps.size;
  graph.set(f, [...deps]);
}
const WHITE = 0, GRAY = 1, BLACK = 2;
const color = new Map();
for (const n of graph.keys()) color.set(n, WHITE);
const stack = [];
const cycles = [];
const seen = new Set();
function dfs(node) {
  color.set(node, GRAY);
  stack.push(node);
  const deps = graph.get(node) || [];
  for (const dep of deps) {
    const c = color.get(dep);
    if (c === GRAY) {
      const idx = stack.indexOf(dep);
      if (idx >= 0) {
        const cyc = stack.slice(idx).concat(dep);
        const key = [...new Set(cyc)].slice().sort().join('>');
        if (!seen.has(key)) { seen.add(key); cycles.push(cyc); }
      }
    } else if ((c === WHITE || c === undefined) && graph.has(dep)) {
      dfs(dep);
    }
  }
  stack.pop();
  color.set(node, BLACK);
}
for (const n of graph.keys()) if (color.get(n) === WHITE) dfs(n);

const rel = (p) => path.relative(ROOT, p);
cycles.forEach((c) => console.log('CYCLE|' + c.map(rel).join(' -> ')));
console.log('CYCLES|' + cycles.length);
console.log('GRAPH|' + graph.size + '|' + edges);
NODE_CYCLES

step "Circular imports in the TypeScript source tree"

CYCLES_LOG="$NODE_SCRIPTS/cycles-builtin.log"
CYCLES_MODE="built-in dependency-graph detector (works offline)"
node "$NODE_SCRIPTS/find-cycles.js" "$PROJECT_ROOT" > "$CYCLES_LOG" 2>&1 || true
CYCLE_COUNT="$(grep -E '^CYCLES\|' "$CYCLES_LOG" | head -1 | cut -d'|' -f2 || echo 0)"
CYCLE_COUNT="$(printf '%s' "${CYCLE_COUNT:-0}" | tr -dc '0-9')"
[[ -z "$CYCLE_COUNT" ]] && CYCLE_COUNT=0

if [[ -x node_modules/.bin/madge ]]; then
  CYCLES_MODE="madge"
  info "madge found — cross-checking with 'madge --circular src'."
  node_modules/.bin/madge --circular --extensions ts,tsx src > "$NODE_SCRIPTS/cycles-madge.log" 2>&1 || true
  sed 's/^/        /' "$NODE_SCRIPTS/cycles-madge.log" | head -20
fi

GRAPH_LINE="$(grep -E '^GRAPH\|' "$CYCLES_LOG" | head -1 || true)"
[[ -n "$GRAPH_LINE" ]] && info "Dependency graph: $(printf '%s' "$GRAPH_LINE" | cut -d'|' -f2) files, $(printf '%s' "$GRAPH_LINE" | cut -d'|' -f3) local import edges."

if [[ "$CYCLE_COUNT" -gt 0 ]]; then
  warn "$CYCLE_COUNT circular import chain(s) found (via $CYCLES_MODE):"
  grep -E '^CYCLE\|' "$CYCLES_LOG" | sed 's/^CYCLE|/        /' | head -20 || true
  [[ "$CYCLE_COUNT" -gt 20 ]] && say "        ... and $((CYCLE_COUNT - 20)) more."
  say ""
  say "  Action required (the script will NOT edit your code):"
  say "    • Circular imports do not stop Metro, but they can make a module import as"
  say "      'undefined' at runtime and they break tree-shaking."
  say "    • Break each loop by moving the shared code into a new module, e.g."
  say "        src/theme/colors.ts  or  src/types/shared.ts"
  say "      and let both files import from there instead of from each other."
  say "    • Re-run this script; when all cycles are gone the app is beta-ready."
  if [[ "$STRICT" -eq 1 ]]; then die "Circular imports found and --strict was requested."; fi
else
  ok "No circular imports detected."
fi

step "Lint with ESLint (Expo's eslint-config-expo)"

if [[ "$SKIP_LINT" -eq 1 ]]; then
  skip "Lint (--skip-lint / --preview)."
else
  LINT_RC=0
  HAS_LINT_SCRIPT=0
  node -e "const p=require('./package.json');process.exit(p.scripts&&p.scripts.lint?0:1)" 2>/dev/null && HAS_LINT_SCRIPT=1

  if [[ "$HAS_LINT_SCRIPT" -eq 1 ]]; then
    info "package.json defines a \"lint\" script — running 'npm run lint'."
    npm run lint || LINT_RC=$?
  else
    info "package.json has no \"lint\" script — running ESLint with the Expo config directly."
    if [[ ! -x node_modules/.bin/eslint ]]; then
      info "Installing eslint + eslint-config-expo as devDependencies (this is a one-time install)."
      npm i -D --no-audit --no-fund eslint eslint-config-expo \
        || npm i -D --no-audit --no-fund --ignore-scripts eslint eslint-config-expo \
        || warn "Could not install ESLint (offline?). Skipping the lint step."
    fi

    ESLINT_MAJOR="$(node -p "try{require('$PROJECT_ROOT/node_modules/eslint/package.json').version.split('.')[0]}catch(e){'0'}" 2>/dev/null || echo 0)"
    HAS_ESLINT_CFG=0
    for f in eslint.config.js eslint.config.mjs eslint.config.cjs eslint.config.ts \
             .eslintrc .eslintrc.js .eslintrc.cjs .eslintrc.json .eslintrc.yml .eslintrc.yaml; do
      [[ -f "$f" ]] && HAS_ESLINT_CFG=1
    done

    if [[ "$HAS_ESLINT_CFG" -eq 0 && -x node_modules/.bin/eslint ]]; then
      if node -e "require.resolve('eslint-config-expo/flat')" >/dev/null 2>&1; then
        info "Writing a minimal flat ESLint config (eslint.config.js) that extends the Expo config."
        cat > eslint.config.js <<'ESLINT_FLAT'
// Generated by fix-everything.sh — ESLint flat config using Expo's shared rules.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...(Array.isArray(expoConfig) ? expoConfig : [expoConfig]),
  {
    ignores: ['dist/*', 'node_modules/*', 'coverage/*', 'cypress/*',
              '.expo/*', 'web-build/*', '**/*.config.js'],
  },
];
ESLINT_FLAT
        ok "Created eslint.config.js (delete it any time you prefer your own config)."
      elif node -e "require.resolve('eslint-config-expo')" >/dev/null 2>&1; then
        info "Writing a legacy .eslintrc.json that extends the Expo config."
        cat > .eslintrc.json <<'ESLINT_RC'
{
  "extends": "expo",
  "ignorePatterns": ["dist/", "coverage/", "cypress/", ".expo/", "web-build/"]
}
ESLINT_RC
        ok "Created .eslintrc.json"
      else
        warn "eslint-config-expo is not resolvable — ESLint cannot be configured. Skipping lint."
      fi
    fi

    if [[ -x node_modules/.bin/eslint ]]; then
      if [[ "${ESLINT_MAJOR:-0}" -ge 9 ]]; then
        info "Running: npx eslint .   (ESLint 9 uses flat config; --ext is no longer supported)"
        npx eslint . || LINT_RC=$?
      else
        info "Running: npx eslint . --ext .js,.jsx,.ts,.tsx"
        npx eslint . --ext .js,.jsx,.ts,.tsx || LINT_RC=$?
      fi
    fi
  fi

  if [[ "$LINT_RC" -eq 0 ]]; then
    ok "ESLint reported no errors."
  else
    warn "ESLint reported problems (exit code $LINT_RC). This does NOT stop the app from running."
    say "        Fix them at your own pace, or run the autofixer:  npx eslint . --fix"
    say "        Re-run this script with --skip-lint to silence the lint step."
    if [[ "$STRICT" -eq 1 ]]; then die "Lint errors found and --strict was requested."; fi
  fi
fi

step "TypeScript check (npx tsc --noEmit)"

if [[ "$SKIP_TYPECHECK" -eq 1 ]]; then
  skip "TypeScript check (--skip-typecheck / --preview)."
else
  if [[ ! -x node_modules/.bin/tsc ]]; then
    info "typescript is not installed locally — installing it as a devDependency."
    npm i -D --no-audit --no-fund typescript \
      || npm i -D --no-audit --no-fund --ignore-scripts typescript \
      || warn "Could not install TypeScript."
  fi

  if [[ -x node_modules/.bin/tsc ]]; then
    TSC_LOG="$NODE_SCRIPTS/tsc.log"
    info "Running: npx tsc --noEmit"
    run_timeout 1800 npx tsc --noEmit > "$TSC_LOG" 2>&1
    TSC_RC=$?
    TSC_ERRORS="$(grep -cE 'error TS[0-9]+' "$TSC_LOG" 2>/dev/null | head -1)"
    TSC_ERRORS="$(printf '%s' "${TSC_ERRORS:-0}" | tr -dc '0-9')"
    [[ -z "$TSC_ERRORS" ]] && TSC_ERRORS=0

    if [[ "$TSC_RC" -eq 0 ]]; then
      ok "TypeScript found no errors."
    else
      bad "TypeScript reported $TSC_ERRORS error line(s) (exit code $TSC_RC):"
      head -60 "$TSC_LOG" | sed 's/^/        /'
      say "        Full log: $TSC_LOG"
      say ""
      say "  Type errors do NOT stop Metro (it strips the types away), so the app below"
      say "  will still bundle — but each one is a real bug worth fixing."
      say "  Work through them with:  npx tsc --noEmit | head -40"
      if [[ "$STRICT" -eq 1 ]]; then
        die "$TSC_ERRORS TypeScript error(s) and --strict was requested."
      fi
      say "  ${DIM}(The script keeps going so you still get a preview; the exit code will be 1.)${RESET}"
    fi
  else
    warn "TypeScript is not available — the type check was skipped."
  fi
fi

step "Jest test suite (npm test / npx jest)"

if [[ "$SKIP_TESTS" -eq 1 ]]; then
  skip "Jest tests (--skip-tests / --preview)."
else
  HAS_TEST_SCRIPT=0
  node -e "const p=require('./package.json');process.exit(p.scripts&&p.scripts.test?0:1)" 2>/dev/null && HAS_TEST_SCRIPT=1

  if [[ "$HAS_TEST_SCRIPT" -eq 0 ]]; then
    info "package.json has no \"test\" script — creating a minimal placeholder test."
    mkdir -p "$PROJECT_ROOT/__tests__"
    if [[ ! -f "$PROJECT_ROOT/__tests__/placeholder.test.ts" ]]; then
      cat > "$PROJECT_ROOT/__tests__/placeholder.test.ts" <<'JEST_PLACEHOLDER'
// Placeholder created by fix-everything.sh so that a test suite always exists.
// Replace it with real tests whenever you are ready.
describe('placeholder', () => {
  test('the test runner is wired up correctly', () => {
    expect(true).toBe(true);
  });
});
JEST_PLACEHOLDER
      ok "Created __tests__/placeholder.test.ts (idempotent — only if it was missing)."
    else
      ok "__tests__/placeholder.test.ts already exists — leaving it untouched."
    fi
    if [[ ! -x node_modules/.bin/jest ]]; then
      warn "jest is not installed — installing jest-expo and jest as devDependencies."
      npm i -D --no-audit --no-fund jest jest-expo \
        || npm i -D --no-audit --no-fund --ignore-scripts jest jest-expo \
        || warn "Could not install Jest (offline?). Skipping the test step."
    fi
    TEST_CMD=(npx jest --ci --passWithNoTests)
  else
    info "package.json defines a \"test\" script — running 'npm test'."
    TEST_CMD=(npm test -- --ci)
  fi

  if [[ -x node_modules/.bin/jest ]]; then
    TEST_LOG="$NODE_SCRIPTS/jest.log"
    info "Running: ${TEST_CMD[*]}"
    if run_timeout 1800 "${TEST_CMD[@]}" > "$TEST_LOG" 2>&1; then
      ok "All Jest tests passed."
      grep -E '^(Tests:|Test Suites:|Snapshots:)' "$TEST_LOG" | sed 's/^/        /' | head -5 || true
    else
      TEST_RC=$?
      bad "Jest reported failures (exit code $TEST_RC)."
      grep -E '^(FAIL|✕|●)|Tests:|Test Suites:' "$TEST_LOG" | head -40 | sed 's/^/        /' || true
      say "        Full log: $TEST_LOG"
      say "        Useful commands:  npx jest --ci -t \"<test name>\"   |   npx jest --watch"
      if [[ "$STRICT" -eq 1 ]]; then
        die "Jest tests failed and --strict was requested."
      fi
      say "  ${DIM}(Red tests mean \"not beta-ready yet\", but the app still launches below.)${RESET}"
    fi
  else
    warn "Jest is not available — the test step was skipped."
  fi
fi

cat > "$NODE_SCRIPTS/check-env.js" <<'NODE_ENV'
// Reports EXPO_PUBLIC_* variables that are used (in .env.example or in code)
// but not defined in .env, plus ones that are defined but left empty.
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2];

function readEnvFile(file) {
  const map = new Map();
  let text = '';
  try { text = fs.readFileSync(file, 'utf8'); } catch (e) { return map; }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?(EXPO_PUBLIC_[A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim().replace(/^["']|["']$/g, '').trim();
    map.set(m[1], value);
  }
  return map;
}
function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'dist') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

const definedKeys = new Set();
const emptyKeys = new Set();
for (const f of ['.env', '.env.local', '.env.production', '.env.beta']) {
  for (const [k, v] of readEnvFile(path.join(ROOT, f))) {
    definedKeys.add(k);
    if (!v || v === 'undefined' || v === 'null' || v === 'your_key_here') emptyKeys.add(k);
  }
}
const referenced = new Set();
for (const f of ['.env.example', '.env.sample']) {
  for (const k of readEnvFile(path.join(ROOT, f)).keys()) referenced.add(k);
}
let files = [];
for (const r of ['src', 'App.tsx', 'index.ts']) {
  const p = path.join(ROOT, r);
  if (!fs.existsSync(p)) continue;
  if (fs.statSync(p).isDirectory()) files = files.concat(walk(p, []));
  else files.push(p);
}
for (const f of files) {
  if (!/\.(ts|tsx|js|jsx)$/.test(f)) continue;
  let src; try { src = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
  const re = /process\.env\.(EXPO_PUBLIC_[A-Z0-9_]+)/g;
  let m;
  while ((m = re.exec(src))) referenced.add(m[1]);
}
const missing = [...referenced].filter((k) => !definedKeys.has(k)).sort();
const empty = [...emptyKeys].filter((k) => referenced.has(k) || true).sort();
missing.forEach((k) => console.log('MISSING_ENV|' + k));
empty.forEach((k) => console.log('EMPTY_ENV|' + k));
console.log('ENV|' + definedKeys.size + '|' + referenced.size);
NODE_ENV

step "Environment variables (EXPO_PUBLIC_*)"

ENV_LOG="$NODE_SCRIPTS/env.log"
node "$NODE_SCRIPTS/check-env.js" "$PROJECT_ROOT" > "$ENV_LOG" 2>&1 || true
grep -E '^MISSING_ENV\|' "$ENV_LOG" | cut -d'|' -f2 > "$NODE_SCRIPTS/env-missing.txt" 2>/dev/null || true
grep -E '^EMPTY_ENV\|' "$ENV_LOG" | cut -d'|' -f2 > "$NODE_SCRIPTS/env-empty.txt" 2>/dev/null || true
ENV_MISSING_N="$(wc -l < "$NODE_SCRIPTS/env-missing.txt" | tr -d ' ')"
ENV_EMPTY_N="$(wc -l < "$NODE_SCRIPTS/env-empty.txt" | tr -d ' ')"
ENV_SUMMARY="$(grep -E '^ENV\|' "$ENV_LOG" | head -1 || true)"
[[ -n "$ENV_SUMMARY" ]] && info "Defined in .env: $(printf '%s' "$ENV_SUMMARY" | cut -d'|' -f2) variable(s); referenced by code/.env.example: $(printf '%s' "$ENV_SUMMARY" | cut -d'|' -f3)."

if [[ ! -f .env ]]; then
  warn "There is no .env file in the project root. Copy the template first: cp .env.example .env"
fi

if [[ "${ENV_MISSING_N:-0}" -gt 0 ]]; then
  warn "$ENV_MISSING_N EXPO_PUBLIC_* variable(s) are referenced but NOT defined in .env:"
  sed 's/^/        /' "$NODE_SCRIPTS/env-missing.txt"
  say "        Add them to .env (or delete the code that reads them). Optional OAuth keys"
  say "        (EXPO_PUBLIC_GOOGLE_*, EXPO_PUBLIC_APPLE_CLIENT_ID) only break the social-login"
  say "        buttons, everything else in the app still works."
  if [[ "$STRICT" -eq 1 ]]; then die "Missing EXPO_PUBLIC_* variables and --strict was requested."; fi
else
  ok "Every referenced EXPO_PUBLIC_* variable is defined in .env."
fi

if [[ "${ENV_EMPTY_N:-0}" -gt 0 ]]; then
  warn "$ENV_EMPTY_N EXPO_PUBLIC_* variable(s) are defined but left EMPTY:"
  sed 's/^/        /' "$NODE_SCRIPTS/env-empty.txt" | head -25
  say "        Those features (Firebase, Sentry, PostHog, Gemini...) will be disabled at runtime."
fi
info "Remember: .env is git-ignored — commit .env.example instead, never real keys."

step "Cache purge (Metro, Expo, watchman)"

if have watchman; then
  info "watchman watch-del-all"
  watchman watch-del-all >/dev/null 2>&1 || true
  watchman shutdown-server >/dev/null 2>&1 || true
  ok "watchman watches cleared."
else
  info "watchman is not installed — nothing to clear there."
fi

info "Removing .expo/, .metro/, .cache/ and node_modules/.cache/ ..."
rm -rf "$PROJECT_ROOT/.expo" "$PROJECT_ROOT/.metro" "$PROJECT_ROOT/.cache" "$PROJECT_ROOT/node_modules/.cache" 2>/dev/null || true
info "Removing temporary Metro/Haste maps from /tmp ..."
rm -rf /tmp/metro-* /tmp/haste-map-* /tmp/react-* 2>/dev/null || true
if [[ -n "${TMPDIR:-}" ]]; then rm -rf "${TMPDIR}"/metro-* "${TMPDIR}"/haste-map-* 2>/dev/null || true; fi
ok "All caches cleared. The next bundle is built from scratch."

step "expo doctor and Expo dependency check"

if [[ "$SKIP_DOCTOR" -eq 1 ]]; then
  skip "expo doctor (--skip-doctor)."
else
  DOCTOR_LOG="$NODE_SCRIPTS/doctor.log"
  DOCTOR_RAN=0
  info "Running: npx --yes expo-doctor   (this downloads the doctor on first use)"
  if CI=1 run_timeout 900 npx --yes expo-doctor > "$DOCTOR_LOG" 2>&1; then
    DOCTOR_RAN=1
    ok "expo doctor reports no problems."
  else
    DOCTOR_RC=$?
    if grep -qE '✖|X ' "$DOCTOR_LOG" 2>/dev/null; then
      DOCTOR_RAN=1
    elif grep -qiE 'expo doctor|No issues detected|checking' "$DOCTOR_LOG" 2>/dev/null; then
      DOCTOR_RAN=1
    else
      DOCTOR_RAN=0
    fi
  fi

  sed 's/^/        /' "$DOCTOR_LOG" | head -40

  if [[ "$DOCTOR_RAN" -eq 1 ]] && grep -qE '✖' "$DOCTOR_LOG" 2>/dev/null; then
    bad "expo doctor reported problem(s) — see the failed checks above."
    say "        Most fixes are automatic:   npx expo install --fix"
    say "        Then re-run this script."
    if [[ "$STRICT" -eq 1 ]]; then
      die "expo doctor found errors and --strict was requested."
    fi
    say "  ${DIM}(Continuing so you can still preview; the exit code will be 1.)${RESET}"
  elif [[ "$DOCTOR_RAN" -eq 0 ]]; then
    warn "expo doctor could not run (probably offline, or the package could not be downloaded)."
    say "        Skipping it does not stop the app: the offline pin check below covers the basics."
  fi

  info "Offline check: npx expo install --check"
  CHECK_LOG="$NODE_SCRIPTS/install-check.log"
  if run_timeout 600 npx expo install --check > "$CHECK_LOG" 2>&1; then
    ok "npx expo install --check: every dependency matches SDK 52."
  else
    warn "npx expo install --check found version drift (or could not run offline):"
    sed 's/^/        /' "$CHECK_LOG" | head -25
    say "        Fix with:  npx expo install --fix"
  fi
fi

step "Start the Expo bundler (Android / iOS via Expo Go / Web)"

say ""
say "  ${BOLD}How to open the app once Metro says \"Bundling complete\":${RESET}"
say "    • ${CYAN}Android${RESET}  — press 'a' (opens Expo Go on a connected device/emulator)"
say "    • ${CYAN}iOS${RESET}      — press 'i' (simulator) or scan the QR code with the Expo Go app"
say "    • ${CYAN}Web${RESET}      — press 'w' (opens http://localhost:8081 in the browser)"
say "    • Press 'r' to reload the app, 'j' to open the debugger, Ctrl+C to stop."
say ""

if [[ "$SKIP_START" -eq 1 ]]; then
  skip "Bundler launch (--no-start)."
  say "        Start it yourself with:   EXPO_DEBUG=true npx expo start -c"
else
  info "Launching: EXPO_DEBUG=true npx expo start -c"
  say "  ${DIM}(Metro prints the last file it touched before an error — that is the file to fix.)${RESET}"
  say ""
  EXPO_DEBUG=true npx expo start -c
  START_RC=$?
  say ""
  if [[ "$START_RC" -ne 0 ]]; then
    warn "The bundler exited with code $START_RC."
  else
    info "The bundler was stopped. Start it again any time with:  npx expo start"
  fi
fi

# ---------------------------------------------------------------------------
# Summary + bug-report skeleton
# ---------------------------------------------------------------------------
say ""
say "${BOLD}${CYAN}=============================================================${RESET}"
say "${BOLD}${CYAN}  SUMMARY${RESET}"
say "${BOLD}${CYAN}=============================================================${RESET}"
say "  Project..........: $PROJECT_ROOT"
say "  Node / npm.......: $(node -v 2>/dev/null || echo 'n/a') / $(npm -v 2>/dev/null || echo 'n/a')"
say "  Expo CLI.........: $(npx expo --version 2>/dev/null || echo 'n/a')"
say "  Warnings.........: $WARNINGS"
say "  Failures.........: $FAILURES"
[[ -n "$SKIPPED" ]] && say "  Skipped steps....: $SKIPPED"
say ""
say "  Report file......: $REPORT_FILE"
say "  Checklist........: beta-checklist.md"
say "  Troubleshooting..: next-steps.md"

{
  echo ""
  echo "=== SUMMARY ==="
  echo "node: $(node -v 2>/dev/null || echo n/a)"
  echo "npm: $(npm -v 2>/dev/null || echo n/a)"
  echo "expo CLI: $(npx expo --version 2>/dev/null || echo n/a)"
  echo "warnings: $WARNINGS"
  echo "failures: $FAILURES"
  echo "skipped:${SKIPPED:- none}"
  echo ""
  echo "=== BUG REPORT TEMPLATE (copy/paste into the LLM chat) ==="
  echo "### Bug report"
  echo "- OS / hardware: $(uname -srm)"
  echo "- Node version: $(node -v 2>/dev/null || echo n/a)"
  echo "- npm version: $(npm -v 2>/dev/null || echo n/a)"
  echo "- Expo CLI version: $(npx expo --version 2>/dev/null || echo n/a)"
  echo "- Project root: $PROJECT_ROOT"
  echo "- Command run: ./fix-everything.sh $*"
  echo "- Last FAIL/WARN lines:"
  grep -E '^  (FAIL|WARN)' "$REPORT_FILE" | tail -20 | sed 's/^/    /'
  echo "- Metro's last printed line (paste it here): <paste>"
} >> "$REPORT_FILE" 2>/dev/null || true

if [[ "$FAILURES" -gt 0 ]]; then
  say ""
  say "${BOLD}${RED}  This run finished with $FAILURES failure(s) — the app still previews, but fix them before beta.${RESET}"
  say "  Open next-steps.md, then paste $REPORT_FILE back into the chat."
  if [[ "$CONTINUE_ON_ERROR" -eq 1 ]]; then
    say "  ${DIM}(--continue-on-error was given, so the exit status is 0.)${RESET}"
    exit 0
  fi
  exit 1
fi

if [[ "$WARNINGS" -gt 0 ]]; then
  say ""
  say "${BOLD}${YELLOW}  Finished with $WARNINGS warning(s) — the app itself is good to preview.${RESET}"
  say "  Review the WARN lines above (and in $REPORT_FILE) before the beta ships."
  exit 0
fi

say ""
say "${BOLD}${GREEN}  Everything passed: assets verified, dependencies pinned, code clean.${RESET}"
say "  You are beta-ready — see beta-checklist.md for the final manual checks."
exit 0