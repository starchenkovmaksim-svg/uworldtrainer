/* Read-only presentation helpers: no progress storage or authentication changes. */
(() => {
  const $=id=>document.getElementById(id);
  let selected='all';
  function filter() {
    const list=$('blockList');if(!list)return;
    const term=($('topicSearch')?.value||'').trim().toLowerCase();
    let visible=0;
    for(const card of list.children){
      card.hidden=!(card.dataset.title||'').includes(term)||(selected!=='all'&&card.dataset.progress!==selected);
      if(!card.hidden)visible++;
    }
    $('catalogEmpty')?.classList.toggle('hide',visible>0);
    if($('catalogCount'))$('catalogCount').textContent=`Показано ${visible} из ${list.children.length}`;
    for(const el of document.querySelectorAll('[data-practice-filter]'))el.setAttribute('aria-pressed',String(el.dataset.practiceFilter===selected));
  }
  for(const el of document.querySelectorAll('[data-practice-filter]'))el.onclick=()=>{selected=el.dataset.practiceFilter;filter();};
  $('topicSearch')?.addEventListener('input',filter);
  if($('clearCatalog'))$('clearCatalog').onclick=()=>{selected='all';if($('topicSearch'))$('topicSearch').value='';filter();};
  document.addEventListener('click',event=>{if(event.target.closest('[data-open-account]'))$('accountDialog').showModal();});
  function account(){
    const label=$('accountLabel'),dot=$('accountDot');
    if(label&&dot)label.textContent=dot.classList.contains('hide')?'Войти':'Аккаунт';
  }
  if($('accountDot'))new MutationObserver(account).observe($('accountDot'),{attributes:true,attributeFilter:['class']});
  window.TrainerUX={filter};filter();account();
})();
