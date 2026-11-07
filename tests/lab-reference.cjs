const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function el(){return {children:[],attributes:{},events:{},value:'',textContent:'',append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.events[k]=f},focus(){this.focused=true}}}
const dialog=el(),search=el(),results=el(),tabs=el(),close=el(),count=el(),body=el(),events={};
dialog.querySelector=s=>({'input':search,'.lab-results':results,'.lab-tabs':tabs,'[data-lab-close]':close,'.lab-count':count}[s]);
dialog.showModal=()=>dialog.open=true;dialog.close=()=>{dialog.open=false;dialog.events.close()};
const document={body,createElement:tag=>tag==='dialog'?dialog:el(),addEventListener(k,f){events[k]=f}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../lab-reference.js','utf8'),{document});
const origin=el();origin.isConnected=true;events.click({target:{closest:()=>origin}});
assert.equal(dialog.open,true);assert.equal(count.textContent,'Показателей: 30');assert.equal(close.focused,true);
search.value='TSH';search.events.input();assert.equal(count.textContent,'Показателей: 1');assert.equal(results.children[0].children[0].textContent,'Гормоны');
search.value='калий';search.events.input();assert.equal(count.textContent,'Показателей: 1');
search.value='';tabs.children[1].onclick();assert.equal(count.textContent,'Показателей: 8');assert.equal(tabs.children[1].attributes['aria-pressed'],'true');
search.value='неттакого';search.events.input();assert.equal(results.children.length,0);assert.ok(count.textContent.includes('Ничего не найдено'));
let blocked=false;events.keydown({stopImmediatePropagation(){blocked=true}});assert.equal(blocked,true);
close.onclick();assert.equal(dialog.open,false);assert.equal(origin.focused,true);
blocked=false;events.keydown({stopImmediatePropagation(){blocked=true}});assert.equal(blocked,false);
for(const file of ['index.html','topics.html','exams.html']){const s=fs.readFileSync(__dirname+'/../'+file,'utf8');assert.equal(s.split('src="lab-reference.js').length,2);assert.ok(s.includes('lab-reference.css'))}
assert.ok(fs.readFileSync(__dirname+'/../exam-app.js','utf8').includes('data-lab-open'));
console.log('PASS lab reference: 30 entries, Russian/English search, categories, empty state, modal focus, shortcut isolation, all-page integration');
