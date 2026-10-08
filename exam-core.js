/* Pure exam logic. No practice state is read or written here. */
(function(root) {
  'use strict';
  const MIN = 60000, DAY = 86400000;
  const shuffle = (items, random = Math.random) => {
    const a = [...items];
    for (let i=a.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  };
  function quotas(systems, total) {
    const parts = systems.map(s=>({id:s.id,n:Math.floor(s.full*total/280),rem:s.full*total/280%1}));
    let left=total-parts.reduce((n,p)=>n+p.n,0);
    [...parts].sort((a,b)=>b.rem-a.rem).slice(0,left).forEach(p=>p.n++);
    return Object.fromEntries(parts.map(p=>[p.id,p.n]));
  }
  function select(bank, mode, topic, history=[], seen=new Set(), random=Math.random) {
    const prior = history.filter(a=>a.mode===mode && (mode!=='topic'||a.topic===topic)).sort((a,b)=>b.startedAt-a.startedAt);
    const last = new Set(prior[0]?.questions.map(q=>q.id)||[]);
    const used = new Set(history.flatMap(a=>a.questions.map(q=>q.id)));
    function pick(pool,n,stratify=false) {
      if(pool.length<n) throw new Error(`Недостаточно подходящих вопросов: ${pool.length} из ${n}.`);
      // Unseen first, then older attempts; repeat the most recent selection only when necessary.
      const ranked = shuffle(pool,random).sort((a,b)=>rank(a)-rank(b));
      function rank(q) { return last.has(q.id)?3:used.has(q.id)?2:q.seenKeys.some(k=>seen.has(k))?1:0; }
      if(!stratify) return ranked.slice(0,n);
      const out=[];
      for(let tier=0;tier<4 && out.length<n;tier++) {
        const groups={};
        ranked.filter(q=>rank(q)===tier).forEach(q=>(groups[q.subtopic||'other']??=[]).push(q));
        const buckets=shuffle(Object.values(groups),random);
        while(buckets.some(b=>b.length)&&out.length<n) for(const b of buckets) if(b.length&&out.length<n) out.push(b.shift());
      }
      return out;
    }
    const valid=bank.questions.filter(q=>q.correct&&q.choices.includes(q.correct)&&q.questionImages.length);
    let chosen;
    if(mode==='topic') {
      const pool=valid.filter(q=>q.topics.includes(topic));
      if(!pool.length) throw new Error('В этой теме пока нет подходящих вопросов.');
      chosen=pick(pool,Math.min(40,pool.length),true);
    } else {
      const allocation=quotas(bank.systems,mode==='full'?280:80);
      chosen=bank.systems.flatMap(s=>{
        const pool=valid.filter(q=>q.step1&&q.system===s.id),need=allocation[s.id];
        if(pool.length<need) throw new Error(`${s.title}: доступно ${pool.length}, требуется ${need}. Запуск невозможен без изменения пропорций.`);
        return pick(pool,need);
      });
    }
    chosen=shuffle(chosen,random);
    if(new Set(chosen.map(q=>q.id)).size!==chosen.length) throw new Error('В банке обнаружены повторяющиеся идентификаторы.');
    return {questions:chosen,repeated:chosen.filter(q=>last.has(q.id)).length};
  }
  function create({id,device,mode,topic,title,selection,version,now}) {
    const n=selection.questions.length, blockSize=mode==='topic'?n:20;
    const a={schema:1,id,device,mode,topic:topic||null,title,bankVersion:version,startedAt:now,
      questions:selection.questions.map(q=>({id:q.id,correct:q.correct,choices:q.choices,system:q.system})),
      repeated:selection.repeated,answers:Array(n).fill(null),flags:Array(n).fill(false),spent:Array(n).fill(0),
      blockSize,block:0,closed:[],current:0,cursorAt:now,breakMs:mode==='full'?55*MIN:mode==='daily'?10*MIN:0,
      phase:mode==='full'?'tutorial':'block',phaseAt:now,deadline:now+(mode==='full'?5*MIN:mode==='topic'?n*90000:30*MIN),lastClock:now};
    return a;
  }
  const duration=a=>a.mode==='topic'?a.questions.length*90000:30*MIN;
  const blockEnd=a=>Math.min(a.questions.length,(a.block+1)*a.blockSize);
  function accrue(a,now) {
    if(a.phase==='block') a.spent[a.current]+=Math.max(0,Math.min(now,a.deadline)-a.cursorAt);
    a.cursorAt=Math.min(now,a.deadline);
  }
  function startBlock(a,at) {
    a.phase='block';a.phaseAt=at;a.deadline=at+duration(a);a.current=a.block*a.blockSize;a.cursorAt=at;
  }
  function closeBlock(a,at) {
    accrue(a,at);
    a.closed.push({block:a.block,startedAt:a.phaseAt,endedAt:at});
    a.breakMs+=Math.max(0,a.deadline-at);
    if(blockEnd(a)===a.questions.length) {a.phase='done';a.finishedAt=at;return;}
    a.block++;a.phase='break';a.phaseAt=at;a.deadline=at+a.breakMs;
  }
  function advance(a,now) {
    now=Math.max(now,a.lastClock||a.startedAt);a.lastClock=now;
    while(a.phase!=='done' && now>=a.deadline) {
      const at=a.deadline;
      if(a.phase==='tutorial') startBlock(a,at);
      else if(a.phase==='block') closeBlock(a,at);
      else {a.breakMs=0;startBlock(a,at);}
    }
    return a;
  }
  function action(a,type,value,now) {
    const before=a.phase+':'+a.block;
    advance(a,now);now=a.lastClock;
    // A click made on an expired screen must never answer or close the next block.
    if(before!==a.phase+':'+a.block)return false;
    if(a.phase==='done') return false;
    if(type==='nextBlock' && (a.phase==='tutorial'||a.phase==='break')) {
      a.breakMs=a.phase==='tutorial'?a.breakMs+Math.max(0,a.deadline-now):Math.max(0,a.deadline-now);
      startBlock(a,now);return true;
    }
    if(a.phase!=='block') return false;
    accrue(a,now);
    if(type==='answer' && (value===null||a.questions[a.current].choices.includes(value))) a.answers[a.current]=value;
    else if(type==='flag') a.flags[a.current]=!a.flags[a.current];
    else if(type==='navigate' && Number.isInteger(value)&&value>=a.block*a.blockSize&&value<blockEnd(a)) a.current=value;
    else if(type==='endBlock') closeBlock(a,now);
    else return false;
    return true;
  }
  function result(a) {
    const systems={};let correct=0,skipped=0;
    a.questions.forEach((q,i)=>{
      const s=systems[q.system]??={total:0,correct:0,skipped:0};s.total++;
      if(a.answers[i]===q.correct) {correct++;s.correct++;}
      if(!a.answers[i]) {skipped++;s.skipped++;}
    });
    const n=a.questions.length;
    return {total:n,correct,skipped,percent:Math.round(correct/n*1000)/10,passed:a.phase==='done'&&correct>=Math.ceil(n*.8),
      systems,spent:a.spent.reduce((n,t)=>n+t,0)};
  }
  function mastery(history,topic) {
    const passes=history.filter(a=>a.mode==='topic'&&a.topic===topic&&a.phase==='done'&&result(a).passed).sort((a,b)=>a.finishedAt-b.finishedAt);
    const latest=passes.at(-1);if(!latest)return null;
    const confirmed=passes.some(a=>passes.some(b=>b.startedAt-a.finishedAt>=7*DAY && b.questions.some(q=>!a.questions.some(p=>p.id===q.id))));
    return {confirmed,percent:result(latest).percent,date:latest.finishedAt};
  }
  const api={quotas,select,create,advance,action,result,mastery,blockEnd,accrue};
  if(typeof module!=='undefined')module.exports=api;
  else root.ExamCore=api;
})(typeof window!=='undefined'?window:globalThis);
