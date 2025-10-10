// ===== COMBO PREMIUM INTRO + FLY-TO-HEADER TRANSITION =====
(function() {
  // configurare timpi (în ms)
  const INTRO_DURATION = 2800;   // cât rămâne intro înainte de startul tranziției
  const FLY_DURATION = 900;      // animația "zbor" gif -> header
  const FADE_OUT_DELAY = 120;    // mic delay la final

  window.addEventListener('load', () => {
    const loading = document.getElementById('loading-screen');
    const introGif = document.getElementById('intro-gif');
    const mainLogo = document.getElementById('main-logo'); // în header
    const logoFrame = document.getElementById('logo-frame');

    // dacă nu există elemente (safety), ascundem loading imediat
    if (!loading || !introGif || !mainLogo || !logoFrame) {
      if (loading) loading.style.display = 'none';
      if (mainLogo) mainLogo.classList.add('show');
      return;
    }

    // forțează header logo-frame să fie transparent până la tranziție
    logoFrame.style.opacity = '1'; // păstrăm vizibil; imaginea rămâne ascunsă

    // 1) după INTRO_DURATION -> animăm "fly" din poziția introGif în poziția mainLogo
    setTimeout(async () => {
      // determină poziții absolute
      const introRect = introGif.getBoundingClientRect();
      const logoRect  = mainLogo.getBoundingClientRect();

      // creează o clonă pentru animație
      const flyClone = introGif.cloneNode(true);
      flyClone.style.position = 'fixed';
      flyClone.style.left = introRect.left + 'px';
      flyClone.style.top = introRect.top + 'px';
      flyClone.style.width = introRect.width + 'px';
      flyClone.style.height = introRect.height + 'px';
      flyClone.style.margin = 0;
      flyClone.style.zIndex = 999999;
      flyClone.style.borderRadius = window.getComputedStyle(introGif).borderRadius || '12px';
      flyClone.style.transition = `all ${FLY_DURATION}ms cubic-bezier(.2,.9,.2,1)`;
      document.body.appendChild(flyClone);

      // mică pulse+fade pentru intro înainte de plecare
      introGif.style.transition = 'transform 300ms ease, opacity 300ms ease';
      introGif.style.transform = 'scale(0.96)';
      introGif.style.opacity = '0.9';

      // forțăm reflow
      void flyClone.offsetWidth;

      // calculează transformări necesare
      const deltaX = logoRect.left + (logoRect.width/2) - (introRect.left + (introRect.width/2));
      const deltaY = logoRect.top  + (logoRect.height/2) - (introRect.top  + (introRect.height/2));
      const scale  = (logoRect.width / introRect.width) * 0.95; // ușor mai mic pentru padding

      flyClone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
      flyClone.style.opacity = '0.98';
      flyClone.style.borderRadius = window.getComputedStyle(mainLogo).borderRadius || '12px';
      flyClone.style.filter = 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))';

      // când termina animația:
      setTimeout(() => {
        // 1) ascundem loading complet (fade)
        loading.classList.add('fade-out');
        setTimeout(() => {
          loading.style.display = 'none';
        }, 400);

        // 2) afișăm mainLogo (în header)
        mainLogo.classList.remove('hidden');
        setTimeout(() => mainLogo.classList.add('show'), 40);

        // 3) îndepărtăm clone-ul animat
        setTimeout(() => {
          try { flyClone.remove(); } catch(e) {}
        }, FADE_OUT_DELAY + 60);
      }, FLY_DURATION + 20);
    }, INTRO_DURATION);
  });
})();
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
    desc: "A LUA mod, easy to install, that lets you choose between summer or winter. The game has only summer by default, but thanks to technology, we can now also have winter.",
    github: "https://github.com/andz7z/SEASONS-GTA-SA",
    features: ["No FPS Drop", "Easy to configure", "Unique"]
  },
  weather: {
    title: "Weather Shift",
    img: "https://i.imgur.com/nstY5n2.jpeg",
    desc: "Advanced time & weather changer: set custom day lengths, sudden storms, fog, or permanent weather presets. Works with Season Flow for best results.",
    github: "https://github.com/andz7z/TIMECHANGER-GTA-SA",
    features: ["Custom time scale", "Weather presets", "No FPS Drop"]
  },
  tags: {
    title: "Modern Tags",
    img: "https://i.imgur.com/nsrK2GW.jpeg",
    desc: "A modern tags mod that helps you style them in any way. You can change the icons, the font, or even the color.",
    github: "https://github.com/andz7z/NAMETAGS-GTA-SA",
    features: ["Easy to configure", "Custom colors support", "Custom fonts support"]
  },
  look: {
    title: "Look Changer",
    img: "https://i.imgur.com/rSWDHs2.jpeg",
    desc: "A mod that lets you change your skin however you want, with the new feature that it stays saved locally even after logging out.",
    github: "https://github.com/andz7z/SKINCHANGER-GTA-SA",
    features: ["Local Saving", "Easdy to understand", "No FPS Drop"]
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
