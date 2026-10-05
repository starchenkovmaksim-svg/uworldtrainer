const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = `${__dirname}/..`;
const blocks = [{n:"topic-test",questions:[{choices:['A','B'],correct:'B'},{choices:['A','B'],correct:null}]}];
let remote = {'1:0':{answer:'B',submitted:true,marked:true,grade:true}}, fail = false, finishRequest, authCallback;
const elements = new Map();
const element = id => {
  if (!elements.has(id)) elements.set(id,{textContent:'',classList:{toggle(){},remove(){}},querySelector(){return {};}});
  return elements.get(id);
};
const storage = new Map(), events = {};
const client = {
  auth: {
    onAuthStateChange(callback){authCallback=callback;},
    async getSession(){return {data:{session:{user:{id:'first',email:'test@example.com'}}}};},
    async signOut(){return {};}
  },
  from(){return {select(){return {eq(){return {async maybeSingle(){return {data:{entries:structuredClone(remote)}};}};}};}};},
  async rpc(_, {patch}) {
    if(fail) throw new Error('offline');
    if(finishRequest === 'pause') await new Promise(resolve=>{finishRequest=resolve;});
    remote = {...remote,...structuredClone(patch)};
    return {data:structuredClone(remote)};
  }
};
let visible;
const win = {
  TrainerAuth:{mount:()=>({session(){}})},
  TRAINER_CONFIG:{supabaseUrl:'https://test.supabase.co',supabasePublishableKey:'test'},
  supabase:{createClient:()=>client},
  trainer:{replace(states){visible=states;}},
  addEventListener(type,fn){events[type]=fn;}
};
const ctx=vm.createContext({window:win,BLOCKS:blocks,structuredClone,Date,console,
  localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
  document:{getElementById:element,createElement:()=>({}),head:{append:s=>s.onload()},addEventListener(){},hidden:false},
  location:{origin:'https://test',pathname:'/'},setTimeout:()=>1,clearTimeout(){},setInterval(){}});
vm.runInContext(fs.readFileSync(`${path}/progress.js`,'utf8'),ctx);
async function tick(){await new Promise(resolve=>setImmediate(resolve));}
(async()=>{
  vm.runInContext(fs.readFileSync(`${path}/topics-cloud.js`,'utf8'),ctx);
  await tick();
  assert.equal(visible["topic-test"].answers[0],null);
  visible["topic-test"].answers[0]='B'; visible["topic-test"].submitted[0]=true; visible["topic-test"].grades[0]=true;
  win.trainer.onChange(visible);
  fail=true;
  await element('syncNow').onclick();
  assert.ok(element('syncStatus').textContent.includes('недоступно'));
  assert.ok(JSON.parse([...storage.values()][0]).pending['topic-test:0']);
  fail=false;
  remote['topic-test:1']={answer:'A',submitted:true,marked:true,grade:false};
  await element('syncNow').onclick();
  assert.equal(visible["topic-test"].answers[0],'B');
  assert.equal(visible["topic-test"].answers[1],'A');
  assert.equal(Object.keys(JSON.parse([...storage.values()][0]).pending).length,0);
  visible["topic-test"].marked[0]=true;win.trainer.onChange(visible);
  finishRequest='pause';
  const inFlight=element('syncNow').onclick();
  visible["topic-test"].marked[0]=false;win.trainer.onChange(visible);
  finishRequest();await inFlight;
  assert.equal(visible["topic-test"].marked[0],false);
  assert.ok(JSON.parse([...storage.values()][0]).pending['topic-test:0']);
  finishRequest=null;await element('syncNow').onclick();
  assert.equal(remote['topic-test:0'].marked,false);
  win.trainer.onChange({});await element('syncNow').onclick();
  assert.equal(remote['topic-test:0'].answer,null);
  assert.equal(remote['topic-test:1'].answer,null);
  await element('logout').onclick();
  assert.equal(Object.keys(visible).length,0);
  assert.equal(remote['1:0'].answer,'B');
  console.log('PASS: topics preserve legacy progress; cloud adapter offline queue, retry, two-device merge, edit during request, reset, logout');
})().catch(error=>{console.error(error);process.exitCode=1;});
