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
// ===== INTRO 3D DIAMOND (Three.js) =====
(() => {
  const overlay = document.getElementById('intro-3d-overlay');
  const root = document.getElementById('intro-3d-root');
  const skipBtn = document.getElementById('intro-3d-skip');
  const flare = document.getElementById('intro-3d-flare');
  const mainTitle = document.getElementById('main-title');

  // Safety: if overlay not present, nothing to do
  if (!overlay || !root) return;

  // disable main title interactions during intro
  if (mainTitle) mainTitle.style.pointerEvents = 'none';

  // quick fallback if WebGL not available
  if (!window.WebGLRenderingContext) {
    // fallback: short CSS reveal
    setTimeout(() => {
      overlay.classList.add('fadeout');
      overlay.remove();
      if (mainTitle) mainTitle.style.pointerEvents = 'auto';
    }, 800);
    return;
  }

  // Three.js vars
  let renderer, scene, camera, diamondMesh, sparklePoints, animationId, composer;
  let startTime = performance.now();
  let finished = false;
  const DURATION = 5000; // total intro time in ms

  // Initialize renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(root.clientWidth, root.clientHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  root.appendChild(renderer.domElement);

  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, root.clientWidth / root.clientHeight, 0.1, 2000);
  camera.position.set(0, 0.04, 1.6);

  // Create a subtle environment: large sphere with a soft gradient to reflect
  const envGeo = new THREE.SphereGeometry(40, 32, 32);
  const envMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide, transparent: true, opacity: 0.6 });
  const envSphere = new THREE.Mesh(envGeo, envMat);
  scene.add(envSphere);

  // Lights: cinematic trio
  const keyLight = new THREE.PointLight(0xffffff, 1.2, 6, 2);
  keyLight.position.set(1.8, 0.8, 2.2);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xffe8d0, 0.55, 8, 2);
  rimLight.position.set(-1.8, -0.6, 1.8);
  scene.add(rimLight);

  const fill = new THREE.AmbientLight(0xffffff, 0.18);
  scene.add(fill);

  // Subtle moving colored light for cinematic shimmer
  const colorLight = new THREE.PointLight(0x8fb6ff, 0.5, 8, 2);
  colorLight.position.set(0.6, -0.8, 1.6);
  scene.add(colorLight);

  // Build a detailed "diamond" using OctahedronGeometry + subdivide for facets
  // Use BufferGeometryUtils subdivision if not available: we will approximate by using high-detail Icosahedron
  const geo = new THREE.OctahedronGeometry(0.55, 4); // second param increases detail
  // Make the geometry slightly sharpened by scaling Y of certain vertices (subtle)
  // Material: MeshPhysicalMaterial with transmission & clearcoat to mimic glass/diamond
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xf7f9fb,
    metalness: 0.0,
    roughness: 0.05,
    transmission: 0.95,       // glass-like transparency
    thickness: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.7,
    envMapIntensity: 1.0,
    opacity: 1.0,
    transparent: true,
    side: THREE.DoubleSide,
  });

  diamondMesh = new THREE.Mesh(geo, mat);
  diamondMesh.rotation.set(0.25, 0.9, 0.06);
  diamondMesh.scale.setScalar(0.0001); // start tiny -> will animate in
  scene.add(diamondMesh);

  // add inner core glow: a smaller emissive mesh to simulate depth
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xfff9ee, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending });
  const inner = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 3), innerMat);
  scene.add(inner);

  // Sparkle particles around diamond (Points)
  const sparkleCount = 200;
  const sparklePositions = new Float32Array(sparkleCount * 3);
  for (let i = 0; i < sparkleCount; i++) {
    const r = 0.75 + Math.random() * 0.9;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    sparklePositions[i * 3] = Math.cos(theta) * Math.cos(phi) * r;
    sparklePositions[i * 3 + 1] = Math.sin(phi) * r * 0.7;
    sparklePositions[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * r;
  }
  const sparkleGeo = new THREE.BufferGeometry();
  sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
  const sparkleMat = new THREE.PointsMaterial({
    size: 0.014,
    sizeAttenuation: true,
    color: 0xfff9fb,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  sparklePoints = new THREE.Points(sparkleGeo, sparkleMat);
  sparklePoints.frustumCulled = false;
  scene.add(sparklePoints);

  // resize handler
  function onResize() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // Animation timeline control (ms)
  const t0 = performance.now();

  // play small whoosh sound if allowed (optional comment out if not using)
  function tryPlaySound() {
    try {
      // small embedded audio data (silent fallback). We won't include big audio here to avoid CORS.
      // If you want sound, set `const sUrl = "path/to/sound.mp3"; new Audio(sUrl).play();`
    } catch (e) {}
  }

  tryPlaySound();

  // animate function
  function animate(now) {
    animationId = requestAnimationFrame(animate);
    const elapsed = now - t0;

    // Diamond formation: scale from tiny to full in first 1600ms with elastic ease
    const formEnd = 1600;
    if (elapsed < formEnd) {
      const p = elapsed / formEnd;
      // easeOutElastic-like approximation
      const eased = Math.sin((p * Math.PI) / 2) * (1 - Math.pow(1 - p, 3));
      const s = THREE.MathUtils.lerp(0.0001, 1.0, eased);
      diamondMesh.scale.setScalar(s);
      inner.scale.setScalar(THREE.MathUtils.lerp(0.02, 1.0, p * 0.95));
      inner.material.opacity = THREE.MathUtils.lerp(0.12, 0.03, p);
    } else {
      diamondMesh.scale.setScalar(1);
      inner.scale.setScalar(1);
    }

    // Rotation gentle
    diamondMesh.rotation.y += 0.0028 + Math.sin(now / 1200) * 0.0008;
    diamondMesh.rotation.x += 0.0009;

    // sparkle twinkle
    const positions = sparkleGeo.attributes.position.array;
    for (let i = 0; i < sparkleCount; i++) {
      const i3 = i * 3;
      // small pulsating
      positions[i3 + 1] += Math.sin(now / (600 + (i % 7) * 80) + i) * 0.0006;
    }
    sparkleGeo.attributes.position.needsUpdate = true;

    // dynamic lights movement for cinematic shimmer
    const cycle = (now / 1000) % 6;
    keyLight.position.x = 1.8 * Math.cos(cycle * 0.7);
    keyLight.position.y = 0.85 + Math.sin(cycle * 0.6) * 0.14;
    colorLight.position.x = 0.6 * Math.cos(cycle * 1.3);
    colorLight.intensity = 0.45 + Math.max(0, Math.sin(now / 450)) * 0.4;

    // flare opacity: ramp up during mid intro
    const flareOn = (elapsed > 1800 && elapsed < 3600);
    if (flareOn) {
      flare.style.opacity = Math.min(1, (elapsed - 1800) / 600);
    } else {
      flare.style.opacity = Math.max(0, 1 - (elapsed - 3600) / 400);
    }

    renderer.render(scene, camera);

    // finish after DURATION
    if (elapsed >= DURATION && !finished) {
      finished = true;
      endIntro(false);
    }
  }

  // End intro: fade overlay, re-enable title and cleanup
  function endIntro(saveSkip) {
    if (finished && overlay.classList.contains('fadeout')) return;
    finished = true;

    // mark skip preference if requested
    if (saveSkip) localStorage.setItem('andz_intro_skipped', '1');

    // visual fade
    overlay.classList.add('fadeout');

    // re-enable main title
    if (mainTitle) {
      mainTitle.style.pointerEvents = 'auto';
      // gently reveal main title if hidden by CSS
      mainTitle.style.opacity = '1';
      mainTitle.classList.add('move-up');
      const nav = document.querySelector('.nav-buttons');
      if (nav) {
        nav.classList.remove('hidden');
        setTimeout(()=> nav.classList.add('show-buttons'), 200);
      }
    }

    // cleanup three after fade
    setTimeout(() => {
      try {
        cancelAnimationFrame(animationId);
      } catch (e) {}
      try {
        // dispose geometries & materials
        geo.dispose && geo.dispose();
        mat.dispose && mat.dispose();
        sparkleGeo.dispose && sparkleGeo.dispose();
        sparkleMat.dispose && sparkleMat.dispose();
      } catch (e) {}
      // remove renderer canvas
      try { renderer.domElement.remove(); } catch (e) {}
      try { overlay.remove(); } catch (e) {}
    }, 900);
  }

  // Skip button behavior
  skipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playClick && playClick();
    endIntro(true);
  });

  // Clicking diamond overlay will also end intro early and trigger title reveal
  renderer.domElement.addEventListener('pointerdown', (e) => {
    // avoid accidental drag
    playClick && playClick();
    endIntro(false);
  });

  // If user cleared intro previously, skip entirely
  if (localStorage.getItem('andz_intro_skipped') === '1') {
    endIntro(false);
    return;
  }

  // start animation loop
  animationId = requestAnimationFrame(animate);
})();
