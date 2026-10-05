const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
function assetExists(src){
 if(!src.startsWith('https:'))return fs.existsSync(path.join(root,src));
 assert.match(src,/^https:\/\/starchenkovmaksim-svg\.github\.io\/uworldtrainer-2024-assets\/assets\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/);
 const assets=path.join(root,'..','uworldtrainer-2024-assets');
 return !fs.existsSync(assets)||fs.existsSync(path.join(assets,src.split('/uworldtrainer-2024-assets/')[1]));
}
const elements=new Map(), storage=new Map();
function element(id='') {
 const classes=new Set(['quiz','summary','explain','selfGrade'].includes(id)?['hide']:[]);
 let html='';
 const e={id,children:[],dataset:{},value:'',textContent:'',disabled:false,
 classList:{contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c),toggle(c,on){on??=!classes.has(c);on?classes.add(c):classes.delete(c);}},
 append(...v){this.children.push(...v)},replaceChildren(...v){this.children=v},scrollIntoView(){},removeAttribute(){},click(){this.onclick?.()},
 get innerHTML(){return html},set innerHTML(v){html=v;this.children=[]},firstElementChild:{removeAttribute(){}}};
 return e;
}
const get=id=>{if(!elements.has(id))elements.set(id,element(id));return elements.get(id)};
const win={};
const context=vm.createContext({window:win,document:{getElementById:get,createElement:()=>element(),addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},scrollTo(){},confirm:()=>true,console});
vm.runInContext(fs.readFileSync(path.join(root,'topics-data.js'),'utf8'),context);
const original=vm.runInContext('JSON.stringify(BLOCKS)',context);
vm.runInContext(fs.readFileSync(path.join(root,'topics-data-2024.js'),'utf8'),context);
assert.equal(vm.runInContext('JSON.stringify(BLOCKS.slice(0,13))',context),original);
const blocks=vm.runInContext('BLOCKS',context);
vm.runInContext(fs.readFileSync(path.join(root,'topics-organization.js'),'utf8'),context);
assert.equal(blocks.length,20);
let total=0;
for(const b of blocks){assert.ok(b.n.startsWith('topic-'));assert.ok(b.questions.length);for(const q of b.questions){total++;assert.ok(q.questionImages.length);assert.ok(q.explanationImages.length);assert.ok(!q.correct||q.choices.includes(q.correct));for(const src of [...q.questionImages,...q.explanationImages,...q.contextImages||[]])assert.ok(assetExists(src),src)}}
const html=fs.readFileSync(path.join(root,'topics.html'),'utf8');
if(!process.argv.includes('--partial'))assert.equal(total,4188);
for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],context);
assert.equal(get('blockList').children.length,blocks.length);
get('topicSearch').value='endocr';get('topicSearch').oninput();assert.equal(get('blockList').children.filter(e=>!e.hidden).length,1);
get('topicSearch').value='';get('topicSearch').oninput();
get('blockList').children[0].click();
assert.ok(!get('quiz').classList.contains('hide'));
assert.ok(get('explain').classList.contains('hide'));
assert.equal(get('explainImages').children.length,0);
assert.ok(get('submit').disabled);
get('choices').children.find(e=>e.textContent===blocks[0].questions[0].correct).click();
assert.ok(!get('submit').disabled);get('submit').click();
assert.ok(!get('explain').classList.contains('hide'));
assert.ok(get('result').children[0].className.includes('good'));
assert.ok(get('explainImages').children.length);
get('next').click();assert.ok(get('explain').classList.contains('hide'));
get('prev').click();assert.ok(!get('explain').classList.contains('hide'));
assert.ok(storage.has('uworld_topics_guest_v1'));assert.ok(!storage.has('uworld_trainer_guest_v2'));
const linkedTopic=blocks.find(b=>b.questions.some(q=>q.contextImages?.length));
const linkedIndex=linkedTopic.questions.findIndex(q=>q.contextImages?.length);
vm.runInContext(`openBlock(${JSON.stringify(linkedTopic.n)},${linkedIndex})`,context);
get('context').open=true;
win.trainer.replace(JSON.parse(storage.get('uworld_topics_guest_v1')));
assert.equal(get('context').open,true,'sync should not close the shared vignette');
get('next').click();assert.equal(get('context').open,false);
vm.runInContext(fs.readFileSync(path.join(root,'progress.js'),'utf8'),context);
const model=win.ProgressModel;
const old={'1:0':{answer:'B',submitted:true,grade:true,marked:true}};
const baseline=model.flatten({},blocks),next=structuredClone(baseline);
next[blocks[0].n+':0']={answer:'C',submitted:true,marked:true,grade:true};
const merged={...old,...model.diff(baseline,next)};
assert.deepEqual(merged['1:0'],old['1:0']);
assert.equal(model.expand(merged,blocks)[blocks[0].n].answers[0],'C');
for(const name of ['topics-cloud.js','topics-data.js'])new vm.Script(fs.readFileSync(path.join(root,name),'utf8'));
console.log(`PASS: ${blocks.length} topics, ${total} questions, every asset exists; search, answer, grading, explanation gating, navigation, local storage and progress isolation`);

const manualTopic=blocks.find(b=>b.n.startsWith('topic-2024-')&&b.questions.some(q=>!q.correct));
const manualIndex=manualTopic.questions.findIndex(q=>!q.correct);
vm.runInContext(`openBlock(${JSON.stringify(manualTopic.n)},${manualIndex})`,context);
assert.ok(get('explain').classList.contains('hide'));
get('choices').children[0].click();get('submit').click();
assert.ok(!get('selfGrade').classList.contains('hide'));
get('gradeYes').click();
assert.equal(JSON.parse(storage.get('uworld_topics_guest_v1'))[manualTopic.n].grades[manualIndex],true);
const extraTopic=blocks.find(b=>b.extraImages?.length);
vm.runInContext(`openBlock(${JSON.stringify(extraTopic.n)},0)`,context);
assert.equal(get('sourceExtraImages').children.length,1);
assert.ok(!get('sourceExtra').classList.contains('hide'));
console.log('PASS: old topic data unchanged, new manual grading and incomplete source page');
