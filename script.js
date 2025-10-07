/* ========== Basic helpers & DOM ========== */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* --- Intro cinematic --- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const intro = $('#intro');
    if (!intro) return;
    intro.style.transition = 'opacity 700ms ease, transform 700ms ease';
    intro.style.opacity = 0;
    intro.style.transform = 'scale(0.98)';
    setTimeout(()=> intro.remove(), 750);
  }, 2000); // 2s intro then fade
});

/* --- Theme toggle (dark <-> ice) --- */
const themeToggle = $('#theme-toggle');
themeToggle.addEventListener('click', () => {
  const body = document.body;
  const current = body.getAttribute('data-theme');
  const next = current === 'dark' ? 'ice' : 'dark';
  body.setAttribute('data-theme', next);
  // small icon flip
  themeToggle.textContent = next === 'dark' ? '❄️' : '🌙';
});

/* --- Sections nav --- */
$$('.nav-buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    $$('.panel').forEach(p => p.classList.add('hidden'));
    const el = document.getElementById(target);
    if (el) el.classList.remove('hidden');
    window.scrollTo({ top: (el ? el.offsetTop - 60 : 0), behavior: 'smooth' });
  });
});

/* open default hero visible (already visible) */

/* --- Parallax hover on cards (3D subtle) --- */
$$('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height;
    const rotY = (x - 0.5) * 10; // degrees
    const rotX = (0.5 - y) * 6;
    card.style.transform = `perspective(800px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ========== Particles (very light) ========== */
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  pCanvas.width = innerWidth;
  pCanvas.height = innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
  // push small number of particles
  for (let i=0;i<2;i++){
    particles.push({
      x: e.clientX + (Math.random()-0.5)*30,
      y: e.clientY + (Math.random()-0.5)*30,
      vx: (Math.random()-0.5)*0.6,
      vy: (Math.random()-0.3)*0.6,
      life: 1.0,
      size: 1 + Math.random()*2
    });
  }
});

function renderParticles(){
  pCtx.clearRect(0,0,pCanvas.width,pCanvas.height);
  for (let i = particles.length - 1; i >= 0; i--){
    const pt = particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy
