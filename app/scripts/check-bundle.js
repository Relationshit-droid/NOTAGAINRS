const fs = require('fs');
const zlib = require('zlib');
const glob = require('glob');

const files = glob.sync('dist/_expo/static/js/web/index-*.js');
if (files.length === 0) {
  console.error('Bundle not found!');
  process.exit(1);
}

const file = files[0];
const content = fs.readFileSync(file);
const gzipped = zlib.gzipSync(content);
const sizeKB = gzipped.length / 1024;

console.log(`Bundle: ${file}`);
console.log(`Size (Gzipped): ${sizeKB.toFixed(2)} KB`);

if (sizeKB < 800) {
  console.log('✅ Bundle size check passed.');
} else {
  console.error('❌ Bundle size too large!');
  process.exit(1);
}
