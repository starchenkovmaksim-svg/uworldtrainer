const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../exam-store.js','utf8');
let remote={'topic-test:0':{answer:'B',submitted:true}},fail=false,pause,authCallback,session={user:{id:'u1',email:'test@example.com'}};
const storage=new Map(),elements=new Map(),timeouts=[];
const el=id=>{if(!elements.has(id))elements.set(id,{textContent:'',classList:{toggle(){}}});return elements.get(id);};
const client={auth:{onAuthStateChange:fn=>authCallback=fn,getSession:async()=>({data:{session}}),signOut:async()=>({})},
 from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:{entries:structuredClone(remote)}})})})}),
 rpc:async(name,{patch})=>{assert.equal(name,'merge_trainer_progress');assert.ok(Object.keys(patch).every(k=>k.startsWith('exam:v1:attempt:')));if(fail)throw Error('offline');if(pause==='wait')await new Promise(r=>pause=r);remote={...remote,...structuredClone(patch)};return{data:structuredClone(remote)};}};
const win={TRAINER_CONFIG:{supabaseUrl:'test',supabasePublishableKey:'public'},supabase:{createClient:()=>client},TrainerAuth:{mount:()=>({session(){}})},addEventListener(){}};
const ctx={window:win,document:{getElementById:el,createElement:()=>({}),head:{append:s=>s.onload()},hidden:false},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},structuredClone,TextEncoder,setTimeout:fn=>{timeouts.push(fn);return timeouts.length;},clearTimeout(){},setInterval(){}};
const tick=()=>new Promise(r=>setImmediate(r));
const attempt=(id,answer='A')=>({schema:1,id,device:'d',mode:'topic',questions:[{id:'q',correct:'B'}],answers:[answer],phase:'block'});
(async()=>{
 vm.runInNewContext(source,ctx);const S=win.ExamStore;S.setWriter(true);await tick();
 S.put(attempt('one'));fail=true;assert.equal(await S.sync(),false);assert.match(el('examSync').textContent,/Нет связи/);
 const saved=JSON.parse(storage.get('uworld_exams_v1:test:u1'));assert.equal(saved.pending['exam:v1:attempt:one'].answers[0],'A');
 remote['exam:v1:attempt:other']=attempt('other');fail=false;await S.sync();assert.equal(S.history().length,2);assert.equal(remote['topic-test:0'].answer,'B');
 S.put(attempt('one','B'));pause='wait';const flight=S.sync();S.put(attempt('one','C'));pause();await flight;
 assert.equal(S.get('one').answers[0],'C');pause=null;await S.sync();assert.equal(remote['exam:v1:attempt:one'].answers[0],'C');
 // A second read-only tab cannot submit an old cached patch or overwrite the local cache.
 S.setWriter(false);const before=JSON.stringify(remote),cacheBefore=storage.get('uworld_exams_v1:test:u1');S.put(attempt('one','A'));await S.sync();assert.equal(JSON.stringify(remote),before);assert.equal(storage.get('uworld_exams_v1:test:u1'),cacheBefore);
 S.setWriter(true);await tick();await el('logout').onclick();assert.equal(S.user,null);assert.equal(S.history().length,0);
 S.put(attempt('guest'));assert.equal(S.history().length,1);assert.ok(!remote['exam:v1:attempt:guest']);
 session={user:{id:'u2',email:'second@example.com'}};remote={};authCallback('SIGNED_IN',session);await timeouts.at(-1)();await tick();
 assert.equal(S.user,'u2');assert.equal(S.history().length,0);assert.ok(JSON.parse(storage.get('uworld_exams_v1:test:guest')).entries['exam:v1:attempt:guest']);
 console.log('PASS: exam-only patches, offline queue, retry, concurrent requests, distinct-device attempts, read-only tabs and account/guest isolation');
})().catch(e=>{console.error(e);process.exitCode=1;});
