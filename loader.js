(function(){
'use strict';
const url=document.currentScript.dataset.app;
const app=document.getElementById('app');app.textContent='正在读取本机存档…';
function launch(){
 const script=document.createElement('script');script.src=url;
 script.onerror=()=>{app.textContent='游戏界面暂时未能加载，请刷新重试。原存档仍保留在本机。';};
 document.body.appendChild(script);
}
window.VCStore.ready.then(launch,error=>{window.VCStoreReadError=error;launch();});
})();
