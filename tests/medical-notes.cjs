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
console.log(`PASS medical notes: ${notes.length} source-linked notes, ${copies} exam copies, unknown questions unchanged`);
