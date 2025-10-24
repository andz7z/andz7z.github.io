// home.js — home-specific animations, parallax, nav icon interactions
document.addEventListener('DOMContentLoaded', ()=>{
  const navIcons = Array.from(document.querySelectorAll('.nav-icon'));
  navIcons.forEach((n, i)=> n.classList.add('delay-'+(i)));
  // show home background with delay
  const bg = document.getElementById('home-bg');
  setTimeout(()=> bg && bg.classList.add('in-view'), 120);

  // nav icon ripple + pulse on click
  document.querySelectorAll('.nav-icon').forEach(a=>{
    a.classList.add('ripple');
    a.addEventListener('click', (ev)=>{
      // short pulse
      a.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:280,easing:'ease-out'});
    });
  });

  // social hover zoom/glow
  document.querySelectorAll('.social__link').forEach(s=>{
    s.addEventListener('mouseenter', ()=> s.style.transform='translateY(-2px) scale(1.02)');
    s.addEventListener('mouseleave', ()=> s.style.transform='translateY(0) scale(1)');
  });

  // small parallax based on mouse movement (only desktop)
  const home = document.getElementById('home');
  if(home && window.innerWidth>900){
    home.addEventListener('mousemove', (e)=>{
      const x = (e.clientX / window.innerWidth - 0.5) * 8; // -4 .. 4
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      const bgEl = document.getElementById('home-bg');
      if(bgEl) bgEl.style.transform = `translate(${x}px,${y}px) scale(1.02)`;
    });
    home.addEventListener('mouseleave', ()=>{
      const bgEl = document.getElementById('home-bg');
      if(bgEl) bgEl.style.transform = 'translate(0,0) scale(1.02)';
    });
  }

  // Mobile menu interactions
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  burger && burger.addEventListener('click', ()=>{
    if(mobileMenu) {
      mobileMenu.hidden = false;
      // animate items in
      setTimeout(()=>{
        document.querySelectorAll('.mobile-list a').forEach((el, idx)=>{
          el.style.opacity=1; el.style.transform='translateX(0)'; el.style.transitionDelay=(idx*80)+'ms';
        });
      },60);
    }
  });
  mobileClose && mobileClose.addEventListener('click', ()=> mobileMenu.hidden = true);
  // close when clicking outside inner
  mobileMenu && mobileMenu.addEventListener('click', (e)=>{ if(e.target===mobileMenu) mobileMenu.hidden = true });

  // Show/hide nav icons on scroll — handled in global script but add small transition here
  window.addEventListener('scroll', ()=>{
    const nav = document.getElementById('nav-icons');
    if(!nav) return;
    const y = window.scrollY;
    if(y>60) nav.style.opacity='0'; else nav.style.opacity='1';
  });
});
