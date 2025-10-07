// ====== Safe DOM ready ======
document.addEventListener("DOMContentLoaded", () => {
    // ====== Section switcher ======
    const buttons = document.querySelectorAll(".nav-buttons button");
    const sections = document.querySelectorAll(".section");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            playClick();
            const id = btn.dataset.section;
            sections.forEach(sec => sec.classList.add("hidden"));
            const target = document.getElementById(id);
            if (target) {
                target.classList.remove("hidden");
                target.classList.add("fade");
                setTimeout(() => target.classList.remove("fade"), 600);
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // ====== YouTube API ======
    const API_KEY = "AIzaSyAjTe6m1s7rgwd2ow9IGe_21B0dai_mMYE";
    const CHANNEL_ID = "UCZrfo91OFER6U2H5UihLwiA";

    async function fetchYouTubeStats() {
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
            const data = await res.json();
            if (data.items && data.items[0]) {
                const c = data.items[0];
                document.getElementById("yt-name").textContent = c.snippet.title;
                document.getElementById("yt-subscribers").textContent = Number(c.statistics.subscriberCount).toLocaleString();
                document.getElementById("yt-videos").textContent = Number(c.statistics.videoCount).toLocaleString();
                document.getElementById("yt-views").textContent = Number(c.statistics.viewCount).toLocaleString();
                document.getElementById("yt-thumbnail").src = c.snippet.thumbnails.high.url;
                document.getElementById("yt-link").href = `https://www.youtube.com/channel/${CHANNEL_ID}`;
            }
        } catch (e) {
            console.warn("YouTube data unavailable:", e);
        }
    }
    fetchYouTubeStats();

    // ====== Music ======
    const music = new Audio("https://andz7z.github.io/song.MP3");
    music.loop = true;
    music.volume = 0;
    let playing = false, started = false;

    const icon = document.getElementById("audio-icon");
    const slider = document.getElementById("volume-slider");

    function fadeIn() {
        let v = 0;
        const fade = setInterval(() => {
            v += 0.01;
            if (v >= 0.2) { v = 0.2; clearInterval(fade); }
            music.volume = v;
            slider.value = v;
        }, 1000);
    }

    function startMusic() {
        if (started) return;
        music.currentTime = 0;
        music.play().then(() => {
            fadeIn();
            playing = true;
            started = true;
            icon.textContent = "🔊";
        }).catch(() => console.log("Autoplay blocked"));
    }

    icon.addEventListener("click", () => {
        playClick();
        playing = !playing;
        icon.textContent = playing ? "🔊" : "🔇";
        playing ? music.play() : music.pause();
    });

    slider.addEventListener("input", e => music.volume = e.target.value);

    window.addEventListener("click", e => {
        if (!started && !e.target.closest("button,a")) startMusic();
    });

    // ====== Click sound ======
    const clickSound = new Audio("https://andz7z.github.io/click.MP3");
    function playClick() {
        const c = clickSound.cloneNode();
        c.volume = 0.05;
        c.play();
    }

    // ====== Title animation ======
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

    // ====== Particle Effect ======
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let particles = [], mouse = { x: 0, y: 0 };

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

    window.addEventListener("mousemove", e => {
        mouse.x = e.x;
        mouse.y = e.y;
        for (let i = 0; i < 2; i++) particles.push(new Particle());
    });

    window.addEventListener("resize", () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    });
});
