// ================= LOADING SCREEN =================
window.addEventListener('load', () => {
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const loadingScreen = document.getElementById('loading-screen');

  let percent = 0;
  const interval = setInterval(() => {
    percent += Math.floor(Math.random() * 5) + 1;
    if (percent >= 100) {
      percent = 100;
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.transition = 'opacity 0.5s ease';
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 500);
      }, 300);
    }
    loaderBar.style.width = percent + '%';
    loaderPercent.textContent = percent + '%';
  }, 50);
});

// ================= YOUTUBE API =================
const API_KEY = "AIzaSyAjTe6m1s7rgwd2ow9IGe_21B0dai_mMYE";
const CHANNEL_ID = "UCZrfo91OFER6U2H5UihLwiA";

async function fetchYouTubeStats() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await res.json();
    const channel = data.items?.[0];
    if (!channel) return;

    const statsMap = {
      'yt-name': channel.snippet.title,
      'yt-subscribers': Number(channel.statistics.subscriberCount).toLocaleString(),
      'yt-videos': Number(channel.statistics.videoCount).toLocaleString(),
      'yt-views': Number(channel.statistics.viewCount).toLocaleString(),
    };

    for (const [id, val] of Object.entries(statsMap)) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    document.getElementById('yt-thumbnail').src = channel.snippet.thumbnails.high.url;
    document.getElementById('yt-link').href = `https://www.youtube.com/channel/${CHANNEL_ID}`;
  } catch (err) {
    console.error("YouTube API Error:", err);
  }
}
window.addEventListener('load', fetchYouTubeStats);

// ================= MUSIC CONTROL =================
const music = new Audio("https://andz7z.github.io/song.MP3");
music.loop = true;
music.volume = 0;
let playing = false, musicStarted = false;
const volumeSlider = document.getElementById('volume-slider');
const audioIcon = document.getElementById('audio-icon');

function fadeInMusic(target = 0.2, step = 0.01) {
  const fade = setInterval(() => {
    music.volume = Math.min(target, music.volume + step);
    volumeSlider.value = music.volume;
    if (music.volume >= target) clearInterval(fade);
  }, 100);
}

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;
  music.currentTime = 0;
  music.play().then(() => {
    fadeInMusic();
    playing = true;
    audioIcon.textContent = '🔊';
  }).catch(() => console.log("Autoplay blocked"));
}

function toggleMusic() {
  playClick();
  playing = !playing;
  audioIcon.textContent = playing ? '🔊' : '🔇';
  playing ? music.play() : music.pause();
}

window.addEventListener('click', e => {
  if (!musicStarted && !e.target.closest('button, a')) startMusic();
});
window.addEventListener('load', () => audioIcon.textContent = '🔇');
volumeSlider.addEventListener('input', e => music.volume = e.target.value);

// ================= CLICK SOUND =================
const clickSound = new Audio("https://andz7z.github.io/click.MP3");
clickSound.volume = 0.05;
function playClick() {
  clickSound.cloneNode().play();
}
document.addEventListener('click', e => {
  if (e.target.closest('button, .nav-buttons button, .nav-buttons a')) playClick();
});

// ================= TITLE ANIMATION =================
const title = document.getElementById('main-title');
const nav = document.querySelector('.nav-buttons');
let moved = false;
title?.addEventListener('mouseenter', () => {
  if (moved) return;
  playClick();
  title.classList.add('move-up');
  nav.classList.remove('hidden');
  setTimeout(() => nav.classList.add('show-buttons'), 200);
  moved = true;
});

// ================= SECTION SWITCHER =================
function openSection(id) {
  playClick();
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
  const section = document.getElementById(id);
  section?.classList.remove('hidden');
  section?.scrollIntoView({ behavior: 'smooth' });
  document.querySelectorAll('.nav-buttons button').forEach(btn => {
    btn.classList.toggle('active-btn', btn.getAttribute('onclick')?.includes(id));
  });
}

// ================= PARTICLE EFFECT =================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas?.getContext('2d');
let particles = [];
const mouse = { x: 0, y: 0 };

