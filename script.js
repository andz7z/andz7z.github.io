// === Loading Screen ===
window.addEventListener("load", () => {
  const loaderBar = document.getElementById("loader-bar");
  const loaderPercent = document.getElementById("loader-percent");
  const loadingScreen = document.getElementById("loading-screen");
  let percent = 0;
  const interval = setInterval(() => {
    percent += Math.floor(Math.random() * 5) + 1;
    if (percent > 100) percent = 100;
    loaderBar.style.width = percent + "%";
    loaderPercent.textContent = percent + "%";
    if (percent === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.transition = "opacity 0.5s ease";
        loadingScreen.style.opacity = "0";
        setTimeout(() => (loadingScreen.style.display = "none"), 500);
      }, 200);
    }
  }, 50);
});

// === Section Switcher ===
function openSection(id) {
  playClick();
  const sections = document.querySelectorAll(".section");
  sections.forEach(s => s.classList.add("hidden"));
  const section = document.getElementById(id);
  if (section) {
    section.classList.remove("hidden");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const buttons = document.querySelectorAll(".nav-buttons button");
  buttons.forEach(b => b.classList.remove("active-btn"));
  const activeBtn = [...buttons].find(b => b.getAttribute("onclick").includes(id));
  if (activeBtn) activeBtn.classList.add("active-btn");
}

// === YouTube Stats ===
const API_KEY = "AIzaSyAjTe6m1s7rgwd2ow9IGe_21B0dai_mMYE";
const CHANNEL_ID = "UCZrfo91OFER6U2H5UihLwiA";

async function fetchYouTubeStats() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await res.json();
    const c = data.items?.[0];
    if (!c) return;
    document.getElementById("yt-name").textContent = c.snippet.title;
    document.getElementById("yt-subscribers").textContent = (+c.statistics.subscriberCount).toLocaleString();
    document.getElementById("yt-videos").textContent = (+c.statistics.videoCount).toLocaleString();
    document.getElementById("yt-views").textContent = (+c.statistics.viewCount).toLocaleString();
    document.getElementById("yt-thumbnail").src = c.snippet.thumbnails.high.url;
    document.getElementById("yt-link").href = `https://www.youtube.com/channel/${CHANNEL_ID}`;
  } catch (e) {
    console.warn("YT API error", e);
  }
}
window.addEventListener("load", fetchYouTubeStats);

// === Music Control ===
const music = new Audio("https://andz7z.github.io/song.MP3");
music.loop = true;
music.volume = 0;
let playing = false, started = false;
const volumeSlider = document.getElementById("volume-slider");

function fadeInMusic() {
  let vol = 0;
  const fade = setInterval(() => {
    vol = Math.min(vol + 0.01, 0.2);
    music.volume = vol;
    volumeSlider.value = vol;
    if (vol >= 0.2) clearInterval(fade);
  }, 800);
}
function startMusic() {
  if (started) return;
  started = true;
  music.currentTime = 0;
  music.play().then(() => {
    fadeInMusic();
    playing = true;
    document.getElementById("audio-icon").textContent = "🔊";
  }).catch(() => {});
}
function toggleMusic() {
  playClick();
  playing = !playing;
  document.getElementById("audio-icon").textContent = playing ? "🔊" : "🔇";
  playing ? music.play() : music.pause();
}
window.addEventListener("click", e => {
  if (!started && !e.target.closest("button, a")) startMusic();
});
volumeSlider.addEventListener("input", e => (music.volume = e.target.value));

// === Click Sound ===
const clickSound = new Audio("https://andz7z.github.io/click.MP3");
clickSound.volume = 0.04;
function playClick() {
  const s = clickSound.cloneNode();
  s.volume = 0.04;
  s.play();
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button,.nav-buttons a").forEach(b => b.addEventListener("click", playClick));
});

// === Title Animation ===
const title = document.getElementById("main-title");
const nav = document.querySelector(".nav-buttons");
let moved = false;
title.addEventListener("mouseenter", () => {
  if (!moved) {
    playClick();
    title.classList.add("move-up");
    nav.classList.remove("hidden");
    setTimeout(() => nav.classList.add("show-buttons"), 200);
    moved = true;
  }
});

// === Particle Effect (optimized) ===
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
let particles = [];
const maxParticles = 200;
const spawnPerMove = 1;
let lastTime = 0, fpsInterval = 1000 / 45;

