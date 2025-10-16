  // ===========================================================
  // ANDZ MAIN SCRIPT
  // ===========================================================

document.addEventListener("DOMContentLoaded", () => {

  // ======== Selectors ========
  const body = document.body;
  const loadingScreen = document.getElementById("loading-screen");
  const mainLogo = document.getElementById("main-logo");
  const volumeSlider = document.getElementById("volume-slider");
  const audioIcon = document.getElementById("audio-icon");
  const themeToggle = document.getElementById("theme-toggle");
  const title = document.getElementById("main-title");
  const nav = document.querySelector(".nav-buttons");
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas?.getContext("2d");
  const starfield = document.querySelector(".starfield");

  // ===========================================================
  // ===== Glass-Metal Intro =====
  // ===========================================================
  window.addEventListener("load", () => {
    if (!loadingScreen || !mainLogo) return;

    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        mainLogo.classList.remove("hidden");
        setTimeout(() => mainLogo.classList.add("show"), 50);
      }, 800);
    }, 2800);
  });

  // ===========================================================
  // ======== Section Switcher ========
  // ===========================================================
function openSection(id) {
  playClick();
  const sections = document.querySelectorAll(".section");
  const buttons = document.querySelectorAll(".nav-buttons button");

  // ascunde toate sectiunile
  sections.forEach(sec => sec.classList.add("hidden"));

  // afiseaza sectiunea selectata + anim
  const sectionToShow = document.getElementById(id);
  if (sectionToShow) {
    sectionToShow.classList.remove("hidden");
    sectionToShow.classList.add("fade-sequence");
    setTimeout(() => sectionToShow.classList.remove("fade-sequence"), 2000);
    sectionToShow.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  buttons.forEach(btn => {
    btn.classList.toggle("active-btn", btn.getAttribute("onclick")?.includes(id));
  });
  const paginationEl = document.querySelector('.pagination');
  if (paginationEl) {
    if (id === 'reviews') paginationEl.classList.remove('hidden');
    else paginationEl.classList.add('hidden');
  }
}

window.openSection = openSection;

  // ===========================================================
  // ======== YouTube API ========
  // ===========================================================
const API_KEY = "AIzaSyAjTe6m1s7rgwd2ow9IGe_21B0dai_mMYE";
const CHANNEL_ID = "UCZrfo91OFER6U2H5UihLwiA";

async function fetchYouTubeStats() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await res.json();
    const channel = data.items?.[0];
    if (!channel) return;

    const { snippet, statistics } = channel;
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setText("yt-name", snippet.title);
    setText("yt-subscribers", Number(statistics.subscriberCount).toLocaleString());
    setText("yt-videos", Number(statistics.videoCount).toLocaleString());
    setText("yt-views", Number(statistics.viewCount).toLocaleString());

    // ===== Thumbnail =====
    const thumb = document.getElementById("yt-thumbnail");
    const lightThumb = "https://andz7z.github.io/assets/logos/youtube/logo_light.gif";
    const darkThumb = "https://andz7z.github.io/assets/logos/youtube/logo_dark.gif";

    if (thumb) {
      const isDark = document.body.classList.contains("dark-mode");
      thumb.src = isDark ? darkThumb : lightThumb;

      const themeToggle = document.getElementById("theme-toggle");
      themeToggle?.addEventListener("click", () => {
        const darkNow = document.body.classList.contains("dark-mode");
        thumb.src = darkNow ? darkThumb : lightThumb;
      });
    }

    const link = document.getElementById("yt-link");
    if (link) link.href = `https://www.youtube.com/channel/${CHANNEL_ID}`;
  } catch (err) {
    console.error("YouTube API Error:", err);
  }
}
window.addEventListener("load", fetchYouTubeStats);

  // ===========================================================
  // ======== Music Control ========
  // ===========================================================
  const music = new Audio("https://andz7z.github.io/assets/sounds/song.MP3");
  const clickSound = new Audio("https://andz7z.github.io/assets/sounds/click.MP3");
  let playing = false, musicStarted = false;
  music.loop = true;
  music.volume = 0;

  function fadeInMusic(targetVol = 0.2, step = 0.01, delay = 1000) {
    let vol = 0;
    const fade = () => {
      vol = Math.min(vol + step, targetVol);
      music.volume = vol;
      volumeSlider.value = vol;
      if (vol < targetVol) setTimeout(fade, delay);
    };
    fade();
  }

  function startMusic() {
    if (musicStarted) return;
    music.currentTime = 0;
    music.play()
      .then(() => {
        fadeInMusic();
        playing = musicStarted = true;
        audioIcon.textContent = "🔊";
      })
      .catch(err => console.log("Autoplay blocked:", err));
  }

  function toggleMusic() {
    playClick();
    playing = !playing;
    audioIcon.textContent = playing ? "🔊" : "🔇";
    playing ? music.play() : music.pause();
  }

  window.addEventListener("click", e => {
    if (!musicStarted && !e.target.closest("button,a")) startMusic();
  });
  window.addEventListener("load", () => { audioIcon.textContent = "🔇"; });
  volumeSlider?.addEventListener("input", e => { music.volume = e.target.value; });
  window.toggleMusic = toggleMusic;

  // ===========================================================
  // ======== Click Sound ========
  // ===========================================================
  clickSound.volume = 0.05;
  function playClick() {
    const sound = clickSound.cloneNode();
    sound.volume = 0.05;
    sound.play();
  }

  document.body.addEventListener("click", e => {
    if (e.target.closest("button, .nav-buttons button, .nav-buttons a")) playClick();
  });

  // ===========================================================
  // ======== Title Animation ========
  // ===========================================================
  let moved = false;
  title?.addEventListener("mouseenter", () => {
    if (!moved) {
      playClick();
      title.classList.add("move-up");
      nav.classList.remove("hidden");
      setTimeout(() => nav.classList.add("show-buttons"), 200);
      moved = true;
    }
  });
  // ===== Title Click =====
