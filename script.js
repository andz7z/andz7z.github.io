// --- Loader + sequence ---
const loader = document.getElementById('loader');
const main = document.getElementById('main-scene');
const header = document.getElementById('site-header');
const words = document.querySelectorAll('.word');
const phone = document.getElementById('phone');
const slogan = document.getElementById('slogan');
const sloganWrap = document.getElementById('slogan-wrap');

function revealWords(){
  words.forEach((w,i)=>{
    setTimeout(()=>{
      w.classList.add('metal');
      w.style.opacity='1';
      w.style.transform='translateY(0)';
    }, 600 + i*900);
  });
}

window.addEventListener('load', ()=>{
  // reset loader visible
  setTimeout(()=>{
    if(loader){
      loader.style.transition='opacity 700ms ease, transform 700ms ease, filter 700ms ease';
      loader.style.opacity='0';
      loader.style.transform='scale(0.98) translateY(-12px)';
      loader.style.filter='blur(6px)';
      setTimeout(()=>{ loader.remove(); }, 800);
    }
    // show main scene
    if(main){
      main.classList.remove('hidden-scene');
      main.classList.add('scene-visible');
      // reveal words
      revealWords();
      // phone animation after words start
      setTimeout(()=>{
        phone.style.opacity='1';
        phone.style.transform='translateX(0) rotateY(-18deg) rotateX(0deg)';
      }, 1600);
      // reveal header last
      setTimeout(()=>{
        header.classList.remove('hidden-header');
        header.classList.add('header-visible');
        header.setAttribute('aria-hidden','false');
      }, 2400);
    }
  }, 3000);
});

// slogan mouse follow - smooth return
(function(){
  if(!sloganWrap) return;
  let raf = null;
  let currentX=0, currentY=0, targetRX=10, targetRXcur=10, targetRY=-6, targetRYcur=-6;
  sloganWrap.addEventListener('mousemove', (e)=>{
    const r = sloganWrap.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / (r.width/2), dy = (e.clientY - cy) / (r.height/2);
    targetRY = dx * 10; targetRX = dy * -6;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>animateTilt());
  });
  sloganWrap.addEventListener('mouseleave', ()=>{
    targetRY = 10; targetRX = -6;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(()=>animateTilt());
  });
  function animateTilt(){
    targetRYcur += (targetRY - targetRYcur) * 0.12;
    targetRXcur += (targetRX - targetRXcur) * 0.12;
    slogan.style.transform = `perspective(900px) rotateX(${targetRXcur}deg) rotateY(${targetRYcur}deg)`;
    raf = requestAnimationFrame(animateTilt);
  }
})();

// Stars canvas - natural flicker + drift + repel
(function(){
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext && canvas.getContext('2d');
  if(!ctx) return;
  let w = canvas.width = innerWidth, h = canvas.height = innerHeight;
  window.addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; init(); });
  let stars = [];
  function init(){
    stars = [];
    const count = Math.floor((w*h)/9000);
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        ox: Math.random()*w,
        oy: Math.random()*h,
        r: Math.random()*1.6 + 0.5,
        base: Math.random()*0.8 + 0.2,
        phase: Math.random()*Math.PI*2,
        vx: (Math.random()-0.5)*0.25,
        vy: (Math.random()-0.5)*0.25
      });
    }
  }
  init();
  let mouse = {x:-9999,y:-9999};
  window.addEventListener('mousemove', e=>{ mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', ()=>{ mouse.x = -9999; mouse.y = -9999; });
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let s of stars){
      // gentle drift
      s.x += s.vx; s.y += s.vy;
      // natural flicker using smooth sinus phase (no abrupt fade)
      s.phase += 0.008;
      const flick = 0.85 + 0.25 * Math.sin(s.phase);
      // repel from mouse but gently
      const dx = s.x - mouse.x, dy = s.y - mouse.y, d = Math.sqrt(dx*dx+dy*dy);
      if(d < 160){
        const f = (160 - d)/160;
        s.x += (dx/d||0) * f * 1.2; s.y += (dy/d||0) * f * 1.2;
      } else {
        // relax towards original
        s.x += (s.ox - s.x) * 0.0015; s.y += (s.oy - s.y) * 0.0015;
      }
      // wrap boundaries
      if(s.x < -10) s.x = w+10; if(s.x > w+10) s.x = -10;
      if(s.y < -10) s.y = h+10; if(s.y > h+10) s.y = -10;
      // draw star
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, s.base * flick)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// header buttons smooth scroll to anchors (placeholders)
document.querySelectorAll('.button').forEach(btn=>{
  btn.addEventListener('click',(e)=>{
    const tgt = btn.getAttribute('data-target');
    if(!tgt) return;
    // smooth scroll placeholder - currently just log
    console.log('Navigate to', tgt);
  });
});

// ensure phone accessible on interaction
(function(){
  const p = document.getElementById('phone');
  if(!p) return;
  p.addEventListener('mouseenter', ()=> p.style.transform = 'translateX(0) rotateY(-22deg) rotateX(2deg)');
  p.addEventListener('mouseleave', ()=> p.style.transform = 'translateX(160px) rotateY(-20deg) rotateX(4deg)');
})();
