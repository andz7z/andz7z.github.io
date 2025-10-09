// ===== Loading Screen =====
window.addEventListener('load', () => {
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const loadingScreen = document.getElementById('loading-screen');
  
  let percent = 0;
  const interval = setInterval(() => {
    percent += Math.floor(Math.random() * 5) + 1;
    if (percent > 100) percent = 100;
    loaderBar.style.width = percent + '%';
    loaderPercent.textContent = percent + '%';
    
    if (percent === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => loadingScreen.style.display = 'none', 500);
      }, 300);
    }
  }, 50);
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
// ===== Notification System =====
setTimeout(() => {
  const notif = document.getElementById('notification');
  if (notif) {
    notif.classList.add('show');

    // Play notification sound
    const notifSound = new Audio("https://github.com/andz7z/andz7z.github.io/raw/main/notification.MP3");
    notifSound.volume = 0.1;
    notifSound.play().catch(() => {});

    // Hide after 10 seconds
    setTimeout(() => {
      notif.classList.remove('show');
    }, 10000);
  }
}, 7000);

// ======== NEW: Work buttons behavior & detail panels ========
const WORK_ITEMS = {
  season: {
    title: "Season Flow",
    img: "https://i.imgur.com/ik14PFa.jpeg",
    desc: "A method that helps switch the season from the standard (summer) to winter. The game normally doesn’t have this season, but with the help of mods, it has become possible.",
    github: "https://github.com/andz7z/SEASONS-GTA-SA",
    features: ["LUA Mod", "Instant Switch", "Low FPS impact"]
  },
  weather: {
    title: "Weather Shift",
    img: "https://i.imgur.com/nstY5n2.jpeg",
    desc: "A mod to instantly change the time from day to night or from afternoon to morning. The transition is smooth, taking you through every minute/hour in just one second.",
    github: "https://github.com/andz7z/TIMECHANGER-GTA-SA",
    features: ["Custom Hour/Min", "Weather config", "Local Save"]
  },
  tags: {
    title: "Modern Tags",
    img: "https://i.imgur.com/nsrK2GW.jpeg",
    desc: "A mod that changes the classic nametags in the game, giving them a more modern, minimalist, and interactive look.",
    github: "https://github.com/andz7z/NAMETAGS-GTA-SA",
    features: ["Modern Look", "No Crashes", "Custom fonts support"]
  },
  look: {
    title: "Look Changer",
    img: "https://i.imgur.com/rSWDHs2.jpeg",
    desc: "It is a mod that lets you change your skin to any skin you want from the game. The mod is simple to understand, without too many additions.",
    github: "https://github.com/andz7z/SKINCHANGER-GTA-SA",
    features: ["Local Save", "Easy Command", "No Restrictions"]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.work-btn');
  const detailContainer = document.getElementById('work-detail-container');

  function closeAllPanels() {
    detailContainer.innerHTML = '';
    buttons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-expanded', 'false');
    });
  }

  function createPanel(itemKey) {
    const item = WORK_ITEMS[itemKey];
    if (!item) return null;

    const panel = document.createElement('div');
    panel.className = 'work-panel';
    panel.innerHTML = `
      <img class="panel-img" src="${item.img}" alt="${item.title} image" />
      <div class="panel-info">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="panel-features">
          ${item.features.map(f => `<span class="feature-pill">${f}</span>`).join('')}
        </div>
        <div class="panel-meta">
          <a class="github-link" href="${item.github}" target="_blank" rel="noopener">View on GitHub</a>
          <a class="download-link" href="${item.github}/archive/refs/heads/main.zip" target="_blank" rel="noopener">Download ZIP</a>
        </div>
      </div>
      <button class="panel-close" aria-label="Close details">✕</button>
    `;

    panel.querySelector('.panel-close').addEventListener('click', () => {
      closeAllPanels();
    });

    return panel;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = btn.getAttribute('data-key');
      if (!key || !WORK_ITEMS[key]) return;

      const isActive = btn.classList.contains('active');
      playClick();

      btn.classList.add('glow-press');
      setTimeout(()=> btn.classList.remove('glow-press'), 800);

      if (isActive) {
        closeAllPanels();
        return;
      }

      closeAllPanels();
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');

      const panel = createPanel(key);
      if (panel) {
        detailContainer.appendChild(panel);
        setTimeout(()=> {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    });
  });

  document.addEventListener('click', (ev) => {
    const insideBtnRow = ev.target.closest('.work-buttons');
    const insidePanel = ev.target.closest('.work-panel');
    if (!insideBtnRow && !insidePanel) {
      closeAllPanels();
    }
  });
});

