// Show main buttons when hovering ANDZ
const brand = document.getElementById('brand');
const mainButtons = document.getElementById('main-buttons');
brand.addEventListener('mouseenter', () => mainButtons.classList.remove('hidden'));
brand.addEventListener('mouseleave', () => mainButtons.classList.add('hidden'));

// Section content
const buttons = document.querySelectorAll('#main-buttons .btn');
const sections = document.querySelectorAll('.section');

// Stories text
const storyTexts = {
  vfx: "Hi! If you’re interested in VFX services or just want to see my journey, welcome to my YouTube channel @andz79. Below is a preview of my latest video, but you can find them all on the channel!",
  gta: "When I was little playing this game, I watched all kinds of tutorials on YouTube. I didn’t understand much at first, but later I started changing colors or names using CTRL+F. Thanks to studying Automation at university, I created 4 interesting mods for this 2004 game.",
  work: "The mods are available on my GitHub @andz7z, but here are the 4 mods you can try with one click each. Each mod brings unique features like season changes, time control, skins, and nametags to GTA San Andreas!"
};

// Typing effect
function typeText(element, text, speed = 20) {
  element.textContent = "";
  let i = 0;
  let timer = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// Transition effect
function transitionToSection(targetId) {
  document.body.style.pointerEvents = "none"; // disable click
  const overlay = document.createElement("div");
  overlay.style.position="fixed";
  overlay.style.top=0;
  overlay.style.left=0;
  overlay.style.width="100%";
  overlay.style.height="100%";
  overlay.style.background="rgba(0,0,0,0.9)";
  overlay.style.zIndex=50;
  overlay.style.transition="opacity 1s ease";
  overlay.style.opacity=0;
  document.body.appendChild(overlay);
  requestAnimationFrame(()=>{ overlay.style.opacity=1; });
  setTimeout(()=>{
    sections.forEach(sec=>sec.style.display="none");
    const target = document.getElementById(targetId);
    target.style.display="block";
    typeText(target.querySelector(".story"), storyTexts[targetId]);
    overlay.style.opacity=0;
    setTimeout(()=>{ overlay.remove(); document.body.style.pointerEvents="auto"; },1000);
  },1000);
}

// Button click
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-section');
    if(target==="contact"){
      contactModal.classList.remove('hidden');
    } else {
      transitionToSection(target);
    }
  });
});

// Contact modal
const contactModal = document.getElementById('contact-modal');
const closeModal = document.getElementById('close-modal');
closeModal.addEventListener('click', () => contactModal.classList.add('hidden'));
contactModal.addEventListener('click', e => { if(e.target === contactModal) contactModal.classList.add('hidden'); });
