<script defer>
document.addEventListener("DOMContentLoaded", () => {
  // ====== LOADING SCREEN ======
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const loadingScreen = document.getElementById('loading-screen');
  let percent = 0;
  const loadInterval = setInterval(() => {
    percent += Math.random() * 7 + 2;
    if (percent >= 100) {
      percent = 100;
      clearInterval(loadInterval);
      loaderBar.style.width = '100%';
      loaderPercent.textContent = '100%';
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 400);
      }, 400);
    } else {
      loaderBar.style.width = percent + '%';
      loaderPercent.textContent = Math.floor(percent) + '%';
    }
  }, 80);

  // ====== CLICK SOUND ======
  const clickSound = new Audio("https://andz7z.github.io/click.MP3");
  clickSound.volume = 0.05;
  const playClick = () => { clickSound.currentTime = 0; clickSound.play(); };

  // ====== MUSIC ======
  const music = new Audio("https://andz7z.github.io/song.MP3");
  music.loop = true;
  music.volume = 0;
  let playing = false, started = false;
  const icon = document.getElementById("audio-icon");
  const slider = document.getElementById("volume-slider");

  const fadeIn = () => {
    let v = 0;
    const f = setInterval(() => {
      v += 0.01;
      if (v >= 0.2) { v = 0.2; clearInterval(f); }
      music.volume = v;
      slider.value = v;
    }, 200);
  };

  const startMusic = () => {
    if (started) return;
    started = true;
    music.play().then(() => {
      fadeIn(); playing = true; icon.textContent = "🔊";
    }).catch(()=>{});
  };

  icon.onclick = () => {
    playClick();
    playing = !playing;
    icon.textContent = playing ? "🔊" : "🔇";
    playing ? music.play() : music.pause();
  };

  slider.oninput = e => music.volume = e.target.value;
  window.addEventListener("click", e => {
    if (!started && !e.target.closest('button,a,input')) startMusic();
  });

  // ====== SECTION SWITCHER ======
  const sections = document.querySelectorAll(".section");
  const buttons = document.querySelectorAll(".nav-buttons button");
  window.openSection = id => {
    playClick();
    sections.forEach(s => s.classList.add("hidden"));
    const sec = document.getElementById(id);
    if (sec) sec.classList.remove("hidden");
    buttons.forEach(b => b.classList.remove("active-btn"));
    const active = Array.from(buttons).find(b => b.getAttribute("onclick").includes(id));
    if (active) active.classList.add("active-btn");
  };

  // ====== TITLE ANIMATION ======
  const title = document.getElementById('main-title');
  const nav = document.querySelector('.nav-buttons');
  let moved = false;
  title.onmouseenter = () => {
    if (!moved) {
      playClick();
      title.classList.add('move-up');
      nav.classList.remove('hidden');
      setTimeout(() => nav.classList.add('show-buttons'), 200);
      moved = true;
    }
  };

  // ====== PARTICLE EFFECT OPTIMIZAT ======
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = {x:0,y:0};
  const MAX_PARTICLES = 150;

  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize(); window.addEventListener("resize", resize);

  // reducere apeluri la mousemove (debounce 16ms)
  let lastMove = 0;
  window.addEventListener("mousemove", e => {
    const now = performance.now();
    if (now - lastMove < 16) return;
    lastMove = now;
    mouse.x = e.x; mouse.y = e.y;
    for (let i = 0; i < 2; i++) particles.push(new Particle());
  });

  class Particle {
    constructor() {
      this.x = mouse.x;
      this.y = mouse.y;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;
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

  let lastFrame = 0;
  function animate(t) {
    if (t - lastFrame < 33) return requestAnimationFrame(animate); // ~30fps
    lastFrame = t;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach((p,i) => {
      p.update();
      p.draw();
      if (p.alpha <= 0 || particles.length > MAX_PARTICLES) particles.splice(i,1);
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // ====== YOUTUBE API (delayed load) ======
  setTimeout(async () => {
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=UCZrfo91OFER6U2H5UihLwiA&key=AIzaSyAjTe6m1s7rgwd2ow9IGe_21B0dai_mMYE`);
      const data = await res.json();
      const ch = data.items?.[0];
      if (ch) {
        document.getElementById('yt-name').textContent = ch.snippet.title;
        document.getElementById('yt-thumbnail').loading = "lazy";
        document.getElementById('yt-thumbnail').src = ch.snippet.thumbnails.high.url;
        document.getElementById('yt-subscribers').textContent = Number(ch.statistics.subscriberCount).toLocaleString();
        document.getElementById('yt-videos').textContent = Number(ch.statistics.videoCount).toLocaleString();
        document.getElementById('yt-views').textContent = Number(ch.statistics.viewCount).toLocaleString();
        document.getElementById('yt-link').href = `https://www.youtube.com/channel/${ch.id}`;
      }
    } catch(e){ console.warn("YT API fail", e); }
  }, 1000);

  // ====== NOTIFICATION ======
  setTimeout(() => {
    const notif = document.getElementById('notification');
    if (!notif) return;
    notif.classList.add('show');
    const nSound = new Audio("https://github.com/andz7z/andz7z.github.io/raw/main/notification.MP3");
    nSound.volume = 0.1; nSound.play().catch(()=>{});
    setTimeout(() => notif.classList.remove('show'), 10000);
  }, 6000);

});
</script>