// ======== Dark / Light Mode Toggle + Cinematic Diamond/Moon ========
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const titleWrapper = document.getElementById("main-title-wrapper"); // wrapper pentru animație
let diamond, moon, titleVisible = true;

// Creează diamant/glassy
diamond = document.createElement("div");
diamond.id = "diamond";
diamond.style.width = "50px";
diamond.style.height = "50px";
diamond.style.borderRadius = "10%";
diamond.style.background = "linear-gradient(145deg, #ffffffaa, #ccccccff)";
diamond.style.boxShadow = "0 0 15px rgba(255,255,255,0.6)";
diamond.style.position = "absolute";
diamond.style.top = "0";
diamond.style.left = "50%";
diamond.style.transform = "translateX(-50%) rotateY(0deg)";
diamond.style.transition = "opacity 0.5s ease";
diamond.style.opacity = 0;
diamond.style.zIndex = 10;
titleWrapper.appendChild(diamond);

// Creează lună
moon = document.createElement("div");
moon.id = "moon";
moon.style.width = "50px";
moon.style.height = "50px";
moon.style.borderRadius = "50%";
moon.style.background = "radial-gradient(circle at 25% 25%, #FFD700, #FFA500)";
moon.style.position = "absolute";
moon.style.top = "0";
moon.style.left = "50%";
moon.style.transform = "translateX(-50%)";
moon.style.transition = "opacity 0.5s ease";
moon.style.opacity = 0;
moon.style.zIndex = 10;
titleWrapper.appendChild(moon);

// Animatie diamant rotativ
let diamondAngle = 0;
function animateDiamond() {
  if (diamond.style.opacity == 1) {
    diamondAngle += 0.3;
    diamond.style.transform = `translateX(-50%) rotateY(${diamondAngle}deg)`;
  }
  requestAnimationFrame(animateDiamond);
}
animateDiamond();

// Functii pentru toggle cinematic
function showDiamond() {
  diamond.style.opacity = 1;
  moon.style.opacity = 0;
  title.style.opacity = 1;
  titleVisible = true;
}
function showMoon() {
  diamond.style.opacity = 0;
  moon.style.opacity = 1;
  // efect de fum pentru title
  if (titleVisible) {
    title.style.transition = "opacity 1s ease, transform 1s ease";
    title.style.opacity = 0;
    title.style.transform = "translateY(-20px) scale(0.8)";
    titleVisible = false;
  }
}
// ======== Toggle cinematic diamond/moon & title ========

// Detectare tema salvata
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggle.textContent = "🌙";
  showMoon();
} else {
  showDiamond();
}

// Toggle prin butonul Light/Dark
themeToggle.addEventListener("click", () => {
  playClick();
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
    showMoon();
  } else {
    themeToggle.textContent = "💡";
    localStorage.setItem("theme", "light");
    showDiamond();
  }
});

// Toggle prin click pe titlu
title.addEventListener("click", () => {
  playClick();
  if (!body.classList.contains("dark-mode")) {
    // Light mode active → afiseaza diamant
    showDiamond();
  } else {
    // Dark mode active → afiseaza luna
    showMoon();
  }
});

// Daca Light mode e activ, apasarea pe darkmode face luna automat
// Daca Dark mode e activ, apasarea pe lightmode face diamant automat
// deja sincronizat cu functiile showDiamond/showMoon

// Optional: reset transform cand revine title
function resetTitleTransform() {
  title.style.transform = "translateY(0px) scale(1)";
  title.style.transition = "opacity 0.5s ease, transform 0.5s ease";
}
