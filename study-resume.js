/* Navigation bookmark only: never writes answers or grades. */
(function(root){
  'use strict';
  const api=root.StudyResumeAdapter;if(!api)return;
  const card=document.getElementById('studyResume');let pending=null,route=new URLSearchParams(location.search).get('resume')==='1';
  const ready=()=>!root.trainer?.cloudConfigured||root.trainer?.sessionReady===true;
  const key=()=>`uworld_study_resume_v1:${root.trainer?.cloudUser||'guest'}`;
  function read(){try{const x=JSON.parse(localStorage.getItem(key()));return x&&['blocks','topics'].includes(x.scope)&&typeof x.block==='string'&&Number.isInteger(x.index)&&x.index>=0&&Number.isInteger(x.total)&&x.total>x.index&&typeof x.title==='string'?x:null;}catch(_){return null;}}
  function store(x){try{localStorage.setItem(key(),JSON.stringify(x));}catch(_){} }
  function record(block,index){const b=api.blocks().find(b=>String(b.n)===String(block));if(!b||!b.questions[index])return;const x={scope:api.scope,block:String(b.n),index,total:b.questions.length,title:b.title||`Блок ${b.n}`,at:Date.now()};if(!ready()){pending=x;return;}store(x);}
  function refresh(){
    if(!ready()){card.hidden=true;return;}
    if(pending){store(pending);pending=null;}
    const x=read();let b=null;
    if(x?.scope===api.scope){b=api.blocks().find(b=>String(b.n)===x.block);if(!b||!b.questions[x.index]){card.hidden=true;return;}}
    card.hidden=!x;if(!x)return;
    card.querySelector('[data-resume-title]').textContent=b?.title||x.title;
    card.querySelector('[data-resume-meta]').textContent=`${x.scope==='topics'?'Задачи по темам':'Практика по блокам'} · Вопрос ${x.index+1} из ${b?.questions.length||x.total}`;
    const link=card.querySelector('a');link.href=(x.scope==='topics'?'topics.html':'index.html')+'?resume=1';
    link.onclick=e=>{if(x.scope===api.scope){e.preventDefault();api.open(b.n,x.index);}};
    if(route&&x.scope===api.scope){route=false;const url=new URL(location.href);url.searchParams.delete('resume');history.replaceState(null,'',url.pathname+url.search+url.hash);api.open(b.n,x.index);}
  }
  function clear(block){const x=read();if(x?.scope===api.scope&&x.block===String(block)){try{localStorage.removeItem(key());}catch(_){} }pending=null;refresh();}
  root.StudyResume={record,refresh,clear};root.addEventListener('storage',refresh);root.addEventListener('focus',refresh);refresh();
})(window);
