/* ============
   Main JS
   ============ */

/* Section Switcher + VFX card anim + auto-pause on Contact */
function openSection(id){
  // hide all sections
  document.querySelectorAll('.section').forEach(sec=>{
    sec.classList.add('hidden');
  });

  const target = document.getElementById(id);
  if(!target) return;

  // reveal the section element (so scroll observer can work)
  target.classList.remove('hidden');

  // scroll a bit above the section
  window.scrollTo({ top: target.offsetTop - 50, behavior:'smooth' });

  // If opening VFX, animate YT card
  if(id === 'vfx'){
    const ytCard = document.getElementById('yt-stats');
    if(ytCard && !ytCard.classList.contains('show')){
      // ensure visible state
      ytCard.classList.add('show');
      setTimeout(()=> ytCard.classList.add('pulse'), 700);
    }
  }

  // Auto-pause music when opening contact
  if(id === 'contact'){
    if(typeof music !== 'undefined' && !music.paused){
      music.pause();
      playing = false;
      const audioIcon = document.getElementById('audio-icon');
      if(audioIcon) audioIcon.textContent = '🔇';
    }
  } else {
    // resume music if previously playing
    if(typeof music !== 'undefined' && !playing){
      // do not force play if user explicitly turned it off earlier
      // we only resume if we set playing=true previously (simple approach)
      // here we choose to not auto-play to avoid intrusive behavior
    }
  }
}

/* ===== Music control + volume UI ===== */
let music = new Audio("https://andz7z.github.io/song.mp3");
music.loop = true;
music.volume = 0;
let playing = false;

const volumeSlider = document.getElementById('volume-slider');

function fadeInMusic(){
  let vol = 0;
  const interval = setInterval(()=>{
    vol += 0.004;
    if(vol >= 0.2){ vol = 0.2; clearInterval(interval); }
    music.volume = vol;
    if(volumeSlider) volumeSlider.value = vol;
    const valEl = document.getElementById('volume-value');
    const barEl = document.getElementById('volume-bar');
    if(valEl) valEl.textContent = Math.round(vol * 100) + '%';
    if(barEl) barEl.style.width = Math.round(vol * 100) + '%';
  }, 100);
}

function toggleMusic(){
  playing = !playing;
  const audioIcon = document.getElementById('audio-icon');
  if(playing){
    music.play().catch(()=>{/* autoplay may be blocked */});
    if(audioIcon) audioIcon.textContent = '🔊';
  } else {
    music.pause();
    if(audioIcon) audioIcon.textContent = '🔇';
  }
}

// on volume slider input
if(volumeSlider){
  volumeSlider.addEventListener('input', e=>{
    const v = parseFloat(e.target.value);
    music.volume = v;
    const valEl = document.getElementById('volume-value');
    const barEl = document.getElementById('volume-bar');
    if(valEl) valEl.textContent = Math.round(v * 100) + '%';
    if(barEl) barEl.style.width = Math.round(v * 100) + '%';
  });
}

/* ===== Title animation / menu reveal and loaded state ===== */
const title = document.getElementById('main-title');
const nav = document.querySelector('.nav-buttons');
let moved = false;

title.addEventListener('mouseenter', ()=>{
  if(!moved){
    title.classList.add('move-up');
    nav.classList.remove('hidden');
    setTimeout(()=> nav.classList.add('show-buttons'), 200);
    moved = true;
  }
});

/* Make title clickable after initial load */
window.addEventListener('load', ()=>{
  // hide preloader
  const pre = document.getElementById('preloader');
  if(pre){
    pre.style.transition = 'opacity 450ms ease';
    pre.style.opacity = '0';
    setTimeout(()=> pre.remove(), 550);
  }

  // make sure body has loaded class for pointer events if needed
  document.body.classList.add('loaded');

  // attempt autoplay and fade in music
  music.play().catch(()=>{/* autoplay may be blocked until interaction */});
  fadeInMusic();
  playing = true;
  const audioIcon = document.getElementById('audio-icon');
  if(audioIcon) audioIcon.textContent = '🔊';

  // Fetch YouTube stats after load
  fetchYouTubeStats();
});