if (canvas && ctx) {
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize();
  addEventListener('resize', resize);

  addEventListener('mousemove', e => {
    mouse.x = e.x; mouse.y = e.y;
    for (let i = 0; i < 2; i++) particles.push(new Particle());
  });

  class Particle {
    constructor() {
      this.x = mouse.x; this.y = mouse.y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
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

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ================= NOTIFICATION SYSTEM =================
setTimeout(() => {
  const notif = document.getElementById('notification');
  if (!notif) return;
  notif.classList.add('show');
  const notifSound = new Audio("https://github.com/andz7z/andz7z.github.io/raw/main/notification.MP3");
  notifSound.volume = 0.1;
  notifSound.play().catch(() => {});
  setTimeout(() => notif.classList.remove('show'), 10000);
}, 7000);

// ================= WORK ITEMS PANELS =================
const WORK_ITEMS = {
  season: {
    title: "Season Flow",
    img: "https://i.imgur.com/ik14PFa.jpeg",
    desc: "A LUA mod, easy to install...",
    github: "https://github.com/andz7z/SEASONS-GTA-SA",
    features: ["No FPS Drop", "Easy to configure", "Unique"]
  },
  weather: {
    title: "Weather Shift",
    img: "https://i.imgur.com/nstY5n2.jpeg",
    desc: "Advanced time & weather changer...",
    github: "https://github.com/andz7z/TIMECHANGER-GTA-SA",
    features: ["Custom time scale", "Weather presets", "No FPS Drop"]
  },
  tags: {
    title: "Modern Tags",
    img: "https://i.imgur.com/nsrK2GW.jpeg",
    desc: "A modern tags mod...",
    github: "https://github.com/andz7z/NAMETAGS-GTA-SA",
    features: ["Easy to configure", "Custom colors support", "Custom fonts support"]
  },
  look: {
    title: "Look Changer",
    img: "https://i.imgur.com/rSWDHs2.jpeg",
    desc: "Change your skin and save locally...",
    github: "https://github.com/andz7z/SKINCHANGER-GTA-SA",
    features: ["Local Saving", "Easy to understand", "No FPS Drop"]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const detailContainer = document.getElementById('work-detail-container');
  const buttons = document.querySelectorAll('.work-btn');

  function closePanels() {
    detailContainer.innerHTML = '';
    buttons.forEach(b => b.classList.remove('active'));
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      if (!WORK_ITEMS[key]) return;
      playClick();
      const active = btn.classList.contains('active');
      closePanels();
      if (active) return;

      btn.classList.add('active', 'glow-press');
      setTimeout(() => btn.classList.remove('glow-press'), 800);

      const item = WORK_ITEMS[key];
      const panel = document.createElement('div');
      panel.className = 'work-panel';
      panel.innerHTML = `
        <img class="panel-img" src="${item.img}" alt="${item.title}" />
        <div class="panel-info">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <div class="panel-features">
            ${item.features.map(f => `<span class="feature-pill">${f}</span>`).join('')}
          </div>
          <div class="panel-meta">
            <a class="github-link" href="${item.github}" target="_blank">View on GitHub</a>
            <a class="download-link" href="${item.github}/archive/refs/heads/main.zip" target="_blank">Download ZIP</a>
          </div>
        </div>
        <button class="panel-close">✕</button>
      `;
      panel.querySelector('.panel-close').addEventListener('click', closePanels);
      detailContainer.appendChild(panel);
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.work-buttons, .work-panel')) closePanels();
  });
});

// ================= THEME TOGGLE =================
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  const body = document.body;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.textContent = "🌙";
  }

  themeToggle.addEventListener("click", () => {
    playClick();
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "🌙" : "💡";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// ================= STARFIELD =================
const starfield = document.querySelector(".starfield");
if (starfield) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    star.style.animationDuration = (2 + Math.random() * 3) + "s";
    frag.appendChild(star);
  }
  starfield.appendChild(frag);
}
