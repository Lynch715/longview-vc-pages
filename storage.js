(function(root){
'use strict';
const KEY='longview-vc-save-v1';
function createStorage(env){
 const cache=new Map();let opening,queue=Promise.resolve();
 function open(){
  if(!env.indexedDB)return Promise.resolve(null);
  if(!opening)opening=new Promise((resolve,reject)=>{
   const request=env.indexedDB.open('longview-vc-local',1);
   request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('records'))db.createObjectStore('records');};
   request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve(db);};
   request.onerror=()=>reject(request.error||Error('无法打开存档库'));
   request.onblocked=()=>reject(Error('请先关闭其他游戏标签页，再重试读取存档'));
  });
  return opening;
 }
 async function read(key){
  await queue.catch(()=>{});const db=await open();let raw;
  if(db)raw=await new Promise((resolve,reject)=>{
   const tx=db.transaction('records','readonly'),request=tx.objectStore('records').get(key);
   request.onsuccess=()=>{raw=request.result;};
   tx.oncomplete=()=>resolve(raw);tx.onabort=()=>reject(tx.error||Error('读取存档失败'));tx.onerror=()=>{};
  });
  if(raw===undefined)raw=env.localStorage.getItem(key);
  cache.set(key,raw??null);return raw??null;
 }
 function write(key,raw,once=false){
  if(typeof raw!=='string')throw Error('存档必须是完整文本');
  const next=queue.catch(()=>{}).then(async()=>{
   const db=await open();
   if(db)await new Promise((resolve,reject)=>{
    const tx=db.transaction('records','readwrite'),store=tx.objectStore('records');let conflict=false;
    if(once){const request=store.get(key);request.onsuccess=()=>{if(request.result!==undefined&&request.result!==raw){conflict=true;tx.abort();}else if(request.result===undefined)store.put(raw,key);};}
    else store.put(raw,key);
    tx.oncomplete=resolve;tx.onabort=()=>reject(conflict?Error('已有不同的档案备份，原件已保留'):tx.error||Error('存档未能写入'));tx.onerror=()=>{};
   });
   else{
    const previous=env.localStorage.getItem(key);if(once&&previous&&previous!==raw)throw Error('已有不同的档案备份，原件已保留');
    if(!once||!previous)env.localStorage.setItem(key,raw);
    if(env.localStorage.getItem(key)!==raw)throw Error('存档未能写入');
   }
   cache.set(key,raw);return true;
  });
  queue=next;return next;
 }
 async function init(){
  const raw=await read(KEY);
  // Preserve an old-format original before app.js performs any migration.
  if(raw){let parsed,version;try{parsed=JSON.parse(raw);version=parsed.version;}catch{return;}
   if(Number.isInteger(version)&&version>=1&&version<10){const key=KEY+'-v'+version+'-backup';if(!await read(key))await write(key,raw,true);}
   if(env.VC&&!env.VC.isContinuous(parsed)&&env.VC.valid(parsed)){const key=env.VC.campaignBackupKey(raw),existing=await read(key);if(existing&&existing!==raw)throw Error('接续前原件备份冲突');if(!existing)await write(key,raw,true);}
  }
 }
 return {init,read,getItem:key=>cache.has(key)?cache.get(key):env.localStorage.getItem(key),setItem:(key,raw)=>write(key,raw),writeOnce:(key,raw)=>write(key,raw,true),flush:()=>queue};
}
if(typeof module!=='undefined'&&module.exports)module.exports=createStorage;
else{root.VCStore=createStorage(root);root.VCStore.ready=root.VCStore.init();}
})(typeof window!=='undefined'?window:globalThis);
