// Per-screen crash sweep. Navigates to every registered route, records the
// first error each one produces, and returns Home in between so a failing
// screen cannot contaminate the next result.
const { JSDOM } = require('jsdom'); const fs=require('fs');
const dom=new JSDOM(fs.readFileSync('/tmp/index.html','utf8'),{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost:8081/'});
const w=dom.window; let errors=[];
const IGNORE=/findDOMNode|deprecated|useNativeDriver|act\(|timeout exceeded|componentStack/i;
const push=s=>{ if(!IGNORE.test(s)) errors.push(s); };
w.addEventListener('error',e=>push(e.message));
['log','warn','error'].forEach(k=>{w.console[k]=(...a)=>{const s=a.map(String).join(' ');if(k==='error')push(s);};});
w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
w.scrollTo=()=>{}; w.alert=()=>{};
w.fetch=()=>Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({}),text:()=>Promise.resolve('')});
w.WebSocket=function(){this.close=()=>{};this.send=()=>{};this.addEventListener=()=>{};};
w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
w.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),16); w.cancelAnimationFrame=id=>clearTimeout(id);
process.on('uncaughtException',e=>push('uncaught: '+e.message));
process.on('unhandledRejection',e=>push('rejection: '+(e&&e.message||e)));
w.eval(fs.readFileSync('/tmp/b.js','utf8'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const root=()=>w.document.getElementById('root');
(async()=>{
  await sleep(9000);
  const els=[...w.document.querySelectorAll('div')].reverse();
  const cta=els.find(e=>/^PRESS TO START$/i.test((e.textContent||'').trim()));
  if(cta)['pointerdown','mousedown','pointerup','mouseup','click'].forEach(t=>cta.dispatchEvent(new w.MouseEvent(t,{bubbles:true,cancelable:true,view:w})));
  await sleep(5000);
  const ref=w.__navigationRef;
  if(!(ref&&ref.isReady&&ref.isReady())){ console.log('FATAL navigationRef not ready'); process.exit(1); }
  const arg=process.argv[2];
  const screens=JSON.parse(arg.startsWith('@')?fs.readFileSync(arg.slice(1),'utf8'):arg);
  const fails=[];
  for(const [label,name,params] of screens){
    // Reset the stack to a single route so previously-visited screens (and any
    // ErrorBoundary fallback they left mounted) are fully unmounted. Plain
    // navigate() keeps prior screens alive in a native-stack, which made one
    // failure look like it contaminated every later screen.
    try{ ref.reset({index:0,routes:[{name:'MainApp'}]}); }catch(e){}
    await sleep(400);
    errors=[];
    try{ ref.reset({index:0,routes:[{name,params:params||{}}]}); }catch(e){ push('nav throw: '+e.message); }
    await sleep(1100);
    const n=root()?root().querySelectorAll('*').length:0;
    // A boundary hit renders this exact copy, so it is a reliable crash signal.
    const caught=(root()?.textContent||'').includes('Dr. Marcie dropped this one');
    if(errors.length||caught||n<5){
      const why=errors[0]||(caught?'ErrorBoundary caught render error':'empty screen');
      fails.push([name,why]); console.log(`FAIL ${name} :: ${why.slice(0,160)}`);
    }
  }
  console.log(`\nPASSED ${screens.length-fails.length}/${screens.length}  FAILED ${fails.length}`);
  fs.writeFileSync('/tmp/fails.json',JSON.stringify(fails,null,1));
  process.exit(0);
})();
