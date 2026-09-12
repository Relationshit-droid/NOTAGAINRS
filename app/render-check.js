const { JSDOM } = require('jsdom'); const fs = require('fs');
const dom = new JSDOM(fs.readFileSync('/tmp/index.html','utf8'), { runScripts:'outside-only', pretendToBeVisual:true, url:'http://localhost:8081/' });
const w = dom.window; const errors=[];
w.addEventListener('error', e=>errors.push('window: '+e.message));
['log','warn','error'].forEach(k=>{w.console[k]=(...a)=>{const s=a.map(String).join(' ');if(k==='error'&&!/findDOMNode|deprecated|useNativeDriver/i.test(s))errors.push(s);};});
w.matchMedia=q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
w.scrollTo=()=>{}; w.alert=()=>{};
w.fetch=()=>Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({}),text:()=>Promise.resolve('')});
w.WebSocket=function(){this.close=()=>{};this.send=()=>{};this.addEventListener=()=>{};};
w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
w.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),16); w.cancelAnimationFrame=id=>clearTimeout(id);
try{ w.eval(fs.readFileSync('/tmp/b.js','utf8')); }catch(e){ console.log('FATAL:', e.stack.split('\n').slice(0,12).join('\n')); }
setTimeout(()=>{
  const root=w.document.getElementById('root');
  const txt=(root?.textContent||'').replace(/\s+/g,' ').trim();
  console.log('NODES:', root?root.querySelectorAll('*').length:0);
  console.log('TEXT:', txt.slice(0,900)||'(empty)');
  console.log('ERRORS('+errors.length+'):'); errors.slice(0,8).forEach(e=>console.log('  -',e.slice(0,260)));
  // click the splash CTA to advance into the app
  const btns=[...w.document.querySelectorAll('[role="button"],div')].filter(b=>/INSERT COIN|START|BEGIN|ENTER/i.test(b.textContent||'')&&(b.textContent||'').length<40);
  console.log('CTA CANDIDATES:', btns.slice(0,4).map(b=>b.textContent.trim()));
  process.exit(0);
},9000);
