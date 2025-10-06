// Elemente
const brand = document.getElementById('brand');
const mainButtons = document.getElementById('main-buttons');
const buttons = document.querySelectorAll('#main-buttons .btn');
const sections = document.querySelectorAll('.section');
const contactModal = document.getElementById('contact-modal');
const closeModal = document.getElementById('close-modal');

// Texte poveste
const storyTexts = {
  vfx: "Hello! If you are interested in VFX services or just want to see my progress, check my YouTube channel: https://www.youtube.com/@andz79\nBelow you can see the latest preview video, all others are on the channel!",
  gta: "When I was little playing GTA San Andreas, I watched tutorials on YouTube but didn't understand much.\nThanks to my automation studies, I managed to create 4 interesting mods for this 2004 game!\nCheck my channel: https://www.youtube.com/@visuals_mods",
  work: "These mods are presented on my GitHub account (https://github.com/andz7z)\nBelow are the 4 mods ready to click!"
};

// Typing effect
function typeText(element, text, speed=40){
  element.innerHTML = "";
  let i=0;
  function typing(){
    if(i<text.length){
      element.innerHTML += text[i];
      i++;
      setTimeout(typing,speed);
    }
  }
  typing();
}

// Arata butoanele cand dai click pe ANDZ
brand.addEventListener('click', () => {
  brand.classList.add('shrink');
  mainButtons.classList.remove('hidden');
});

// Click pe butoane
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-section');
    // Shrink ANDZ
    brand.classList.add('shrink');

    if(target==="contact"){
      contactModal.classList.remove('hidden');
    } else {
      transitionToSection(target);
    }
  });
});

// Inchidere contact modal
closeModal.addEventListener('click', () => contactModal.classList.add('hidden'));

// Tranziție blend/fum
function transitionToSection(targetId){
  document.body.style.pointerEvents="none";
  const overlay = document.createElement("div");
  overlay.style.position="fixed";
  overlay.style.top=0;
  overlay.style.left=0;
  overlay.style.width="100%";
  overlay.style.height="100%";
  overlay.style.background="rgba(0,0,0,0.95)";
  overlay.style.zIndex=50;
  overlay.style.transition="opacity 0.8s ease";
  overlay.style.opacity=0;
  document.body.appendChild(overlay);
  requestAnimationFrame(()=>{ overlay.style.opacity=1; });

  setTimeout(()=>{
    sections.forEach(sec => sec.style.display="none");
    const target = document.getElementById(targetId);
    target.style.display="block";

    // Afiseaza text typing
    const storyElem = target.querySelector(".story");
    storyElem.style.display = "block";
    typeText(storyElem, storyTexts[targetId]);

    overlay.style.opacity=0;
    setTimeout(()=>{
      overlay.remove();
      document.body.style.pointerEvents="auto";
    },800);
  },800);
}

// YouTube Background Music + Volume Control
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('bg-music', {
    events: { 'onReady': onPlayerReady }
  });
}

function onPlayerReady(event){
  player.setVolume(50);
}

// Slider Volume
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
let isMuted = false;

volumeSlider.addEventListener('input', ()=>{
  if(player){
    player.setVolume(volumeSlider.value);
    if(isMuted && volumeSlider.value>0){
      player.unMute();
      isMuted=false;
      muteBtn.textContent="Mute";
    }
  }
});

muteBtn.addEventListener('click', ()=>{
  if(player){
    if(isMuted){
      player.unMute();
      muteBtn.textContent="Mute";
      isMuted=false;
    } else {
      player.mute();
      muteBtn.textContent="Unmute";
      isMuted=true;
    }
  }
});

// Load YouTube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);
