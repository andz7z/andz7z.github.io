// ======== Section Switcher ========
function openSection(id){
    playClick(); // 🔊 sunet click
    document.querySelectorAll('.section').forEach(sec=>sec.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    window.scrollTo({ top: document.getElementById(id).offsetTop-50, behavior:'smooth' });
}
// ===== YouTube API =====
const API_KEY = "AIzaSyAjTe6m1s7rgwd2ow9IGe_21B0dai_mMYE"; // pune aici API Key-ul tău
const CHANNEL_ID = "UCZrfo91OFER6U2H5UihLwiA"; // pune aici Channel ID-ul

async function fetchYouTubeStats() {
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            const channel = data.items[0];

            // update card
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

// Apelează la încărcarea paginii
window.addEventListener('load', fetchYouTubeStats);

// ======== Music Control ========
let music = new Audio("https://andz7z.github.io/song.MP3");
music.loop = true;
music.volume = 0;
let playing = false;
let musicStarted = false;

const volumeSlider = document.getElementById('volume-slider');

function fadeInMusic(){
    let vol = 0;
    const interval = setInterval(()=>{
        vol += 0.01;
        if(vol >= 0.2){ vol = 0.2; clearInterval(interval); }
        music.volume = vol;
        volumeSlider.value = vol;
    }, 1000); // fade-in de ~20 secunde
}

function startMusic(){
    if(!musicStarted){
        music.currentTime = 0;
        music.play().then(()=>{
            fadeInMusic();
            playing = true;
            musicStarted = true;
            document.getElementById('audio-icon').textContent = '🔊';
        }).catch(err=>{
            console.log("Autoplay blocat:", err);
        });
    }
}

function toggleMusic(){
    playClick(); // 🔊 sunet click
    playing = !playing;
    document.getElementById('audio-icon').textContent = playing ? '🔊' : '🔇';
    playing ? music.play() : music.pause();
}

// pornește muzica doar la click pe pagină (nu pe butoane)
window.addEventListener('click', (e)=>{
    if(!musicStarted && !e.target.closest('button, a')){ 
        startMusic();
    }
});

// setăm emoji-ul la load
window.addEventListener('load', ()=>{ 
    document.getElementById('audio-icon').textContent = '🔇'; 
});

// ======== Slider Volum (fără procentaj numeric) ========
volumeSlider.addEventListener('input', e=>{
    music.volume = e.target.value; // doar slider, fără text
});

// ======== Click Sound ========
const clickSound = new Audio("https://andz7z.github.io/click.MP3");
clickSound.volume = 0.05; // 🎚 volum subtil

function playClick(){
    const sound = clickSound.cloneNode(); // creează instanță nouă pentru redare rapidă
    sound.volume = 0.05;
    sound.play();
}

// atașăm click sound la toate butoanele
document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('button, .nav-buttons button, .nav-buttons a')
        .forEach(btn=>{
            btn.addEventListener('click', ()=> playClick());
        });
});

// ======== Title Animation ========
const title = document.getElementById('main-title');
const nav = document.querySelector('.nav-buttons');
let moved = false;

title.addEventListener('mouseenter', ()=>{
    if(!moved){
        playClick(); // 🔊 efect subtil la deschiderea meniului
        title.classList.add('move-up');
        nav.classList.remove('hidden');
        setTimeout(()=> nav.classList.add('show-buttons'), 200);
        moved = true;
    }
});

// ======== Particle Effect ========
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [], mouse = {x:0,y:0};
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', e=>{
    mouse.x = e.x;
    mouse.y = e.y;
    for(let i=0;i<2;i++) particles.push(new Particle());
});

class Particle{
    constructor(){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random()*3 + 1;
        this.speedX = (Math.random()*2) - 1;
        this.speedY = (Math.random()*2) - 1;
        this.alpha = 1;
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
    }
    draw(){
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fill();
    }
}

function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach((p,i)=>{
        p.update();
        p.draw();
        if(p.alpha <= 0) particles.splice(i,1);
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();