/* ===== Particles (unchanged) ===== */
const canvas = document.getElementById('particle-canvas');
let ctx = null;
let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

if(canvas){
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', ()=>{ canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
  window.addEventListener('mousemove', e=>{ mouse.x = e.clientX; mouse.y = e.clientY; for(let i=0;i<2;i++) particles.push(new Particle()); });
}

class Particle {
  constructor(){ this.x = mouse.x; this.y = mouse.y; this.size = Math.random()*3+1; this.speedX = (Math.random()*2)-1; this.speedY = (Math.random()*2)-1; this.alpha = 1; }
  update(){ this.x += this.speedX; this.y += this.speedY; this.alpha -= 0.02; }
  draw(){ if(!ctx) return; ctx.fillStyle = `rgba(255,255,255,${this.alpha})`; ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); }
}

function animateParticles(){
  if(!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach((p,i)=>{ p.update(); p.draw(); if(p.alpha <= 0) particles.splice(i,1); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== Scroll-to-reveal using IntersectionObserver ===== */
const ioOptions = { root: null, rootMargin: '0px', threshold: 0.18 };
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      // Optionally unobserve to avoid toggling back
      observer.unobserve(entry.target);
    }
  });
}, ioOptions);

// Observe all sections that are not hidden at start
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.section').forEach(sec=>{
    // If it's not hidden, observe it; if hidden initially, observe when it gets shown (openSection handles)
    observer.observe(sec);
  });
});

/* ===== YouTube Live Stats (client-side) ===== */
/* NOTE: Replace placeholder with your API key here or use server proxy.
   const YT_API_KEY = "AIza...."; */
const YT_API_KEY = "AIzaSyAjTe6m1s7rgwd2ow9IGe_21B0dai_mMYE";
const CHANNEL_ID = "UCZrfo91OFER6U2H5UihLwiA";

async function fetchYouTubeStats(){
  const nameEl = document.getElementById('yt-name');
  try {
    if(!YT_API_KEY || YT_API_KEY === "YOUR_API_KEY_HERE"){
      // demo fallback values (for design)
      if(nameEl) nameEl.textContent = "andz79 (demo)";
      document.getElementById('yt-subscribers').textContent = '175';
      document.getElementById('yt-videos').textContent = '4';
      document.getElementById('yt-views').textContent = '23,000';
      return;
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${YT_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if(!data || !data.items || data.items.length === 0) throw new Error('No channel data');

    const channel = data.items[0];
    const thumbUrl = (channel.snippet.thumbnails && (channel.snippet.thumbnails.high || channel.snippet.thumbnails.default)) ? (channel.snippet.thumbnails.high.url || channel.snippet.thumbnails.default.url) : '';
    if(thumbUrl) document.getElementById('yt-thumbnail').src = thumbUrl;
    if(nameEl) nameEl.textContent = channel.snippet.title || 'Channel';
    document.getElementById('yt-subscribers').textContent = Number(channel.statistics.subscriberCount || 0).toLocaleString();
    document.getElementById('yt-videos').textContent = Number(channel.statistics.videoCount || 0).toLocaleString();
    document.getElementById('yt-views').textContent = Number(channel.statistics.viewCount || 0).toLocaleString();
  } catch(err){
    console.error('YouTube API error', err);
    if(nameEl) nameEl.textContent = "Unable to load stats";
    // fallback demo
    document.getElementById('yt-subscribers').textContent = '175';
    document.getElementById('yt-videos').textContent = '4';
    document.getElementById('yt-views').textContent = '23,000';
  }
}

/* ===== Accessibility: keyboard open sections (optional small enhancement) ===== */
document.addEventListener('keydown', (e)=>{
  if(e.key === '1') openSection('vfx');
  if(e.key === '2') openSection('lua');
  if(e.key === '3') openSection('work');
  if(e.key === '4') openSection('contact');
});

/* End of script.js */
