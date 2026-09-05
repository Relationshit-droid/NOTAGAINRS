const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync('dist/**/*.{js,html,json,css}');
let found = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.match(/sk_[a-zA-Z0-9]{20,}/) || content.match(/pk_[a-zA-Z0-9]{20,}/)) {
    console.error(`❌ Found potential key in ${file}`);
    found = true;
  }
});

if (!found) {
  console.log('✅ No keys found in build artifacts.');
} else {
  process.exit(1);
}
