// ======== Section Switcher ========
function openSection(id){
    document.querySelectorAll('.section').forEach(sec=>sec.classList.add('hidden'));
    const target = document.getElementById(id);
    if(!target) return;
    target.classList.remove('hidden');

    // Smooth scroll a little above the section
    window.scrollTo({ top: target.offsetTop - 50, behavior:'smooth' });

    // If opening VFX, show YouTube card with animation
if(id === 'vfx') {
  const ytCard = document.getElementById('yt-stats');
  if(ytCard && !ytCard.classList.contains('show')){
    ytCard.classList.add('show');
    setTimeout(()=> ytCard.classList.add('pulse'), 700);
  }
}
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  music.play().catch(()=>{});
  fadeInMusic();
  playing = true;
  document.getElementById('audio-icon').textContent = '🔊';
});
// ======== Music Control ========
let music = new Audio("https://andz7z.github.io/song.mp3");
music.loop = true; music.volume = 0;
let playing=false;

const volumeSlider = document.getElementById('volume-slider');

function fadeInMusic(){
    let vol = 0;
    const interval = setInterval(()=>{
        vol+=0.004;
        if(vol>=0.2){ vol=0.2; clearInterval(interval); }
        music.volume=vol;
        if(volumeSlider) volumeSlider.value=vol;
        const valEl = document.getElementById('volume-value');
        if(valEl) valEl.textContent = Math.round(vol * 100) + '%';
    },100);
}

function toggleMusic(){
    playing = !playing;
    document.getElementById('audio-icon').textContent = playing?'🔊':'🔇';
    playing? music.play():music.pause();
}

window.addEventListener('load',()=>{
    // Autoplay attempt
    music.play().catch(()=>{/* autoplay may be blocked until user interacts */});
    fadeInMusic();
    playing=true;
    document.getElementById('audio-icon').textContent='🔊';
});

// Slider
if(volumeSlider){
  volumeSlider.addEventListener('input', e => {
    music.volume = e.target.value;
    document.getElementById('volume-value').textContent = Math.round(e.target.value * 100) + '%';
  });
}

// ======== Title Animation ========
const title = document.getElementById('main-title');
const nav = document.querySelector('.nav-buttons');
let moved=false;

title.addEventListener('mouseenter', ()=>{
    if(!moved){
        title.classList.add('move-up');
        nav.classList.remove('hidden');
        setTimeout(()=> nav.classList.add('show-buttons'),200);
        moved=true;
    }
});

// ======== Particle Effect ========
const canvas=document.getElementById('particle-canvas');
const ctx=canvas.getContext('2d');
let particles=[], mouse={x:window.innerWidth/2,y:window.innerHeight/2};
if(canvas){
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  window.addEventListener('resize',()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; });
  window.addEventListener('mousemove', e=>{ mouse.x=e.x; mouse.y=e.y; for(let i=0;i<2;i++) particles.push(new Particle()); });
}

class Particle{
    constructor(){ this.x=mouse.x; this.y=mouse.y; this.size=Math.random()*3+1; this.speedX=(Math.random()*2)-1; this.speedY=(Math.random()*2)-1; this.alpha=1; }
    update(){ this.x+=this.speedX; this.y+=this.speedY; this.alpha-=0.02; }
    draw(){ ctx.fillStyle=`rgba(255,255,255,${this.alpha})`; ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); }
}

function animateParticles(){
    if(!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach((p,i)=>{ p.update(); p.draw(); if(p.alpha<=0) particles.splice(i,1); });
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ======== YouTube Live Stats ========
// NOTE: Replace YOUR_API_KEY_HERE with your actual API key (or better: call your server that stores the key)
const YT_API_KEY = "AIzaSyAjTe6m1s7rgwd2ow9IGe_21B0dai_mMYE";
const CHANNEL_ID = "UCZrfo91OFER6U2H5UihLwiA";

async function fetchYouTubeStats() {
  const nameEl = document.getElementById('yt-name');
  try {
    if(!YT_API_KEY || YT_API_KEY === "YOUR_API_KEY_HERE") {
      // Show placeholder/mock values if API key not set
      if(nameEl) nameEl.textContent = "andz79 (demo)";
      document.getElementById('yt-subscribers').textContent = '175';
      document.getElementById('yt-videos').textContent = '4';
      document.getElementById('yt-views').textContent = '23,000';
      // keep thumbnail as placeholder or your avatar URL
      return;
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${YT_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if(!data || !data.items || data.items.length === 0) throw new Error('No channel data');

    const channel = data.items[0];
    // Thumbnail
    const thumbUrl = (channel.snippet.thumbnails && (channel.snippet.thumbnails.high || channel.snippet.thumbnails.default)) ? (channel.snippet.thumbnails.high.url || channel.snippet.thumbnails.default.url) : '';
    if(thumbUrl) document.getElementById('yt-thumbnail').src = thumbUrl;
    if(nameEl) nameEl.textContent = channel.snippet.title || 'Channel';
    document.getElementById('yt-subscribers').textContent = Number(channel.statistics.subscriberCount || 0).toLocaleString();
    document.getElementById('yt-videos').textContent = Number(channel.statistics.videoCount || 0).toLocaleString();
    document.getElementById('yt-views').textContent = Number(channel.statistics.viewCount || 0).toLocaleString();
  } catch (err) {
    console.error("YouTube API error:", err);
    if(nameEl) nameEl.textContent = "Unable to load stats";
    // fallback demo values
    document.getElementById('yt-subscribers').textContent = '175';
    document.getElementById('yt-videos').textContent = '4';
    document.getElementById('yt-views').textContent = '23,000';
  }
}

// Fetch on load
window.addEventListener('load', fetchYouTubeStats);
