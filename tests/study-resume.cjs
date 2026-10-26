const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync(__dirname+'/../study-resume.js','utf8');
const store=new Map();
function boot(scope='blocks',user=null,ready=true,search=''){
 const parts={'[data-resume-title]':{},'[data-resume-meta]':{},a:{}};
 const card={hidden:true,querySelector:s=>parts[s]},opened=[],events={};
 const blocks=scope==='blocks'?[{n:1,questions:[{},{},{}]}]:[{n:'topic-biochemistry',title:'Biochemistry',questions:[{},{}]}];
 const window={trainer:{cloudConfigured:true,cloudUser:user,sessionReady:ready},StudyResumeAdapter:{scope,blocks:()=>blocks,open:(...args)=>opened.push(args)},addEventListener:(k,v)=>events[k]=v};
 const ctx={window,document:{getElementById:()=>card},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},location:{search,href:'https://example.test/index.html'+search},history:{replaceState(){}},URL,URLSearchParams,Date};vm.runInNewContext(code,ctx);return {window,card,parts,opened,events};
}
let a=boot();assert.equal(a.card.hidden,true);a.window.StudyResume.record(1,2);a.window.StudyResume.refresh();assert.equal(a.parts['[data-resume-meta]'].textContent,'Практика по блокам · Вопрос 3 из 3');a.parts.a.onclick({preventDefault(){}});assert.deepEqual(a.opened,[[1,2]]);
let b=boot('topics');assert.equal(b.parts.a.href,'index.html?resume=1');b.window.StudyResume.record('topic-biochemistry',1);
a=boot();assert.equal(a.parts['[data-resume-title]'].textContent,'Biochemistry');assert.equal(a.parts.a.href,'topics.html?resume=1');
a=boot('topics',null,true,'?resume=1');assert.equal(a.opened.length,1);a.window.StudyResume.refresh();assert.equal(a.opened.length,1,'route only once');
a=boot('blocks','user-a');assert.equal(a.card.hidden,true);a.window.StudyResume.record(1,0);a.window.StudyResume.refresh();assert.equal(a.card.hidden,false);a.window.trainer.cloudUser='user-b';a.window.StudyResume.refresh();assert.equal(a.card.hidden,true,'account isolation');
a=boot('blocks','user-a',false,'?resume=1');assert.equal(a.card.hidden,true);assert.equal(a.opened.length,0);a.window.trainer.sessionReady=true;a.window.StudyResume.refresh();assert.deepEqual(a.opened,[[1,0]]);
a.window.StudyResume.clear(1);assert.equal(a.card.hidden,true);assert.ok(store.has('uworld_study_resume_v1:guest'),'reset leaves guest bookmark');
a=boot('blocks','user-c',false);a.window.StudyResume.record(1,1);assert.ok(!store.has('uworld_study_resume_v1:user-c'));a.window.trainer.sessionReady=true;a.window.StudyResume.refresh();assert.equal(a.card.hidden,false);
store.set('uworld_study_resume_v1:user-c',JSON.stringify({scope:'blocks',block:'1',index:99,total:100,title:'Stale'}));a.window.StudyResume.refresh();assert.equal(a.card.hidden,true);
store.set('uworld_study_resume_v1:user-c','broken');a.window.StudyResume.refresh();assert.equal(a.card.hidden,true);
console.log('PASS: resume exact question, cross-section links, reload, auth readiness, account isolation, reset and stale/corrupt bookmarks');
