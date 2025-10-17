
// Loader -> show main
const loader = document.getElementById('loader');
const main = document.getElementById('main');
const words = document.querySelectorAll('.word');
const phone = document.getElementById('phone');

// show words sequentially
function revealWords(){
  words.forEach((w,i)=>{
    setTimeout(()=>{
      w.style.opacity='1';
      w.style.transform='translateY(0)';
    }, 700 + i*900);
  });
}

// fade loader and show main scene
window.addEventListener('load', ()=>{
  setTimeout(()=>{
    if(loader){
      loader.style.opacity='0';
      loader.style.transform='scale(0.98) translateY(-10px)';
      loader.style.filter='blur(6px)';
      setTimeout(()=>{ loader.remove(); }, 700);
    }
    // reveal main
    if(main){
      main.classList.remove('hidden-scene');
      main.style.opacity='1';
      main.style.visibility='visible';
      // animate phone in a bit later
      setTimeout(()=>{ phone.style.opacity='1'; phone.style.transform='translateX(0) rotateY(-18deg) rotateX(0deg)'; }, 1200);
      revealWords();
    }
  }, 3000);
});

// slogan hover 3D follow
(function(){
  const wrap = document.querySelector('.slogan-wrap');
  const slogan = document.querySelector('.slogan');
  if(!wrap) return;
  wrap.addEventListener('mousemove', (e)=>{
    const r = wrap.getBoundingClientRect();
    const cx = r.left + r.width/2; const cy = r.top + r.height/2;
    const dx = e.clientX - cx; const dy = e.clientY - cy;
    const rx = (dy / (r.height/2)) * -6; const ry = (dx / (r.width/2)) * 8;
    slogan.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  });
  wrap.addEventListener('mouseleave', ()=>{ slogan.style.transform='perspective(900px) rotateY(10deg) rotateX(-6deg)'; });
})();

// stars canvas natural flicker + drift + repel
(function(){
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth, h = canvas.height = innerHeight;
  window.addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; initStars(); });

  let stars = [];
  function initStars(){
    stars = [];
    const count = Math.floor((w*h)/9000);
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        ox: 0, oy:0,
        r: Math.random()*1.6 + 0.5,
        base: Math.random()*0.8 + 0.2,
        phase: Math.random()*Math.PI*2,
        vx: (Math.random()-0.5)*0.2,
        vy: (Math.random()-0.5)*0.2
      });
      stars[i].ox = stars[i].x; stars[i].oy = stars[i].y;
    }
  }
  initStars();

  let mouse = {x:-9999,y:-9999};
  window.addEventListener('mousemove', e=>{ mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', ()=>{ mouse.x = -9999; mouse.y = -9999; });

  function draw(t){
    ctx.clearRect(0,0,w,h);
    for(let s of stars){
      // gentle drift
      s.x += s.vx; s.y += s.vy;
      // natural smooth flicker using phase
      s.phase += 0.01;
      const flick = 0.7 + 0.3 * Math.sin(s.phase);
      // repel from mouse but keep near origin
      const dx = s.x - mouse.x, dy = s.y - mouse.y, d = Math.sqrt(dx*dx+dy*dy);
      if(d < 140){
        const f = (140 - d)/140;
        s.x += (dx/d||0) * f * 1.2; s.y += (dy/d||0) * f * 1.2;
      } else {
        // relax slowly towards original
        s.x += (s.ox - s.x) * 0.002; s.y += (s.oy - s.y) * 0.002;
      }
      // boundary wrap
      if(s.x < 0) s.x = w; if(s.x > w) s.x = 0;
      if(s.y < 0) s.y = h; if(s.y > h) s.y = 0;
      // draw
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, s.base * flick)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
