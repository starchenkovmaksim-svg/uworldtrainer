(async () => {
  const config = window.TRAINER_CONFIG || {};
  const status = document.getElementById('syncStatus');
  const login = document.getElementById('loginForm');
  const logout = document.getElementById('logout');
  const retry = document.getElementById('syncNow');
  const account = document.getElementById('account');
  const message = text => { status.textContent = text; };
  if (!config.supabaseUrl || !config.supabasePublishableKey) {
    message('Облако ещё не подключено. Прогресс сохраняется только в этом браузере.');
    return;
  }
  let client, userId = null, pending = {}, baseline = {}, busy = false, epoch = 0;
  let applying = false, timer, storageFailed = false;
  const model = window.ProgressModel;
  const cacheKey = () => `uworld_topics_cloud_v1:${config.supabaseUrl}:${userId}`;
  const persist = () => {
    try {
      localStorage.setItem(cacheKey(), JSON.stringify({entries: baseline, pending}));
      storageFailed = false;
    } catch (_) {
      storageFailed = true;
      message('Браузер не сохраняет данные. Не закрывайте страницу до отправки в облако.');
    }
  };
  const apply = entries => {
    baseline = model.flatten(model.expand(entries, BLOCKS), BLOCKS);
    applying = true;
    try { window.trainer.replace(model.expand(baseline, BLOCKS)); }
    finally { applying = false; }
    persist();
  };
  window.trainer.onChange = states => {
    if (applying || !userId) return;
    const next = model.flatten(states, BLOCKS);
    Object.assign(pending, model.diff(baseline, next));
    baseline = next;
    persist();
    if (Object.keys(pending).length) {
      if (!storageFailed) message('Есть изменения для отправки…');
      clearTimeout(timer);
      timer = setTimeout(sync, 400);
    }
  };
  async function sync() {
    if (!userId || busy) return false;
    busy = true;
    const version = epoch, uid = userId;
    const patch = structuredClone(pending);
    message('Синхронизация…');
    try {
      let entries;
      if (Object.keys(patch).length) {
        const {data, error} = await client.rpc('merge_trainer_progress', {patch});
        if (error) throw error;
        entries = data || {};
      } else {
        const {data, error} = await client.from('trainer_progress').select('entries').eq('user_id', uid).maybeSingle();
        if (error) throw error;
        entries = data?.entries || {};
      }
      if (version !== epoch) return false;
      for (const key of Object.keys(patch)) {
        if (JSON.stringify(pending[key]) === JSON.stringify(patch[key])) delete pending[key];
      }
      apply({...entries, ...pending});
      message(Object.keys(pending).length ? 'Есть изменения для отправки…' :
        `Сохранено в облаке · ${new Date().toLocaleTimeString('ru-RU')}`);
      return Object.keys(pending).length === 0;
    } catch (_) {
      if (version === epoch) message(storageFailed ?
        'Не удалось сохранить. Не закрывайте страницу; проверьте интернет и повторите.' :
        'Облако недоступно. Изменения сохранены здесь; повторим отправку автоматически.');
      return false;
    } finally {
      if (version === epoch) {
        busy = false;
        if (Object.keys(pending).length) {
          clearTimeout(timer);
          timer = setTimeout(sync, 10000);
        }
      }
    }
  }
  async function sessionChanged(session) {
    const nextId = session?.user?.id || null;
    if (nextId === userId) return;
    epoch++;
    clearTimeout(timer);
    busy = false;
    userId = nextId;
    window.trainer.cloudUser = userId;
    pending = {};
    login.classList.toggle('hide', !!userId);
    logout.classList.toggle('hide', !userId);
    retry.classList.toggle('hide', !userId);
    account.textContent = session?.user?.email || '';
    if (!userId) {
      applying = true;
      window.trainer.replace({});
      applying = false;
      message('Войдите с той же почтой на всех устройствах.');
      return;
    }
    let cached = {};
    try { cached = JSON.parse(localStorage.getItem(cacheKey())) || {}; } catch (_) {}
    pending = cached.pending || {};
    apply({...cached.entries, ...pending});
    await sync();
  }
  try {
    // Load only when configured; local mode does not depend on the CDN.
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
    client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey);
    login.classList.remove('hide');
    message('Войдите с той же почтой на всех устройствах.');
    client.auth.onAuthStateChange((_event, session) => {
      // Keep async Supabase calls outside the auth callback lock.
      setTimeout(() => sessionChanged(session), 0);
    });
    login.onsubmit = async event => {
      event.preventDefault();
      const button = login.querySelector('button');
      button.disabled = true;
      try {
        const {error} = await client.auth.signInWithOtp({
          email: document.getElementById('email').value.trim(),
          options: {emailRedirectTo: new URL('./', location.href).href}
        });
        if (error) throw error;
        message('Письмо отправлено. Откройте ссылку на этом устройстве.');
      } catch (_) { message('Не удалось отправить письмо. Проверьте адрес и попробуйте позже.'); }
      finally { button.disabled = false; }
    };
    logout.onclick = async () => {
      logout.disabled = true;
      try {
        if (Object.keys(pending).length && !(await sync())) {
          message('Сначала дождитесь отправки изменений в облако, затем выйдите.');
          return;
        }
        const {error} = await client.auth.signOut({scope: 'local'});
        if (error) throw error;
        await sessionChanged(null);
      } catch (_) { message('Не удалось выйти. Повторите попытку.'); }
      finally { logout.disabled = false; }
    };
    retry.onclick = sync;
    window.addEventListener('online', sync);
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
    setInterval(() => { if (!document.hidden) sync(); }, 15000);
    const {data, error} = await client.auth.getSession();
    if (error) throw error;
    await sessionChanged(data.session);
  } catch (_) {
    message('Не удалось подключить облако. Проверьте интернет и обновите страницу.');
  }
})();
