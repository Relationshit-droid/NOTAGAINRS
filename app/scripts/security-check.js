const fs = require('fs');
const path = require('path');

const FORBIDDEN = ['sk_', 'pk_', 'eyJ']; // Secret patterns
const DIR = path.join(__dirname, '../src');

function scan(dir) {
  let hasError = false;
  if (!fs.existsSync(dir)) return false;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (scan(fullPath)) hasError = true;
    } else {
      // Skip test files and snapshots
      if (file.includes('.test.') || file.includes('.spec.') || file.includes('__tests__')) continue;
      
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for hardcoded secrets
      for (const pattern of FORBIDDEN) {
        if (content.includes(pattern)) {
          // Allow exceptions if needed, but generally fail
          // Simple heuristic: if it looks like a key assignment
          if (content.match(new RegExp(`['"]${pattern}[a-zA-Z0-9-_]+['"]`))) {
            console.error(`SECURITY ERROR: Found potential hardcoded secret "${pattern}..." in ${fullPath}`);
            hasError = true;
          }
        }
      }

      // Check for process.env
      if (content.includes('process.env')) {
         console.error(`SECURITY ERROR: Found "process.env" in ${fullPath}. Use import.meta.env via src/lib/env.ts.`);
         hasError = true;
      }
    }
  }
  return hasError;
}

console.log('Running security scan on src/...');
if (scan(DIR)) {
  console.error('Security scan failed.');
  process.exit(1);
} else {
  console.log('Security check passed.');
}
