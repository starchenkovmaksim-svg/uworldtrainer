(() => {
  for(const id of ['accountClose','reportClose']){const b=document.getElementById(id);if(b)b.textContent='Закрыть';}
  for(const id of ['dots','sumDots']){
    const dots=document.getElementById(id);if(!dots)continue;
    const legend=document.createElement('div');legend.className='question-legend';legend.innerHTML='<span><i class="legend-good"></i>Верно</span><span><i class="legend-bad"></i>Неверно</span><span><i class="legend-pending"></i>Нужна самопроверка</span><span>★ Отмечено для возврата</span>';dots.before(legend);
    const update=()=>{for(const b of dots.children){const c=b.classList,label=`Вопрос ${b.textContent}: ${c.contains('good')?'верно':c.contains('bad')?'неверно':c.contains('pending')?'нужна самопроверка':'без оценки'}${c.contains('marked')?', отмечен для возврата':''}${c.contains('now')?', текущий':''}`;b.title=label;b.setAttribute('aria-label',label);}};
    new MutationObserver(update).observe(dots,{childList:true});update();
  }
})();