const mainTitle = document.getElementById("main-title");
const navButtons = document.querySelector(".nav-buttons");
const titleEl = document.getElementById("main-logo");
let navVisible = false;

if (mainTitle && navButtons && titleEl) {
  mainTitle.addEventListener("click", () => {
    playClick();
    navVisible = !navVisible;

    // ===== SHOW MENU =====
    if (navVisible) {
      titleEl.classList.add("move-up");
      navButtons.classList.remove("hidden");
      const buttons = navButtons.querySelectorAll("button");
      navButtons.style.opacity = "1";
      navButtons.style.transform = "scale(1)";

      buttons.forEach((btn, i) => {
        btn.style.opacity = "0";
        btn.style.transform = "translateY(15px)";
        setTimeout(() => {
          btn.style.transition = "all 0.6s ease";
          btn.style.opacity = "1";
          btn.style.transform = "translateY(0)";
        }, i * 250); // 0.25s (+-)
      });
    }

    // ===== HIDE MENU =====
    else {
      navButtons.style.transition = "transform 0.4s ease, opacity 0.4s ease";
      navButtons.style.transform = "scale(0.8)";
      navButtons.style.opacity = "0";

      // fade-out
      document.querySelectorAll(".section:not(.hidden)").forEach(sec => {
        sec.classList.add("fade-out");
        setTimeout(() => sec.classList.add("hidden"), 400);
      });

      // hide everything
      setTimeout(() => {
        navButtons.classList.add("hidden");
        titleEl.classList.remove("move-up");

        const workDetail = document.getElementById("work-detail-container");
        if (workDetail) workDetail.innerHTML = "";
        document.querySelectorAll(".work-btn").forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-expanded", "false");
        });
      }, 450);
    }
  });
}
  // ===========================================================
  // ======== Particle Effect ========
  // ===========================================================
  if (canvas && ctx) {
    let particles = [];
    const mouse = { x: 0, y: 0 };

    const addParticles = () => {
      for (let i = 0; i < 2; i++) particles.push(new Particle());
    };

    class Particle {
      constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
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

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    window.addEventListener("mousemove", e => {
      mouse.x = e.x;
      mouse.y = e.y;
      addParticles();
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animateParticles();
  }

  // ===========================================================
  // ======== Work buttons ========
  // ===========================================================
  const WORK_ITEMS = {
    season: {
      title: "Season Flow",
      img: "https://i.imgur.com/ik14PFa.jpeg",
      desc: "A LUA mod, easy to install, that lets you choose between summer or winter.",
      github: "https://github.com/andz7z/SEASONS-GTA-SA",
      features: ["No FPS Drop", "Easy to configure", "Unique"]
    },
    weather: {
      title: "Weather Shift",
      img: "https://i.imgur.com/nstY5n2.jpeg",
      desc: "Advanced time & weather changer.",
      github: "https://github.com/andz7z/TIMECHANGER-GTA-SA",
      features: ["Custom time scale", "Weather presets", "No FPS Drop"]
    },
    tags: {
      title: "Modern Tags",
      img: "https://i.imgur.com/nsrK2GW.jpeg",
      desc: "A modern tags mod that helps you style them in any way.",
      github: "https://github.com/andz7z/NAMETAGS-GTA-SA",
      features: ["Easy to configure", "Custom colors", "Custom fonts"]
    },
    look: {
      title: "Look Changer",
      img: "https://i.imgur.com/rSWDHs2.jpeg",
      desc: "Change your skin with local saving.",
      github: "https://github.com/andz7z/SKINCHANGER-GTA-SA",
      features: ["Local Saving", "Easy to use", "No FPS Drop"]
    }
  };

  const buttons = document.querySelectorAll(".work-btn");
  const detailContainer = document.getElementById("work-detail-container");

  function closeAllPanels() {
    detailContainer.innerHTML = "";
    buttons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-expanded", "false");
    });
  }

  function createPanel(itemKey) {
    const item = WORK_ITEMS[itemKey];
    if (!item) return null;

    const panel = document.createElement("div");
    panel.className = "work-panel";
    panel.innerHTML = `
      <img class="panel-img" src="${item.img}" alt="${item.title} image" />
      <div class="panel-info">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="panel-features">
          ${item.features.map(f => `<span class="feature-pill">${f}</span>`).join("")}
        </div>
        <div class="panel-meta">
          <a class="github-link" href="${item.github}" target="_blank">View on GitHub</a>
          <a class="download-link" href="${item.github}/archive/refs/heads/main.zip" target="_blank">Download ZIP</a>
        </div>
      </div>
      <button class="panel-close" aria-label="Close details">✕</button>
    `;

    panel.querySelector(".panel-close").addEventListener("click", closeAllPanels);
    return panel;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-key");
      if (!key || !WORK_ITEMS[key]) return;
      const isActive = btn.classList.contains("active");
      playClick();
      btn.classList.add("glow-press");
      setTimeout(() => btn.classList.remove("glow-press"), 800);

      if (isActive) return closeAllPanels();
      closeAllPanels();
      btn.classList.add("active");
      btn.setAttribute("aria-expanded", "true");
      const panel = createPanel(key);
      if (panel) {
        detailContainer.appendChild(panel);
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.addEventListener("click", ev => {
    if (!ev.target.closest(".work-buttons, .work-panel")) closeAllPanels();
  });

  // ===========================================================
  // ======== Dark / Light Mode System ========
  // ===========================================================
  // ===========================================================
// ======== Dark / Light Mode System (Uiverse Switch) ========
// ===========================================================
const checkbox = document.getElementById("checkbox");

// initializează tema la load
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  checkbox.checked = true;
} else {
  body.classList.remove("dark-mode");
  checkbox.checked = false;
}

// când se schimbă switch-ul
checkbox.addEventListener("change", () => {
  playClick();
  body.classList.add("theme-transition");

  if (checkbox.checked) {
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }

  setTimeout(() => body.classList.remove("theme-transition"), 1200);
});

  // ===========================================================
  // ===== Starfield Generator (Dark) =====
  // ===========================================================
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
  // ===========================================================
  // ===== Services + Why Us =====
  // ===========================================================
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

// animations
document.querySelectorAll(".service-card, .why-us, .yt-card").forEach(el => {
  el.classList.add("fade-in-up");
  observer.observe(el);
});
// ===========================================================
// ===== Navigation System =====
// ===========================================================
const floatNav = document.getElementById("floating-nav");
const floatBtns = floatNav?.querySelectorAll("button");
const topBtns = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");
let currentOpen = null;

// Floating Nav System
let hideTimeout;
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    floatNav?.classList.add("show");
    // hide after 3s
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      floatNav?.classList.remove("show");
    }, 3000);
  } else {
    floatNav?.classList.remove("show");
  }
});

