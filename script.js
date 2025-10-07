// ======== Section Switcher ========
function openSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    window.scrollTo({ top: document.getElementById(id).offsetTop - 50, behavior: 'smooth' });
}

// ======== Music Control ========
let music = new Audio("https://andz7z.github.io/song.mp3");
music.loop = true;
music.volume = 0; // start 0
let playing = true;

function toggleMusic() {
    playing = !playing;
    document.getElementById('audio-icon').textContent = playing ? '🔊' : '🔇';
    playing ? music.play() : music.pause();
}

const volumeSlider = document.getElementById('volume-slider');
volumeSlider.addEventListener('input', e => { music.volume = e.target.value; });

// Autoplay + volum gradual 20%
window.addEventListener('load', () => {
    music.play().catch(() => {});
    let vol = 0;
    const interval = setInterval(() => {
        if (vol < 0.2) {
            vol += 0.002;
            music.volume = vol;
            volumeSlider.value = vol;
        } else { clearInterval(interval); }
    }, 100);
});

// ======== Title Animation ========
const title = document.getElementById('main-title');
const nav = document.querySelector('.nav-buttons');
let moved = false;

title.addEventListener('mouseenter', () => {
    if (!moved) {
        title.classList.add('move-up');
        nav.classList.remove('hidden');
        nav.classList.add('show-buttons');
        moved = true;
    }
});

// ======== Particle Effect ========
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 
