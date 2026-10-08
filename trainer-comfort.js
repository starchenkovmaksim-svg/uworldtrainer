(() => {
  'use strict';
  const $=id=>document.getElementById(id),root=document.documentElement;
  const theme=document.createElement('button');theme.type='button';theme.className='btn outline theme-toggle';
  function refreshTheme(){const dark=root.dataset.theme==='dark';theme.textContent=dark?'☀ Светлая':'☾ Тёмная';theme.setAttribute('aria-label',dark?'Включить светлую тему':'Включить тёмную тему');theme.setAttribute('aria-pressed',String(dark));}
  theme.onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('trainer_theme_v1',root.dataset.theme);}catch(_){}refreshTheme();};
  $('accountOpen').before(theme);refreshTheme();
  const toast=document.createElement('div');toast.className='action-toast';toast.setAttribute('role','status');toast.hidden=true;document.body.append(toast);let timer;
  function notify(text){clearTimeout(timer);toast.textContent=text;toast.hidden=false;timer=setTimeout(()=>toast.hidden=true,2200);}
  window.TrainerFeedback={notify};
  if($('quiz')){
    const dock=document.createElement('div');dock.className='question-dock';dock.setAttribute('aria-label','Быстрая навигация по вопросу');
    dock.innerHTML='<span class="dock-title"></span><div class="dock-actions"><button class="btn outline dock-mark" type="button" data-proxy="mark">☆ Отметить</button></div>';
    $('quiz').prepend(dock);
    const actions=$('submit').parentElement;actions.classList.add('answer-actions');actions.append($('next'));
    $('prev').parentElement.append($('homeBtn'));$('mark').hidden=true;
    function primaryAction(){const reviewed=!$('explain').classList.contains('hide');$('submit').classList.toggle('primary',!reviewed);$('submit').classList.toggle('outline',reviewed);$('next').classList.toggle('primary',reviewed);$('next').classList.toggle('outline',!reviewed);}
    new MutationObserver(primaryAction).observe($('explain'),{attributes:true,attributeFilter:['class']});primaryAction();
    function sync(){dock.querySelector('.dock-title').textContent=$('qTitle').textContent;const mark=dock.querySelector('[data-proxy="mark"]');mark.textContent=$('mark').textContent;mark.setAttribute('aria-pressed',String($('mark').textContent.startsWith('★')));}
    dock.onclick=e=>{const b=e.target.closest('[data-proxy]');if(b&&!b.disabled)$(b.dataset.proxy).click();};
    const observer=new MutationObserver(sync);for(const id of ['qTitle','mark','prev','next'])observer.observe($(id),{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});sync();
  }
  document.addEventListener('click',e=>{const b=e.target.closest('#mark,[data-action="flag"]');if(!b||b.disabled)return;requestAnimationFrame(()=>{const current=b.id==='mark'?$('mark'):document.querySelector('.toolbar [data-action="flag"]');if(current){notify(current.textContent.startsWith('★')?'Добавлено в отмеченные':'Отметка снята');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)current.animate([{opacity:.5},{opacity:1}],{duration:180});}});});
  // Announce only confirmed cloud saves; never infer success from a button click.
  const status=$('syncStatus');let last=status?.textContent||'';
  if(status)new MutationObserver(()=>{const text=status.textContent;if(text===last)return;last=text;if(/сохранен[оы] в (аккаунте|облаке)|синхронизирован/i.test(text))notify('Прогресс сохранён в аккаунте');}).observe(status,{childList:true,subtree:true,characterData:true});
})();
