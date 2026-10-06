const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..'),elements=new Map(),storage=new Map();
const el=id=>{if(!elements.has(id)){const classes=new Set(['quiz','summary','explain','selfGrade'].includes(id)?['hide']:[]);elements.set(id,{children:[],open:false,disabled:false,textContent:'',classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle(x,on){on??=!classes.has(x);on?classes.add(x):classes.delete(x)}},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},scrollIntoView(){},addEventListener(){},showModal(){this.open=true},close(){this.open=false},setAttribute(){},getBoundingClientRect(){return{left:0,right:100,top:0,bottom:100}},firstElementChild:{removeAttribute(){}}});}return elements.get(id)};
const ctx=vm.createContext({window:{},document:{getElementById:el,createElement:()=>({classList:{add(){},remove(){}},scrollIntoView(){}}),addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},scrollTo(){},confirm:()=>true,console});
const run=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
run('data.js');run('question-repairs.js');run('progress.js');
const blocks=vm.runInContext('BLOCKS',ctx),model=ctx.window.ProgressModel,repairs=ctx.window.QuestionRepairs;
assert.equal(blocks.reduce((n,b)=>n+b.questions.length,0),829);
const keys=new Set();let auto=0,unavailable=0;
for(const b of blocks)for(const [i,q]of b.questions.entries()){
 const key=q.progressKey||`${b.n}:${i}`;assert.ok(!keys.has(key),key);keys.add(key);
 if(q.unavailable){unavailable++;assert.equal(q.choices.length,0);}else assert.ok(q.questionImages.length);
 if(q.correct){auto++;assert.ok(q.choices.includes(q.correct));}
 for(const src of [...q.questionImages,...q.explanationImages]){
  const p=src.startsWith('https:')?path.join(root,'..','uworldtrainer-2024-assets',src.split('/uworldtrainer-2024-assets/')[1]):path.join(root,src);assert.ok(fs.existsSync(p),src);
 }
}
assert.equal(auto,823);assert.equal(unavailable,3);
// All retained answers follow the same source key, including reordered questions.
const old={};for(const b of blocks){old[b.n]={answers:Array(b.questions.length).fill('A'),submitted:Array(b.questions.length).fill(true),marked:Array(b.questions.length).fill(true),grades:Array(b.questions.length).fill(true),last:3};}
const before=JSON.stringify(old),migrated=repairs.migrate(old,blocks);assert.equal(JSON.stringify(old),before);
for(const b of blocks){repairs.regrade(migrated[b.n],b.questions);for(const [i,q]of b.questions.entries()){
 assert.equal(migrated[b.n].answers[i],q.legacyIndex===null?null:'A');
 if(q.correct&&q.legacyIndex!==null)assert.equal(migrated[b.n].grades[i],q.correct==='A');
}}
const cloudEntries={};for(const b of blocks)for(let i=0;i<b.questions.length;i++)cloudEntries[`${b.n}:${i}`]={answer:'A',submitted:true,marked:true,grade:true};
const cloud=model.expand(cloudEntries,blocks);for(const b of blocks)assert.deepEqual(JSON.parse(JSON.stringify(cloud[b.n].answers)),JSON.parse(JSON.stringify(migrated[b.n].answers)));
storage.set('uworld_trainer_guest_v2',before);
for(const m of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],ctx);
vm.runInContext('openBlock(2,0)',ctx);assert.equal(storage.get('uworld_trainer_guest_v2'),before);assert.ok(storage.has('uworld_trainer_guest_v3'));
vm.runInContext('states[2].submitted[0]=false;states[2].answers[0]=BLOCKS[1].questions[0].correct;submit()',ctx);assert.equal(vm.runInContext('states[2].grades[0]',ctx),true);assert.ok(el('selfGrade').classList.contains('hide'));
vm.runInContext('openBlock(12,35)',ctx);assert.equal(el('choices').children.length,0);assert.ok(el('selfGrade').classList.contains('hide'));assert.match(el('sourceNotice').textContent,/не оценивается/);assert.equal(vm.runInContext('stats(12).total',ctx),39);
run('account-panel.js');el('accountOpen').onclick();assert.equal(el('accountDialog').open,true);el('accountClose').onclick();assert.equal(el('accountDialog').open,false);
console.log('PASS: 829 source items, 823 keys, assets, unique stable IDs, guest backup/migration, cloud mapping, regrading, unavailable source handling and account dialog');
