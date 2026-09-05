/**
 * Headless boot smoke test.
 *
 * Executes the real Metro web bundle inside jsdom and asserts the app mounts
 * and paints, catching runtime crashes that type-checking and unit tests miss.
 * No browser download required (handy in sandboxed CI).
 *
 * Usage:
 *   npx expo start --web --port 8081 --offline
 *   curl -s -o /tmp/bundle.js "http://localhost:8081/index.bundle?platform=web&dev=true&minify=false"
 *   node smoke-jsdom.js
 */
const fs = require('fs');
const { JSDOM } = require('jsdom');

const bundle = fs.readFileSync('/tmp/bundle.js', 'utf8');
const errors = [];

const dom = new JSDOM(
  '<!DOCTYPE html><html><body><div id="root"></div></body></html>',
  { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost:8081/' }
);
const w = dom.window;

w.matchMedia = w.matchMedia || (q => ({ matches: false, media: q, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} }));
w.scrollTo = () => {};
process.on('unhandledRejection', () => {});
w.FontFace = w.FontFace || class { constructor(){ this.status='loaded'; } load(){ return Promise.resolve(this); } };
w.document.fonts = { ready: Promise.resolve(), load: () => Promise.resolve([]), add(){}, check: () => true, forEach(){}, values: () => [][Symbol.iterator]() };

w.CSSFontFaceRule = w.CSSFontFaceRule || class CSSFontFaceRule {};

w.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
w.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} takeRecords(){return[];} };

w.fetch = () => Promise.resolve({ ok: true, status: 200, json: async () => ({}), text: async () => '', headers: { get: () => null } });
w.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 16);
w.cancelAnimationFrame = id => clearTimeout(id);
w.console.error = (...a) => errors.push('ERROR: ' + a.map(String).join(' ').slice(0, 400));
w.console.warn = () => {};
w.addEventListener('error', e => errors.push('WINDOW ERROR: ' + (e.message || e)));

try {
  w.eval(bundle);
} catch (e) {
  errors.push('THROWN: ' + (e && e.stack ? e.stack.split('\n').slice(0, 6).join('\n') : String(e)));
}

setTimeout(() => {
  const root = w.document.getElementById('root');
  const nodes = root ? root.querySelectorAll('*').length : 0;
  const text = (root ? root.textContent : '').replace(/\s+/g, ' ').trim().slice(0, 700);
  console.log('DOM_NODES=' + nodes);
  console.log('--- TEXT ---\n' + text);
  const uniq = [...new Set(errors)];
  console.log('--- ERRORS(' + uniq.length + ') ---');
  console.log(uniq.slice(0, 12).join('\n---\n'));
  process.exit(0);
}, 15000);
