const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname+'/..',ctx={window:{}};
vm.runInNewContext(fs.readFileSync(root+'/medical-notes.js','utf8'),ctx);
vm.runInNewContext(fs.readFileSync(root+'/exam-bank.js','utf8'),ctx);
const notes=JSON.parse(fs.readFileSync(root+'/audits/medical-notes.json','utf8'));
assert.equal(new Set(notes.map(n=>n.image)).size,notes.length);
assert.equal(ctx.window.MedicalNotes.html({questionImages:['unreviewed.webp']}),'');
let copies=0;
for(const n of notes){
 const q={questionImages:[n.image]},before=JSON.stringify(q);
 const html=ctx.window.MedicalNotes.html(q);
 assert.ok(html.includes(n.title));assert.ok(html.includes('ключ исходника сохранён'));
 assert.equal(JSON.stringify(q),before);assert.equal(n.keyChanged,false);
 for(const s of n.sources){assert.equal(new URL(s.url).protocol,'https:');assert.ok(html.includes(s.label));}
 for(const copy of ctx.window.ExamBank.questions.filter(q=>q.questionImages[0]===n.image)){
  assert.equal(ctx.window.MedicalNotes.html(copy),html);copies++;
 }
}
assert.ok(copies>0);
// The recovered Gaucher stem retains its progress identity and source key.
const topicContext={BLOCKS:[]};
vm.runInNewContext(fs.readFileSync(root+'/topics-data-2024.js','utf8'),topicContext);
const gaucher=topicContext.BLOCKS.find(b=>b.n==='topic-2024-general-pharmacology').questions[12];
assert.equal(gaucher.correct,'A');
assert.equal(gaucher.sourceQuestionId,'18421');
assert.deepEqual(Array.from(gaucher.sourcePages),[65]);
assert.ok(gaucher.questionImages[0].endsWith('/q013-p0064.webp'));
assert.ok(!gaucher.explanationImages.some(u=>u.endsWith('/p0065.webp')));
const examGaucher=ctx.window.ExamBank.questions.find(q=>q.id==='uw:18421');
assert.equal(examGaucher.questionImages[0],gaucher.questionImages[0]);
assert.equal(examGaucher.correct,gaucher.correct);
assert.deepEqual(Array.from(examGaucher.explanationImages),Array.from(gaucher.explanationImages));
const progress=JSON.parse(fs.readFileSync(root+'/audits/medical-review-progress.json','utf8'));
assert.equal(progress.questions.length,progress.total);
assert.equal(progress.questions.filter(q=>q.status!=='pending').length,progress.firstPassRead);
assert.equal(progress.questions.filter(q=>q.status==='source_checked_note').length,notes.length);
console.log(`PASS medical notes: ${notes.length} source-linked notes, ${copies} exam copies, unknown questions unchanged`);
