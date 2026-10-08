(() => {
  'use strict';
  const C=window.ExamCore,B=window.ExamBank,S=window.ExamStore,$=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const date=t=>new Date(t).toLocaleString('ru-RU',{dateStyle:'medium',timeStyle:'short'});
  const time=ms=>{const n=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(n/3600)?Math.floor(n/3600)+':':''}${String(Math.floor(n/60)%60).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;};
  const byId=new Map(B.questions.map(q=>[q.id,q]));
  const systemName=id=>B.systems.find(s=>s.id===id)?.title||id;
  let device,locked=false,view=null,review=-1,filter='all',draft=null,account=S.user,localStorageWorks=true;
  try{device=localStorage.getItem('uworld_exam_device_v1')||crypto.randomUUID();localStorage.setItem('uworld_exam_device_v1',device);}catch(_){device=crypto.randomUUID();localStorageWorks=false;}
  const random=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;
  const owner=a=>locked&&a.device===device;
  const save=a=>S.put(a);
  const h=()=>S.history().sort((a,b)=>b.startedAt-a.startedAt);
  const active=()=>h().find(a=>a.phase!=='done'&&a.device===device);
  const button=(text,action,cls='btn outline',extra='')=>`<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
  function note() {
    const el=$('lockNotice');
    el.classList.toggle('hide',locked&&localStorageWorks);
    el.textContent=!localStorageWorks?'Браузер не разрешает сохранение. Включите хранилище, чтобы начать попытку.':!locked?'Редактирование доступно в одной вкладке экзамена. Закройте другую вкладку и обновите эту.':'';
  }
  if(navigator.locks) navigator.locks.request('uworld-exam-editor',{ifAvailable:true},async lock=>{
    locked=!!lock;S.setWriter(locked);note();render();if(lock)await new Promise(()=>{});
  });else {$('lockNotice').textContent='Для надёжного сохранения откройте этот раздел в современном Chrome, Edge, Firefox или Safari.';$('lockNotice').classList.remove('hide');}
  function settle() {
    for(const a of h())if(owner(a)&&a.phase!=='done'){
      const before=a.phase+':'+a.block;C.advance(a,Date.now());
      if(before!==a.phase+':'+a.block)save(a);
    }
  }
  function home() {
    const history=h(),running=history.filter(a=>a.phase!=='done');
    $('examContent').innerHTML=`<div class="hero"><h1>Проверьте, что уже освоено</h1><p>Зачёт по одной теме или репетиция Step 1 со смешанными вопросами. Ответы и объяснения — после завершения попытки.</p><span class="pill" style="color:#182334">Учебная цель: 80% правильных ответов</span></div>
    ${running.length?`<div class="card pad"><h2>Текущие попытки</h2>${running.map(a=>`<div class="history-row"><div><strong>${esc(a.title)}</strong><p class="small">${date(a.startedAt)} · ${a.device===device?'Таймер продолжает идти':'Начата на другом устройстве; продолжение там же'}</p></div>${button('Открыть','open','btn primary',`data-id="${a.id}"`)}</div>`).join('')}</div>`:''}
    <div class="catalog-mode-grid section-title"><article class="card mode catalog-card"><div class="catalog-cover daily-cover" aria-hidden="true"><span class="cover-caption">ЕЖЕДНЕВНАЯ ПРАКТИКА</span><span class="cover-number">80</span><span class="cover-caption">ВОПРОСОВ · 4 БЛОКА</span></div><div class="catalog-details"><span class="small">НА КАЖДЫЙ ДЕНЬ</span><h2>Ежедневный тест</h2><p>80 вопросов · 4 блока по 30 минут<br>Общий запас перерывов: 10 минут</p>${button('Выбрать ежедневный тест','prepare','btn primary','data-mode="daily"')}</div></article><article class="card mode catalog-card"><div class="catalog-cover full-cover" aria-hidden="true"><span class="cover-caption">ПОЛНАЯ РЕПЕТИЦИЯ</span><span class="cover-number">280</span><span class="cover-caption">ВОПРОСОВ · 14 БЛОКОВ</span></div><div class="catalog-details"><span class="small">STEP 1 · ЭКЗАМЕН</span><h2>Демо Step 1</h2><p>280 вопросов · 14 блоков по 30 минут<br>55 минут перерывов + 5 минут инструктажа · до 8 часов</p>${button('Выбрать полный экзамен','prepare','btn primary','data-mode="full"')}</div></article></div>
    <details class="card pad"><summary>Подбор вопросов и правила</summary><p>В смешанные тесты входят ${B.questions.filter(q=>q.step1).length} уникальных заданий, отобранных по источнику и содержанию для подготовки к Step 1. Пропорции систем соответствуют диапазонам <a href="https://www.usmle.org/exam-resources/step-1-materials/step-1-content-outline-and-specifications" target="_blank" rel="noopener">спецификации USMLE</a>. Разметка предварительная: задания не проходили официальную калибровку сложности.</p><p>В полном демо используется <a href="https://www.usmle.org/test-delivery-software-updates-step-2-ck-and-step-1-coming-may-2026" target="_blank" rel="noopener">формат с мая 2026 года</a>. Ежедневный тест — сокращённый учебный режим. Порог 80% — наша учебная цель, а не официальный проходной балл или вероятность сдачи USMLE.</p><p>Таймер не останавливается при закрытии страницы. По истечении времени блок закрывается; пропуски считаются неверными. Между блоками сразу расходуется запас перерывов; когда он закончится, следующий блок начнётся автоматически. Неиспользованное время блока и инструктажа пополняет запас перерывов.</p><p>Начатую попытку продолжайте в том же браузере и аккаунте. Завершённые результаты доступны на других устройствах после синхронизации. Гостевые попытки хранятся отдельно и не переносятся в аккаунт автоматически.</p><div class="table-wrap"><table><thead><tr><th>Система</th><th>Полный</th><th>Ежедневный</th></tr></thead><tbody>${B.systems.map(s=>`<tr><td>${s.title}</td><td>${s.full}</td><td>${C.quotas(B.systems,80)[s.id]}</td></tr>`).join('')}</tbody></table></div></details>
    <h2 class="section-title" id="topicHeading">Зачёты по темам</h2><p class="small">До 40 вопросов · 90 секунд на вопрос · PASS от 80%. Повторный PASS спустя минимум 7 дней с новой выборкой подтверждает освоение. Для маленьких тем подтверждение ждёт появления новых вопросов.</p><input id="examTopicSearch" class="search" aria-label="Найти тему зачёта" placeholder="Найти тему…"><div class="grid catalog-grid" id="examTopics">${[...B.topics].sort((a,b)=>a.title.localeCompare(b.title,'en',{sensitivity:'base',numeric:true})).map(t=>{
      const n=Math.min(40,B.questions.filter(q=>q.topics.includes(t.id)).length),m=C.mastery(history,t.id);
      return `<article class="card topic-card catalog-card" data-title="${esc(t.title.toLowerCase())}">${window.TopicCards?.visual(t.id)||''}<div class="catalog-details"><span class="small catalog-eyebrow">ЗАЧЁТ ПО ТЕМЕ</span><h3 class="topic-name">${esc(t.title)}</h3><div class="small">${n} вопросов · ${n*1.5} мин · PASS: ${Math.ceil(n*.8)}/${n}</div>${m?`<p class="badge">✓ ${m.confirmed?'Освоение подтверждено':'Освоено'} · ${m.percent}%</p><div class="small">${date(m.date)}</div>`:''}<div>${button('Сдать зачёт','prepare','btn outline',`data-mode="topic" data-topic="${t.id}"`)}</div></div></article>`;
    }).join('')}</div>
    <h2 class="section-title">История попыток</h2><div class="card pad">${history.filter(a=>a.phase==='done').map(a=>{const r=C.result(a);return `<div class="history-row"><div><strong>${esc(a.title)}</strong><p>${r.percent}% · ${r.correct}/${r.total} · ${r.passed?'PASS':'Нужно повторить'}</p><p class="small">${date(a.finishedAt)}</p></div>${button('Результат и разбор','open','btn outline',`data-id="${a.id}"`)}</div>`;}).join('')||'<p class="muted">Здесь появятся результаты завершённых зачётов и экзаменов.</p>'}</div>`;
    $('examTopicSearch').oninput=e=>{for(const el of $('examTopics').children)el.hidden=!el.dataset.title.includes(e.target.value.toLowerCase().trim());};
  }
  function seenPractice() {
    const seen=new Set(S.seen);
    if(!S.user)for(const key of ['uworld_trainer_guest_v3','uworld_topics_guest_v1'])try{
      const states=JSON.parse(localStorage.getItem(key))||{};
      for(const [topic,s] of Object.entries(states))s.submitted?.forEach((v,i)=>{if(v)seen.add(`${topic}:${i}`);});
    }catch(_){}
    return seen;
  }
  function prepare(mode,topic) {
    settle();
    if(!S.ready){alert('Подождите подключения сохранения.');return;}
    if(!locked||!localStorageWorks||!S.storageOK){alert('Сначала восстановите доступ к сохранению и закройте другую вкладку экзамена.');return;}
    if(active()){view=active().id;review=-1;render();return;}
    try {
      const title=mode==='topic'?`Зачёт · ${B.topics.find(t=>t.id===topic).title}`:mode==='full'?'Демо Step 1 · полный экзамен':'Step 1 · ежедневный тест';
      const selection=C.select(B,mode,topic,h(),seenPractice(),random),n=selection.questions.length;
      draft={mode,topic,title,selection};$('setupTitle').textContent=title;
      $('setupBody').innerHTML=`<p><strong>${n} вопросов · ${mode==='full'?'14 блоков × 30 минут':mode==='daily'?'4 блока × 30 минут':n*1.5+' минут без перерывов'}</strong></p><p>Учебная цель: минимум ${Math.ceil(n*.8)} верных ответов (${80}%). ${mode==='full'?'Начнём с 5-минутного инструктажа.':mode==='daily'?'Между блоками доступно 10 минут перерывов.':''}</p><p>Ответы можно менять внутри открытого блока. После закрытия блока возврата нет. Разбор откроется после всей попытки.</p><p>Часы продолжают идти в фоне и после закрытия страницы. Продолжить начатую попытку можно в этом браузере; результаты синхронизируются после входа в аккаунт.</p><p class="${S.user?'small':'warning'}">${S.user?'Попытка сохранится в вашем аккаунте.':'Вы в гостевом режиме. Если нужен общий прогресс на устройствах, отмените старт и войдите через значок аккаунта.'}</p><p class="small">Повторов из предыдущей попытки этого режима: ${selection.repeated}/${n}. ${selection.repeated?'По возможности сначала выбираются новые вопросы.':''}</p>`;
      $('setupDialog').showModal();
    }catch(e){alert(e.message);}
  }
  function image(src,label) {return `<img class="exam-image" src="${esc(src)}" alt="${esc(label)}" loading="lazy" data-zoom>`;}
  function question(a,i,finished) {
    const snap=a.questions[i],q=byId.get(snap.id);
    if(!q)return '<p class="warning">Этот вопрос отсутствует в текущем банке. Сохранённый результат остаётся доступен.</p>';
    return `${q.contextImages.length?`<details><summary>Контекст клинического случая</summary><div class="images">${q.contextImages.map(u=>image(u,'Контекст случая')).join('')}</div></details>`:''}<div class="images">${q.questionImages.map(u=>image(u,'Условие и варианты ответа')).join('')}</div>
    <p class="small">Выберите букву варианта из условия.</p><div class="choices">${snap.choices.map(letter=>button(letter,'answer','choice'+(a.answers[i]===letter?' active':'')+(finished&&letter===snap.correct?' correct':''),`data-letter="${letter}" ${finished||!owner(a)?'disabled':''}`)).join('')}</div>
    ${finished?`<div class="notice ${a.answers[i]===snap.correct?'good':'bad'}">Ваш ответ: ${esc(a.answers[i]||'пропуск')} · правильный: ${snap.correct} · время: ${time(a.spent[i])}</div><div class="small">${esc(q.source)}</div><h3>Объяснение</h3><div class="images">${q.explanationImages.map(u=>image(u,'Объяснение ответа')).join('')||'<p>В исходнике нет объяснения.</p>'}</div>`:''}`;
  }
  function running(a) {
    if(a.phase==='tutorial'||a.phase==='break') {
      $('examContent').innerHTML=`<div class="card break-card"><p class="small">${esc(a.title)}</p><h1>${a.phase==='tutorial'?'Инструктаж':'Перерыв'}</h1><div class="clock" id="examClock"></div><p>${a.phase==='tutorial'?'Выбирайте ответ буквой, отмечайте сомнительные вопросы флажком. До закрытия блока можно вернуться к любому его вопросу. Неиспользованное время инструктажа добавится к перерывам.':`Блок ${a.block} завершён. Следующий — ${a.block+1} из ${Math.ceil(a.questions.length/a.blockSize)}. Сейчас расходуется общий запас перерывов.`}</p><p class="small">Когда время закончится, следующий блок запустится автоматически.</p>${button(a.phase==='tutorial'?'Перейти к вопросам':'Начать следующий блок','nextBlock','btn primary',owner(a)?'':'disabled')}${!owner(a)?'<p class="warning">Продолжение доступно на устройстве, где начата попытка.</p>':''}</div>`;
      return;
    }
    const start=a.block*a.blockSize,end=C.blockEnd(a),answered=a.answers.slice(start,end).filter(Boolean).length;
    $('examContent').innerHTML=`<div class="toolbar row between"><div><strong>Блок ${a.block+1}/${Math.ceil(a.questions.length/a.blockSize)}</strong><div class="small">Отвечено ${answered}/${end-start}</div></div><div><div class="small">Осталось в блоке</div><div id="examClock" class="clock"></div></div>${button('Завершить блок','askEnd','btn outline',owner(a)?'':'disabled')}</div>${!owner(a)?'<p class="warning">Просмотр без редактирования. Продолжайте на устройстве, где начата попытка.</p>':''}<div class="exam-grid"><article class="card pad"><h2>Вопрос ${a.current-start+1} из ${end-start}</h2>${question(a,a.current,false)}<div class="row">${button(a.flags[a.current]?'★ Отмечено':'☆ Отметить','flag','btn outline',owner(a)?'':'disabled')}${button('Убрать ответ','clear','btn outline',owner(a)?'':'disabled')}</div><div class="nav">${button('← Назад','navigate','btn',`data-index="${a.current-1}" ${!owner(a)||a.current===start?'disabled':''}`)}${a.current===end-1?button('Обзор блока','overview','btn primary'):button('Далее →','navigate','btn primary',`data-index="${a.current+1}" ${owner(a)?'':'disabled'}`)}</div></article><aside class="card pad exam-map"><div class="dots" id="examMap">${a.questions.slice(start,end).map((q,j)=>{const i=start+j;return button(`${j+1}${a.flags[i]?'★':''}`,'navigate','dot'+(a.current===i?' now':'')+(a.answers[i]?' answered':'')+(a.flags[i]?' marked':''),`data-index="${i}" aria-label="Вопрос ${j+1}${a.answers[i]?', есть ответ':', без ответа'}${a.flags[i]?', отмечен':''}" ${owner(a)?'':'disabled'}`);}).join('')}</div><p class="small">Синие — с ответом<br>★ — отмечены для проверки</p></aside></div>`;
  }
  function results(a) {
    const r=C.result(a),ids=a.questions.map((q,i)=>i).filter(i=>filter==='all'||filter==='wrong'&&a.answers[i]!==a.questions[i].correct||filter==='flagged'&&a.flags[i]);
    if(review>=0&&!ids.includes(review))review=ids[0]??-1;
    $('examContent').innerHTML=`<div class="card pad"><p class="small">${esc(a.title)} · ${date(a.finishedAt)}</p><h1>${r.passed?'PASS · учебная цель достигнута':'Есть над чем поработать'}</h1><div class="result-number">${r.percent}%</div><p>${r.correct} из ${r.total} верно · ${r.skipped} без ответа · цель: ${Math.ceil(r.total*.8)} верных</p><p class="small">Время в блоках: ${time(r.spent)} · в среднем ${Math.round(r.spent/r.total/1000)} сек/вопрос. Включает время в фоне.</p><p class="small">Это учебный результат по нашей базе. Он не является официальной оценкой USMLE или прогнозом сдачи.</p><div class="row">${button('К режимам и истории','home','btn primary')}${button('Новая попытка','prepare','btn outline',`data-mode="${a.mode}" ${a.topic?`data-topic="${a.topic}"`:''}`)}</div><h2>Результат по системам</h2><div class="table-wrap"><table><thead><tr><th>Система</th><th>Верно</th><th>Результат</th></tr></thead><tbody>${Object.entries(r.systems).sort((a,b)=>a[1].correct/a[1].total-b[1].correct/b[1].total).map(([id,s])=>`<tr><td>${systemName(id)}</td><td>${s.correct}/${s.total}</td><td>${Math.round(s.correct/s.total*100)}%</td></tr>`).join('')}</tbody></table></div></div><section class="card pad section-title"><h2>Разбор вопросов</h2><div class="row review-controls">${[['all','Все'],['wrong','Ошибки и пропуски'],['flagged','Отмеченные']].map(([id,name])=>button(name,'filter',`btn ${filter===id?'primary':'outline'}`,`data-filter="${id}"`)).join('')}</div><div class="dots">${ids.map(i=>button(i+1,'review','dot'+(a.answers[i]===a.questions[i].correct?' good':' bad')+(i===review?' now':''),`data-index="${i}"`)).join('')}</div>${!ids.length?'<p>Таких вопросов нет.</p>':review<0?'<p class="small">Выберите номер, чтобы открыть условие и объяснение.</p>':`<div class="section-title"><h3>Вопрос ${review+1}</h3>${question(a,review,true)}</div>`}</section>`;
  }
  function render() {
    const a=view?S.get(view):null;
    if(!a){view=null;home();}else if(a.phase==='done')results(a);else running(a);
    clock();
  }
  function clock() {
    const a=view?S.get(view):null;if(!a||a.phase==='done'||!$('examClock'))return;
    const left=a.deadline-Math.max(Date.now(),a.lastClock||0);$('examClock').textContent=time(left);$('examClock').classList.toggle('urgent',left<5*60000);
  }
  function act(type,value) {
    const a=S.get(view);if(!a||!owner(a))return;
    C.action(a,type,value,Date.now());save(a);render();
  }
  $('examContent').onclick=e=>{
    const img=e.target.closest('[data-zoom]');if(img){$('largeImage').src=img.src;$('imageDialog').showModal();return;}
    const el=e.target.closest('[data-action]');if(!el||el.disabled)return;
    const action=el.dataset.action;
    if(action==='prepare')prepare(el.dataset.mode,el.dataset.topic);
    else if(action==='home'){view=null;render();scrollTo(0,0);}
    else if(action==='open'){view=el.dataset.id;review=-1;filter='all';settle();render();scrollTo(0,0);}
    else if(action==='filter'){filter=el.dataset.filter;review=-1;render();}
    else if(action==='review'){review=Number(el.dataset.index);render();}
    else if(action==='answer')act('answer',el.dataset.letter);
    else if(action==='clear')act('answer',null);
    else if(action==='navigate')act('navigate',Number(el.dataset.index));
    else if(action==='flag'||action==='nextBlock')act(action);
    else if(action==='overview')$('examMap').scrollIntoView({behavior:'smooth',block:'center'});
    else if(action==='askEnd'){
      const a=S.get(view),start=a.block*a.blockSize,end=C.blockEnd(a);
      $('endDialog').dataset.attempt=a.id;$('endDialog').dataset.block=String(a.block);
      $('endDetails').textContent=`Без ответа: ${a.answers.slice(start,end).filter(v=>!v).length}. Отмечено: ${a.flags.slice(start,end).filter(Boolean).length}.`;
      $('endDialog').showModal();
    }
  };
  $('confirmEnd').onclick=()=>{
    const a=S.get(view),d=$('endDialog');d.close();
    if(a&&a.id===d.dataset.attempt&&a.block===Number(d.dataset.block)&&a.phase==='block')act('endBlock');
  };
  $('cancelEnd').onclick=()=>$('endDialog').close();$('cancelSetup').onclick=()=>$('setupDialog').close();$('closeImage').onclick=()=>$('imageDialog').close();
  $('startExam').onclick=()=>{
    if(!draft||!locked||active()||!S.ready)return;
    const a=C.create({...draft,id:crypto.randomUUID(),device,version:B.version,now:Date.now()});save(a);view=a.id;review=-1;draft=null;$('setupDialog').close();render();scrollTo(0,0);
  };
  $('examHome').onclick=()=>{view=null;render();scrollTo(0,0);};
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey||document.querySelector('dialog[open]')||['INPUT','TEXTAREA','SELECT','BUTTON'].includes(e.target.tagName))return;
    const a=S.get(view);if(!a||a.phase!=='block'||!owner(a))return;
    const k=e.key.toUpperCase();if(a.questions[a.current].choices.includes(k))act('answer',k);
    else if(e.key==='ArrowRight'&&a.current<C.blockEnd(a)-1)act('navigate',a.current+1);
    else if(e.key==='ArrowLeft'&&a.current>a.block*a.blockSize)act('navigate',a.current-1);
  });
  S.subscribe(()=>{
    if(account!==S.user){account=S.user;view=null;draft=null;$('setupDialog').close();$('endDialog').close();}
    settle();render();
  });
  // The clock is derived from persisted absolute deadlines, never from interval counts.
  setInterval(()=>{const before=view?S.get(view)?.phase+':'+S.get(view)?.block:null;settle();const after=view?S.get(view)?.phase+':'+S.get(view)?.block:null;if(before!==after){$('endDialog').close();render();}else clock();},1000);
  window.addEventListener('pagehide',()=>{const a=S.get(view);if(a&&owner(a)&&a.phase==='block'){C.advance(a,Date.now());C.accrue(a,Date.now());save(a);}});
  render();
  const requested=new URLSearchParams(location.search).get('topic');
  if(requested&&B.topics.some(t=>t.id===requested)){
    const wait=setInterval(()=>{if(S.ready&&locked){clearInterval(wait);prepare('topic',requested);}},200);
  }
})();
