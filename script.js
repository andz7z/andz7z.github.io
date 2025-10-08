// ==== INNOVATIVE LOADING SCRIPT ====
// Targets: #loader-bar, #loader-percent, #loading-screen, #loader-particles, #skip-loader

(function () {
  const bar = document.getElementById('loader-bar');
  const percentText = document.getElementById('loader-percent');
  const screen = document.getElementById('loading-screen');
  const canvas = document.getElementById('loader-particles');
  const skipBtn = document.getElementById('skip-loader');

  // Controlled progress model (smooth, non-linear)
  let progress = 0;
  let done = false;

  // Simulate staged loading phases (for realism)
  const phases = [
    { label: 'Initializing', max: 18, speed: 700 },
    { label: 'Warming assets', max: 52, speed: 1100 },
    { label: 'Applying styles', max: 78, speed: 800 },
    { label: 'Finalizing', max: 98, speed: 900 }
  ];

  let phaseIndex = 0;
  function stepPhase() {
    if (phaseIndex >= phases.length) return;
    const ph = phases[phaseIndex];
    // animate to a random point within phase.max over ph.speed
    const target = ph.max - Math.random() * 6;
    const start = progress;
    const duration = ph.speed;
    const startTs = performance.now();

    function animate(ts) {
      const t = Math.min(1, (ts - startTs) / duration);
      // easing - easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      progress = start + (target - start) * eased;
      updateUI(Math.round(progress));
      if (t < 1) requestAnimationFrame(animate);
      else {
        phaseIndex++;
        if (phaseIndex < phases.length) {
          setTimeout(stepPhase, 120 + Math.random() * 320);
        } else {
          // final fill to 100
          setTimeout(() => finishLoading(), 300 + Math.random() * 700);
        }
      }
    }
    requestAnimationFrame(animate);
  }

  function updateUI(p) {
    p = Math.max(0, Math.min(100, p));
    bar.style.width = p + '%';
    percentText.textContent = p + '%';
    bar.parentElement.setAttribute('aria-valuenow', p);
    // sheen position: move when >3%
    const sheen = bar.parentElement.querySelector('.progress-sheen');
    if (sheen) {
      sheen.style.transform = `skewX(-18deg) translateX(${(-120 + p * 2.6)}%)`;
    }
  }

  function finishLoading() {
    progress = 100;
    updateUI(100);
    // small pause for aesthetic
    setTimeout(() => {
      // add fade out
      screen.classList.add('hidden');
      // mark hidden to screen readers
      screen.setAttribute('aria-hidden', 'true');
      // remove element after transition
      setTimeout(() => {
        screen.style.display = 'none';
      }, 700);
    }, 420);
  }

  // skip button
  skipBtn.addEventListener('click', () => {
    if (!done) {
      finishLoading();
      done = true;
    }
  });

  // Kick off phases on DOM ready (or window.load if you prefer)
  window.addEventListener('load', () => {
    // start particle system
    initParticles(canvas);
    // small delay to feel 'purposeful'
    setTimeout(stepPhase, 180);
  });

  // Safety: if load never fires (rare), finish after 5.5s
  setTimeout(() => { if (!done && progress < 100) finishLoading(); }, 5500);

  /* -------------------------
     Subtle particle system (snow / dust)
     lightweight, performant
     ------------------------- */
  function initParticles(canvasEl) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    let W = canvasEl.width = innerWidth;
    let H = canvasEl.height = innerHeight;
    const particles = [];
    const count = Math.min(75, Math.floor((W * H) / 50000)); // scale with viewport

    for (let i = 0; i < count; i++) particles.push(createParticle());

    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.8 + Math.random() * 2.2,
        vx: -0.3 + Math.random() * 0.6,
        vy: 0.2 + Math.random() * 1.1,
        alpha: 0.05 + Math.random() * 0.12
      };
    }

    function resize() {
      W = canvasEl.width = innerWidth;
      H = canvasEl.height = innerHeight;
    }
    addEventListener('resize', resize);

    let last = performance.now();
    function frame(now) {
      const dt = now - last;
      last = now;
      ctx.clearRect(0, 0, W, H);

      // subtle vignette background dots
      ctx.fillStyle = 'rgba(255,255,255,0.01)';
      for (let p of particles) {
        p.x += p.vx * (dt * 0.06);
        p.y += p.vy * (dt * 0.06);

        if (p.y > H + 8) { p.y = -8; p.x = Math.random() * W; }
        if (p.x > W + 8) { p.x = -8; }
        if (p.x < -8) { p.x = W + 8; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      }

      // stop animating when loader hidden
      if (!document.body.contains(screen) || screen.classList.contains('hidden')) {
        ctx.clearRect(0,0,W,H);
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
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
