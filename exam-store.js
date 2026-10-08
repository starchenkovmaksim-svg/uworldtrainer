/* Independent namespace: never sends practice entries to the merge RPC. */
(() => {
  const PREFIX='exam:v1:attempt:', config=window.TRAINER_CONFIG||{};
  const $=id=>document.getElementById(id);
  let entries={},pending={},uid=null,client,busy=false,epoch=0,timer,ready=false,seen=new Set();
  let listener=()=>{},storageOK=true,canWrite=false;
  const filter=x=>Object.fromEntries(Object.entries(x||{}).filter(([k,v])=>k.startsWith(PREFIX)&&v?.schema===1&&Array.isArray(v.questions)));
  const key=()=>`uworld_exams_v1:${config.supabaseUrl||'local'}:${uid||'guest'}`;
  const say=text=>{ $('syncStatus').textContent=text;$('examSync').textContent=text; };
  function persist() {
    if(!canWrite)return false;
    try{localStorage.setItem(key(),JSON.stringify({entries,pending,seen:[...seen]}));storageOK=true;return true;}
    catch(_){storageOK=false;say('Не удалось сохранить в браузере. Не закрывайте страницу; освободите место и синхронизируйте.');return false;}
  }
  function load() {
    let c={};try{c=JSON.parse(localStorage.getItem(key()))||{};}catch(_){}
    entries=filter(c.entries);pending=uid?filter(c.pending):{};seen=new Set(c.seen||[]);
    entries={...entries,...pending};listener();
  }
  const notify=()=>listener();
  async function sync() {
    if(!uid||busy||!client)return false;
    const patch={};let size=2;
    if(canWrite)for(const [k,v]of Object.entries(pending)){
      const bytes=new TextEncoder().encode(JSON.stringify({[k]:v})).length;
      if(size+bytes>800000&&Object.keys(patch).length)break;
      patch[k]=structuredClone(v);size+=bytes;
    }
    const e=epoch,user=uid;busy=true;say('Синхронизация попыток…');
    try {
      let response;
      if(Object.keys(patch).length)response=await client.rpc('merge_trainer_progress',{patch});
      else response=await client.from('trainer_progress').select('entries').eq('user_id',user).maybeSingle();
      if(response.error)throw response.error;
      if(e!==epoch)return false;
      const remote=Object.keys(patch).length?(response.data||{}):(response.data?.entries||{});
      for(const k of Object.keys(patch))if(JSON.stringify(patch[k])===JSON.stringify(pending[k]))delete pending[k];
      entries={...filter(remote),...pending};
      seen=new Set(Object.entries(remote).filter(([k,v])=>!k.startsWith('exam:')&&v?.submitted).map(([k])=>k));
      persist();notify();
      if(storageOK)say(Object.keys(pending).length?'Отправляем новые ответы…':'Попытки сохранены в аккаунте');
      return !Object.keys(pending).length;
    }catch(_){if(e===epoch)say(storageOK?'Нет связи с облаком. Ответы сохранены здесь; отправим автоматически.':'Не удалось сохранить ответы. Не закрывайте страницу.');return false;}
    finally{if(e===epoch){busy=false;if(Object.keys(pending).length){clearTimeout(timer);timer=setTimeout(sync,10000);}}}
  }
  function session(session) {
    const next=session?.user?.id||null;
    $('account').textContent=session?.user?.email||'';
    $('logout').classList.toggle('hide',!next);$('syncNow').classList.toggle('hide',!next);
    if(next!==uid){epoch++;busy=false;clearTimeout(timer);uid=next;load();}
    ready=true;notify();
    if(uid)sync();else say('Гостевой режим · попытки сохраняются только в этом браузере');
  }
  window.ExamStore={
    get user(){return uid;},get ready(){return ready;},get storageOK(){return storageOK;},get seen(){return seen;},
    setWriter(value){canWrite=value;if(value){load();if(uid)sync();}},
    history:()=>Object.values(entries),
    get:id=>entries[PREFIX+id],
    subscribe:fn=>{listener=fn;},
    put(a){if(!canWrite)return;const k=PREFIX+a.id;entries[k]=structuredClone(a);if(uid)pending[k]=structuredClone(a);persist();
      if(uid){if(storageOK)say('Ответы сохранены здесь · отправляем в аккаунт…');clearTimeout(timer);timer=setTimeout(sync,500);}else if(storageOK)say('Сохранено в этом браузере · войдите до начала новой попытки для облачного сохранения');},
    sync
  };
  load();
  window.addEventListener('storage',event=>{if(event.key===key())load();});
  (async()=>{
    if(!config.supabaseUrl||!config.supabasePublishableKey){session(null);return;}
    try {
      await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';s.onload=resolve;s.onerror=reject;document.head.append(s);});
      client=window.supabase.createClient(config.supabaseUrl,config.supabasePublishableKey);
      const ui=window.TrainerAuth.mount(client);
      client.auth.onAuthStateChange((event,s)=>setTimeout(()=>{ui.session(s,event);session(s);},0));
      const {data,error}=await client.auth.getSession();if(error)throw error;ui.session(data.session);session(data.session);
      $('syncNow').onclick=sync;
      $('logout').onclick=async()=>{
        if(Object.keys(pending).length&&!(await sync())){say('Дождитесь отправки ответов перед выходом.');return;}
        const {error}=await client.auth.signOut({scope:'local'});if(error)say('Не удалось выйти. Повторите попытку.');else session(null);
      };
      window.addEventListener('online',sync);window.addEventListener('focus',sync);
      setInterval(()=>{if(!document.hidden)sync();},15000);
    } catch(_){ready=true;notify();say('Облако не подключено. Доступен гостевой режим; для аккаунта проверьте интернет и обновите страницу.');}
  })();
})();
