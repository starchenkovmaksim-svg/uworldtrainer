/* Read-only badges. No practice answers, grades, keys or ordering are modified. */
(() => {
  let records=[],user=null;
  function guest() {
    try{const key=`uworld_exams_v1:${window.TRAINER_CONFIG?.supabaseUrl||'local'}:guest`;return Object.values(JSON.parse(localStorage.getItem(key))?.entries||{});}catch(_){return [];}
  }
  function render() {
    if(!user)records=guest();
    for(const el of document.querySelectorAll('[data-exam-topic]')) {
      const m=window.ExamCore.mastery(records,el.dataset.examTopic);
      el.textContent=m?`✓ ${m.confirmed?'Освоение подтверждено':'Освоено'} · ${m.percent}% · ${new Date(m.date).toLocaleDateString('ru-RU')}`:'';
    }
  }
  window.ExamBadges={render,update(entries,uid){user=uid;records=Object.entries(entries||{}).filter(([k,v])=>k.startsWith('exam:v1:attempt:')&&v?.schema===1).map(([,v])=>v);render();}};
  window.addEventListener('storage',render);window.addEventListener('focus',render);render();
})();