// show again if mouse move
window.addEventListener("mousemove", () => {
  if (window.scrollY > 200) {
    floatNav?.classList.add("show");
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      floatNav?.classList.remove("show");
    }, 3000);
  }
});

// === Main toggle handler ===
function toggleSection(targetId) {
  const target = document.getElementById(targetId);
  const allBtns = [...floatBtns, ...topBtns];

  // click again -> close section
  if (currentOpen === targetId) {
    target.classList.add("hidden");
    allBtns.forEach(b => b.classList.remove("active"));
    currentOpen = null;
    playClick();
    return;
  }

  // close others
  sections.forEach(sec => sec.classList.add("hidden"));
  allBtns.forEach(b => b.classList.remove("active"));

  // open selected
  target.classList.remove("hidden");
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  allBtns
    .filter(b => b.dataset.target === targetId)
    .forEach(b => b.classList.add("active"));

  currentOpen = targetId;
  playClick();
}

// === Link both up and down nav bar ===
[...floatBtns, ...topBtns].forEach(btn => {
  btn.addEventListener("click", () => toggleSection(btn.dataset.target));
});
// ===========================================================
// ===== NOTIFICATION System =====
// ===========================================================
let hasShownNotification = false;

function createSparks(x, y) {
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;

    const angle = Math.random() * 2 * Math.PI;
    const distance = 50 + Math.random() * 40;
    spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 1000);
  }
}

