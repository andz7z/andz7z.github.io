// ======== Music Fade-In ========
const music = new Audio("https://andz.github.io/song.mp3");
music.loop = true;
music.volume = 0;
let playing = false;
const volumeSlider = document.getElementById('volume-slider');

function fadeInMusic(){
  let vol = 0;
  const interval = setInterval(()=>{
    vol += 0.004;
    if(vol >= 0.2){ vol = 0.2; clearInterval(interval); }
    music.volume = vol;
    volumeSlider.value = vol;
  },100);
}

function toggleMusic(){
  playing = !playing;
  document.getElementById('audio-icon').textContent = playing ? '🔊' : '🔇';
  playing ? music.play() : music.pause();
}

window.addEventListener('load',()=>{
  music.play();
  fadeInMusic();
  playing = true;
  document.getElementById('audio-icon').textContent='🔊';
});

volumeSlider.addEventListener('input', e=>{ music.volume = e.target.value; });

// ======== Title Animation ========
const title = document.getElementById('main-title');
const nav = document.querySelector('.nav-buttons');
let moved = false;

title.addEventListener('mouseenter', ()=>{
  if(!moved){
    title.classList.add('move-up');
    nav.classList.remove('hidden');
    setTimeout(()=> nav.classList.add('show-buttons'),200);
    moved = true;
  }
});

// ======== Info Display ========
function showInfo(id){
  document.querySelectorAll('.info-box').forEach(b=>b.style.display='none');
  document.getElementById(id).style.display='block';
  window.scrollTo({top: document.getElementById(id).offsetTop - 80, behavior:'smooth'});
}

// ======== Particle Effect ========
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [], mouse = {x:0,y:0};
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;

window.addEventListener('resize',()=>{ 
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight; 
});

window.addEventListener('mousemove', e=>{ 
  mouse.x = e.x; mouse.y = e.y; 
  for(let i=0;i<2;i++) particles.push(new Particle());
});

class Particle{
  constructor(){
    this.x=mouse.x; this.y=mouse.y; 
    this.size=Math.random()*3+1;
    this.speedX=(Math.random()*2)-1; 
    this.speedY=(Math.random()*2)-1; 
    this.alpha=1;
  }
  update(){ this.x+=this.speedX; this.y+=this.speedY; this.alpha-=0.02; }
  draw(){ ctx.fillStyle=`rgba(255,255,255,${this.alpha})`; ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); }
}

function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach((p,i)=>{
    p.update(); p.draw();
    if(p.alpha<=0) particles.splice(i,1);
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ======== Typewriter Effect ========
const text = "I provide video/photo editing and modding services for games.";
const typewriter = document.getElementById('typewriter');
let i = 0;

function typeEffect(){
  if(i < text.length){
    typewriter.textContent += text.charAt(i);
    i++;
    setTimeout(typeEffect, 60);
  }
}

window.addEventListener('load', ()=> setTimeout(typeEffect, 800));
