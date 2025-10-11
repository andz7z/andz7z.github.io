// ===========================================================
// ANDZ MAIN SCRIPT — COMPLETE (PARTEA 1/2)
// ===========================================================
document.addEventListener("DOMContentLoaded", () => {
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
  // Loading screen & intro logo
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
  // Section switcher
  // ===========================================================
  function openSection(id) {
    const sections = document.querySelectorAll(".section");
    const buttons = document.querySelectorAll(".nav-buttons button");

    sections.forEach(sec => sec.classList.add("hidden"));
    const sectionToShow = document.getElementById(id);
    if (sectionToShow) {
      sectionToShow.classList.remove("hidden");
      sectionToShow.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    buttons.forEach(btn => {
      btn.classList.toggle("active-btn", btn.getAttribute("onclick")?.includes(id));
    });
  }
  window.openSection = openSection;

  // ===========================================================
  // YouTube stats fetch (kept from original)
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

      const thumb = document.getElementById("yt-thumbnail");
      if (thumb && snippet.thumbnails) thumb.src = snippet.thumbnails.high.url;

      const link = document.getElementById("yt-link");
      if (link) link.href = `https://www.youtube.com/channel/${CHANNEL_ID}`;
    } catch (err) {
      console.error("YouTube API Error:", err);
    }
  }
  window.addEventListener("load", fetchYouTubeStats);

  // ===========================================================
  // Music control
  // ===========================================================
  const music = new Audio("https://andz7z.github.io/song.MP3");
  const clickSound = new Audio("https://andz7z.github.io/click.MP3");
  let playing = false, musicStarted = false;
  music.loop = true;
  music.volume = 0;

  function fadeInMusic(targetVol = 0.2, step = 0.01, delay = 1000) {
    let vol = 0;
    const fade = () => {
      vol = Math.min(vol + step, targetVol);
      music.volume = vol;
      if (volumeSlider) volumeSlider.value = vol;
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
        if (audioIcon) audioIcon.textContent = "🔊";
      })
      .catch(err => console.log("Autoplay blocked:", err));
  }

  function toggleMusic() {
    playClick();
    playing = !playing;
    if (audioIcon) audioIcon.textContent = playing ? "🔊" : "🔇";
    playing ? music.play() : music.pause();
  }

  window.addEventListener("click", e => {
    if (!musicStarted && !e.target.closest("button,a")) startMusic();
  });
  window.addEventListener("load", () => { if (audioIcon) audioIcon.textContent = "🔇"; });
  volumeSlider?.addEventListener("input", e => { music.volume = e.target.value; });
  window.toggleMusic = toggleMusic;

  // ===========================================================
  // Click sound
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
  // Title hover / nav toggle
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

  const mainTitle = document.getElementById("main-title");
  const navButtons = document.querySelector(".nav-buttons");
  const titleEl = document.getElementById("main-logo");
  let navVisible = false;

  if (mainTitle && navButtons && titleEl) {
    mainTitle.addEventListener("click", () => {
      playClick();
      navVisible = !navVisible;
      if (navVisible) {
        titleEl.classList.add("move-up");
        navButtons.classList.remove("hidden");
        navButtons.style.transform = "scale(0.8)";
        navButtons.style.opacity = "0";
        setTimeout(() => {
          navButtons.style.transition = "transform 0.5s ease, opacity 0.5s ease";
          navButtons.style.transform = "scale(1)";
          navButtons.style.opacity = "1";
          navButtons.classList.add("show-buttons");
        }, 20);
      } else {
        navButtons.style.transition = "transform 0.4s ease, opacity 0.4s ease";
        navButtons.style.transform = "scale(0.8)";
        navButtons.style.opacity = "0";
        setTimeout(() => {
          navButtons.classList.remove("show-buttons");
          navButtons.classList.add("hidden");
          titleEl.classList.remove("move-up");
        }, 400);
      }
    });
  }

  // ===========================================================
  // Particle effect (mouse trail)
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
  // Dark / Light mode init
  // ===========================================================
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "🌙";
  }

  themeToggle?.addEventListener("click", () => {
    playClick();
    const isDark = body.classList.toggle("dark-mode");
    themeToggle.textContent = isDark ? "🌙" : "💡";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // ===========================================================
  // ======== GOOGLE SHEETS REVIEWS SYSTEM (start) ============
  // ===========================================================
  const reviewsContainer = document.getElementById("reviews-container");
  const reviewForm = document.getElementById("review-form");

  // ✅ Linkul tău Web App (am folosit linkul pe care l-ai pus)
  const webAppUrl = "https://script.google.com/macros/s/AKfycbxOeLjD1m3vU1LekPZY47uiX26ONBLa3SuZFa37CP_hVDJR59zOKhOnHRISUbPwdJXLRg/exec";

  async function fetchReviews() {
    if (!reviewsContainer) return;
    try {
      const res = await fetch(webAppUrl);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      renderReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      console.error("Eroare la fetch reviews:", err);
      reviewsContainer.innerHTML = '<p>Could not load reviews right now.</p>';
    }
  }
  // ===========================================================
// ANDZ MAIN SCRIPT — COMPLETE (PARTEA 2/2) — CONTINUARE
// ===========================================================
  function renderReviews(reviews) {
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = "";
    if (!reviews || reviews.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No reviews yet. Be the first! ✍️";
      reviewsContainer.appendChild(p);
      return;
    }

    // afișăm cele mai noi primul
    reviews.slice().reverse().forEach((r, idx) => {
      const div = document.createElement("div");
      div.className = "review";

      // header (username + rating)
      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      header.style.alignItems = "center";

      const nameWrap = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = r.username || "Anonymous";
      nameWrap.appendChild(strong);

      header.appendChild(nameWrap);

      const ratingSpan = document.createElement("span");
      ratingSpan.className = "rating";
      const ratingNum = Number(r.rating) || 0;
      ratingSpan.textContent = " " + "★".repeat(ratingNum) + "☆".repeat(Math.max(0, 5 - ratingNum));
      header.appendChild(ratingSpan);

      div.appendChild(header);

      // comment
      const p = document.createElement("p");
      p.textContent = r.comment || "";
      div.appendChild(p);

      // timestamp
      const small = document.createElement("small");
      small.textContent = r.timestamp ? new Date(r.timestamp).toLocaleString() : "";
      div.appendChild(small);

      reviewsContainer.appendChild(div);
      // animație de apariție
      setTimeout(() => div.classList.add("show"), 100 * idx);
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const usernameEl = document.getElementById("username");
      const ratingEl = document.getElementById("rating");
      const commentEl = document.getElementById("comment");

      const username = usernameEl ? usernameEl.value.trim() : "";
      const rating = ratingEl ? parseInt(ratingEl.value) : 0;
      const comment = commentEl ? commentEl.value.trim() : "";

      if (!username || !rating || !comment) {
        return alert("Completează toate câmpurile!");
      }

      const newReview = { username, rating, comment };

      try {
        const res = await fetch(webAppUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview)
        });
        const data = await res.json();
        if (data && data.success) {
          reviewForm.reset();
          fetchReviews();
        } else {
          alert("Eroare la trimiterea recenziei!");
          console.error("POST response:", data);
        }
      } catch (err) {
        console.error("Eroare POST:", err);
        alert("Conexiune eșuată la serverul Google.");
      }
    });
  }

  // apelăm review-urile la încărcare
  window.addEventListener("load", fetchReviews);

  // ===========================================================
  // Starfield generator (dark-mode decorative)
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
  // Footer typing animation + safe creation if missing
  // ===========================================================
  const footer = document.querySelector("footer");
  let footerText = footer ? footer.querySelector("#footer-text") : null;

  if (footer && !footerText) {
    // păstrăm textul existent (dacă există) și-l mutăm într-un element cu id #footer-text
    const existing = footer.textContent.trim();
    footer.innerHTML = "";
    footerText = document.createElement("p");
    footerText.id = "footer-text";
    footerText.textContent = existing || "";
    footer.appendChild(footerText);
  }

  const lightMsg = "© 2025 ANDZ | Crafted with passion 🧊";
  const darkMsg = "© 2025 ANDZ | Dreaming under the moon 🌙";

  function typeFooterText(message) {
    if (!footer) return;
    footer.classList.remove("show");
    footer.classList.add("fade-out");
    setTimeout(() => {
      if (!footerText) return;
      footerText.textContent = "";
      footerText.style.width = "0";
      footer.classList.remove("fade-out");

      let i = 0;
      const interval = setInterval(() => {
        footerText.textContent += message.charAt(i) ?? "";
        i++;
        if (i === message.length) {
          clearInterval(interval);
          footer.classList.add("show");
        }
      }, 40);
    }, 400);
  }

  // initial typing on load (only if footer exists)
  setTimeout(() => typeFooterText(lightMsg), 4000);

  // when theme toggles also type new message
  themeToggle?.addEventListener("click", () => {
    const isDark = body.classList.contains("dark-mode");
    const newMsg = isDark ? darkMsg : lightMsg;
    typeFooterText(newMsg);
  });

}); // end DOMContentLoaded
