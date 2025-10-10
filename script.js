// ===== Glass-Metal Intro → GIF stays as main logo =====
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const mainLogo = document.getElementById('main-logo');
  if (!loadingScreen || !mainLogo) return;

  // Intro rulează ~2.8s, apoi dispare
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      // Arată gif-ul principal
      mainLogo.classList.remove('hidden');
      setTimeout(() => mainLogo.classList.add('show'), 50);
    }, 800);
  }, 2500);
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
}/* =================== REVIEWS JS (robust + fallback) =================== */
const REVIEW_API = "https://script.google.com/macros/s/AKfycbx_VXb_GdqA8gI-kIPEdJlqv0hleZvAUoDdFrsV77IBdZHlqTkmzlaBnRNQ9cjBa9dGPQ/exec";

(function() {
  // elemente
  const form = document.getElementById("review-form");
  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("message");
  const starControl = document.getElementById("star-control");
  const submitBtn = document.getElementById("submit-review");
  const statusBox = document.getElementById("form-status");
  const reviewsList = document.getElementById("reviews-list");
  const reviewsError = document.getElementById("reviews-error");
  const avgValueEl = document.getElementById("avg-value");
  let currentRating = 5;

  // init stars interactions
  function updateStarsUI(value) {
    const stars = starControl.querySelectorAll(".star");
    stars.forEach(s => {
      const v = Number(s.dataset.value);
      if (v <= value) s.classList.add("selected");
      else s.classList.remove("selected");
    });
  }
  starControl.addEventListener("click", (ev) => {
    const s = ev.target.closest(".star");
    if (!s) return;
    currentRating = Number(s.dataset.value);
    updateStarsUI(currentRating);
  });
  // set default
  updateStarsUI(currentRating);

  // render one review
  function renderReview(r, optimistic=false) {
    const div = document.createElement("div");
    div.className = "review";
    const meta = document.createElement("div");
    meta.className = "meta";
    const name = document.createElement("strong");
    name.textContent = r.name || "Anon";
    const rating = document.createElement("div");
    rating.className = "rating";
    rating.textContent = r.rating || "—";
    meta.appendChild(name);
    meta.appendChild(rating);

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = r.message || "";

    div.appendChild(meta);
    div.appendChild(text);

    if (optimistic) {
      const note = document.createElement("div");
      note.style.fontSize = "0.85rem";
      note.style.opacity = "0.8";
      note.style.marginTop = "8px";
      note.textContent = "Pending — will retry sending when server is reachable.";
      div.appendChild(note);
      // mark as pending in localStorage queue
      queuePendingReview(r);
    }

    reviewsList.prepend(div);
  }

  // local queue for retries
  const PENDING_KEY = "andz_reviews_pending_v1";
  function getPendingQueue() {
    try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch(e){return [];}
  }
  function setPendingQueue(q) { localStorage.setItem(PENDING_KEY, JSON.stringify(q)); }
  function queuePendingReview(r) {
    const q = getPendingQueue(); q.push(r); setPendingQueue(q);
  }
  async function retryPending() {
    const q = getPendingQueue();
    if (!q.length) return;
    console.log("Retrying pending reviews:", q.length);
    const remaining = [];
    for (let item of q) {
      try {
        const res = await fetch(REVIEW_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
        if (!res.ok) throw new Error("Non-OK");
        // success -> drop from queue
      } catch (err) {
        console.warn("Retry failed:", err);
        remaining.push(item);
      }
    }
    setPendingQueue(remaining);
  }
  // attempt retry every 30s
  setInterval(retryPending, 30000);

  // calculate + set average rating
  function updateAverage(reviews) {
    if (!reviews || reviews.length === 0) {
      avgValueEl.textContent = "—";
      return;
    }
    let sum = 0, count = 0;
    for (let r of reviews) {
      const n = parseInt((r.rating || "").replace(/[^0-9]/g,''),10);
      if (!isNaN(n)) { sum += n; count++; }
    }
    const avg = count ? (sum / count).toFixed(1) : "—";
    avgValueEl.textContent = avg;
  }

  // load reviews from server
  async function loadReviews() {
    reviewsList.innerHTML = "<div style='opacity:.7'>Loading reviews…</div>";
    reviewsError.hidden = true;
    try {
      const res = await fetch(REVIEW_API, { method: "GET" });
      if (!res.ok) throw new Error("Server returned " + res.status);
      const data = await res.json();
      reviewsList.innerHTML = "";
      // make sure array
      const arr = Array.isArray(data) ? data : [];
      arr.reverse().forEach(r => renderReview(r));
      updateAverage(arr);
      // also show any pending local ones
      const pending = getPendingQueue();
      pending.forEach(p => renderReview(p, true));
    } catch (err) {
      console.error("Failed to load reviews:", err);
      reviewsList.innerHTML = "";
      reviewsError.hidden = false;
      // show local pending reviews so page is not empty
      const pending = getPendingQueue();
      if (pending.length) {
        pending.slice().reverse().forEach(p => renderReview(p, true));
      } else {
        const el = document.createElement("div");
        el.style.opacity = ".8";
        el.textContent = "No reviews available (offline or server blocked).";
        reviewsList.appendChild(el);
      }
    }
  }

  // submit handler
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const payload = {
      name: nameInput.value.trim() || "Anon",
      rating: "⭐".repeat(currentRating) + ` (${currentRating})`,
      message: messageInput.value.trim() || ""
    };
    // quick local render (optimistic)
    renderReview(payload, true);

    // UI
    submitBtn.disabled = true;
    statusBox.textContent = "Sending…";
    try {
      // try normal POST first
      const res = await fetch(REVIEW_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        statusBox.textContent = "Sent ✅";
        // try reloading server list
        setTimeout(loadReviews, 800);
        // remove from pending queue if any (retry may have duplicated)
        // optimistic approach: attempt to remove same message from pending
        const pending = getPendingQueue().filter(p => !(p.name===payload.name && p.message===payload.message));
        setPendingQueue(pending);
      } else {
        // server rejected -> fallback to no-cors (may still save)
        console.warn("Server returned non-ok:", res.status);
        try {
          await fetch(REVIEW_API, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          statusBox.textContent = "Sent (no-cors) — optimistic ✅";
          queuePendingReview(payload);
        } catch (err2) {
          console.error("Fallback no-cors failed:", err2);
          statusBox.textContent = "Saved locally (will retry) ⚠️";
          queuePendingReview(payload);
        }
      }
    } catch (err) {
      console.error("POST failed:", err);
      // fallback: try no-cors to at least attempt sending
      try {
        await fetch(REVIEW_API, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        statusBox.textContent = "Sent (no-cors) — optimistic ✅";
        queuePendingReview(payload);
      } catch (err2) {
        console.error("no-cors also failed:", err2);
        statusBox.textContent = "Saved locally (will retry) ⚠️";
        queuePendingReview(payload);
      }
    } finally {
      submitBtn.disabled = false;
      form.reset();
      currentRating = 5; updateStarsUI(currentRating);
    }
  });

  // initial load
  loadReviews();

  // expose for debugging in console
  window._andz_reviews = { loadReviews, retryPending, getPendingQueue };
})();
