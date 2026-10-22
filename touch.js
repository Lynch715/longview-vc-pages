'use strict';
// Preserve one-finger scrolling and controls; suppress only multi-touch zoom.
for(const type of ['touchstart','touchmove'])document.addEventListener(type,e=>{if(e.touches?.length>1)e.preventDefault();},{passive:false});
for(const type of ['gesturestart','gesturechange','gestureend'])document.addEventListener(type,e=>e.preventDefault(),{passive:false});

// iOS keyboards can shrink only the visual viewport, while 100dvh stays unchanged.
let viewportFrame=0;
function syncGameViewport(){
 const root=document.documentElement,v=window.visualViewport;
 const height=Math.min(window.innerHeight,v?.height||window.innerHeight),top=v?.offsetTop||0;
 root.style.setProperty('--view-height',height+'px');root.style.setProperty('--view-top',top+'px');
 const field=document.activeElement,dialog=document.querySelector('dialog[open]');
 if(!dialog||!field||!dialog.contains(field)||!field.matches('input:not([type=file]),textarea,select'))return;
 const r=field.getBoundingClientRect(),d=dialog.getBoundingClientRect(),bar=dialog.querySelector('.dialog-bar');
 const safeTop=Math.max(d.top,bar?.getBoundingClientRect().bottom||d.top)+12,safeBottom=Math.min(d.bottom,top+height)-12;
 if(r.top<safeTop||r.bottom>safeBottom)field.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
}
function queueGameViewport(){cancelAnimationFrame(viewportFrame);viewportFrame=requestAnimationFrame(syncGameViewport);}
window.addEventListener('resize',queueGameViewport);
window.visualViewport?.addEventListener('resize',queueGameViewport);
window.visualViewport?.addEventListener('scroll',queueGameViewport);
document.addEventListener('focusin',queueGameViewport);
syncGameViewport();
