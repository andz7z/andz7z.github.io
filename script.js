// ---------- Basic helpers & initial state ----------
const sections = document.querySelectorAll('.section');
const audio = new Audio("https://andz7z.github.io/song.mp3");
audio.loop = true;
audio.volume = 0.4;
let playing = false;

// ---------- DOM elements ----------
const title = document.getElementById('main-title');
const nav = document.getElementById('main-nav');
const audioIcon = document.getElementById('audio-icon');
const volumeSlider = document.getElementById('volume-slider');
const themeToggle = document.getElementById('theme-toggle');
const particleCanvas = document.getElementById('particle-canvas');
const ctx = particleCanvas.getContext('2d');

// ---------- Section switcher ----------
function openSection(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.add('hidden'));
  const el = document.getElementById(id);
  if(el){
    el.classList.remove('hidden');
    window.scrollTo({ top: el.offsetTop - 40, behavior: 'smooth' });
  }
}

// ---------- Music controls ----------
function toggleMusic(){
  playing = !playing;
  audioIcon.textContent = playing ? '🔊' : '🔇';
  playing ? audio.play().catch(()=>{}) : audio.pause();
}
volumeSlider.addEventListener('input', e => { audio.volume = e.target.value; });

// ---------- Theme toggle ----------
function applyTheme(isLight){
  if(isLight) document.documentElement.classList.add('light');
  else document.documentElement.classList.remove('light');
  // small visual feedback
  themeToggle.style.transform = isLight ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)';
}
let light = false;
themeToggle.addEventListener('click', ()=>{
  light = !light;
  applyTheme(light);
});

// Initialize theme from localStorage if available
try{
  const saved = localStorage.getItem('andz-theme-light');
  if(saved !== null){ light = saved === '1'; applyTheme(light); }
  themeToggle.addEventListener('click', ()=> localStorage.setItem('andz-theme-light', light ? '1' : '0'));
}catch(e){}

/* ---------- Title hover behavior ----------
   - At page load title is outline-only
   - When hovering title: fill + glow + reveal nav
   - When leaving title: revert after small delay if mouse not over nav
*/
let navTimeout;
title.addEventListener('mouseenter', () => {
  title.classList.add('glow');
  nav.classList.add('show');
  nav.classList.remove('hidden');
  nav.setAttribute('aria-hidden','false');
  clearTimeout(navTimeout);
});
title.addEventListener('mouseleave', () => {
  navTimeout = setTimeout(()=> {
    if(!nav.matches(':hover')){
      title.classList.remove('glow');
      nav.classList.remove('show');
      nav.setAttribute('aria-hidden','true');
      // keep nav hidden to match requested behavior
      setTimeout(()=>nav.classList.add('hidden'), 300);
    }
  }, 350);
});
nav.addEventListener('mouseleave', () => {
  // hide if leaving nav
  navTimeout = setTimeout(()=> {
    title.classList.remove('glow');
    nav.classList.remove('show');
    nav.setAttribute('aria-hidden','true');
    setTimeout(()=>nav.classList.add('hidden'), 300);
  }, 250);
});
nav.addEventListener('mouseenter', ()=> clearTimeout(navTimeout));

// ---------- Particles / stars / smoke ----------
let w = particleCanvas.width = innerWidth;
let h = particleCanvas.height = innerHeight;
window.addEventListener('resize', ()=> { w = particleCanvas.width = innerWidth; h = particleCanvas.height = innerHeight; });

