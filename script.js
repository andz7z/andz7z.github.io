
// Loader hide + show main scene
(function(){
  const loader = document.getElementById('loader');
  const main = document.getElementById('main-scene');
  const phone = document.getElementById('phoneCard');
  const metal = document.getElementById('metalText');

  function readyShow(){
    main.classList.remove('hidden-scene');
    main.classList.add('scene-visible');
    setTimeout(()=>{
      phone.style.transform='translateX(0px)';
      phone.style.opacity='1';
    }, 220);
  }

  document.addEventListener('DOMContentLoaded', ()=>{ if(loader) loader.style.opacity='1'; });

  window.addEventListener('load', ()=>{
    setTimeout(()=>{
      if(loader){
        loader.style.transition='opacity 600ms ease, transform 600ms ease, filter 600ms ease';
        loader.style.opacity='0';
        loader.style.transform='scale(0.96) translateY(-8px)';
        loader.style.filter='blur(6px)';
        setTimeout(()=>{ loader.remove(); readyShow(); }, 700);
      } else {
        readyShow();
      }
    }, 3000);
  });

  // 3D hover tilt for metal text based on mouse pos
  (function(){
    const el = metal;
    if(!el) return;
    const boundArea = el.parentElement;
    const maxTilt = 12;
    boundArea.addEventListener('mousemove', (e)=>{
      const r = boundArea.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = (dy / (r.height/2)) * maxTilt;
      const ry = -(dx / (r.width/2)) * maxTilt;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    boundArea.addEventListener('mouseleave', ()=>{ el.style.transform='none'; });
  })();

  // Stars canvas with flee behavior
  (function(){
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    let w=canvas.width = innerWidth;
    let h=canvas.height = innerHeight;
    window.addEventListener('resize', ()=>{ w=canvas.width=innerWidth; h=canvas.height=innerHeight; });

    const stars = [];
    const STAR_COUNT = Math.floor((w*h)/7000);
    for(let i=0;i<STAR_COUNT;i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        ox:0, oy:0,
        r: Math.random()*1.6 + 0.6,
        baseAlpha: Math.random()*0.6 + 0.2,
        alpha: 0,
        flickerSpeed: Math.random()*0.02 + 0.005,
        vx: 0, vy: 0
      });
      stars[i].ox = stars[i].x; stars[i].oy = stars[i].y;
    }

    let mouse = {x:-9999,y:-9999};

    window.addEventListener('mousemove',(e)=>{ mouse.x=e.clientX; mouse.y=e.clientY; });
    window.addEventListener('mouseleave',()=>{ mouse.x=-9999; mouse.y=-9999; });

    function step(){
      ctx.clearRect(0,0,w,h);
      for(let s of stars){
        s.alpha += s.flickerSpeed * (Math.random()*1.2);
        if(s.alpha > 1) s.alpha = s.baseAlpha;
        // repulse
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 140){
          const force = (140 - dist)/140;
          s.vx += (dx/dist||0) * force * 1.6;
          s.vy += (dy/dist||0) * force * 1.6;
        } else {
          // ease back to origin slightly
          s.vx += (s.ox - s.x) * 0.002;
          s.vy += (s.oy - s.y) * 0.002;
          s.vx *= 0.96; s.vy *= 0.96;
        }
        s.x += s.vx * 0.6; s.y += s.vy * 0.6;
        // draw star
        const shimmer = 0.6 + Math.sin((performance.now()/500) + s.r)*0.5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0.06, s.baseAlpha * shimmer)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
        // occasional sparkle
        if(Math.random() < 0.0015){
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255,255,255,0.95)';
          ctx.arc(s.x + (Math.random()-0.5)*8, s.y + (Math.random()-0.5)*8, s.r*2.5, 0, Math.PI*2);
          ctx.fill();
        }
      }
      requestAnimationFrame(step);
    }
    step();
  })();

})();
