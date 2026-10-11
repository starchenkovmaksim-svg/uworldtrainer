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
  const result=document.getElementById('result');let last='';
  if(result)new MutationObserver(()=>{const state=result.querySelector('.good')?'good':result.querySelector('.bad')?'bad':'';const signature=(document.getElementById('qTitle')?.textContent||'')+state;if(signature===last)return;last=signature;if(root.dataset.skin!=='vanessa')return;message.textContent=state==='good'?'Верно! Закрепим: что помогло выбрать этот ответ?':state==='bad'?'Давай разберём этот вопрос. Ошибка — повод понять ещё одну деталь.':'Не спеши. Внимательно прочитай условие.';if(state)react();}).observe(result,{childList:true,subtree:true});
  refresh();
})();
