#!/bin/bash
export PATH="/home/c-jay69/.npm-global/bin:/home/c-jay69/Documents/TAB/NOTAGAINRS/app/node_modules/.bin:/usr/bin:$PATH"
cd /home/c-jay69/Documents/TAB/NOTAGAINRS/app
echo "=== RUNNER START $(date) ===" 
echo "PATH=$PATH"
echo "NODE_PATH_CHECK:"
if command -v node >/dev/null 2>&1; then echo "node OK: $(node --version)"; else echo "node NOT FOUND"; fi
if command -v npm >/dev/null 2>&1; then echo "npm OK: $(npm --version)"; else echo "npm NOT FOUND"; fi
if command -v npx >/dev/null 2>&1; then echo "npx OK: $(npx --version)"; else echo "npx NOT FOUND"; fi
echo "=== RUNNING MAIN SCRIPT ==="
bash ./fix-everything-beta.sh --no-start --continue-on-error 2>&1
echo "=== RUNNER EXIT: $? ==="