const mouse = { x: w/2, y: h/2 };
addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// Stars layer (background slow twinkle)
class Star {
  constructor(){
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.r = Math.random() * 1.2;
    this.a = Math.random() * 0.6 + 0.2;
    this.da = (Math.random() * 0.002) * (Math.random() < 0.5 ? 1 : -1);
  }
  update(){
    this.a += this.da;
    if(this.a <= 0.15 || this.a >= 0.9) this.da *= -1;
  }
  draw(){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${this.a})`;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
  }
}

const stars = Array.from({length: 120}, ()=> new Star());

// Mouse-trail particles (fades quickly)
let particles = [];
class Particle {
  constructor(){
    this.x = mouse.x + (Math.random()-0.5)*20;
    this.y = mouse.y + (Math.random()-0.5)*20;
    this.vx = (Math.random()-0.5) * 1.6;
    this.vy = (Math.random()-0.5) * 1.6;
    this.size = Math.random()*2.6 + 0.6;
    this.alpha = 0.95;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.02;
  }
  draw(){
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

// Slow drifting smoke using radial gradient overlay
function drawSmoke(){
  // subtle moving radial gradient
  const g = ctx.createRadialGradient(w*0.2, h*0.2, 10, w*0.5, h*0.5, Math.max(w,h));
  g.addColorStop(0, 'rgba(255,255,255,0.02)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);
}

function animate(){
  ctx.clearRect(0,0,w,h);

  // stars
  stars.forEach(s => { s.update(); s.draw(); });

  // smoke layer - very subtle
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  drawSmoke();
  ctx.restore();

  // mouse particles
  if(Math.random() < 0.8){
    particles.push(new Particle());
  }
  for(let i = particles.length -1; i >= 0; i--){
    const p = particles[i];
    p.update();
    p.draw();
    if(p.alpha <= 0.02) particles.splice(i,1);
  }

  requestAnimationFrame(animate);
}
animate();

// ---------- Channel preview demo (static fallback) ----------
function makePreviewHTML({thumb, title, videos, views, url}){
  return `
    <div class="channel-preview">
      <img src="${thumb}" alt="${title} thumbnail" />
      <div class="info">
        <h3>${title}</h3>
        <p>${videos} videos</p>
        <p>${Intl.NumberFormat().format(views)} views</p>
        <a href="${url}" target="_blank">Visit Channel</a>
      </div>
    </div>
  `;
}

// Demo data (replace with real API results if you integrate YouTube Data API)
const demoVfx = {
  thumb: 'https://i.imgur.com/1Q9Z1ZB.png',
  title: 'VISUALS',
  videos: 4,
  views: 3000000,
  url: 'https://www.youtube.com/@andz79'
};
const demoLua = {
  thumb: 'https://i.imgur.com/8u4f3pQ.png',
  title: 'VISUALS_MODS',
  videos: 12,
  views: 1250000,
  url: 'https://www.youtube.com/@visuals_mods'
};

document.addEventListener('DOMContentLoaded', ()=>{
  // populate demo previews
  const vfxWrap = document.getElementById('vfx-channel-preview');
  const luaWrap = document.getElementById('lua-channel-preview');
  if(vfxWrap) vfxWrap.innerHTML = makePreviewHTML(demoVfx);
  if(luaWrap) luaWrap.innerHTML = makePreviewHTML(demoLua);
});

// ---------- YouTube Data API Integration (optional) ----------
/*
To fetch real channel data:
1) Get an API Key from Google Cloud Console (YouTube Data API v3 enabled).
2) Use the channels endpoint:
   GET https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=CHANNEL_ID&key=API_KEY
3) Example implementation (CORS may apply):

async function fetchChannel(channelId, apiKey){
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
  const r = await fetch(url);
  const j = await r.json();
  if(j.items && j.items.length){
    const it = j.items[0];
    return {
      thumb: it.snippet.thumbnails.medium.url,
      title: it.snippet.title,
      videos: it.statistics.videoCount,
      views: it.statistics.viewCount,
      url: 'https://www.youtube.com/channel/' + it.id
    };
  }
  throw new Error('No channel');
}
Then render with makePreviewHTML.
*/

// ---------- Keyboard accessibility: open first section on Enter when title focused ----------
title.tabIndex = 0;
title.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === ' '){
    title.classList.add('glow');
    nav.classList.add('show');
    nav.classList.remove('hidden');
    nav.setAttribute('aria-hidden','false');
  }
});

// Prevent accidental text selection
title.addEventListener('selectstart', e => e.preventDefault());
