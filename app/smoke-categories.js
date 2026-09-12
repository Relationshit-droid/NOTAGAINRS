/**
 * Verifies at least one playable game per major category.
 * Usage: node smoke-categories.js  (requires /tmp/bundle.js, see smoke-nav.js)
 */
const fs=require('fs'); const {JSDOM}=require('jsdom');
const bundle=fs.readFileSync('/tmp/bundle.js','utf8');
const CATS=process.argv.slice(2).length?process.argv.slice(2):
  ['Love Arcade','Emotional Connection','Conflict Resolution','Creative Chaos','Romance Hub','Healing Hospital'];

async function run(cat){
  const errors=[];
  const dom=new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>',
    {runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost:8081/'});
  const w=dom.window;
  w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
  w.scrollTo=()=>{};
  process.removeAllListeners('unhandledRejection'); process.on('unhandledRejection',()=>{});
  w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
  w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}takeRecords(){return[]}};
  w.CSSFontFaceRule=w.CSSFontFaceRule||class CSSFontFaceRule{};
  w.FontFace=class{constructor(){this.status='loaded'}load(){return Promise.resolve(this)}};
  w.document.fonts={ready:Promise.resolve(),load:()=>Promise.resolve([]),add(){},check:()=>true,forEach(){},values:()=>[][Symbol.iterator]()};
  w.fetch=()=>Promise.resolve({ok:true,status:200,json:async()=>({}),text:async()=>'',headers:{get:()=>null}});
  w.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),16);
  w.cancelAnimationFrame=id=>clearTimeout(id);
  w.console.error=(...a)=>{const s=a.map(String).join(' ');if(!/findDOMNode/.test(s))errors.push(s.slice(0,200));};
  w.console.warn=()=>{};
  try{w.eval(bundle);}catch(e){errors.push('THROWN: '+e);}
  const txt=()=>(w.document.getElementById('root').textContent||'').replace(/\s+/g,' ').trim();
  const click=re=>{const els=[...w.document.querySelectorAll('#root [role="button"], #root button, #root div[tabindex]')];
    const el=els.find(e=>re.test((e.textContent||'').trim())); if(!el)return false;
    el.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true,view:w})); return true;};
  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  await wait(11000);
  click(/PRESS TO START|START/i); await wait(8000);
  const okCat=click(new RegExp(cat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i')); await wait(8000);
  const listed=(txt().match(/PLAY/g)||[]).length;
  const okPlay=click(/^PLAY$/i); await wait(9000);
  const t=txt();
  const reachedLobbyOrGame=/Game Lobby|Question \d+ of|Start Game/i.test(t);
  console.log(`${cat.padEnd(22)} card=${okCat?'Y':'N'} games=${listed} play=${okPlay?'Y':'N'} lobby/game=${reachedLobbyOrGame?'Y':'N'} errors=${[...new Set(errors)].length}`);
  if(errors.length) console.log('    ! '+[...new Set(errors)][0]);
  dom.window.close();
}
(async()=>{ for(const c of CATS) await run(c); process.exit(0); })();
