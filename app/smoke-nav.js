/**
 * End-to-end journey smoke test (headless, no browser binary required).
 *
 * Drives the real Metro web bundle inside jsdom through the critical path:
 *   splash -> dashboard -> category detail -> game lobby -> gameplay
 * and reports any console errors raised along the way.
 *
 * The jsdom polyfills below (ResizeObserver, CSSFontFaceRule, document.fonts)
 * stand in for browser APIs jsdom lacks; they are test scaffolding, not app
 * workarounds.
 *
 * Usage:
 *   npx expo start --web --port 8081 --offline --clear
 *   curl -s -o /tmp/bundle.js "http://localhost:8081/index.bundle?platform=web&dev=true&minify=false"
 *   node smoke-nav.js
 */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const bundle = fs.readFileSync('/tmp/bundle.js', 'utf8');
const errors = [];
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>',
  { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost:8081/' });
const w = dom.window;
w.matchMedia = q => ({ matches:false, media:q, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} });
w.scrollTo = () => {};
process.on('unhandledRejection', () => {});
w.FontFace = w.FontFace || class { constructor(){ this.status='loaded'; } load(){ return Promise.resolve(this); } };
w.document.fonts = { ready: Promise.resolve(), load: () => Promise.resolve([]), add(){}, check: () => true, forEach(){}, values: () => [][Symbol.iterator]() };

w.CSSFontFaceRule = w.CSSFontFaceRule || class CSSFontFaceRule {};

w.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
w.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} takeRecords(){return[];} };

w.fetch = () => Promise.resolve({ ok:true, status:200, json:async()=>({}), text:async()=>'', headers:{get:()=>null} });
w.requestAnimationFrame = cb => setTimeout(()=>cb(Date.now()),16);
w.cancelAnimationFrame = id => clearTimeout(id);
w.console.error = (...a) => { const s=a.map(String).join(' '); if(!/findDOMNode/.test(s)) errors.push(s.slice(0,300)); };
w.console.warn = () => {};
try { w.eval(bundle); } catch(e){ errors.push('THROWN: '+e); }

const txt = () => (w.document.getElementById('root').textContent||'').replace(/\s+/g,' ').trim();
// React Navigation keeps previous screens mounted; read only the topmost one.
const topTxt = () => {
  const scenes = [...w.document.querySelectorAll('#root [role="main"], #root > div > div > div')];
  const last = scenes[scenes.length-1];
  return ((last?last.textContent:'')||'').replace(/\s+/g,' ').trim();
};
const click = (re) => {
  const els = [...w.document.querySelectorAll('#root [role="button"], #root button, #root div[tabindex]')];
  const el = els.find(e => re.test((e.textContent||'').trim()));
  if (!el) return false;
  const ev = new w.MouseEvent('click', { bubbles:true, cancelable:true, view:w });
  el.dispatchEvent(ev);
  return true;
};
const wait = ms => new Promise(r=>setTimeout(r,ms));

(async () => {
  await wait(12000);
  console.log('[1 splash] ' + txt().slice(0,120));
  console.log('  clicked START =', click(/PRESS TO START|START/i));
  await wait(9000);
  console.log('[2 after start] nodes=' + w.document.querySelectorAll('#root *').length);
  console.log('  ' + txt().slice(0,600));
  console.log('  clicked Love Arcade =', click(/Love Arcade/i));
  await wait(7000);
  console.log('[3 arcade] nodes=' + w.document.querySelectorAll('#root *').length);
  {
    const full = txt();
    const dash = 'Welcome back,';
    const i = full.indexOf(dash);
    const tail = full.slice(full.indexOf('Healing Hospital') >= 0 ? full.indexOf('Healing Hospital') : 0);
    console.log('  NEW CONTENT (tail): ' + tail.slice(-500));
  }

  const before = txt();
  const opened = click(/^PLAY$/i);
  await wait(10000);
  console.log('[4 game] clicked=' + opened + ' nodes=' + w.document.querySelectorAll('#root *').length);
  const after = txt();
  console.log('  changed=' + (after !== before));
  console.log('  TAIL: ' + after.slice(-450));

  const b5 = txt();
  console.log('  clicked Start Game =', click(/^Start Game$/i));
  await wait(10000);
  const a5 = txt();
  console.log('[5 play] nodes=' + w.document.querySelectorAll('#root *').length + ' changed=' + (a5!==b5));
  console.log('  TAIL: ' + a5.slice(-450));

  console.log('--- ERRLIST ---');
  console.log([...new Set(errors)].slice(0,5).join('\n=====\n').slice(0,1500));
  console.log('--- ERRORS(' + [...new Set(errors)].length + ') ---');
  console.log([...new Set(errors)].slice(0,10).join('\n---\n'));
  process.exit(0);
})();
