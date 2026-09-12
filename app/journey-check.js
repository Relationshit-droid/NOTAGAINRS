const { JSDOM } = require('jsdom'); const fs = require('fs');
const dom = new JSDOM(fs.readFileSync('/tmp/index.html','utf8'), { runScripts:'outside-only', pretendToBeVisual:true, url:'http://localhost:8081/' });
const w = dom.window; const errors=[];
w.addEventListener('error', e=>errors.push('window: '+e.message));
['log','warn','error'].forEach(k=>{w.console[k]=(...a)=>{const s=a.map(String).join(' ');if(k==='error'&&!/findDOMNode|deprecated|useNativeDriver|act\(|Unable to preventDefault/i.test(s))errors.push(s);};});
w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
w.scrollTo=()=>{}; w.alert=()=>{}; w.confirm=()=>true;
w.fetch=()=>Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({}),text:()=>Promise.resolve('')});
w.WebSocket=function(){this.close=()=>{};this.send=()=>{};this.addEventListener=()=>{};};
w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
w.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),16); w.cancelAnimationFrame=id=>clearTimeout(id);
process.on('uncaughtException', e=>{ if(!/timeout exceeded/.test(String(e&&e.message))) errors.push('uncaught: '+e.message); });
try{ w.eval(fs.readFileSync('/tmp/b.js','utf8')); }catch(e){ console.log('FATAL:',e.stack.split('\n').slice(0,8).join('\n')); process.exit(1);}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const txt=()=>(w.document.getElementById('root')?.textContent||'').replace(/\s+/g,' ').trim();
function click(match){
  const els=[...w.document.querySelectorAll('div,[role="button"],button')];
  const el=els.reverse().find(e=>{const t=(e.textContent||'').trim();return match(t)&&t.length<80;});
  if(!el)return false;
  ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(t=>el.dispatchEvent(new w.MouseEvent(t,{bubbles:true,cancelable:true,view:w})));
  return true;
}
const step=async(label,pred)=>{const ok=click(pred);await sleep(3500);
  console.log(`\n### ${label} (clicked=${ok}) nodes=${w.document.getElementById('root')?.querySelectorAll('*').length}`);
  console.log('   ', txt().slice(0,420)||'(empty)'); return ok;};
(async()=>{
  await sleep(9000); click(t=>/^PRESS TO START$/i.test(t)); await sleep(5000);
  console.log('### DASHBOARD nodes=',w.document.getElementById('root')?.querySelectorAll('*').length);
  await step('TAP: Love Arcade category', t=>/^🕹️Love Arcade/.test(t));
  await step('TAP: GAMES tab', t=>/^🎮GAMES$/.test(t));
  await step('TAP: SOS tab', t=>/^🆘?!?$/.test(t)||/^SOS$/i.test(t));
  await step('TAP: ARCADE tab', t=>/^🕹️ARCADE$/.test(t));
  await step('TAP: DECODER tab', t=>/^🔍DECODER$/.test(t));
  await step('TAP: PROFILE tab', t=>/^👤PROFILE$/.test(t));
  console.log('\n=== ERRORS ('+errors.length+') ==='); errors.slice(0,12).forEach(e=>console.log(' -',e.slice(0,240)));
  process.exit(0);
})();
