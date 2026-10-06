(() => {
  const dialog=document.getElementById('accountDialog');
  document.getElementById('accountOpen').onclick=()=>dialog.showModal();
  document.getElementById('accountClose').onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
})();
