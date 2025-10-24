// home.js — homepage specific interactions
// small extra animation for title
document.addEventListener('DOMContentLoaded', ()=>{
  const title = document.querySelector('.andz-title');
  if(title){
    title.animate([{opacity:0, transform:'translateY(8px) scale(.98)'},{opacity:1, transform:'translateY(0) scale(1)'}], {duration:900, easing:'cubic-bezier(.22,.8,.36,1)', fill:'forwards'});
  }
});
