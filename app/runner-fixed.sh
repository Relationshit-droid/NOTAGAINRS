#!/bin/bash
# Runner script that fixes PATH before running main script
export PATH="/home/c-jay69/.nvm/versions/node/v22.23.0/bin:$HOME/.npm-global/bin:$HOME/.npm-global/bin:/home/c-jay69/Documents/TAB/NOTAGAINRS/app/node_modules/.bin:/usr/bin:$PATH"
export HOME="/home/c-jay69"

echo "=== RUNNER START $(date) ==="
echo "PATH=$PATH"
echo ""

# Verify tools are accessible
echo "--- Tool verification ---"
if command -v node >/dev/null 2>&1; then
  echo "node: OK ($(node --version))"
else
  echo "node: NOT FOUND"
fi

if command -v npm >/dev/null 2>&1; then
  echo "npm: OK ($(npm --version))"
else
  echo "npm: NOT FOUND"
fi

if command -v npx >/dev/null 2>&1; then
  echo "npx: OK ($(npx --version))"
else
  echo "npx: NOT FOUND"
fi

echo ""
echo "--- Asset verification ---"
# Only the six canonical brand logos are allowed.
CANONICAL_LOGOS=(
  "assets/logo/RSBLACKNBBANNER.png"
  "assets/logo/RSBLACKNBSQUARE.png"
  "assets/logo/RSICONNB.png"
  "assets/logo/RSTRANSPARENTICONNB.png"
  "assets/logo/RSWHITENBBANNER.png"
  "assets/logo/RSWHITENBSQUARE.png"
)
for asset in "${CANONICAL_LOGOS[@]}"; do
  if [ -f "$asset" ]; then
    size=$(stat -c%s "$asset" 2>/dev/null || echo "?")
    echo "$asset: OK ($size bytes)"
  else
    echo "$asset: MISSING"
  fi
done

echo ""
echo "--- Running fix-everything-beta.sh ---"
cd /home/c-jay69/Documents/TAB/NOTAGAINRS/app

# Clear old logs to get fresh run
> fix-everything-beta.log
> fix-everything-beta-report.txt

bash ./fix-everything-beta.sh --no-start --continue-on-error 2>&1
RUNNER_EXIT=$?

echo ""
echo "=== RUNNER EXIT: $RUNNER_EXIT ==="
echo "=== RUNNER END $(date) ==="

exit $RUNNER_EXIT
