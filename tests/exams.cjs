const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const C=require('../exam-core.js'),ctx={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/../exam-bank.js','utf8'),ctx);
const B=JSON.parse(JSON.stringify(ctx.window.ExamBank)),MIN=60000,DAY=86400000;
const full=C.select(B,'full',null),daily=C.select(B,'daily',null);
assert.equal(full.questions.length,280);assert.equal(daily.questions.length,80);
for(const [mode,s]of[['full',full],['daily',daily]]){
 assert.equal(new Set(s.questions.map(q=>q.id)).size,s.questions.length);
 assert.ok(s.questions.every(q=>q.step1&&q.correct&&q.questionImages.length));
 const wanted=C.quotas(B.systems,s.questions.length);
 for(const id in wanted)assert.equal(s.questions.filter(q=>q.system===id).length,wanted[id]);
}
assert.throws(()=>C.select({...B,questions:B.questions.filter(q=>q.system!=='development')},'full'),/доступно/);
const topic=B.topics.find(t=>t.title==='Ophthalmology'),selection=C.select(B,'topic',topic.id);
assert.equal(selection.questions.length,30);
const make=(mode='full',sel=full,now=1000)=>C.create({id:'test',device:'test-device',mode,title:'test',topic:topic.id,selection:sel,version:B.version,now});
let a=make();assert.equal(a.phase,'tutorial');
C.action(a,'nextBlock',null,1000+MIN);assert.equal(a.breakMs,59*MIN);assert.equal(a.deadline,1000+31*MIN);
C.action(a,'answer',a.questions[0].correct,1000+2*MIN);assert.equal(a.answers[0],a.questions[0].correct);
C.action(a,'endBlock',null,1000+11*MIN);assert.equal(a.phase,'break');assert.equal(a.breakMs,79*MIN);
C.action(a,'nextBlock',null,1000+16*MIN);assert.equal(a.breakMs,74*MIN);assert.equal(a.block,1);
assert.equal(C.action(a,'navigate',0,1000+17*MIN),false);
assert.equal(C.action(a,'answer','INVALID',1000+17*MIN),false);
// Reload during break, expire entire day in background: no fresh timer is granted.
a=JSON.parse(JSON.stringify(a));C.advance(a,1000+480*MIN);assert.equal(a.phase,'done');assert.equal(a.finishedAt,1000+480*MIN);
assert.equal(C.result(a).skipped,279);assert.equal(C.result(a).correct,1);assert.equal(C.result(a).passed,false);
const snapshot=JSON.stringify(a);C.action(a,'answer','A',1000+500*MIN);assert.deepEqual(a.answers,JSON.parse(snapshot).answers);
// Stale submit at a zero-break boundary must not close the next block.
a=make('daily',daily);a.breakMs=0;assert.equal(C.action(a,'endBlock',null,a.deadline+1),false);assert.equal(a.block,1);assert.equal(a.closed.length,1);
// Topic threshold uses ceiling, not rounded percentages.
a=make('topic',selection);for(let i=0;i<24;i++)a.answers[i]=a.questions[i].correct;
C.action(a,'endBlock',null,1000+MIN);assert.equal(C.result(a).passed,true);a.answers[23]=null;assert.equal(C.result(a).passed,false);
a.answers[23]=a.questions[23].correct;
let b=structuredClone(a);b.id='test2';b.startedAt=a.finishedAt+7*DAY;b.finishedAt=b.startedAt+MIN;
assert.equal(C.mastery([a,b],topic.id).confirmed,false,'identical questions cannot confirm mastery');
b.questions[0].id='different';assert.equal(C.mastery([a,b],topic.id).confirmed,true);
b.startedAt=a.finishedAt+7*DAY-1;assert.equal(C.mastery([a,b],topic.id).confirmed,false);
// Retakes avoid the last selection when the pool can supply a new set.
const large=B.topics.find(t=>t.title==='Cardiovascular System'),first=C.select(B,'topic',large.id);
const old=make('topic',first);old.topic=large.id;
const second=C.select(B,'topic',large.id,[old]);assert.equal(second.repeated,0);
// No hidden changes to original source data or practice save keys.
assert.ok(!fs.readFileSync(__dirname+'/../exam-store.js','utf8').includes('uworld_topics_guest_v1'));
assert.ok(B.questions.every(q=>q.choices.includes(q.correct)));
assert.equal(new Set(B.questions.map(q=>q.id)).size,B.questions.length);
console.log('PASS: real-bank quotas, shortages, uniqueness, retakes, deadlines, reload, breaks, stale clicks, grading and spaced mastery');
