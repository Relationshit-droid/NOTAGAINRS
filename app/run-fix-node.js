#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = '/home/c-jay69/Documents/TAB/NOTAGAINRS/app';
const npmGlobalBin = '/home/c-jay69/.npm-global/bin';
const localBin = path.join(projectRoot, 'node_modules/.bin');
const nodeBinDir = '/home/c-jay69/.nvm/versions/node/v22.23.0/bin';


const currentPath = process.env.PATH || '';
const newPath = [npmGlobalBin, localBin, '/usr/bin', currentPath]
  .filter((p, i, arr) => arr.indexOf(p) === i && p.trim())
  .join(':');

process.env.PATH = newPath;

console.log('=== NODE WRAPPER START ===');
console.log('NODE_VERSION:', process.version);
console.log('PATH:', process.env.PATH);

function check(cmd) {
  try {
    return { ok: true, output: execSync(cmd, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 10000,
      cwd: projectRoot
    }).trim() };
  } catch (e) {
    return { ok: false, error: e.message.split('\n')[0] };
  }
}

console.log('');
console.log('--- Tool checks ---');
const npmCheck = check('npm --version');
console.log('npm:', npmCheck.ok ? npmCheck.output : 'FAIL: ' + npmCheck.error);
const npxCheck = check('npx --version');
console.log('npx:', npxCheck.ok ? npxCheck.output : 'FAIL: ' + npxCheck.error);

console.log('');
console.log('--- Asset checks ---');
// Only the six canonical brand logos are allowed. See app/assets/logo/.
const assets = [
  'assets/logo/RSBLACKNBBANNER.png',
  'assets/logo/RSBLACKNBSQUARE.png',
  'assets/logo/RSICONNB.png',
  'assets/logo/RSTRANSPARENTICONNB.png',
  'assets/logo/RSWHITENBBANNER.png',
  'assets/logo/RSWHITENBSQUARE.png'
];
for (const asset of assets) {
  try {
    const stat = fs.statSync(path.join(projectRoot, asset));
    console.log(asset + ': OK (' + stat.size + ' bytes)');
  } catch (e) {
    console.log(asset + ': MISSING');
  }
}

console.log('');
console.log('--- Running fix-everything-beta.sh ---');
const logFile = path.join(projectRoot, 'fix-everything-beta.log');
const reportFile = path.join(projectRoot, 'fix-everything-beta-report.txt');
fs.writeFileSync(logFile, '');
fs.writeFileSync(reportFile, '');

try {
  const result = execSync(
    'cd "' + projectRoot + '" && bash ./fix-everything-beta.sh --no-start --continue-on-error',
    {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 300000,
      env: Object.assign({}, process.env, { PATH: newPath })
    }
  );
  console.log('SCRIPT_OUTPUT:');
  console.log(result);
  console.log('');
  console.log('=== WRAPPER EXIT: 0 ===');
  process.exit(0);
} catch (e) {
  console.log('SCRIPT_ERROR:');
  console.log(e.message.split('\n').slice(0, 50).join('\n'));
  console.log('');
  console.log('=== WRAPPER EXIT: 1 ===');
  process.exit(1);
}
