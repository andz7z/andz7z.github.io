/* MAIN interactions: brand reveal, project previews, contact & audio lazy load */

// helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// BRAND reveal (hover & keyboard)
const brand = $('#brand');
const brandMenu = $('#brandMenu');

function showBrand(){ brandMenu.classList.add('show'); brandMenu.setAttribute('aria-hidden','false'); }
function hideBrand(){ brandMenu.classList.remove('show'); brandMenu.setAttribute('aria-hidden','true'); }

brand.addEventListener('mouseenter', showBrand);
brand.addEventListener('focus', showBrand);
brand.addEventListener('mouseleave', hideBrand);
brand.addEventListener('blur', hideBrand);
brand.addEventListener('keydown', e=>{
  if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); brandMenu.classList.toggle('show'); }
});

// BRAND buttons -> scroll
$$('.big-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const tgt = btn.dataset.target;
    if(tgt === 'work') document.getElementById('work').scrollIntoView({behavior:'smooth'});
    if(tgt === 'gta') document.querySelector('.left-col')?.scrollIntoView({behavior:'smooth'});
    if(tgt === 'vfx') document.querySelector('.right-col')?.scrollIntoView({behavior:'smooth'});
    if(btn.id === 'openContact') toggleContact(true);
  });
});

// CONTACT panel open/close
const contactPanel = $('#contactPanel');
const btnContactMini = $('#btnContactMini');
const openContact = $('#openContact');
const closeContact = $('#closeContact');

function toggleContact(forceOpen){
  if(forceOpen === true){ contactPanel.classList.remove('hidden'); contactPanel.style.display='block'; return; }
  if(contactPanel.classList.contains('hidden') || getComputedStyle(contactPanel).display === 'none'){
    contactPanel.classList.remove('hidden'); contactPanel.style.display='block';
  } else {
    contactPanel.classList.add('hidden'); contactPanel.style.display='none';
  }
}
btnContactMini?.addEventListener('click', ()=> toggleContact(true));
openContact?.addEventListener('click', ()=> toggleContact(true));
closeContact?.addEventListener('click', ()=> toggleContact(false));

// PROJECT previews (floating box that follows cursor)
const projects = $$('.project');
const preview = $('#preview');
const previewImg = $('#previewImg');
const previewTitle = $('#previewTitle');
const previewDesc = $('#previewDesc');

projects.forEach(p=>{
  // set background quick preview as low-contrast cover (for visual feedback)
  const img = p.dataset.img;
  if(img) p.style.setProperty('--preview', `url(${img})`);

  p.addEventListener('mouseenter', (e)=>{
    previewImg.src = img || '';
    previewTitle.textContent = p.dataset.title || '';
    previewDesc.textContent = p.dataset.desc || '';
    preview.classList.remove('hidden'); preview.classList.add('visible');
  });
  p.addEventListener('mousemove', (e)=>{
    const pad = 18;
    const boxW = preview.offsetWidth;
    const boxH = preview.offsetHeight;
    let left = e.clientX + pad;
    let top = e.clientY + pad;
    if(left + boxW > window.innerWidth) left = e.clientX - boxW - pad;
    if(top + boxH > window.innerHeight) top = e.clientY - boxH - pad;
    preview.style.left = left + 'px';
    preview.style.top = top + 'px';
  });
  p.addEventListener('mouseleave', ()=>{
    preview.classList.add('hidden'); preview.classList.remove('visible');
  });

  // allow keyboard focus to show preview (accessibility)
  p.addEventListener('focus', (e)=>{
    const rect = p.getBoundingClientRect();
    previewImg.src = img || '';
    previewTitle.textContent = p.dataset.title || '';
    previewDesc.textContent = p.dataset.desc || '';
    preview.classList.remove('hidden'); preview.classList.add('visible');
    // position near element center
    let left = rect.left + rect.width + 12;
    let top = rect.top + 12;
    if(left + preview.offsetWidth > window.innerWidth) left = rect.left - preview.offsetWidth - 12;
    preview.style.left = left + 'px'; preview.style.top = top + 'px';
  });
  p.addEventListener('blur', ()=> { preview.classList.add('hidden'); preview.classList.remove('visible'); });
});

// AUDIO lazy-load toggle using provided YouTube track
const audioBtn = $('#btnAudio');
const audioFrame = $('#audioFrame');
let audioOn = false;
// URL from user (track)
const audioURL = "https://www.youtube.com/embed/nfrHH4I1qNQ?autoplay=1&loop=1&playlist=nfrHH4I1qNQ&enablejsapi=1";

audioBtn.addEventListener('click', ()=>{
  if(!audioOn){
    audioFrame.src = audioURL;
    audioFrame.style.display = 'block';
    audioBtn.textContent = '⏸ Muzică';
    audioBtn.setAttribute('aria-pressed','true');
  } else {
    audioFrame.src = '';
    audioFrame.style.display = 'none';
    audioBtn.textContent = '▶ Muzică';
    audioBtn.setAttribute('aria-pressed','false');
  }
  audioOn = !audioOn;
});

// small parallax bg on mouse move
const bg = $('#bg');
document.addEventListener('mousemove', (e)=>{
  const cx = (e.clientX / window.innerWidth - 0.5) * 10;
  const cy = (e.clientY / window.innerHeight - 0.5) * 6;
  bg.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
});

// keyboard esc closes contact & previews
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    toggleContact(false);
    preview.classList.add('hidden'); preview.classList.remove('visible');
    brandMenu.classList.remove('show');
  }
});
