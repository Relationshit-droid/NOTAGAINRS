const { JSDOM } = require('jsdom'); const fs=require('fs');
const dom=new JSDOM(fs.readFileSync('/tmp/index.html','utf8'),{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost:8081/'});
const w=dom.window; let errors=[];
w.addEventListener('error',e=>{errors.push(e.message); if(e.error&&e.error.stack) w.__lastStack=e.error.stack;});
['log','warn','error'].forEach(k=>{w.console[k]=(...a)=>{const s=a.map(String).join(' ');if(k==='error'&&!/findDOMNode|deprecated|useNativeDriver|act\(/i.test(s))errors.push(s);};});
w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
w.scrollTo=()=>{}; w.alert=()=>{};
w.fetch=()=>Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({}),text:()=>Promise.resolve('')});
w.WebSocket=function(){this.close=()=>{};this.send=()=>{};this.addEventListener=()=>{};};
w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
w.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),16); w.cancelAnimationFrame=id=>clearTimeout(id);
process.on('uncaughtException',e=>{if(!/timeout exceeded/.test(String(e&&e.message)))errors.push('uncaught: '+e.message);});
w.eval(fs.readFileSync('/tmp/b.js','utf8'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const root=()=>w.document.getElementById('root');
const txt=()=>(root()?.textContent||'').replace(/\s+/g,' ').trim();
(async()=>{
  await sleep(9000);
  const els=[...w.document.querySelectorAll('div')].reverse();
  const cta=els.find(e=>/^PRESS TO START$/i.test((e.textContent||'').trim()));
  if(cta)['pointerdown','mousedown','pointerup','mouseup','click'].forEach(t=>cta.dispatchEvent(new w.MouseEvent(t,{bubbles:true,cancelable:true,view:w})));
  await sleep(5000);
  const ref=w.__navigationRef;
  console.log('navigationRef ready:', !!(ref&&ref.isReady&&ref.isReady()));
  let pass=0;
  const screens=JSON.parse(process.argv[2].startsWith('@')?fs.readFileSync(process.argv[2].slice(1),'utf8'):process.argv[2]);
  for(const [label,name,params] of screens){
    errors=[];
    try{ ref.navigate(name, params||{}); }catch(e){ errors.push('nav throw: '+e.message); }
    if(w.__lastStack) { console.log('STACK:', w.__lastStack.split('\n').slice(0,6).join(' | ')); w.__lastStack=null; }
    await sleep(900);
    const n=root().querySelectorAll('*').length;
    const body=txt().slice(0,150);
    if(errors.length) console.log(`FAIL ${name} :: ${errors[0].slice(0,170)}`);
    else if(n<5) console.log(`EMPTY ${name} nodes=${n}`);
    else pass++;
  }
  console.log(`\nPASSED ${pass}/${screens.length}`);
  process.exit(0);
})();
