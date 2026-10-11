(() => {
  'use strict';
  const root=document.documentElement, key='trainer_skin_v1';
  const nav=document.querySelector('.section-nav');
  if(!nav)return;
  const toggle=document.createElement('button');
  toggle.type='button';toggle.className='btn outline vanessa-toggle';
  toggle.textContent='Ванесса';toggle.title='Тема оформления с Ванессой';
  document.querySelector('.theme-toggle').before(toggle);
  const helper=document.createElement('aside');helper.className='vanessa-helper';helper.setAttribute('aria-label','Помощница Ванесса');
  helper.innerHTML='<button type="button" class="vanessa-pet" aria-label="Погладить Ванессу"><img src="assets/vanessa/vanessa.png" width="80" height="98" alt="Рыжая пти-брабансон Ванесса" decoding="async"></button><div class="vanessa-copy"><strong>Ванесса рядом</strong><p class="vanessa-message" role="status">По одному вопросу — и всё получится.</p></div><button type="button" class="btn outline vanessa-tip">Совет</button>';
  nav.after(helper);
  const settings=document.getElementById('account-settings');
  const row=document.createElement('label');row.className='setting-row';row.htmlFor='accountSkin';
  row.innerHTML='<span><strong>Тема с помощницей</strong><small>Ванесса · тёплая палитра и короткие советы</small></span><select id="accountSkin"><option value="classic">Классическая</option><option value="vanessa">Ванесса</option></select>';
  settings?.append(row);
  const select=row.querySelector('select'), message=helper.querySelector('.vanessa-message'),pet=helper.querySelector('.vanessa-pet');
  function refresh(){const on=root.dataset.skin==='vanessa';helper.hidden=!on;toggle.setAttribute('aria-pressed',String(on));select.value=on?'vanessa':'classic';}
  function setSkin(value){root.dataset.skin=value==='vanessa'?'vanessa':'classic';try{localStorage.setItem(key,root.dataset.skin);}catch(_){}refresh();}
  toggle.onclick=()=>setSkin(root.dataset.skin==='vanessa'?'classic':'vanessa');
  select.onchange=()=>setSkin(select.value);
  window.addEventListener('storage',e=>{if(e.key===key){root.dataset.skin=e.newValue==='vanessa'?'vanessa':'classic';refresh();}});
  const tips=['Прежде чем смотреть варианты, попробуй сформулировать свой ответ.','После разбора объясни себе, почему остальные варианты не подходят.','Сложный вопрос можно отметить звёздочкой и вернуться к нему позже.','В разделе «Работа над ошибками» можно повторить неверные ответы.','Таблицы и схемы можно увеличить нажатием на изображение.'];
  let tip=0;
  helper.querySelector('.vanessa-tip').onclick=()=>{message.textContent=tips[tip++%tips.length];react();};
  function react(){if(root.dataset.motion!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)pet.animate([{transform:'rotate(0)'},{transform:'rotate(-5deg) translateY(-3px)'},{transform:'rotate(3deg)'},{transform:'rotate(0)'}],{duration:550,easing:'ease-in-out'});}
  pet.onclick=()=>{message.textContent='Спасибо за ласку. Я рядом — продолжим в твоём темпе.';react();};
  /* Reactions are driven by confirmed learning actions, never by reopening answers. */
  const D=window.VanessaDaily,photo=pet.querySelector('img');
  const goal=document.createElement('div');goal.className='vanessa-goal';
  goal.innerHTML='<div class="vanessa-goal-heading"><strong class="vanessa-count"></strong><button class="btn outline vanessa-goal-edit" type="button">Цель</button></div><progress aria-label="Дневная цель" max="20" value="0"></progress><small class="vanessa-goal-note">На этом устройстве · все разделы</small>';
  helper.insertBefore(goal,helper.querySelector('.vanessa-tip'));
  const goalRow=document.createElement('label');goalRow.className='setting-row';goalRow.htmlFor='vanessaTarget';
  goalRow.innerHTML='<span><strong>Цель Ванессы на день</strong><small>1–280 проверенных вопросов. По местному времени; каждый вопрос один раз в день. В экзамене — после закрытия блока. Счётчик на этом устройстве, отдельно для каждого аккаунта.</small></span><input id="vanessaTarget" type="number" required min="1" max="280" step="1" value="20">';
  settings?.append(goalRow);
  const input=goalRow.querySelector('input'),bar=goal.querySelector('progress'),count=goal.querySelector('.vanessa-count'),note=goal.querySelector('small');
  const owner=()=>window.trainer?.cloudUser||window.ExamStore?.user||'guest';
  let celebrationTimer,animation,currentContext='',identity='',lastDay='',storageError=false;
  const poses={attentive:['vanessa.png','Ванесса внимательно слушает'],happy:['happy.png','Ванесса радуется и поднимает лапку'],rest:['rest.png','Ванесса отдыхает, положив голову на лапы']};
  function pose(name){const [src,alt]=poses[name];if(photo.getAttribute('src')!=='assets/vanessa/'+src)photo.src='assets/vanessa/'+src;photo.alt=alt;helper.dataset.pose=name;}
  function context(name=window.getVanessaContext?.()||'home'){
    const changed=currentContext!==name;currentContext=name;
    if(!changed)return;
    clearTimeout(celebrationTimer);animation?.cancel();
    if(name==='break'){pose('rest');message.textContent='Блок позади. Отдохни — я тоже пока полежу.';}
    else if(name==='done'){pose('happy');message.textContent='Ты завершил занятие. Хорошая работа!';}
    else {pose('attentive');message.textContent=name==='block'?'Я рядом. Сосредоточься на вопросах — разбор будет после экзамена.':'По одному вопросу — и всё получится.';}
  }
  function celebrate(){
    if(helper.hidden||currentContext==='block'||currentContext==='tutorial')return;
    pose('happy');message.textContent='Цель на сегодня выполнена! Дай лапу — ты хорошо поработал.';
    animation?.cancel();
    if(root.dataset.motion!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)animation=pet.animate([{transform:'translateY(0)'},{transform:'translateY(-7px) rotate(-4deg)'},{transform:'translateY(0)'},{transform:'translateY(-3px)'},{transform:'translateY(0)'}],{duration:850,easing:'ease-out'});
    clearTimeout(celebrationTimer);celebrationTimer=setTimeout(()=>pose(currentContext==='break'?'rest':currentContext==='done'?'happy':'attentive'),4000);
  }
  function updateGoal(){
    try{
      const user=owner(),d=D.read(localStorage,user);
      if(identity!==user||lastDay!==d.day){identity=user;lastDay=d.day;clearTimeout(celebrationTimer);animation?.cancel();currentContext='';context();}
      count.textContent=d.count>=d.target?`✓ ${d.count} / ${d.target} · цель выполнена`:`Сегодня ${d.count} / ${d.target}`;
      bar.max=d.target;bar.value=Math.min(d.count,d.target);bar.setAttribute('aria-valuetext',`${d.count} из ${d.target} вопросов`);
      if(document.activeElement!==input)input.value=d.target;
      if(!storageError)note.textContent='На этом устройстве · все разделы';
      return d;
    }catch(_){note.textContent='Счётчик недоступен: браузер не разрешает сохранение.';return null;}
  }
  function record(ids,date=new Date(),feedback=true){
    try{const before=D.read(localStorage,owner());D.record(localStorage,owner(),ids,date);storageError=false;const after=updateGoal();if(feedback&&after&&before.count<before.target&&after.count>=after.target){celebrate();return true;}}
    catch(_){storageError=true;note.textContent='Не удалось сохранить цель. Проверь свободное место в браузере.';}
    return false;
  }
  window.Vanessa={
    answered(id,grade){if(typeof grade!=='boolean')return;const won=record([id]);if(!won&&!helper.hidden){pose(grade?'happy':'attentive');message.textContent=grade?'Верно! Что помогло выбрать этот ответ?':'Давай спокойно разберём объяснение. Я рядом.';if(grade)react();}},
    completed(){context('done');if(!helper.hidden)react();},
    examSaved(a,questions){
      // Only locked blocks count. Never reveal correctness during a timed attempt.
      const before=updateGoal();
      for(const closed of a.closed||[]){const start=closed.block*a.blockSize;record(a.questions.slice(start,start+a.blockSize).flatMap((q,j)=>a.answers[start+j]?[questions.get(q.id)?.questionImages?.[0]||q.id]:[]),new Date(closed.endedAt),false);}
      const after=updateGoal();context(a.phase);
      if(before&&after&&before.count<before.target&&after.count>=after.target)celebrate();
    },context
  };
  goal.querySelector('button').onclick=()=>{document.getElementById('accountOpen').click();document.querySelector('[data-account-tab="settings"]').click();input.focus();};
  input.onchange=()=>{const n=Number(input.value);if(!input.checkValidity()||!Number.isInteger(n)||n<1||n>280){input.reportValidity();return;}try{D.target(localStorage,owner(),n);storageError=false;updateGoal();}catch(_){storageError=true;note.textContent='Не удалось сохранить цель.';}};
  window.addEventListener('storage',updateGoal);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateGoal();});
  const accountNode=document.getElementById('account');
  if(accountNode)new MutationObserver(updateGoal).observe(accountNode,{childList:true,subtree:true,characterData:true});
  setInterval(()=>{if(!document.hidden)updateGoal();},30000);
  new MutationObserver(()=>{if(root.dataset.motion==='off')for(const a of pet.getAnimations())a.cancel();}).observe(root,{attributes:true,attributeFilter:['data-motion']});
  const result=document.getElementById('result');
  if(result)new MutationObserver(()=>{if(!result.children.length){clearTimeout(celebrationTimer);pose('attentive');}}).observe(result,{childList:true});
  refresh();updateGoal();context();
})();
