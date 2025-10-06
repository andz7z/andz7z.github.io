/* PORTFOLIO JS
   - panel switching
   - tsParticles smoke/ice effect config
   - custom cursor
   - ambient sound toggle
   - subtle GSAP entrance animations
*/

// ---------- helpers ----------
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// year
document.getElementById('year').textContent = new Date().getFullYear();

// panel nav
$$('.btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const t = btn.dataset.target;
    switchPanel(t);
  });
});
function switchPanel(id){
  // hide all panels
  $$('.panel').forEach(p=>p.classList.remove('active'));
  // if id exists show, otherwise show hero
  const target = document.getElementById(id) || $('#hero');
  target.classList.add('active');

  // small gsap pulse when switching
  gsap.fromTo(target, {opacity:0, y:12}, {opacity:1, y:0, duration:0.6, ease:'power2.out'});
}

// initial
switchPanel('hero');


// ---------- tsParticles (smoke + ice particulate) ----------
window.addEventListener('DOMContentLoaded', async () => {
  // config: slow drifting gray particles to mimic smoke + tiny bright particles for icy sparkles
  tsParticles.load("tsparticles", {
    fpsLimit: 60,
    detectRetina: true,
    background: { opacity: 0 },
    particles: {
      number: { value: 40, density: { enable: true, area: 800 } },
      color: { value: ["#cbeef3", "#ffffff", "#8ff0ff", "#bfc6cc"] },
      shape: { type: "circle" },
      opacity: {
        value: 0.06,
        random: { enable: true, minimumValue: 0.02 },
        animation: { enable: true, speed: 0.2, minimumValue: 0.02, sync: false }
      },
      size: {
        value: { min: 8, max: 60 },
        animation: { enable: true, speed: 2, minimumValue: 8, sync: false }
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
        trail: { enable: false }
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: { onHover: { enable: false }, onClick: { enable: false }, resize: true }
    }
  });

  // small sparkles overlay: add another emitter of tiny fast particles (ice glints)
  tsParticles.domItem(0).particles.array.push(); // no-op to ensure lib ready
});

// ---------- Cursor ----------
const cursor = $('#cursor');
const cursorInner = document.querySelector('.cursor-inner');
document.addEventListener('mousemove', (e) => {
  cursor.style.transform = translate3d(${e.clientX}px, ${e.clientY}px, 0);
});
$$('a, .btn, .card, .cta').forEach(el=>{
  el.addEventListener('mouseenter', ()=> {
    cursorInner.style.transform = 'translate(-50%,-50%) scale(1.9)';
    cursorInner.style.borderWidth = '1px';
  });
  el.addEventListener('mouseleave', ()=> {
    cursorInner.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorInner.style.borderWidth = '2px';
  });
});

// hide default cursor for big screens
if (window.matchMedia('(min-width:768px)').matches){
  document.documentElement.style.cursor = 'none';
}

// ---------- Ambient sound toggle ----------
const ambient = $('#ambient');
const soundToggle = $('#soundToggle');
let soundOn = false;
soundToggle.addEventListener('click', ()=>{
  soundOn = !soundOn;
  if(soundOn){
    ambient.volume = 0.25;
    ambient.play().catch(()=>{/* autoplay might be blocked on some browsers */});
    soundToggle.textContent = '🔈';
    soundToggle.setAttribute('aria-pressed','true');
  } else {
    ambient.pause();
    soundToggle.textContent = '🔊';
    soundToggle.setAttribute('aria-pressed','false');
  }
});

// ---------- small entrance GSAP for header/title ----------
gsap.from('.andz', {y:-10, opacity:0, duration:1.2, ease:'elastic.out(1,0.6)', delay:0.2});
gsap.from('.nav .btn', {y:8, opacity:0, duration:0.8, stagger:0.06, delay:0.5});
