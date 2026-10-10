/* Retakes are deliberately isolated from first-pass and cloud progress. */
(function(root){
  'use strict';
  const collect=(blocks,stateFor)=>blocks.flatMap(b=>{
    const s=stateFor(b.n);
    return b.questions.flatMap((q,i)=>s.grades[i]===false&&!q.unavailable&&q.choices?.length&&(q.correct||q.explanationImages?.length)?[{id:`${b.n}:${i}`,block:b.n,title:b.title||`Блок ${b.n}`,number:i+1,q}]:[]);
  });
  function session(items){
    const results=items.map(()=>({answer:null,submitted:false,grade:null}));
    return {items,results,choose(i,answer){if(!results[i].submitted&&items[i].q.choices.includes(answer))results[i].answer=answer;},
      submit(i){const r=results[i],q=items[i].q;if(!r.answer||r.submitted)return;r.submitted=true;if(q.correct)r.grade=r.answer===q.correct;},
      grade(i,value){if(results[i].submitted&&!items[i].q.correct&&typeof value==='boolean')results[i].grade=value;},
      totals(){return {correct:results.filter(r=>r.grade===true).length,wrong:results.filter(r=>r.grade===false).length,pending:results.filter(r=>r.grade===null).length,total:items.length};}};
  }
  const api={collect,session};
  if(typeof module==='object'&&module.exports){module.exports=api;return;}
  root.MistakeReviewCore=api;
  if(!root.getMistakeQuestions)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dialog=document.createElement('dialog');dialog.className='account-dialog mistake-dialog';dialog.setAttribute('aria-labelledby','mistakeTitle');
  dialog.innerHTML='<header class="mistake-heading"><h2 id="mistakeTitle">Работа над ошибками</h2><button class="btn outline" data-close>Закрыть</button></header><div id="mistakeBody"></div>';
  document.body.append(dialog);const body=dialog.querySelector('#mistakeBody');let attempt=null,index=0,owner=null;
  const launch=document.createElement('button');launch.type='button';launch.className='btn outline mistake-launch';launch.textContent='↻ Работа над ошибками';
  document.querySelector('#overall').after(launch);
  const summaryLaunch=launch.cloneNode(true);document.querySelector('#sumDetails').after(summaryLaunch);
  function setup(){
    attempt=null;owner=root.trainer?.cloudUser;const pool=root.getMistakeQuestions();
    const groups=[...new Map(pool.map(x=>[String(x.block),x.title])).entries()].sort((a,b)=>a[1].localeCompare(b[1],'en',{numeric:true}));
    body.innerHTML=`<p class="small">Повторение неверных ответов в этом разделе. Первоначальный прогресс сохраняется без изменений. Итог повторения доступен до закрытия окна и не синхронизируется.</p>${pool.length?`<div class="mistake-settings"><label>Тема или блок<select id="mistakeGroup"><option value="">Все (${pool.length})</option>${groups.map(([id,title])=>`<option value="${esc(id)}">${esc(title)} (${pool.filter(x=>String(x.block)===id).length})</option>`).join('')}</select></label><label>Количество вопросов<select id="mistakeLimit"><option value="20">До 20</option><option value="40">До 40</option><option value="all">Все ошибки</option></select></label></div><p id="mistakeCount" class="small"></p><button class="btn primary" data-start>Начать повторение</button>`:'<div class="empty-state"><strong>Пока нет ошибок для повторения</strong><p>Здесь появятся вопросы с неверным ответом из этого раздела.</p></div>'}`;
    if(pool.length){const update=()=>{const group=body.querySelector('#mistakeGroup').value,limit=body.querySelector('#mistakeLimit').value,n=pool.filter(x=>!group||String(x.block)===group).length;body.querySelector('#mistakeCount').textContent=`В тренировке: ${limit==='all'?n:Math.min(n,Number(limit))} вопросов · без таймера`;};body.onchange=update;update();}
  }
  function open(){setup();dialog.showModal();}launch.onclick=open;summaryLaunch.onclick=open;
  function images(paths){return (paths||[]).map(src=>`<a href="${esc(src)}" target="_blank" rel="noopener" title="Открыть страницу в полном размере"><img class="source" loading="lazy" src="${esc(src)}" alt="Страница задания — открыть в полном размере"></a>`).join('');}
  function render(){
    const item=attempt.items[index],q=item.q,r=attempt.results[index];
    body.innerHTML=`<p class="small">Повторение ${index+1} из ${attempt.items.length} · ${esc(item.title)} · вопрос ${item.number}</p>${q.missingMedia?'<p class="notice">В источнике отсутствует внешнее медиа.</p>':''}${q.sourceNote?`<p class="notice">${esc(q.sourceNote)}</p>`:''}${q.contextImages?.length?`<details><summary>Условие предыдущего задания</summary><div class="images">${images(q.contextImages)}</div></details>`:''}<div class="images">${images(q.questionImages)}</div><p class="small">Выберите букву ответа. Нажмите на страницу, чтобы увеличить её.</p><div class="choices">${q.choices.map(letter=>`<button class="choice${r.answer===letter?' active':''}${r.submitted&&q.correct===letter?' correct':''}${r.submitted&&q.correct&&r.answer===letter&&letter!==q.correct?' wrong':''}" data-answer="${esc(letter)}" ${r.submitted?'disabled':''}>${esc(letter)}</button>`).join('')}</div><div class="row"><button class="btn primary" data-check ${!r.answer||r.submitted?'disabled':''}>Проверить ответ</button>${root.QuestionReports?.button({section:'Работа над ошибками',source:`${item.title} · вопрос ${item.number}`,id:String(q.progressKey||item.id),image:q.questionImages[0]||'',timed:false})||''}</div>${r.submitted?`<div class="notice ${r.grade===true?'good':r.grade===false?'bad':''}" role="status">${q.correct?`${r.grade?'Верно':'Неверно'}. Правильный ответ: ${esc(q.correct)}. Ваш ответ: ${esc(r.answer)}.`:r.grade===null?'Нет подтверждённого ключа. Сверьте ответ с объяснением.':r.grade?'Вы отметили ответ как верный.':'Вы отметили ответ как неверный.'}</div><h3>Объяснение</h3><div class="images">${images(q.explanationImages)}</div>${!q.correct?'<div class="row"><button class="btn outline" data-grade="yes">Ответ верный</button><button class="btn outline" data-grade="no">Ответ неверный</button></div>':''}`:''}<div class="mistake-nav"><button class="btn outline" data-prev ${index===0?'disabled':''}>← Назад</button><button class="btn primary" data-next>${index===attempt.items.length-1?'Показать итог':'Далее →'}</button></div><p class="small">Исходные ответы и статистика темы не изменяются.</p>`;
  }
  function finish(){const s=attempt.totals();body.innerHTML=`<h3>Итог повторения</h3><div class="notice"><strong>Верно ${s.correct} из ${s.total}</strong><p>Неверно: ${s.wrong} · без оценки: ${s.pending}</p></div><p class="small">Это результат текущей тренировки. Первоначальная статистика сохранена.</p><div class="row"><button class="btn primary" data-again ${!s.wrong?'disabled':''}>Повторить оставшиеся ошибки (${s.wrong})</button><button class="btn outline" data-review>Просмотреть ответы</button><button class="btn outline" data-setup>Новая подборка</button></div>`;}
  dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{attempt=null;body.replaceChildren();});
  // Drop an open retake on account replacement, including sign-out in another tab.
  const replace=root.trainer.replace;root.trainer.replace=function(next){if(dialog.open&&owner!==root.trainer.cloudUser)dialog.close();return replace.call(this,next);};
  body.onclick=e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(owner!==root.trainer?.cloudUser){dialog.close();return;}
    if(b.hasAttribute('data-start')){const group=body.querySelector('#mistakeGroup').value,limit=body.querySelector('#mistakeLimit').value,pool=root.getMistakeQuestions().filter(x=>!group||String(x.block)===group);for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}attempt=session(limit==='all'?pool:pool.slice(0,Number(limit)));index=0;if(!pool.length){setup();return;}render();}
    else if(b.hasAttribute('data-answer')){attempt.choose(index,b.dataset.answer);render();return;}
    else if(b.hasAttribute('data-check')){attempt.submit(index);render();return;}
    else if(b.hasAttribute('data-grade')){attempt.grade(index,b.dataset.grade==='yes');render();return;}
    else if(b.hasAttribute('data-prev')){index--;render();}
    else if(b.hasAttribute('data-next')){if(index===attempt.items.length-1)finish();else {index++;render();}}
    else if(b.hasAttribute('data-again')){attempt=session(attempt.items.filter((_,i)=>attempt.results[i].grade===false));index=0;render();}
    else if(b.hasAttribute('data-review')){index=0;render();}
    else if(b.hasAttribute('data-setup'))setup();else return;
    dialog.scrollTop=0;
  };
})(typeof window==='object'?window:globalThis);