function showNotification(type = "info", message = "🏡 Make yourself like home", duration = 11000) {
  if (hasShownNotification) return; // show once
  hasShownNotification = true;

  const existing = document.querySelector(".notification.show");
  if (existing) existing.remove();

  const notif = document.createElement("div");
  notif.className = `notification ${type}`;
  notif.innerHTML = `
    <span>${message}</span>
    <button class="notif-close" aria-label="Close">&times;</button>
  `;
  document.body.appendChild(notif);

  // Sound
  const notifSound = new Audio("https://andz7z.github.io/assets/sounds/notification.MP3");
  notifSound.volume = 0.1;
  notifSound.play().catch(() => {});

  // Sparks near notif
  const rect = notif.getBoundingClientRect();
  const centerX = rect.right - rect.width / 2;
  const centerY = rect.bottom - rect.height / 2;
  createSparks(centerX, centerY);

  // Animate in
  setTimeout(() => notif.classList.add("show"), 80);

  // Manual close
  notif.querySelector(".notif-close").addEventListener("click", () => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 600);
  });

  // Auto hide
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 600);
  }, duration);
}

// show notif when title click
const titleElement = document.getElementById("main-title");
if (titleElement) {
  titleElement.addEventListener("click", () => {
    // Check localStorage for previous visit
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (hasVisited) {
      showNotification("info", "Back for more? 🔥 Let’s make it even better this time!");
    } else {
      showNotification("info", "Let’s build something awesome together! 🚀");
      localStorage.setItem("hasVisitedBefore", "true");
    }
  });
}
  // ===========================================================
  // ======== Footer Animation + Dark Mode Switch ========
  // ===========================================================
  const footer = document.querySelector("footer");
  const footerText = document.getElementById("footer-text");

  const lightMsg = "© 2025 ANDZ | Motion turned into emotion 🧊";
  const darkMsg = "© 2025 ANDZ | Dreaming under the moon 🌙";

  function typeFooterText(message) {
    footer.classList.remove("show");
    footer.classList.add("fade-out");
    setTimeout(() => {
      footerText.textContent = "";
      footerText.style.width = "0";
      footer.classList.remove("fade-out");

      let i = 0;
      const interval = setInterval(() => {
        footerText.textContent += message.charAt(i);
        i++;
        if (i === message.length) {
          clearInterval(interval);
          footer.classList.add("show");
        }
      }, 40);
    }, 400);
  }

  // typing effect
  setTimeout(() => typeFooterText(lightMsg), 4000);

  // auto-change between dark/light mode.
  themeToggle?.addEventListener("click", () => {
    const isDark = body.classList.contains("dark-mode");
    const newMsg = isDark ? darkMsg : lightMsg;
    typeFooterText(newMsg);
  });
});
