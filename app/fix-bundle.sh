#!/usr/bin/env bash
# fix-bundle.sh – automatically repair missing assets and rebuild the Expo bundle
# Run from the Expo project root (app/):
#   chmod +x fix-bundle.sh
#   ./fix-bundle.sh
set -e

PROJECT_ROOT="$(pwd)"
ASSET_DIR="$PROJECT_ROOT/assets/logo"

echo "==============================================="
echo " Expo bundle fixer – SDK 52 / Metro"
echo " Project root: $PROJECT_ROOT"
echo "==============================================="

# Sanity check: must be run from Expo project root (where app.json lives)
if [[ ! -f "$PROJECT_ROOT/app.json" ]]; then
  echo "❌ ERROR: app.json not found in $PROJECT_ROOT"
  echo "   Please cd to your Expo project root (app/) and run ./fix-bundle.sh again."
  exit 1
fi

if [[ ! -f "$PROJECT_ROOT/package.json" ]]; then
  echo "❌ ERROR: package.json not found in $PROJECT_ROOT"
  echo "   Please run this script from the folder that contains package.json and app.json."
  exit 1
fi

# ------------------------------------------------
# 1️⃣ Verify PNG assets (case-sensitive)
# ------------------------------------------------
echo ""
echo "🔍 Step 1/4: Checking required image assets..."

REQUIRED_ASSETS=(
  "RSTRANSPARENTICONNB.png"
  "mainlogoone.png"
)

for EXPECTED in "${REQUIRED_ASSETS[@]}"; do
  FILE_PATH="$ASSET_DIR/$EXPECTED"
  if [[ -f "$FILE_PATH" ]]; then
    echo "✅ $EXPECTED exists at assets/logo/$EXPECTED"
  else
    echo "⚠️  $EXPECTED NOT found at assets/logo/$EXPECTED – looking for case mismatch..."

    # Look for a case-insensitive match in the same folder
    MATCH=""
    if [[ -d "$ASSET_DIR" ]]; then
      MATCH=$(find "$ASSET_DIR" -maxdepth 1 -iname "$EXPECTED" -print -quit 2>/dev/null || true)
    fi

    if [[ -n "$MATCH" && -f "$MATCH" ]]; then
      echo "⚠️  Found '$MATCH' with wrong case – renaming to '$FILE_PATH'"
      mv "$MATCH" "$FILE_PATH"
      echo "✅ Renamed to $EXPECTED"
    else
      echo "❌ Missing required asset: assets/logo/$EXPECTED"
      echo "   Expected by code:"
      if [[ "$EXPECTED" == "RSTRANSPARENTICONNB.png" ]]; then
        echo "     - src/screens/auth/LoginAndSignUp.tsx -> ../../assets/logo/$EXPECTED"
      else
        echo "     - src/constants/assetManifest.ts -> ../../assets/logo/$EXPECTED"
      fi
      echo "   Please add the file to $ASSET_DIR/ with EXACTLY this case-sensitive name,"
      echo "   or correct the import path in code."
      # Helpful hint: file lives in the other common location in this repo
      if [[ -f "$PROJECT_ROOT/src/assets/logo/$EXPECTED" ]]; then
        echo "   💡 Hint: found $EXPECTED at src/assets/logo/$EXPECTED."
        echo "      You can copy it with:"
        echo "        cp \"src/assets/logo/$EXPECTED\" \"assets/logo/$EXPECTED\""
      fi
      # List what IS in the folder to help spot typos
      if [[ -d "$ASSET_DIR" ]]; then
        echo "   Files currently in assets/logo/:"
        ls -1 "$ASSET_DIR" || true
      else
        echo "   Directory $ASSET_DIR does not exist!"
      fi
      exit 1
    fi
  fi
done

echo "✅ All required assets present."

# ------------------------------------------------
# 2️⃣ Re-install exact Expo-pinned dependencies
# ------------------------------------------------
echo ""
echo "📦 Step 2/4: Re-installing Expo-pinned dependencies..."
echo "   This picks the exact versions Expo SDK 52 expects."

npx expo install --fix
echo "✅ 'npx expo install --fix' done."

echo "   Ensuring react-native-gesture-handler is Expo-pinned..."
npx expo install react-native-gesture-handler
echo "✅ react-native-gesture-handler pinned."

echo "🔧 Running a full npm install to finish..."
npm install
echo "✅ npm install done."

# ------------------------------------------------
# 3️⃣ Clear every Metro / Expo cache
# ------------------------------------------------
echo ""
echo "🧹 Step 3/4: Clearing Metro / Expo caches..."

if command -v watchman >/dev/null 2>&1; then
  echo "   Running 'watchman watch-del-all'..."
  watchman watch-del-all || true
else
  echo "   (watchman not installed – skipping 'watchman watch-del-all')"
fi

echo "   Removing .expo, .metro, .cache, node_modules/.cache..."
rm -rf .expo .metro .cache "node_modules/.cache" || true
# Extra common Metro temp files (safe to delete, ignored if missing)
rm -rf "$TMPDIR/metro-"* /tmp/metro-* /tmp/haste-map-* 2>/dev/null || true
echo "✅ Caches cleared."

# ------------------------------------------------
# 4️⃣ Start the bundler in debug mode
# ------------------------------------------------
echo ""
echo "🚀 Step 4/4: Starting Expo bundler (debug mode)..."
echo "👉 Now scan the QR code or press 'a' for Android, 'w' for web, 'i' for iOS."
echo "   Launching: EXPO_DEBUG=true npx expo start -c"
echo ""

EXPO_DEBUG=true npx expo start -c

echo ""
echo "✅ Bundler exited. Scan the QR code or press 'a' for Android, 'w' for web, etc. on next run."
