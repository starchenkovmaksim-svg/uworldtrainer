window.TrainerAuth = {
  mount(client) {
    const $ = id => document.getElementById(id);
    const say = text => { $('authStatus').textContent = text; };
    const redirectTo = new URL('./', location.href).href;
    let mode = 'login', activeUser = null, working = false;
    const errorText = error => ({
      invalid_credentials: 'Неверная почта или пароль.',
      email_not_confirmed: 'Сначала подтвердите почту по ссылке из письма.',
      weak_password: 'Пароль слишком простой. Используйте более длинный пароль.',
      same_password: 'Новый пароль должен отличаться от прежнего.',
      over_email_send_rate_limit: 'Письма запрашиваются слишком часто. Подождите и повторите.',
      over_request_rate_limit: 'Слишком много попыток. Подождите и повторите.'
    }[error?.code] || 'Не удалось выполнить действие. Проверьте интернет и повторите позже.');
    const run = async action => {
      if (working) return;
      working = true;
      const controls = ['authSubmit','authLogin','authSignup','authReset','authMagic','authResend','passwordSave'];
      controls.forEach(id => { $(id).disabled = true; });
      try { await action(); } catch (error) { say(errorText(error)); }
      finally { working = false; controls.forEach(id => { $(id).disabled = false; }); }
    };
    const checked = result => { if (result.error) throw result.error; return result.data; };
    function email() {
      const input = $('email');
      if (!input.reportValidity()) return null;
      return input.value.trim();
    }
    function setMode(next) {
      mode = next;
      $('confirmLabel').classList.toggle('hide', mode !== 'signup');
      $('passwordConfirm').required = mode === 'signup';
      $('password').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
      $('password').minLength = mode === 'signup' ? 8 : 1;
      $('authSubmit').textContent = mode === 'signup' ? 'Зарегистрироваться' : 'Войти';
      $('authHint').textContent = mode === 'signup' ? 'Не менее 8 символов. Подтвердите почту один раз; затем входите по почте и паролю.' : 'Войдите с той же почтой на всех устройствах. До входа прогресс хранится только в этом браузере.';
      $('authLogin').classList.toggle('primary',mode === 'login');
      $('authSignup').classList.toggle('primary',mode === 'signup');
      $('authLogin').classList.toggle('outline',mode !== 'login');
      $('authSignup').classList.toggle('outline',mode !== 'signup');
      say('');
    }
    $('authLogin').onclick = () => setMode('login');
    $('authSignup').onclick = () => setMode('signup');
    $('loginForm').onsubmit = event => {
      event.preventDefault();
      if (!$('loginForm').reportValidity()) return;
      const address = email(), password = $('password').value;
      if (!address) return;
      if (mode === 'signup' && password !== $('passwordConfirm').value) { say('Пароли не совпадают.'); return; }
      return run(async () => {
        if (mode === 'signup') {
          const data = checked(await client.auth.signUp({email:address,password,options:{emailRedirectTo:redirectTo}}));
          say(data?.session ? 'Регистрация завершена.' : 'Проверьте почту и подтвердите адрес. Если аккаунт уже есть, используйте вход или восстановление пароля.');
        } else {
          checked(await client.auth.signInWithPassword({email:address,password}));
          say('Вы вошли. Прогресс синхронизируется.');
        }
        $('password').value = ''; $('passwordConfirm').value = '';
      });
    };
    $('authReset').onclick = () => {
      const address = email(); if (!address) return;
      return run(async () => {
        checked(await client.auth.resetPasswordForEmail(address,{redirectTo}));
        say('Если аккаунт существует, на почту придёт ссылка для задания нового пароля. Откройте её на этом устройстве.');
      });
    };
    $('authMagic').onclick = () => {
      const address = email(); if (!address) return;
      return run(async () => {
        checked(await client.auth.signInWithOtp({email:address,options:{emailRedirectTo:redirectTo,shouldCreateUser:false}}));
        say('Ссылка для входа отправлена. После входа нажмите «Задать / сменить пароль».');
      });
    };
    $('authResend').onclick = () => {
      const address = email(); if (!address) return;
      return run(async () => {
        checked(await client.auth.resend({type:'signup',email:address,options:{emailRedirectTo:redirectTo}}));
        say('Запрос отправлен. Проверьте почту, включая папку «Спам».');
      });
    };
    $('authSetPassword').onclick = () => { $('passwordForm').classList.toggle('hide'); };
    $('passwordForm').onsubmit = event => {
      event.preventDefault();
      if (!activeUser || !$('passwordForm').reportValidity()) return;
      const password = $('newPassword').value;
      if (password !== $('newPasswordConfirm').value) { say('Пароли не совпадают.'); return; }
      return run(async () => {
        checked(await client.auth.updateUser({password}));
        $('newPassword').value = ''; $('newPasswordConfirm').value = '';
        $('passwordForm').classList.add('hide');
        say('Пароль сохранён. Теперь входите с этой почтой и паролем.');
      });
    };
    $('authPanel').classList.remove('hide');
    setMode('login');
    return {session(session,event) {
      activeUser = session?.user?.id || null;
      $('authGuest').classList.toggle('hide',!!activeUser);
      $('authSetPassword').classList.toggle('hide',!activeUser);
      if (!activeUser) {
        $('passwordForm').classList.add('hide');
        for (const id of ['password','passwordConfirm','newPassword','newPasswordConfirm']) $(id).value = '';
      }
      if (event === 'PASSWORD_RECOVERY' && activeUser) {
        $('passwordForm').classList.remove('hide');
        say('Введите новый пароль для своего аккаунта.');
      }
    }};
  }
};
