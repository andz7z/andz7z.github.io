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

function openSection(id) {
  playClick();

  // ascunde toate secțiunile
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.classList.add('hidden'));

  // arată secțiunea selectată
  const sectionToShow = document.getElementById(id);
  if (sectionToShow) {
    sectionToShow.classList.remove('hidden');
    sectionToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // marchează butonul selectat
  const buttons = document.querySelectorAll('.nav-buttons button');
  buttons.forEach(btn => btn.classList.remove('active-btn'));
  const activeBtn = Array.from(buttons).find(btn => btn.getAttribute("onclick").includes(id));
  if (activeBtn) activeBtn.classList.add('active-btn');
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

// ======== NEW: Work buttons behavior & detail panels ========

const WORK_ITEMS = {
  season: {
    title: "Season Flow",
    img: "https://i.imgur.com/ik14PFa.jpeg",
    desc: "Seamlessly transitions map seasons in GTA:SA — snow in winter, green fields in summer, leaves falling in autumn. Easy install, configurable times and regions.",
    github: "https://github.com/andz7z/SEASONS-GTA-SA",
    features: ["Auto day/night aware", "Configurable zones", "Low perf impact"]
  },
  weather: {
    title: "Weather Shift",
    img: "https://i.imgur.com/nstY5n2.jpeg",
    desc: "Advanced time & weather changer: set custom day lengths, sudden storms, fog, or permanent weather presets. Works with Season Flow for best results.",
    github: "https://github.com/andz7z/TIMECHANGER-GTA-SA",
    features: ["Custom time scale", "Weather presets", "Hotkey ready"]
  },
  tags: {
    title: "Modern Tags",
    img: "https://i.imgur.com/nsrK2GW.jpeg",
    desc: "Modern, stylable nametags for multiplayer servers. Clean design, color-coded roles, and smooth fading for readability and aesthetics.",
    github: "https://github.com/andz7z/NAMETAGS-GTA-SA",
    features: ["Role colors", "Smooth fades", "Custom fonts support"]
  },
  look: {
    title: "Look Changer",
    img: "https://i.imgur.com/rSWDHs2.jpeg",
    desc: "Quickly change player skins and outfits with a simple menu or commands. Includes many presets and supports costume saving/loading.",
    github: "https://github.com/andz7z/SKINCHANGER-GTA-SA",
    features: ["Preset outfits", "Command & menu", "Save custom skins"]
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

      // press glow
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

  // click outside to close panels (but keep navigation safe)
  document.addEventListener('click', (ev) => {
    const insideBtnRow = ev.target.closest('.work-buttons');
    const insidePanel = ev.target.closest('.work-panel');
    if (!insideBtnRow && !insidePanel) {
      closeAllPanels();
    }
  });
});
// ======== Dark / Light Mode Toggle ========
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  playClick();
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "💡";
    localStorage.setItem("theme", "light");
  }
});
// ===== Starfield Generator =====
const starfield = document.querySelector(".starfield");
if (starfield) {
  for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    star.style.animationDuration = (2 + Math.random() * 3) + "s";
    starfield.appendChild(star);
  }
}
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name,
    data.rating,
    data.message
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ result: "success" })
  ).setMimeType(ContentService.MimeType.JSON);
}
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwzD7c9du93q8HWfQQn1pmHLCrIH6-eprIEABmwHOauEFNOvxCzvpId_2YDNqD-6z-w/exec";

submitBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message || selectedRating === 0) {
    alert("Please fill all fields and select a rating ⭐");
    return;
  }

  const review = {
    name,
    rating: selectedRating,
    message
  };

  // Trimite spre Google Sheets
  fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify(review),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(() => {
    alert("Review submitted successfully!");
    
    // Adaugă și pe pagină (live update)
    addReviewToPage(review);

    // Reset form
    nameInput.value = "";
    messageInput.value = "";
    selectedRating = 0;
    stars.forEach(s => s.classList.remove("selected"));
  })
  .catch(err => alert("Error: " + err));
});

// Funcție de afișare review pe pagină
function addReviewToPage(review) {
  if (emptyMsg) emptyMsg.style.display = "none";

  const card = document.createElement("div");
  card.className = "review-card";

  let starsHTML = "";
  for (let i = 0; i < review.rating; i++) starsHTML += "★";
  for (let i = review.rating; i < 5; i++) starsHTML += "☆";

  card.innerHTML = `
    <h4>${review.name}</h4>
    <div class="stars-display">${starsHTML}</div>
    <p>${review.message}</p>
  `;

  reviewsList.prepend(card);
}
