// Loader
window.onload = function() {
  setTimeout(() => {
    document.getElementById('loader').style.opacity = 0;
    setTimeout(() => document.getElementById('loader').style.display = 'none', 600);
  }, 1200);
}

// Elemente
const brand = document.getElementById('brand');
const mainButtons = document.getElementById('main-buttons');
const sections = document.querySelectorAll('.section');
const buttons = document.querySelectorAll('#main-buttons .btn');
const closeBtns = document.querySelectorAll('.close-btn');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const visualizer = document.getElementById('music-visualizer');
const ctx = visualizer.getContext('2d');
const volIcon = document.getElementById('vol-icon');
const contactModal = document.getElementById('contact-modal');
const closeModal = document.getElementById('close-modal');

// Poveste cu highlight
const storyTexts = {
  vfx: "✨ <span class='key'>VFX services</span> & progress: <a href='https://www.youtube.com/@andz79' target='_blank'>andz79 YouTube Channel</a>. <br>Preview video below, more on channel!",
  gta: "🚗 Childhood with <span class='key'>GTA San Andreas</span> & modding. Automation studies helped me create <span class='key'>4 unique mods</span> for this classic. <br>Channel: <a href='https://www.youtube.com/@visuals_mods' target='_blank'>visuals_mods</a>.",
  work: "🛠️ All mods are open-source on <a href='https://github.com/andz7z' target='_blank'>GitHub</a>. <br>Explore the cards below & flip for details."
};

// Typing premium effect
function typePremium(el, html, speed=22) {
  el.innerHTML = '';
  let i = 0, tag = false, cursor = document.createElement('span');
  cursor.className = 'cursor'; cursor.textContent = '|';
  el.appendChild(cursor);
  function type() {
    if (i < html.length) {
      if (html[i] === '<') tag = true;
      if (!tag) {
        cursor.insertAdjacentHTML('beforebegin', `<span class="typing-letter">${html[i]}</span>`);
      }
      if (html[i] === '>') tag = false;
      if (tag) {
        let close = html.indexOf('>', i);
        cursor.insertAdjacentHTML('beforebegin', html.slice(i, close+1));
        i = close;
        tag = false;
      }
      i++;
      setTimeout(type, (html[i-1] === ' ' ? speed*2 : speed) + Math.random()*20);
    } else {
      cursor.classList.add('done');
    }
  }
  type();
}

// Remove ANDZ & show section
function showSection(id) {
  document.querySelector('.brand-container').style.opacity = 0;
  setTimeout(() => document.querySelector('.brand-container').style.display = 'none', 700);
  sections.forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  const storyElem = document.getElementById('story-' + id);
  storyElem.style.display = "block";
  typePremium(storyElem, storyTexts[id]);
}

// Brand click
brand.addEventListener('click', () => {
  mainButtons.classList.remove('hidden');
  brand.classList.add('hide'); // pentru fade
});

// Butoane click
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-section');
    if(target==="contact"){
      contactModal.classList.remove('hidden');
    } else {
      showSection(target);
    }
  });
});

// Inchidere modal contact
closeModal.addEventListener('click', () => contactModal.classList.add('hidden'));

// Buton Home (close-btn)
closeBtns.forEach(btn => btn.addEventListener('click', () => {
  sections.forEach(s => s.style.display = 'none');
  document.querySelector('.brand-container').style.display = '';
  setTimeout(() => document.querySelector('.brand-container').style.opacity = 1, 50);
  mainButtons.classList.add('hidden');
  brand.classList.remove('hide');
}));

// Glass effect la hover pe carduri
document.querySelectorAll('.work-card').forEach(card=>{
  card.addEventListener('mouseenter',()=>card.classList.add('active'));
  card.addEventListener('mouseleave',()=>card.classList.remove('active'));
});

// Vizualizare volum + icon animat
let lastVol = 50;
volumeSlider.addEventListener('input', ()=>{
  lastVol = volumeSlider.value;
  if (lastVol == 0) volIcon.textContent = '🔇';
  else if (lastVol < 30) volIcon.textContent = '🔈';
  else if (lastVol < 70) volIcon.textContent = '🔉';
  else volIcon.textContent = '🔊';
  setYTVolume(lastVol, isMuted);
});

// Mute btn
let isMuted = false;
muteBtn.addEventListener('click', ()=>{
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "Unmute" : "Mute";
  volIcon.textContent = isMuted ? "🔇" : (lastVol>70?"🔊":(lastVol>30?"🔉":"🔈"));
  setYTVolume(lastVol, isMuted);
});

// Visualizer (fake bars)
function drawVisualizer(){
  ctx.clearRect(0,0,80,28);
  for(let i=0;i<7;i++){
    const h = Math.random()*visualizer.height*0.8 + 6;
    ctx.fillStyle = "rgba(127,0,255,0.65)";
    ctx.fillRect(i*11, visualizer.height-h, 8, h);
  }
  requestAnimationFrame(drawVisualizer);
}
drawVisualizer();

// Loader spinner anim
let loaderDots = document.querySelector('.loader-text');
let dotCount = 0;
setInterval(()=>{
  if(loaderDots){
    loaderDots.textContent = "ANDZ Portfolio" + ".".repeat(dotCount%4);
    dotCount++;
  }
},340);

// Animated BG particles
const canvas = document.getElementById('bg-canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
function resizeBg() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBg);

function createParticles(){
  particles=[];
  for(let i=0;i<90;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*2.2+1.2,
      dx: (Math.random()-0.5)*0.7,
      dy: (Math.random()-0.5)*0.7,
      color: `rgba(${127+Math.random()*80|0},0,${255-Math.random()*60|0},${0.18+Math.random()*0.22})`
    });
  }
}
createParticles();

function animateParticles(){
  c.clearRect(0,0,canvas.width,canvas.height);
  for(let p of particles){
    p.x += p.dx; p.y += p.dy;
    if(p.x<0||p.x>canvas.width) p.dx*=-1;
    if(p.y<0||p.y>canvas.height) p.dy*=-1;
    c.beginPath();
    c.arc(p.x,p.y,p.r,0,2*Math.PI);
    c.fillStyle = p.color;
    c.shadowColor = "#ff00ff";
    c.shadowBlur = 10;
    c.fill();
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// --- YOUTUBE MUSIC PLAYER (FUNCȚIONAL CONTROL VOLUM) ---
let ytReady = false;
let ytPlayer = null;

// Inject YouTube iframe via API
function injectYT() {
  if (document.getElementById('yt-music-iframe')) return;
  let wrapper = document.getElementById('youtube-wrapper');
  wrapper.innerHTML = `
    <div id="yt-music-iframe"></div>
  `;
  // Load YouTube API
  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
}
injectYT();

// API callback
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-music-iframe', {
    height: '0', width: '0',
    videoId: 'nfrHH4I1qNQ',
    playerVars: {
      autoplay: 1,
      loop: 1,
      controls: 0,
      modestbranding: 1,
      playlist: 'nfrHH4I1qNQ'
    },
    events: { 'onReady': function(event){
      ytReady = true;
      setYTVolume(lastVol, isMuted);
    }}
  });
}

// Set volume function
function setYTVolume(vol, muted) {
  if (ytPlayer && ytReady) {
    if (muted || vol == 0) {
      ytPlayer.mute();
    } else {
      ytPlayer.unMute();
      ytPlayer.setVolume(vol);
    }
  }
}
