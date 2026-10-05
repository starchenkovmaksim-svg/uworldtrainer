const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname+'/..',elements=new Map(),calls=[];let fail;
function el(id){if(!elements.has(id)){const set=new Set();elements.set(id,{value:'',textContent:'',disabled:false,reportValidity:()=>true,classList:{add:x=>set.add(x),remove:x=>set.delete(x),contains:x=>set.has(x),toggle(x,on){on??=!set.has(x);on?set.add(x):set.delete(x)}}});}return elements.get(id);}
const auth=Object.fromEntries(['signUp','signInWithPassword','signInWithOtp','resetPasswordForEmail','updateUser','resend'].map(name=>[name,async(...args)=>{calls.push([name,...args]);return fail?{error:{code:fail}}:{data:{session:null}}}]));
const ctx=vm.createContext({window:{},document:{getElementById:el},URL,location:{href:'https://example.com/trainer/topics.html'}});
vm.runInContext(fs.readFileSync(root+'/auth-ui.js','utf8'),ctx);
const ui=ctx.window.TrainerAuth.mount({auth});const submit=id=>el(id).onsubmit({preventDefault(){}});
(async()=>{
 el('email').value='person@example.com';el('password').value='example-password';
 await submit('loginForm');assert.equal(calls.at(-1)[0],'signInWithPassword');assert.equal(el('password').value,'');
 el('authSignup').onclick();el('password').value='example-password';el('passwordConfirm').value='different';const count=calls.length;
 await submit('loginForm');assert.equal(calls.length,count);assert.match(el('authStatus').textContent,/не совпадают/);
 el('passwordConfirm').value='example-password';await submit('loginForm');assert.equal(calls.at(-1)[0],'signUp');assert.equal(calls.at(-1)[1].options.emailRedirectTo,'https://example.com/trainer/');
 assert.match(el('authStatus').textContent,/подтвердите/);
 await el('authReset').onclick();assert.equal(calls.at(-1)[0],'resetPasswordForEmail');
 ui.session({user:{id:'same-account'}},'PASSWORD_RECOVERY');assert.equal(el('passwordForm').classList.contains('hide'),false);
 ui.session({user:{id:'same-account'}});assert.equal(el('passwordForm').classList.contains('hide'),false);
 el('newPassword').value=el('newPasswordConfirm').value='replacement-password';await submit('passwordForm');assert.equal(calls.at(-1)[0],'updateUser');assert.equal(el('newPassword').value,'');
 ui.session(null);assert.ok(el('passwordForm').classList.contains('hide'));await submit('passwordForm');assert.equal(calls.at(-1)[0],'updateUser');
 el('authLogin').onclick();el('password').value='bad-password';fail='invalid_credentials';await submit('loginForm');assert.match(el('authStatus').textContent,/Неверная почта/);assert.equal(el('authSubmit').disabled,false);
 console.log('PASS: password login, registration confirmation, mismatched passwords, recovery, password update, logout and errors');
})().catch(e=>{console.error(e);process.exitCode=1});
