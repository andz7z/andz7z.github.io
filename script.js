// ====== basic helpers ======
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// ====== brand reveal (hover or keyboard focus) ======
const brand = $('#brand');
const brandActions = $('#brandActions');

function showBrandActions() {
  brandActions.classList.add('show');
}
function hideBrandActions() {
  brandActions.classList.remove('show');
}

brand.addEventListener('mouseenter', showBrandActions);
brand.addEventListener('focus', showBrandActions);
brand.addEventListener('mouseleave', hideBrandActions);
brand.addEventListener('blur', hideBrandActions);

// clicking action buttons scrolls to section
$$('.action-btn').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const key = btn.dataset.scroll;
    if(key === 'work') document.getElementById('work').scrollIntoView({behavior:'smooth'});
    if(key === 'gta') document.getElementById('gtaCol')?.scrollIntoView({behavior:'smooth'});
    if(key === 'vfx') document.getElementById('vfxCol')?.scrollIntoView({behavior:'smooth'});
    if(btn.id === 'contactAction') toggleContact(true);
  });
});

// ====== contact panel ======
const contactPanel = $('#contactPanel');
const openContact = $('#openContact');
const closeContact = $('#closeContact');

function toggleContact(forceOpen){
  if(forceOpen===true){ contactPanel.classList.remove('hidden'); contactPanel.style.display='block'; return; }
  if(contactPanel.classList.contains('hidden') || getComputedStyle(contactPanel).display==='none'){
    contactPanel.classList.remove('hidden');contactPanel.style.display='block';
  } else {
    contactPanel.classList.add('hidden');contactPanel.style.display='none';
  }
}
openContact?.addEventListener('click', ()=> toggleContact(true));
closeContact?.addEventListener('click', ()=> toggleContact(false));

// ====== projects preview (hover -> show previewBox) ======
const previewBox = document.getElementById('previewBox');
const previewImg = document.getElementById('previewImg');
const previewTitle = document.getElementById('previewTitle');
const previewDesc = document.getElementById('previewDesc');

$$('.project').forEach(proj=>{
  proj.addEventListener('mouseenter', e=>{
    const img = proj.dataset.img;
    const title = proj.dataset.title;
    const desc = proj.dataset.desc;
    previewImg.src = img || '';
    previewTitle.textContent = title || '';
    previewDesc.textContent = desc || '';
    previewBox.classList.remove('hidden');
    previewBox.classList.add('visible');
  });
  proj.addEventListener('mousemove', e=>{
    // position preview near cursor but keep inside screen
    const pad = 18;
    let left = e.clientX + pad;
    let top = e.clientY + pad;
    const boxW = previewBox.offsetWidth;
    const boxH = previewBox.offsetHeight;
    if(left + boxW > window.innerWidth) left = e.clientX - boxW - pad;
    if(top + boxH > window.innerHeight) top = e.clientY - boxH - pad;
    previewBox.style.left = left + 'px';
    previewBox.style.top = top + 'px';
  });
  proj.addEventListener('mouseleave', e=>{
    previewBox.classList.add('hidden');
    previewBox.classList.remove('visible');
  });
});

// hide preview on touch (mobile)
document.addEventListener('touchstart', ()=> {
  previewBox.classList.add('hidden'); previewBox.classList.remove('visible');
});

// ====== audio player toggle (lazy load) ======
const audioToggle = $('#audioToggle');
const audioFrame = $('#audioFrame');
let audioPlaying = false;
const audioURL = "https://www.youtube.com/embed/nfrHH4I1qNQ?autoplay=1&loop=1&playlist=nfrHH4I1qNQ&enablejsapi=1";

audioToggle?.addEventListener('click', ()=>{
  if(!audioPlaying){
    // start music (lazy set src)
    audioFrame.src = audioURL;
    audioFrame.style.display='block';
    audioToggle.textContent = '⏸ Music';
    audioToggle.setAttribute('aria-pressed','true');
  } else {
    // stop by clearing src (works cross-browser)
    audioFrame.src = '';
    audioFrame.style.display='none';
    audioToggle.textContent = '▶ Music';
    audioToggle.setAttribute('aria-pressed','false');
  }
  audioPlaying = !audioPlaying;
});

// ====== small accessibility: keyboard toggle for brand actions ======
brand.tabIndex = 0;
brand.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    brandActions.classList.toggle('show');
  }
});

// ====== small parallax on mouse move for bg (subtle) ======
const bg = $('#bg-layer');
document.addEventListener('mousemove', (e)=>{
  const cx = e.clientX / window.innerWidth - 0.5;
  const cy = e.clientY / window.innerHeight - 0.5;
  bg.style.transform = `translate3d(${cx * 8}px, ${cy * 6}px, 0)`;
});

// ====== initial focus states (neat entrance) ======
window.addEventListener('load', ()=>{
  setTimeout(()=> brand.classList.add('loaded'), 150);
});
