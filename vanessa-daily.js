(function(root){
  'use strict';
  const prefix='uworld_vanessa_daily_v1:';
  const day=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const scope=owner=>prefix+encodeURIComponent(owner||'guest')+':';
  const valid=n=>Number.isInteger(n)&&n>=1&&n<=280;
  function read(storage,owner,date=new Date()){
    const base=scope(owner),start=base+day(date)+':q:';
    const n=Number(storage.getItem(base+'target'));let count=0;
    for(let i=0;i<storage.length;i++)if(storage.key(i)?.startsWith(start))count++;
    return {day:day(date),target:valid(n)?n:20,count};
  }
  function record(storage,owner,ids,date=new Date()){
    const start=scope(owner)+day(date)+':q:';
    for(const id of new Set(ids.filter(id=>typeof id==='string'&&id))){const key=start+encodeURIComponent(id);if(storage.getItem(key)!=='1')storage.setItem(key,'1');}
    return read(storage,owner,date);
  }
  function target(storage,owner,n){if(!valid(n))return false;storage.setItem(scope(owner)+'target',String(n));return true;}
  const api={day,read,record,target};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.VanessaDaily=api;
})(typeof window==='object'?window:globalThis);
