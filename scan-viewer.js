/* Reversible presentation: original image URLs and question data stay intact. */
(() => {
  const margins=window.ScanMargins||{},root=document.documentElement;
  function bounds(img){const src=img.getAttribute('src');return margins[src]||margins[src?.replace(new URL('.',location.href).href,'')]||[img.naturalWidth,img.naturalHeight,img.naturalWidth];}
  function crop(frame,img,b,full){const w=full?b[0]:b[2];frame.style.aspectRatio=`${w}/${b[1]}`;img.style.width=`${b[0]/w*100}%`;return w;}
  const dialog=document.createElement('dialog');dialog.className='scan-viewer';dialog.setAttribute('aria-label','Просмотр страницы');
  dialog.innerHTML='<div class="scan-toolbar"><strong>Просмотр страницы</strong><div class="scan-controls"><button type="button" data-less aria-label="Уменьшить">−</button><output aria-live="polite"></output><button type="button" data-more aria-label="Увеличить">+</button><button type="button" data-fit>По ширине</button><button type="button" data-full>Вся страница</button><button type="button" data-close>Закрыть</button></div></div><div class="scan-stage" tabindex="0" aria-label="Изображение: перемещайте мышью или пальцем"><div class="scan-frame"><img alt="Увеличенная страница задания" draggable="false"></div></div><p class="scan-help">Масштаб: + / − или два пальца. Перемещение: потяните страницу. Esc — закрыть.</p><p class="scan-error" role="status" hidden>Не удалось загрузить изображение. Закройте окно и попробуйте снова.</p>';
  document.body.append(dialog);const stage=dialog.querySelector('.scan-stage'),frame=stage.firstElementChild,img=frame.firstElementChild,output=dialog.querySelector('output'),fullButton=dialog.querySelector('[data-full]');let b=null,full=false,pixels=0,origin=null,ready=false;
  function refresh(){if(!ready)return;const w=crop(frame,img,b,full);frame.style.width=pixels+'px';output.textContent=Math.round(pixels/w*100)+'%';fullButton.hidden=b[2]===b[0];fullButton.textContent=full?'Без пустых полей':'Вся страница';}
  function fit(){if(!ready)return;pixels=Math.min(stage.clientWidth-24,(full?b[0]:b[2])*1.25);refresh();stage.scrollTo(0,0);}
  function zoom(factor){if(!ready)return;const old=pixels;pixels=Math.max(96,Math.min((full?b[0]:b[2])*5,pixels*factor));const ratio=pixels/old,x=(stage.scrollLeft+stage.clientWidth/2)*ratio-stage.clientWidth/2,y=(stage.scrollTop+stage.clientHeight/2)*ratio-stage.clientHeight/2;refresh();stage.scrollTo(x,y);}
  function open(source){origin=source;ready=false;b=bounds(source);full=false;dialog.querySelector('.scan-error').hidden=true;img.onload=()=>{if(!b[0])b=[img.naturalWidth,img.naturalHeight,img.naturalWidth];ready=true;fit();};img.onerror=()=>{dialog.querySelector('.scan-error').hidden=false;};img.src=source.src;dialog.showModal();if(img.complete&&img.naturalWidth)img.onload();}
  dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('[data-less]').onclick=()=>zoom(1/1.25);dialog.querySelector('[data-more]').onclick=()=>zoom(1.25);dialog.querySelector('[data-fit]').onclick=fit;fullButton.onclick=()=>{full=!full;fit();};
  dialog.addEventListener('close',()=>{ready=false;img.removeAttribute('src');origin?.focus({preventScroll:true});});
  dialog.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.25);}if(e.key==='-'){e.preventDefault();zoom(1/1.25);}if(e.key==='0'){e.preventDefault();fit();}});
  // Pointer capture supports both mouse panning and two-finger pinch, without changing browser zoom.
  const pointers=new Map();let lastDistance=0;
  stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;pointers.set(e.pointerId,[e.clientX,e.clientY]);stage.setPointerCapture(e.pointerId);lastDistance=pointers.size===2?distance():0;});
  function distance(){const [a,b]=[...pointers.values()];return Math.hypot(a[0]-b[0],a[1]-b[1]);}
  stage.addEventListener('pointermove',e=>{const prev=pointers.get(e.pointerId);if(!prev)return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){const d=distance();if(lastDistance>0)zoom(d/lastDistance);lastDistance=d;}else if(pointers.size===1){stage.scrollLeft+=prev[0]-e.clientX;stage.scrollTop+=prev[1]-e.clientY;}});
  for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,e=>{pointers.delete(e.pointerId);lastDistance=0;});
  dialog.addEventListener('close',()=>pointers.clear());window.addEventListener('resize',()=>{if(dialog.open)fit();});
  function enhance(){for(const source of document.querySelectorAll('img.source,img.exam-image')){
    if(source.dataset.scanReady)continue;source.dataset.scanReady='true';source.tabIndex=0;source.setAttribute('role','button');source.setAttribute('aria-label','Увеличить страницу задания');source.title='Нажмите, чтобы увеличить';
    const holder=document.createElement('div');holder.className='scan-holder';const viewport=document.createElement('div');viewport.className='scan-frame';source.before(holder);holder.append(viewport);viewport.append(source);
    const controls=document.createElement('div');controls.className='scan-inline-tools';controls.innerHTML='<button type="button" data-enlarge>Увеличить страницу</button><button type="button" data-original hidden>Вся страница</button>';holder.append(controls);controls.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();});controls.querySelector('[data-enlarge]').onclick=()=>open(source);
    const original=controls.querySelector('[data-original]');let uncropped=false;const apply=()=>{const box=bounds(source);if(!box[0])return;const width=crop(viewport,source,box,uncropped);viewport.style.maxWidth=Math.min(1000,width*1.25)+'px';original.hidden=box[2]===box[0];original.textContent=uncropped?'Без пустых полей':'Вся страница';};original.onclick=()=>{uncropped=!uncropped;apply();};source.addEventListener('load',apply);if(source.complete)apply();
    source.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();open(source);}});
  }}
  document.addEventListener('click',e=>{const source=e.target.closest('img[data-scan-ready]');if(!source)return;e.preventDefault();e.stopImmediatePropagation();open(source);},true);
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});enhance();
})();
