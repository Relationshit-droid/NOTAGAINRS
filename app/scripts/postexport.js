const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// 1. Inject Polyfills
const poly = '<script>window.__METRO_GLOBAL_PREFIX__=window.__METRO_GLOBAL_PREFIX__||\"metro\";window.process=window.process||{env:{}};</script>';
if (!html.includes('__METRO_GLOBAL_PREFIX__')) {
  html = html.replace('<div id=\"root\"></div>', '<div id=\"root\"></div>\n  ' + poly);
}

// 2. Fix Script Types
html = html.replace(/<script src="\/_expo\/static\/js\/web\/([^"]+)"(?![^>]*type="module")[^>]*>/g, '<script src="/_expo/static/js/web/$1" type="module" defer>');

// 3. Add Meta Tags for SEO/Social
const metaTags = `
  <meta name="description" content="Love, Actually... The Game. An AI-powered relationship therapy game.">
  <meta property="og:title" content="Love, Actually... The Game">
  <meta property="og:description" content="Strengthen your relationship with AI-guided games and therapy tools.">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#E11637">
`;
if (!html.includes('name="description"')) {
  html = html.replace('</head>', `${metaTags}\n</head>`);
}

// 4. Add Title
if (html.includes('<title>app</title>')) {
  html = html.replace('<title>app</title>', '<title>Love, Actually... The Game</title>');
}

fs.writeFileSync(file, html);

// 5. Create 404.html (Copy of index.html for SPA routing on some hosts)
const file404 = path.join(__dirname, '..', 'dist', '404.html');
fs.writeFileSync(file404, html);

// 6. Create vercel.json for correct routing
const vercelConfig = {
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
};
const vercelFile = path.join(__dirname, '..', 'dist', 'vercel.json');
fs.writeFileSync(vercelFile, JSON.stringify(vercelConfig, null, 2));

console.log('Post-export script completed: index.html patched, 404.html created, vercel.json created.');
