echo // script.js
(function(){
  const bg = document.getElementById('bg');
  const turbulence = document.getElementById('turbulence');
  const displacement = document.getElementById('displacement');

  const cfg = {
    maxScale: 18,
    baseFrequencyMax: 0.03,
    baseFrequencyMin: 0.0001,
    parallaxAmount: 18,
    returnDuration: 900,
    mouseMoveSmoothing: 0.12
  }

  let targetScale = 0;
  let currentScale = 0;
  let targetBaseFreq = cfg.baseFrequencyMin;
  let currentBaseFreq = cfg.baseFrequencyMin;
  let lastMouse = {x:0,y:0};

  function norm(x, max){ return (x / max) * 2 - 1 }

  function onMove(e){
    const w = innerWidth, h = innerHeight;
    const mx = e.clientX || (e.touches && e.touches[0].clientX);
    const my = e.clientY || (e.touches && e.touches[0].clientY);
    const dx = mx - lastMouse.x;
    const dy = my - lastMouse.y;
    const mag = Math.sqrt(dx*dx + dy*dy);
    targetScale = Math.min(cfg.maxScale, mag * 0.6);
    targetBaseFreq = Math.min(cfg.baseFrequencyMax, cfg.baseFrequencyMin + (targetScale / cfg.maxScale) * cfg.baseFrequencyMax);
    const px = Math.round(50 + norm(mx,w) * cfg.parallaxAmount);
    const py = Math.round(50 + norm(my,h) * cfg.parallaxAmount);
    bg.style.backgroundPosition = `${px}% ${py}%`;
    lastMouse = {x:mx,y:my};
  }

  function onLeave(){
    targetScale = 0;
    targetBaseFreq = cfg.baseFrequencyMin;
    bg.style.transition = `background-position ${cfg.returnDuration}ms cubic-bezier(.2,.9,.2,1)`;
    bg.style.backgroundPosition = `50% 50%`;
  }

  function tick(){
    currentScale += (targetScale - currentScale) * cfg.mouseMoveSmoothing;
    currentBaseFreq += (targetBaseFreq - currentBaseFreq) * cfg.mouseMoveSmoothing;
    displacement.setAttribute('scale', currentScale);
    turbulence.setAttribute('baseFrequency', `${currentBaseFreq} ${currentBaseFreq}`);
    const s = 1 + currentScale * 0.0027;
    bg.style.transform = `scale(${s})`;
    requestAnimationFrame(tick);
  }

  tick();
  addEventListener('mousemove', onMove, {passive:true});
  addEventListener('mouseleave', onLeave);
})(); > script.js
