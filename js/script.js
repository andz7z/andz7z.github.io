// script.js — global behaviors
document.addEventListener('DOMContentLoaded', () => {
  const scrollArrow = document.getElementById('scrollArrow');
  const backHome = document.getElementById('backHome');
  const socialsLeft = document.querySelector('.social-vertical.left');
  const socialsRight = document.querySelector('.social-vertical.right');
  const homeSection = document.getElementById('home');

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-link, .scroll-arrow, #exploreBtn').forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      let href = el.getAttribute('href') || '#about';
      const target = document.querySelector(href);
      if(target){
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Show back-home after leaving home
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        // in home
        socialsLeft?.classList.remove('hidden');
        socialsRight?.classList.remove('hidden');
        backHome.classList.remove('show');
      } else {
        socialsLeft?.classList.add('hidden');
        socialsRight?.classList.add('hidden');
        backHome.classList.add('show');
      }
    });
  }, {threshold: 0.2});
  observer.observe(homeSection);

  backHome.addEventListener('click', ()=>{ document.getElementById('home').scrollIntoView({behavior:'smooth'}); });

  // small if reduced motion
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(mq && mq.matches){
    document.querySelectorAll('*').forEach(n=>n.style.animation = 'none');
  }
});
