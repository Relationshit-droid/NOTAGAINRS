const { JSDOM } = require('jsdom'); const fs = require('fs');
const dom = new JSDOM(fs.readFileSync('/tmp/index.html','utf8'), { runScripts:'outside-only', pretendToBeVisual:true, url:'http://localhost:8081/' });
const w = dom.window; const errors=[];
w.addEventListener('error', e=>errors.push('window: '+e.message));
['log','warn','error'].forEach(k=>{w.console[k]=(...a)=>{const s=a.map(String).join(' ');if(k==='error'&&!/findDOMNode|deprecated|useNativeDriver|not wrapped in act/i.test(s))errors.push(s);};});
w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
w.scrollTo=()=>{}; w.alert=()=>{};
w.fetch=()=>Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({}),text:()=>Promise.resolve('')});
w.WebSocket=function(){this.close=()=>{};this.send=()=>{};this.addEventListener=()=>{};};
w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
w.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),16); w.cancelAnimationFrame=id=>clearTimeout(id);
try{ w.eval(fs.readFileSync('/tmp/b.js','utf8')); }catch(e){ console.log('FATAL:', e.stack.split('\n').slice(0,10).join('\n')); process.exit(1); }

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const txt=()=> (w.document.getElementById('root')?.textContent||'').replace(/\s+/g,' ').trim();
function click(pred){
  const els=[...w.document.querySelectorAll('div,[role="button"],button')];
  const el=els.reverse().find(e=>pred((e.textContent||'').trim()) && (e.textContent||'').trim().length<60);
  if(!el) return false;
  ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(t=>{
    el.dispatchEvent(new w.MouseEvent(t,{bubbles:true,cancelable:true,view:w}));
  });
  return true;
}
(async()=>{
  await sleep(9000);
  console.log('[1] SPLASH:', txt().slice(0,120));
  console.log('    clicked PRESS TO START:', click(t=>/^PRESS TO START$/i.test(t)));
  await sleep(6000);
  const home=txt();
  console.log('[2] AFTER START ('+ (w.document.getElementById('root')?.querySelectorAll('*').length) +' nodes):');
  console.log('   ', home.slice(0,700)||'(empty)');
  console.log('ERRORS('+errors.length+'):'); errors.slice(0,10).forEach(e=>console.log('  -',e.slice(0,240)));
  process.exit(0);
})();
