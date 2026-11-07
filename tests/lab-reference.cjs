const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function el(){return {children:[],attributes:{},events:{},value:'',textContent:'',append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.events[k]=f},focus(){this.focused=true}}}
const unitButton=el(),formulaButton=el(),media={matches:false,addEventListener(n,f){this.change=f}};
const dialog=el(),search=el(),results=el(),tabs=el(),close=el(),count=el(),body=el(),events={};
dialog.querySelector=s=>({'input':search,'.lab-results':results,'.lab-tabs':tabs,'[data-lab-close]':close,'[data-lab-unit]':unitButton,'[data-lab-formulas]':formulaButton,'.lab-count':count}[s]);
body.classList={toggle(){},remove(){}};dialog.contains=target=>target===search;dialog.show=()=>{dialog.open=true;dialog.modal=false};
dialog.showModal=()=>{dialog.open=true;dialog.modal=true};dialog.close=()=>{dialog.open=false;dialog.events.close()};
const document={body,getElementById(){return null},querySelector(){return null},createElement:tag=>tag==='dialog'?dialog:el(),addEventListener(k,f){events[k]=f}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../lab-reference.js','utf8'),{document,window:{matchMedia:()=>media,LabCalculations:require('../lab-calculations.js')}});
const origin=el();origin.isConnected=true;events.click({target:{closest:()=>origin}});
assert.equal(dialog.open,true);assert.equal(count.textContent,'Показателей: 92');assert.equal(close.focused,true);
search.value='TSH';search.events.input();assert.equal(count.textContent,'Показателей: 1');assert.equal(results.children[0].children[0].textContent,'Гормоны');
search.value='калий';search.events.input();assert.equal(count.textContent,'Показателей: 1');
search.value='';tabs.children[1].onclick();assert.equal(count.textContent,'Показателей: 23');assert.equal(tabs.children[1].attributes['aria-pressed'],'true');
search.value='неттакого';search.events.input();assert.equal(results.children.length,0);assert.ok(count.textContent.includes('Ничего не найдено'));
let blocked=false;events.keydown({stopImmediatePropagation(){blocked=true}});assert.equal(blocked,true);
close.onclick();assert.equal(dialog.open,false);assert.equal(origin.focused,true);
blocked=false;events.keydown({stopImmediatePropagation(){blocked=true}});assert.equal(blocked,false);
for(const file of ['index.html','topics.html','exams.html']){const s=fs.readFileSync(__dirname+'/../'+file,'utf8');assert.equal(s.split('src="lab-reference.js').length,2);assert.ok(s.includes('lab-reference.css'))}
assert.ok(fs.readFileSync(__dirname+'/../exam-app.js','utf8').includes('data-lab-open'));
// US/SI changes units without losing the chosen category or search.
tabs.children[0].onclick();search.value='Креатинин';search.events.input();
unitButton.onclick();assert.equal(results.children[0].children[1].children[0].children[1].textContent,'53–106 мкмоль/л');
search.value='';search.events.input();formulaButton.onclick();assert.equal(results.children.length,3);
let form=results.children[0].children.find(e=>e.className==='lab-calc');
form.children[0].children[0].value='140';form.children[1].children[0].value='104';form.children[2].children[0].value='24';form.onsubmit({preventDefault(){}});assert.equal(form.children.at(-1).textContent,'12 ммоль/л');
form.children[0].children[0].value='';form.onsubmit({preventDefault(){}});assert.ok(form.children.at(-1).textContent.includes('Введите'));
// Desktop is non-modal, and resizing back to mobile restores a modal.
media.matches=true;events.click({target:{closest:()=>origin}});assert.equal(dialog.modal,false);
blocked=false;events.keydown({target:origin,stopImmediatePropagation(){blocked=true}});assert.equal(blocked,false);
blocked=false;events.keydown({target:search,stopImmediatePropagation(){blocked=true}});assert.equal(blocked,true);
media.matches=false;media.change();assert.equal(dialog.modal,true);dialog.close();
const calc=require('../lab-calculations.js').calculate;
assert.equal(calc('winter',{hco:12},'US'),'24–28 мм рт. ст.');assert.equal(calc('winter',{hco:12},'SI'),'3.2–3.7 кПа');
assert.equal(calc('osm',{na:140,glucose:90,urea:14},'US'),'290 мОсм/кг');assert.equal(calc('osm',{na:140,glucose:5,urea:5},'SI'),'290 мОсм/кг');
console.log('PASS lab reference: 92 entries, Russian/English search, categories, empty state, modal focus, shortcut isolation, all-page integration');

// Exam context exposes formulas but no calculator fields.
document.getElementById=()=>({});
vm.runInNewContext(fs.readFileSync(__dirname+'/../lab-reference.js','utf8'),{document,window:{matchMedia:()=>media}});
events.click({target:{closest:()=>origin}});formulaButton.onclick();assert.equal(results.children.length,3);assert.ok(results.children.every(s=>!s.children.some(e=>e.className==='lab-calc')));dialog.close();
console.log('PASS units, dock/resize, formula results, validation, exam calculator exclusion');
