1. script.js // ======== Section Switcher ========
function openSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  window.scrollTo({ top: document.getElementById(id).offsetTop - 50, behavior: 'smooth' });
}

// ======== Music Control ========
let music = new Audio("https://andz7z.github.io/song.mp3");
music.loop = true;
music.volume = 0.4;
let playing = false;

function toggleMusic() {
  playing = !playing;
  document.getElementById('audio-icon').textContent = playing ? '🔊' : '🔇';
  playing ? music.play() : music.pause();
}

const volumeSlider = document.getElementById('volume-slider');
volumeSlider.addEventListener('input', e => {
  music.volume = e.target.value;
});

// ======== Title Animation ========
const title = document.getElementById('main-title');
const nav = document.querySelector('.nav-buttons');
let moved = false;

title.addEventListener('mouseenter', () => {
  if (!moved) {
    title.classList.add('move-up');
    nav.classList.remove('hidden');
    setTimeout(() => nav.classList.add('show'), 200);
    moved = true;
  }
});

// ======== Particle Effect ========
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0 };
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', e => {
  mouse.x = e.x;
  mouse.y = e.y;
  for (let i = 0; i < 2; i++) {
    particles.push(new Particle());
  }
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
    ctx.fillStyle = rgba(255,255,255,${this.alpha});
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
