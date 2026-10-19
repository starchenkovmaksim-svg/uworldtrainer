const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function element(){return {style:{},events:{},addEventListener(n,f){(this.events[n]??=[]).push(f)},emit(n,e={}){for(const f of this.events[n]||[])f(e)},setAttribute(){},removeAttribute(){},focus(){},querySelector(){},classList:{},dataset:{}};}
const dialog=element(),stage=element(),plane=element(),frame=element(),img=element(),output=element(),buttons={};
stage.clientWidth=360;stage.clientHeight=600;stage.scrollLeft=0;stage.scrollTop=0;
stage.firstElementChild=plane;plane.firstElementChild=frame;frame.firstElementChild=img;
stage.getBoundingClientRect=()=>({left:0,top:70});
frame.getBoundingClientRect=()=>({left:parseFloat(frame.style.left||0)-stage.scrollLeft,top:70+parseFloat(frame.style.top||0)-stage.scrollTop});
stage.scrollBy=(x,y)=>{stage.scrollLeft+=x;stage.scrollTop+=y};stage.scrollTo=(x,y)=>{stage.scrollLeft=x;stage.scrollTop=y};
const captured=new Set();stage.setPointerCapture=id=>captured.add(id);stage.hasPointerCapture=id=>captured.has(id);stage.releasePointerCapture=id=>captured.delete(id);
dialog.querySelector=s=>s==='.scan-stage'?stage:s==='output'?output:(buttons[s]??=element());
dialog.showModal=()=>dialog.open=true;dialog.close=()=>{dialog.open=false;dialog.emit('close')};
img.complete=true;img.naturalWidth=1200;img.naturalHeight=900;
const doc=element();doc.body={append(){}};doc.documentElement={};doc.createElement=()=>dialog;doc.querySelectorAll=()=>[];
const win=element();win.visualViewport=element();let observer,raf=[];
const ctx={window:win,document:doc,location:{href:'https://example.org/'},URL,MutationObserver:class{observe(){}},ResizeObserver:class{constructor(f){observer=f}observe(){}},requestAnimationFrame:f=>(raf.push(f),raf.length),cancelAnimationFrame:()=>{raf=[]}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../scan-viewer.js','utf8'),ctx);
const source={src:'https://example.org/test.webp',naturalWidth:1200,naturalHeight:900,getAttribute(){return this.src},focus(){}};
doc.emit('click',{target:{closest:()=>source},preventDefault(){},stopImmediatePropagation(){}});
assert.equal(output.textContent,'28%');
buttons['[data-more]'].onclick();buttons['[data-more]'].onclick();
stage.emit('pointerdown',{button:0,pointerId:1,clientX:100,clientY:200});
stage.emit('pointermove',{pointerId:1,clientX:130,clientY:160});
function anchor(){const r=frame.getBoundingClientRect(),w=parseFloat(frame.style.width);return [(stage.clientWidth/2-r.left)/w,(70+stage.clientHeight/2-r.top)/w]}
function closeTo(a,b){a.forEach((v,i)=>assert.ok(Math.abs(v-b[i])<1e-8,`${v} != ${b[i]}`))}
const width=frame.style.width,percent=output.textContent,point=anchor();
function resize(w,h){stage.clientWidth=w;stage.clientHeight=h;stage.emit('scroll');win.emit('resize');observer();while(raf.length)raf.shift()();}
resize(780,260);assert.equal(frame.style.width,width);assert.equal(output.textContent,percent);closeTo(anchor(),point);assert.equal(captured.size,0);
resize(780,310);closeTo(anchor(),point);assert.equal(frame.style.width,width);
resize(360,600);closeTo(anchor(),point);assert.equal(frame.style.width,width);
// Late duplicate image-load events cannot reset an already zoomed image.
img.onload();assert.equal(frame.style.width,width);
// Explicit fitting still works after rotation.
resize(780,260);buttons['[data-fit]'].onclick();assert.equal(frame.style.width,'756px');
dialog.close();assert.equal(captured.size,0);
console.log('PASS scan viewer: zoom and focal point survive rotation/browser chrome resize, captures reset, explicit fit and delayed load handled');
