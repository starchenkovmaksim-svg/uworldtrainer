/* Reversible presentation: original image URLs and question data stay intact. */
(() => {
  const margins=window.ScanMargins||{},root=document.documentElement;
  function bounds(img){const src=img.getAttribute('src');return margins[src]||margins[src?.replace(new URL('.',location.href).href,'')]||[img.naturalWidth,img.naturalHeight,img.naturalWidth];}
  function crop(frame,img,b,full){const w=full?b[0]:b[2];frame.style.aspectRatio=`${w}/${b[1]}`;img.style.width=`${b[0]/w*100}%`;return w;}
  const dialog=document.createElement('dialog');dialog.className='scan-viewer';dialog.setAttribute('aria-label','Просмотр страницы');
  dialog.innerHTML='<div class="scan-toolbar"><strong>Просмотр страницы</strong><div class="scan-controls"><button type="button" data-less aria-label="Уменьшить">−</button><output aria-live="polite"></output><button type="button" data-more aria-label="Увеличить">+</button><button type="button" data-fit>По ширине</button><button type="button" data-full>Вся страница</button><button type="button" data-close>Закрыть</button></div></div><div class="scan-stage" tabindex="0" aria-label="Изображение: перемещайте мышью или пальцем"><div class="scan-plane"><div class="scan-frame"><img alt="Увеличенная страница задания" draggable="false"></div></div></div><p class="scan-help">Масштаб: колёсико под курсором, + / − или два пальца. Перемещение: потяните страницу. Esc — закрыть.</p><p class="scan-error" role="status" hidden>Не удалось загрузить изображение. Закройте окно и попробуйте снова.</p>';
  document.body.append(dialog);const stage=dialog.querySelector('.scan-stage'),plane=stage.firstElementChild,frame=plane.firstElementChild,img=frame.firstElementChild,output=dialog.querySelector('output'),fullButton=dialog.querySelector('[data-full]');let b=null,full=false,pixels=0,origin=null,ready=false;
  function refresh(){if(!ready)return;const w=crop(frame,img,b,full);frame.style.width=pixels+'px';const height=pixels*b[1]/w;plane.style.width=Math.max(stage.clientWidth,pixels)*3+'px';plane.style.height=Math.max(stage.clientHeight,height)*3+'px';frame.style.left=(parseFloat(plane.style.width)-pixels)/2+'px';frame.style.top=(parseFloat(plane.style.height)-height)/2+'px';output.textContent=Math.round(pixels/w*100)+'%';fullButton.hidden=b[2]===b[0];fullButton.textContent=full?'Без пустых полей':'Вся страница';}
  let view=null,layoutFrame=0;
  // Cache the image point at the viewport centre before browser chrome or rotation
  // changes the stage. Scroll events from the new layout must not overwrite it.
  function rememberView(force=false){
    if(!ready||!pixels)return;
    if(!force&&view&&(view.width!==stage.clientWidth||view.height!==stage.clientHeight))return;
    const r=frame.getBoundingClientRect(),v=stage.getBoundingClientRect();
    view={width:stage.clientWidth,height:stage.clientHeight,u:(v.left+stage.clientWidth/2-r.left)/pixels,v:(v.top+stage.clientHeight/2-r.top)/pixels};
  }
  function fit(){if(!ready)return;pixels=Math.max(1,Math.min(stage.clientWidth-24,(full?b[0]:b[2])*1.25));refresh();stage.scrollTo(0,0);const r=frame.getBoundingClientRect(),v=stage.getBoundingClientRect();stage.scrollBy(r.left-v.left-(stage.clientWidth-pixels)/2,r.top-v.top-12);rememberView(true);}
  function keepImageVisible(){
    const r=frame.getBoundingClientRect(),v=stage.getBoundingClientRect();
    const width=pixels,height=pixels*b[1]/(full?b[0]:b[2]);
    function offset(position,size,available){
      const low=Math.min(12,available-size-12),high=Math.max(12,available-size-12);
      return position-Math.max(low,Math.min(high,position));
    }
    stage.scrollBy(offset(r.left-v.left,width,stage.clientWidth),offset(r.top-v.top,height,stage.clientHeight));
  }
  function relayout(){
    layoutFrame=0;if(!dialog.open||!ready||!stage.clientWidth||!stage.clientHeight)return;
    if(!view){fit();return;}
    if(view.width===stage.clientWidth&&view.height===stage.clientHeight)return;
    const anchor=view;resetPointers();refresh();
    const r=frame.getBoundingClientRect(),v=stage.getBoundingClientRect();
    stage.scrollBy(r.left+anchor.u*pixels-v.left-stage.clientWidth/2,r.top+anchor.v*pixels-v.top-stage.clientHeight/2);
    keepImageVisible();rememberView(true);
  }
  function scheduleLayout(){if(dialog.open&&!layoutFrame)layoutFrame=requestAnimationFrame(relayout);}
  stage.addEventListener('scroll',()=>rememberView(),{passive:true});
  function zoom(factor,clientX,clientY,targetX=clientX,targetY=clientY){
    if(!ready)return;
    const viewport=stage.getBoundingClientRect(),before=frame.getBoundingClientRect();
    const x=clientX??Math.max(before.left,Math.min(before.left+pixels,viewport.left+stage.clientWidth/2)),y=clientY??Math.max(before.top,Math.min(before.top+pixels*b[1]/(full?b[0]:b[2]),viewport.top+stage.clientHeight/2));
    const u=(x-before.left)/pixels,v=(y-before.top)/pixels;
    const next=Math.max(96,Math.min((full?b[0]:b[2])*5,pixels*factor));
    if(next===pixels&&targetX===clientX&&targetY===clientY)return;
    pixels=next;refresh();
    const after=frame.getBoundingClientRect();
    stage.scrollBy(after.left+u*pixels-(targetX??x),after.top+v*pixels-(targetY??y));
    rememberView(true);
  }
  stage.addEventListener('wheel',e=>{
    if(!ready||!e.deltaY)return;
    e.preventDefault();
    const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?stage.clientHeight:1);
    zoom(Math.exp(-Math.max(-240,Math.min(240,delta))*.002),e.clientX,e.clientY);
  },{passive:false});
  function open(source){origin=source;ready=false;view=null;b=bounds(source);full=false;dialog.querySelector('.scan-error').hidden=true;img.onload=()=>{if(ready||!dialog.open)return;if(!b[0])b=[img.naturalWidth,img.naturalHeight,img.naturalWidth];ready=true;fit();};img.onerror=()=>{dialog.querySelector('.scan-error').hidden=false;};img.src=source.src;dialog.showModal();if(img.complete&&img.naturalWidth)img.onload();}
  dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('[data-less]').onclick=()=>zoom(1/1.25);dialog.querySelector('[data-more]').onclick=()=>zoom(1.25);dialog.querySelector('[data-fit]').onclick=fit;fullButton.onclick=()=>{full=!full;fit();};
  dialog.addEventListener('close',()=>{ready=false;view=null;cancelAnimationFrame(layoutFrame);layoutFrame=0;img.removeAttribute('src');origin?.focus({preventScroll:true});});
  dialog.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.25);}if(e.key==='-'){e.preventDefault();zoom(1/1.25);}if(e.key==='0'){e.preventDefault();fit();}});
  // Pointer capture supports both mouse panning and two-finger pinch, without changing browser zoom.
  const pointers=new Map();let lastDistance=0;
  function resetPointers(){const ids=[...pointers.keys()];pointers.clear();lastDistance=0;for(const id of ids)if(stage.hasPointerCapture(id))stage.releasePointerCapture(id);}
  stage.addEventListener('pointerdown',e=>{if(e.button!==0||!ready||pointers.size>=2)return;pointers.set(e.pointerId,[e.clientX,e.clientY]);stage.setPointerCapture(e.pointerId);lastDistance=pointers.size===2?distance():0;});
  function distance(){const [a,b]=[...pointers.values()];return Math.hypot(a[0]-b[0],a[1]-b[1]);}
  stage.addEventListener('pointermove',e=>{
    const prev=pointers.get(e.pointerId);if(!prev)return;
    const old=[...pointers.values()];pointers.set(e.pointerId,[e.clientX,e.clientY]);
    if(pointers.size===2){
      const d=distance(),[a,b]=[...pointers.values()];
      if(lastDistance>0)zoom(d/lastDistance,(old[0][0]+old[1][0])/2,(old[0][1]+old[1][1])/2,(a[0]+b[0])/2,(a[1]+b[1])/2);
      lastDistance=d;
    }else{stage.scrollLeft+=prev[0]-e.clientX;stage.scrollTop+=prev[1]-e.clientY;rememberView(true);}
  });
  for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,e=>{if(pointers.delete(e.pointerId))lastDistance=0;});
  dialog.addEventListener('close',resetPointers);window.addEventListener('resize',scheduleLayout);
  window.visualViewport?.addEventListener('resize',scheduleLayout);
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(scheduleLayout).observe(stage);
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
