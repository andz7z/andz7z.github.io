// ===== Loading Screen =====
window.addEventListener('load', () => {
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const loadingScreen = document.getElementById('loading-screen');
  
  let percent = 0;
  const interval = setInterval(() => {
    percent += Math.floor(Math.random() * 5) + 1; // crește ușor aleator
    if (percent > 100) percent = 100;
    loaderBar.style.width = percent + '%';
    loaderPercent.textContent = percent + '%';
    
    if (percent === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => loadingScreen.style.display = 'none', 500);
      }, 300); // mic delay după 100%
    }
  }, 50); // update la fiecare 50ms → ~2-3 secunde
});

// ======== Section Switcher ========
function openSection(id) {
  playClick();
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.classList.add('hidden'));
  const sectionToShow = document.getElementById(id);
  if (sectionToShow) {
    sectionToShow.classList.remove('hidden');
    sectionToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.warn("Section not found:", id);
  }
}

// ======== YouTube API ========
const API_KEY = "AIzaSyAjTe6m1s7rgwd2ow9IGe_21B0dai_mMYE";
const CHANNEL_ID = "UCZrfo91OFER6U2H5UihLwiA";

async function fetchYouTubeStats() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const channel = data.items[0];
      document.getElementById('yt-name').textContent = channel.snippet.title;
      document.getElementById('yt-subscribers').textContent = Number(channel.statistics.subscriberCount).toLocaleString();
      document.getElementById('yt-videos').textContent = Number(channel.statistics.videoCount).toLocaleString();
      document.getElementById('yt-views').textContent = Number(channel.statistics.viewCount).toLocaleString();
      document.getElementById('yt-thumbnail').src = channel.snippet.thumbnails.high.url;
      document.getElementById('yt-link').href = `https://www.youtube.com/channel/${CHANNEL_ID}`;
    }
  } catch (err) {
    console.error("YouTube API Error:", err);
  }
}
window.addEventListener('load', fetchYouTubeStats);

// ======== Music Control ========
let music = new Audio("https://andz7z.github.io/song.MP3");
music.loop = true;
music.volume = 0;
let playing = false;
let musicStarted = false;
const volumeSlider = document.getElementById('volume-slider');

function fadeInMusic() {
  let vol = 0;
  const interval = setInterval(() => {
    vol += 0.01;
    if (vol >= 0.2) {
      vol = 0.2;
      clearInterval(interval);
    }
    music.volume = vol;
    volumeSlider.value = vol;
  }, 1000);
}

function startMusic() {
  if (!musicStarted) {
    music.currentTime = 0;
    music.play().then(() => {
      fadeInMusic();
      playing = true;
      musicStarted = true;
      document.getElementById('audio-icon').textContent = '🔊';
    }).catch(err => console.log("Autoplay blocked:", err));
  }
}

function toggleMusic() {
  playClick();
  playing = !playing;
  document.getElementById('audio-icon').textContent = playing ? '🔊' : '🔇';
  playing ? music.play() : music.pause();
}

window.addEventListener('click', e => {
  if (!musicStarted && !e.target.closest('button, a')) {
    startMusic();
  }
});

window.addEventListener('load', () => {
  document.getElementById('audio-icon').textContent = '🔇';
});

volumeSlider.addEventListener('input', e => {
  music.volume = e.target.value;
});

// ======== Click Sound ========
const clickSound = new Audio("https://andz7z.github.io/click.MP3");
clickSound.volume = 0.05;
function playClick() {
  const sound = clickSound.cloneNode();
  sound.volume = 0.05;
  sound.play();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button, .nav-buttons button, .nav-buttons a')
    .forEach(btn => {
      btn.addEventListener('click', () => playClick());
    });
});

// ======== Title Animation ========
const title = document.getElementById('main-title');
const nav = document.querySelector('.nav-buttons');
let moved = false;

title.addEventListener('mouseenter', () => {
  if (!moved) {
    playClick();
    title.classList.add('move-up');
    nav.classList.remove('hidden');
    setTimeout(() => nav.classList.add('show-buttons'), 200);
    moved = true;
  }
});

// ======== Particle Effect ========
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [], mouse = { x: 0, y: 0 };

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', e => {
  mouse.x = e.x;
  mouse.y = e.y;
  for (let i = 0; i < 2; i++) particles.push(new Particle());
});

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() * 2) - 1;
    this.speedY = (Math.random() * 2) - 1;
    this.alpha = 1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.02;
  }
  draw() {
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
// ===== Notification System =====
setTimeout(() => {
  const notif = document.getElementById('notification');
  if (notif) {
    notif.classList.add('show');

    // Play notification sound
    const notifSound = new Audio("https://github.com/andz7z/andz7z.github.io/raw/main/notification.MP3");
    notifSound.volume = 0.1;
    notifSound.play().catch(() => {});

    // Hide after 12 seconds
    setTimeout(() => {
      notif.classList.remove('show');
    }, 10000);
  }
}, 7000); // appears after 3s
.section {
  padding: 60px 20px;
  animation: fadeIn 0.5s ease forwards;
  border-radius: 15px;
  max-width: 1000px;
  margin: 20px auto;
  position: relative;
  overflow: hidden;
  background: rgba(30,30,30,0.6); /* fundal opac pentru Services */
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
