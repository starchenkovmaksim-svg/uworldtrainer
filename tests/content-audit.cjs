const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
function load(files){const c=vm.createContext({window:{}});for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return vm.runInContext('BLOCKS',c);}
const blocks=load(['data.js']),topics=load(['topics-data.js','topics-data-2024.js','topics-organization.js']);
const rawTopics=load(['topics-data.js','topics-data-2024.js']);
const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'exam-bank.js'),'utf8'),c);const bank=c.window.ExamBank;
assert.equal(blocks.flatMap(b=>b.questions).length,829);assert.equal(topics.flatMap(b=>b.questions).length,4188);
const byImage=new Map();
for(const b of [...blocks,...topics]){
 const ids=new Set();
 for(const [i,q]of b.questions.entries()){
  const id=q.progressKey||`${b.n}:${i}`;assert.ok(!ids.has(id),id);ids.add(id);
  assert.equal(q.choices.length,new Set(q.choices).size,id);
  assert.ok(!q.correct||q.choices.includes(q.correct),id);
  assert.ok(q.unavailable||q.questionImages.length,id);
  if(q.questionImages.length)byImage.set(JSON.stringify(q.questionImages),q);
 }
}
const fixes=JSON.parse(fs.readFileSync(path.join(root,'audits/2026-10-11-fixes.json'),'utf8'));
for(const f of fixes.fixes){const q=rawTopics.find(b=>b.n===f.topic).questions[f.question-1];assert.equal(JSON.stringify(q),JSON.stringify(f.after),f.topic);assert.equal(q.correct,f.before.correct,'do not change source keys without evidence');}
for(const q of bank.questions){const source=byImage.get(JSON.stringify(q.questionImages));assert.ok(source,q.id);for(const key of ['choices','correct','explanationImages'])assert.equal(JSON.stringify(q[key]),JSON.stringify(source[key]),`${q.id} ${key}`);}
assert.equal(bank.questions.length,4309);
console.log('PASS: 5017 practice records, 4309 matching exam copies, valid keys and options, stable IDs and 9 source-confirmed repairs');
