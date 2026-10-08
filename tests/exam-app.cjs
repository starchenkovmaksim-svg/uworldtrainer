const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const core=require('../exam-core.js'),ctxBank={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/../exam-bank.js','utf8'),ctxBank);
const bank=ctxBank.window.ExamBank,els=new Map(),local=new Map(),records=new Map(),intervals=[];let notify=()=>{},user=null,now=1000000,serial=0;
function el(id){if(!els.has(id))els.set(id,{innerHTML:'',textContent:'',dataset:{},value:'',children:[],classList:{toggle(){},add(){},remove(){}},showModal(){this.open=true;},close(){this.open=false;},scrollIntoView(){}});return els.get(id);}
const store={get user(){return user;},ready:true,storageOK:true,seen:new Set(),setWriter(){},history:()=>[...records.values()],get:id=>records.get(id),put:a=>records.set(a.id,structuredClone(a)),subscribe:fn=>notify=fn};
const win={ExamCore:core,ExamBank:bank,ExamStore:store,addEventListener(){}};
class Clock extends Date{static now(){return now;}}
const context={window:win,document:{getElementById:el,querySelector:()=>null,addEventListener(){}},navigator:{locks:{request:(_name,_options,fn)=>Promise.resolve().then(()=>fn({}))}},localStorage:{getItem:k=>local.get(k),setItem:(k,v)=>local.set(k,v)},crypto:{randomUUID:()=>`test-${++serial}`,getRandomValues:a=>{a[0]=Math.floor(Math.random()*4294967296);return a;}},Date:Clock,URLSearchParams,location:{search:''},setInterval:(fn,ms)=>intervals.push([fn,ms]),clearInterval(){},scrollTo(){},alert:message=>{throw Error(message);}};
const click=(action,extra={})=>el('examContent').onclick({target:{closest:selector=>selector==='[data-zoom]'?null:{dataset:{action,...extra},disabled:false}}});
const tick=()=>intervals.filter(([,ms])=>ms===1000).forEach(([fn])=>fn());
(async()=>{
 vm.runInNewContext(fs.readFileSync(__dirname+'/../exam-app.js','utf8'),context);await new Promise(r=>setImmediate(r));
 assert.match(el('examContent').innerHTML,/Зачёты по темам/);
 click('prepare',{mode:'topic',topic:bank.topics[0].id});assert.ok(el('setupDialog').open);assert.match(el('setupBody').innerHTML,/гостевом режиме/);
 el('startExam').onclick();assert.equal(records.size,1);let a=[...records.values()][0];assert.equal(a.mode,'topic');assert.match(el('examContent').innerHTML,/Осталось в блоке/);assert.ok(!el('examContent').innerHTML.includes('Объяснение</h3>'));
 click('answer',{letter:a.questions[0].correct});click('flag');a=records.get(a.id);assert.equal(a.answers[0],a.questions[0].correct);assert.equal(a.flags[0],true);
 click('navigate',{index:'1'});assert.equal(records.get(a.id).current,1);
 click('askEnd');assert.ok(el('endDialog').open);now+=60000;el('confirmEnd').onclick();assert.equal(records.get(a.id).phase,'done');assert.match(el('examContent').innerHTML,/Результат по системам/);
 click('review',{index:'0'});assert.match(el('examContent').innerHTML,/правильный:/);assert.match(el('examContent').innerHTML,/Объяснение/);
 click('home');click('prepare',{mode:'full'});el('startExam').onclick();a=[...records.values()].at(-1);assert.equal(a.phase,'tutorial');assert.match(el('examContent').innerHTML,/Инструктаж/);
 click('nextBlock');assert.equal(records.get(a.id).breakMs,60*60000);click('askEnd');el('confirmEnd').onclick();assert.equal(records.get(a.id).phase,'break');assert.match(el('examContent').innerHTML,/Перерыв/);
 now+=480*60000;tick();assert.equal(records.get(a.id).phase,'done');assert.match(el('examContent').innerHTML,/280/);
 // Changing accounts closes an open start dialog; a guest draft cannot become an account attempt.
 click('home');click('prepare',{mode:'daily'});user='different-user';notify();assert.equal(el('setupDialog').open,false);
 const count=records.size;el('startExam').onclick();assert.equal(records.size,count);
 console.log('PASS: exam screen setup, guest notice, answer/flag/navigation, confirmation, hidden explanations, final review, tutorial, break, expiry and auth-switch draft isolation');
})().catch(e=>{console.error(e);process.exitCode=1;});
