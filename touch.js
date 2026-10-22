'use strict';
// Preserve one-finger scrolling and controls; suppress only multi-touch zoom.
for(const type of ['touchstart','touchmove'])document.addEventListener(type,e=>{if(e.touches?.length>1)e.preventDefault();},{passive:false});
for(const type of ['gesturestart','gesturechange','gestureend'])document.addEventListener(type,e=>e.preventDefault(),{passive:false});
