// script.js — global JS initializations and utilities
// Author: Generated template
document.addEventListener('DOMContentLoaded', () => {
  // Simple helpers
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Preloader animation: fake progress -> hide
  const pre = $('#preloader');
  if(pre){
    // animate bar and logo
    const bar = pre.querySelector('.preloader__bar span');
    const logo = pre.querySelector('.preloader__logo');
    requestAnimationFrame(()=>{ logo.style.opacity=1; logo.style.transform='translateY(0)'; bar.style.width='72%'; });
    window.addEventListener('load', ()=>{
      bar.style.width='100%';
      setTimeout(()=>{ pre.style.opacity=0; pre.style.pointerEvents='none'; pre.style.transition='opacity 500ms ease'; setTimeout(()=>pre.remove(),700) }, 700);
    });
  }

  // IntersectionObserver for reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('in-view');
    });
  }, {threshold:0.18});

  // Observe section titles and fade-up elements
  $$('.section__title').forEach(el=>io.observe(el));
  $$('.fade-up').forEach(el=>io.observe(el));

  // scroll to sections smoothly for anchor links
  document.addEventListener('click', (ev)=>{
    const a = ev.target.closest('a[href^="#"]');
    if(a){
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if(target){ ev.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    }
  });

  // show/hide to-top when not in home
  const home = $('#home');
  const toTop = $('#to-top');
  const navIcons = $('#nav-icons');
  const obsTop = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting){ // left home
        if(navIcons) navIcons.style.opacity='0';
        if(toTop) toTop.hidden=false;
      } else {
        if(navIcons) navIcons.style.opacity='1';
        if(toTop) toTop.hidden=true;
      }
    })
  }, {threshold:0.6});
  if(home) obsTop.observe(home);

  if(toTop) toTop.addEventListener('click', ()=>{
    home.scrollIntoView({behavior:'smooth'});
  });

  // small helper: add ripple on click for elements with .ripple
  document.addEventListener('click', (ev)=>{
    const r = ev.target.closest('.ripple');
    if(!r) return;
    const rect = r.getBoundingClientRect();
    let circle = document.createElement('span');
    circle.style.position='absolute';
    circle.style.left=(ev.clientX - rect.left) + 'px';
    circle.style.top=(ev.clientY - rect.top) + 'px';
    circle.style.width='12px'; circle.style.height='12px'; circle.style.borderRadius='50%';
    circle.style.transform='translate(-50%,-50%) scale(0)';
    circle.style.background='rgba(255,255,255,0.12)';
    circle.style.opacity='0.9';
    circle.style.transition='transform 480ms ease, opacity 480ms ease';
    r.appendChild(circle);
    requestAnimationFrame(()=>circle.style.transform='translate(-50%,-50%) scale(18)');
    setTimeout(()=>{ circle.style.opacity='0'; setTimeout(()=>circle.remove(),520) },520);
  });

  // Accessibility: escape closes mobile menu
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape'){
      const mm = document.getElementById('mobile-menu');
      if(mm && !mm.hidden) mm.hidden = true;
    }
  });
});
