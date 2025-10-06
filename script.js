// Helpers
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// BRAND reveal actions
const brand = $('#ANDZ');
const brandActions = $('#brandActions');
brand.addEventListener('mouseenter', ()=>{ brandActions.classList.add('show'); brandActions.classList.remove('hidden'); brandActions.setAttribute('aria-hidden','false'); });
brand.addEventListener('mouseleave', ()=>{ brandActions.classList.remove('show'); brandActions.classList.add('hidden'); brandActions.setAttribute('aria-hidden','true'); });
brand.addEventListener('focus', ()=>{ brandActions.classList.add('show'); brandActions.classList.remove('hidden'); });
brand.addEventListener('blur', ()=>{ brandActions.classList.remove('show'); brandActions.classList.add('hidden'); });

// NAV quick open: scroll to columns
$$('.nav-btn').forEach(b=>{
  b.addEventListener('click', ()=> {
    const target = b.dataset.open;
    if(!target) return;
    const el = document.getElementById(target);
    if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
  });
});

// Inline player modal (for GTA / VFX preview)
const modal = $('#playerModal');
const playerWrap = $('#playerWrap');
const closePlayer = $('#closePlayer');

function openPlayer(youtubeEmbedUrl){
  // create iframe (lazy)
  playerWrap.innerHTML = `<iframe width="100%" height="100%" src="${youtubeEmbedUrl}&rel=0&autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  modal.classList.remove('hidden');
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden','false');
}
function closePlayerFn(){
  playerWrap.innerHTML = '';
  modal.classList.add('hidden');
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden','true');
}
closePlayer.addEventListener('click', closePlayerFn);
modal.addEventListener('click', (e)=>{ if(e.target===modal) closePlayerFn(); });

// Attach playInline buttons
$$('.playInline').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const url = btn.dataset.youtube;
    openPlayer(url);
  });
});

// WORK buttons: preview inside button (background image) on hover, click opens repo
$$('.work-btn').forEach(btn=>{
  const img = btn.dataset.img;
  btn.addEventListener('mouseenter', ()=> {
    btn.classList.add('hovered');
    btn.style.setProperty('--img', `url(${img})`);
    // set pseudo-element background via inline style on ::before using CSS variable approach
    btn.style.setProperty('background-image', `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${img})`);
    btn.style.backgroundSize = 'cover';
    btn.style.backgroundPosition = 'center';
  });
  btn.addEventListener('mouseleave', ()=>