class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.alpha = 1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.015;
  }
  draw() {
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
window.addEventListener("mousemove", e => {
  for (let i = 0; i < spawnPerMove; i++) {
    if (particles.length < maxParticles) particles.push(new Particle(e.x, e.y));
  }
});
function animateParticles(time) {
  if (time - lastTime < fpsInterval) return requestAnimationFrame(animateParticles);
  lastTime = time;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.alpha > 0);
  for (const p of particles) { p.update(); p.draw(); }
  requestAnimationFrame(animateParticles);
}
requestAnimationFrame(animateParticles);

// === Notification ===
setTimeout(() => {
  const n = document.getElementById("notification");
  if (!n) return;
  n.classList.add("show");
  const s = new Audio("https://github.com/andz7z/andz7z.github.io/raw/main/notification.MP3");
  s.volume = 0.08;
  s.play().catch(() => {});
  setTimeout(() => n.classList.remove("show"), 9000);
}, 7000);

// === Work Buttons & Panels ===
const WORK_ITEMS = {
  season: {
    title: "Season Flow",
    img: "https://i.imgur.com/ik14PFa.jpeg",
    desc: "Seamlessly transitions map seasons in GTA:SA — snow in winter, green fields in summer, leaves falling in autumn.",
    github: "https://github.com/andz7z/SEASONS-GTA-SA",
    features: ["Auto day/night aware", "Configurable zones", "Low perf impact"]
  },
  weather: {
    title: "Weather Shift",
    img: "https://i.imgur.com/nstY5n2.jpeg",
    desc: "Advanced time & weather changer: set custom day lengths, sudden storms, fog, or permanent weather presets.",
    github: "https://github.com/andz7z/TIMECHANGER-GTA-SA",
    features: ["Custom time scale", "Weather presets", "Hotkey ready"]
  },
  tags: {
    title: "Modern Tags",
    img: "https://i.imgur.com/nsrK2GW.jpeg",
    desc: "Modern, stylable nametags for multiplayer servers with color-coded roles and smooth fading.",
    github: "https://github.com/andz7z/NAMETAGS-GTA-SA",
    features: ["Role colors", "Smooth fades", "Custom fonts support"]
  },
  look: {
    title: "Look Changer",
    img: "https://i.imgur.com/rSWDHs2.jpeg",
    desc: "Change player skins and outfits with presets and saving options.",
    github: "https://github.com/andz7z/SKINCHANGER-GTA-SA",
    features: ["Preset outfits", "Command & menu", "Save custom skins"]
  }
};
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".work-btn");
  const container = document.getElementById("work-detail-container");
  function closeAll() {
    container.innerHTML = "";
    buttons.forEach(b => b.classList.remove("active"));
  }
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      if (!WORK_ITEMS[key]) return;
      const active = btn.classList.contains("active");
      playClick();
      btn.classList.add("glow-press");
      setTimeout(() => btn.classList.remove("glow-press"), 700);
      if (active) return closeAll();
      closeAll();
      btn.classList.add("active");
      const item = WORK_ITEMS[key];
      const panel = document.createElement("div");
      panel.className = "work-panel";
      panel.innerHTML = `
        <img class="panel-img" src="${item.img}" alt="${item.title}">
        <div class="panel-info">
          <h3>${item.title}</h3><p>${item.desc}</p>
          <div class="panel-features">${item.features.map(f => `<span class='feature-pill'>${f}</span>`).join("")}</div>
          <div class="panel-meta">
            <a href="${item.github}" target="_blank">GitHub</a>
            <a href="${item.github}/archive/refs/heads/main.zip" target="_blank">Download</a>
          </div>
        </div>
        <button class="panel-close">✕</button>
      `;
      panel.querySelector(".panel-close").addEventListener("click", closeAll);
      container.appendChild(panel);
      setTimeout(() => panel.scrollIntoView({ behavior: "smooth" }), 100);
    });
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".work-buttons, .work-panel")) closeAll();
  });
});

// === Dark/Light Theme ===
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggle.textContent = "🌙";
}
themeToggle.addEventListener("click", () => {
  playClick();
  body.classList.toggle("dark-mode");
  const dark = body.classList.contains("dark-mode");
  themeToggle.textContent = dark ? "🌙" : "💡";
  localStorage.setItem("theme", dark ? "dark" : "light");
});

// === Starfield Background ===
const starfield = document.querySelector(".starfield");
if (starfield) {
  for (let i = 0; i < 90; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    star.style.animationDuration = 2 + Math.random() * 3 + "s";
    starfield.appendChild(star);
  }
}
