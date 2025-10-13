// === FIREBASE SETUP ===
const firebaseConfig = {
    apiKey: "AIzaSyCGn9V5dUPM3m_LxzQuiwDWB5vUc24bF6c",
    authDomain: "andz-reviews-67306.firebaseapp.com",
    databaseURL: "https://andz-reviews-67306-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "andz-reviews-67306",
    storageBucket: "andz-reviews-67306.firebasestorage.app",
    messagingSenderId: "314000134063",
    appId: "1:314000134063:web:850f55c638f8ef34e7695a"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Helper functions
function q(sel){ return document.querySelector(sel); }
function qa(sel){ return Array.from(document.querySelectorAll(sel)); }
function escapeHtml(s){
  if(!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function toast(msg, timeout=2800){
  const t = document.createElement('div');
  t.className = 'andz-toast';
  t.innerHTML = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('visible'));
  setTimeout(()=> { t.classList.remove('visible'); setTimeout(()=>t.remove(),300); }, timeout);
}

// Client identity
let clientId = localStorage.getItem('andz_clientId');
if(!clientId){
  clientId = 'c_' + Math.random().toString(36).slice(2,10);
  localStorage.setItem('andz_clientId', clientId);
}

// Lazy-load reviews
let reviewsLoaded = false;
function openSection(name){
  qa('[data-section]').forEach(el => el.style.display = 'none');
  const target = q(`[data-section="${name}"]`);
  if(target){
    target.style.display = 'block';
    setTimeout(()=> target.scrollIntoView({behavior:'smooth', block:'start'}), 60);
    if(name === 'reviews' && !reviewsLoaded){
      initReviews();
      reviewsLoaded = true;
    }
  }
}

// DOM refs
const reviewsContainer = q('#reviews-container');
const noReviewsBox = q('#no-reviews');
const form = q('#review-form');
const starEls = qa('#rating-stars span[data-value]');
const serviceBtns = qa('#review-form button[data-value]');
const charCount = q('#char-count');
const avgDonut = q('#avg-donut');
const avgValueEl = q('#avg-value');
const avgWebEl = q('#avg-web');
const avgProgEl = q('#avg-prog');
const avgEditEl = q('#avg-edit');
const reviewsBg = q('.avg-sub') || q('.reviews-bg');
const paginationEl = q('.pagination');
const prevBtn = q('#prev-page');
const nextBtn = q('#next-page');
const pageInfo = q('#page-info');
const sortFilter = q('#sort-filter');
const serviceFilter = q('#service-filter');
const sortChips = qa('.sort-chip');

let selectedRating = 0;
let selectedService = null;
let reviews = [];
let currentPage = 1;
const PER_PAGE = 10;
let activeSort = sortFilter ? sortFilter.value : 'recent';
let activeService = serviceFilter ? serviceFilter.value : 'all';

// Rating stars
if(starEls.length){
  starEls.forEach(s => s.addEventListener('click', function(){
    selectedRating = Number(this.dataset.value) || 0;
    starEls.forEach(x => x.classList.toggle('active', Number(x.dataset.value) <= selectedRating));
  }));
}

// Service buttons
if(serviceBtns.length){
  serviceBtns.forEach(b => b.addEventListener('click', function(){
    serviceBtns.forEach(x => x.classList.remove('active'));
    this.classList.add('active');
    selectedService = this.dataset.value;
  }));
}

// Character counter
if(charCount){
  const msg = q('#message');
  if(msg){
    msg.addEventListener('input', ()=> charCount.textContent = `${msg.value.length} / 200`);
  }
}

// Submit review
if(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const gender = form.gender.value;
    const message = form.message.value.trim();
    if(!name || !gender || !message || !selectedRating || !selectedService){
      return toast('Completeaza toate campurile si alege rating + serviciu', 2400);
    }
    const payload = {
      name, gender, message,
      rating: Number(selectedRating),
      service: selectedService,
      date: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      votes: {}
    };
    db.ref('reviews').push(payload).then(() => {
      form.reset();
      selectedRating = 0; selectedService = null;
      starEls.forEach(x => x.classList.remove('active'));
      serviceBtns.forEach(b => b.classList.remove('active'));
      charCount && (charCount.textContent = '0 / 200');
      toast(`🎉 Mulțumim, ${escapeHtml(name)}! Recenzia ta a fost trimisă.`);
      likeBurstAnimation();
    }).catch(err => {
      console.error('write review error', err);
      toast('Eroare la trimitere (vezi consola).', 2400);
    });
  });
}

// Initialize reviews
function initReviews(){
  if(sortFilter){ sortFilter.addEventListener('change', ()=> { activeSort = sortFilter.value; currentPage=1; renderPage(); syncSortChips(); }); }
  if(serviceFilter){ serviceFilter.addEventListener('change', ()=> { activeService = serviceFilter.value; currentPage=1; renderPage(); }); }
  sortChips.forEach(chip => chip.addEventListener('click', ()=> {
    const val = chip.dataset.sort;
    if(sortFilter) sortFilter.value = val;
    activeSort = val;
    currentPage = 1;
    syncSortChips();
    renderPage();
  }));

  db.ref('reviews').on('value', snapshot => {
    const arr = [];
    const ratings = { web: [], prog: [], edit: [] };
    const counts = {};
    snapshot.forEach(ch => {
      const v = ch.val();
      const obj = Object.assign({}, v);
      obj.id = ch.key;
      obj.rating = Number(obj.rating) || 0;
      arr.push(obj);
      if(obj.service === 'web') ratings.web.push(obj.rating);
      if(obj.service === 'prog') ratings.prog.push(obj.rating);
      if(obj.service === 'edit') ratings.edit.push(obj.rating);
      counts[obj.name] = (counts[obj.name] || 0) + 1;
    });
    const enhanced = arr.map(r => {
      let badge = null;
      const c = counts[r.name] || 0;
      if(c >= 50) badge = '👑 Legend';
      else if(c >= 5) badge = '🏆 Top Reviewer';
      else if(c >= 3) badge = '💡 Contributor';
      return Object.assign({}, r, { badge, totalReviews: c });
    });
    reviews = enhanced.sort((a,b) => new Date(b.date) - new Date(a.date));
    updateAvgs(ratings);
    renderPage();
  }, err => console.error('db:on error', err));
}

// Average ratings
function updateAvgs(ratings){
  const avg = arr => arr.length ? (arr.reduce((s,x)=>s+x,0)/arr.length) : 0;
  const overallArr = [...ratings.web, ...ratings.prog, ...ratings.edit];
  const overall = avg(overallArr);
  avgValueEl && (avgValueEl.textContent = overall ? overall.toFixed(2) : '0.00');
  avgWebEl && (avgWebEl.textContent = `🌐 ${avg(ratings.web).toFixed(2)}`);
  avgProgEl && (avgProgEl.textContent = `💻 ${avg(ratings.prog).toFixed(2)}`);
  avgEditEl && (avgEditEl.textContent = `🎬 ${avg(ratings.edit).toFixed(2)}`);
}

// Filtering & sorting
function getFilteredSorted(){
  let arr = reviews.slice();
  if(activeService && activeService !== 'all'){
    arr = arr.filter(r => r.service === activeService);
  }
  if(activeSort === 'recent') arr.sort((a,b)=> new Date(b.date) - new Date(a.date));
  else if(activeSort === 'oldest') arr.sort((a,b)=> new Date(a.date) - new Date(b.date));
  else if(activeSort === 'highest') arr.sort((a,b)=> b.rating - a.rating || (new Date(b.date)-new Date(a.date)));
  else if(activeSort === 'lowest') arr.sort((a,b)=> a.rating - b.rating || (new Date(b.date)-new Date(a.date)));
  return arr;
}

// Render reviews
function renderPage(){
  if(!reviewsContainer) return;
  const filtered = getFilteredSorted();
  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / PER_PAGE));
  if(currentPage > maxPage) currentPage = maxPage;
  const start = (currentPage - 1) * PER_PAGE;
  const visible = filtered.slice(start, start + PER_PAGE);
  reviewsContainer.innerHTML = '';
  if(!visible.length){
    if(noReviewsBox) noReviewsBox.style.display = 'block';
    paginationEl && paginationEl.classList.add('hidden');
    return;
  } else {
    if(noReviewsBox) noReviewsBox.style.display = 'none';
    paginationEl && paginationEl.classList.remove('hidden');
  }

  visible.forEach(r => {
    const card = document.createElement('div');
    card.className = 'review-card glassy';
    const img = `assets/logos/reviews/${r.gender || 'male'}.gif`;
    const svcEmoji = r.service === 'web' ? '🌐' : r.service === 'prog' ? '💻' : '🎬';
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    card.innerHTML = `
      <div class="review-header">
        <img class="author-img" src="${img}" alt="${escapeHtml(r.gender||'')}">
        <div class="review-meta">
          <div class="meta-top">
            <h4 class="meta-name">${escapeHtml(r.name)} <span class="service-emoji">${svcEmoji}</span>
              ${r.badge ? `<span class="badge">${r.badge}</span>` : ''}
            </h4>
            <div class="meta-sub"><small class="meta-count">${r.totalReviews || 1} reviews</small></div>
          </div>
        </div>
        <div class="review-rating">${stars}</div>
      </div>
      <p class="review-text">${escapeHtml(r.message)}</p>
      <div class="review-actions-row">
        <div class="action-left">
          <button class="like-btn" data-id="${r.id}">👍 <span class="like-count">${r.likes||0}</span></button>
          <button class="dislike-btn" data-id="${r.id}">👎 <span class="dislike-count">${r.dislikes||0}</span></button>
          <button class="reply-btn" data-id="${r.id}">💬 <span class="reply-count">0</span></button>
        </div>
        <div class="action-right">
          <small class="review-date">${new Date(r.date).toLocaleString()}</small>
        </div>
      </div>
      <div class="reply-list" id="replies-${r.id}"></div>
    `;
    reviewsContainer.appendChild(card);

    const likeBtn = card.querySelector('.like-btn');
    const dislikeBtn = card.querySelector('.dislike-btn');
    const likeCountSpan = card.querySelector('.like-count');
    const dislikeCountSpan = card.querySelector('.dislike-count');

    const voteRef = db.ref(`reviews/${r.id}/votes/${clientId}`);
    voteRef.once('value').then(snap => {
      const val = snap.val();
      const v = val && val.vote ? Number(val.vote) : 0;
      if(v === 1) likeBtn.disabled = true;
      if(v === -1) dislikeBtn.disabled = true;
    }).catch(err => console.error(err));

    likeBtn.addEventListener('click', ()=> handleVote(r.id, 1, likeCountSpan, dislikeCountSpan, likeBtn, dislikeBtn));
    dislikeBtn.addEventListener('click', ()=> handleVote(r.id, -1, likeCountSpan, dislikeCountSpan, likeBtn, dislikeBtn));

    const replyListEl = card.querySelector(`#replies-${r.id}`);
    db.ref(`reviews/${r.id}/replies`).on('value', snap => {
      const obj = snap.val() || {};
      const keys = Object.keys(obj);
      const count = keys.length;
      const replyCountEl = card.querySelector('.reply-count');
      if(replyCountEl) replyCountEl.textContent = count;
      replyListEl.innerHTML = '';
      const arr = keys.map(k => ({ id: k, ...obj[k] })).sort((a,b)=> new Date(a.date) - new Date(b.date));
      const last = arr.slice(-2);
      last.forEach(rep => {
        const block = document.createElement('div');
        block.className = 'reply-inline';
        const pimg = `assets/logos/reviews/${rep.gender || 'male'}.gif`;
        block.innerHTML = `<img class="reply-author-img" src="${pimg}" alt="">
          <div class="reply-inline-body"><strong>${escapeHtml(rep.name)}</strong> <small class="reply-date-inline">${new Date(rep.date).toLocaleDateString()}</small>
          <div class="reply-text-inline">${escapeHtml(rep.text)}</div></div>`;
        replyListEl.appendChild(block);
      });
    });

    const replyBtn = card.querySelector('.reply-btn');
    replyBtn.addEventListener('click', ()=> openReplyDialog(r.id));
  });

  // ✅ pagination UI (fix: maxPage already defined above)
  pageInfo && (pageInfo.textContent = `Page ${currentPage} / ${maxPage}`);
  prevBtn && (prevBtn.disabled = currentPage <= 1);
  nextBtn && (nextBtn.disabled = currentPage >= maxPage);

  const footer = document.querySelector('footer');
  if(footer && paginationEl) { footer.appendChild(paginationEl); paginationEl.classList.remove('hidden'); }
}

// ✅ rest of helper functions (unchanged)
function handleVote(reviewId, intendedVote, likeCountSpan, dislikeCountSpan, likeBtn, dislikeBtn){
  const vRef = db.ref(`reviews/${reviewId}/votes/${clientId}`);
  vRef.once('value').then(snap => {
    const current = snap.val() && snap.val().vote ? Number(snap.val().vote) : 0;
    if(current === intendedVote){
      const counterKey = intendedVote === 1 ? 'likes' : 'dislikes';
      db.ref(`reviews/${reviewId}/${counterKey}`).transaction(n => (n || 1) - 1);
      vRef.remove();
      if(intendedVote === 1){ likeBtn.disabled = false; likeCountSpan.textContent = Math.max(0, Number(likeCountSpan.textContent||0)-1); }
      else { dislikeBtn.disabled = false; dislikeCountSpan.textContent = Math.max(0, Number(dislikeCountSpan.textContent||0)-1); }
    } else if(current === 0){
      const counterKey = intendedVote === 1 ? 'likes' : 'dislikes';
      db.ref(`reviews/${reviewId}/${counterKey}`).transaction(n => (n || 0) + 1);
      vRef.set({ vote: intendedVote, at: new Date().toISOString() });
      if(intendedVote === 1){ likeBtn.disabled = true; likeCountSpan.textContent = Number(likeCountSpan.textContent||0)+1; animateLike(likeBtn); }
      else { dislikeBtn.disabled = true; dislikeCountSpan.textContent = Number(dislikeCountSpan.textContent||0)+1; }
    } else {
      const incKey = intendedVote === 1 ? 'likes' : 'dislikes';
      const decKey = intendedVote === 1 ? 'dislikes' : 'likes';
      db.ref(`reviews/${reviewId}/${incKey}`).transaction(n => (n || 0)+1);
      db.ref(`reviews/${reviewId}/${decKey}`).transaction(n => (n || 1)-1);
      vRef.set({ vote: intendedVote, at: new Date().toISOString() });
      if(intendedVote === 1){
        likeBtn.disabled = true; dislikeBtn.disabled = false;
        likeCountSpan.textContent = Number(likeCountSpan.textContent||0)+1;
        dislikeCountSpan.textContent = Math.max(0, Number(dislikeCountSpan.textContent||0)-1);
        animateLike(likeBtn);
      } else {
        dislikeBtn.disabled = true; likeBtn.disabled = false;
        dislikeCountSpan.textContent = Number(dislikeCountSpan.textContent||0)+1;
        likeCountSpan.textContent = Math.max(0, Number(likeCountSpan.textContent||0)-1);
      }
    }
  });
}

// Like animation
function animateLike(btn){
  const rect = btn.getBoundingClientRect();
  const heart = document.createElement('div');
  heart.className = 'like-burst';
  heart.textContent = '💖';
  heart.style.position = 'fixed';
  heart.style.left = (rect.left + rect.width/2) + 'px';
  heart.style.top = (rect.top - 8) + 'px';
  document.body.appendChild(heart);
  requestAnimationFrame(()=> {
    heart.style.transition = 'all 520ms cubic-bezier(.2,.9,.2,1)';
    heart.style.opacity = 1;
    heart.style.transform = 'translateY(-28px) scale(1.2)';
  });
  setTimeout(()=> heart.remove(), 900);
}
function likeBurstAnimation(){
  for(let i=0;i<6;i++){
    const dot = document.createElement('div');
    dot.className = 'confetti-dot';
    dot.style.left = (50 + (Math.random()*80-40)) + '%';
    dot.style.top = (10 + Math.random()*6) + '%';
    document.body.appendChild(dot);
    setTimeout(()=> dot.remove(), 1200);
  }
}

// Pagination
if(prevBtn) prevBtn.addEventListener('click', ()=> { if(currentPage>1){ currentPage--; renderPage(); } });
if(nextBtn) nextBtn.addEventListener('click', ()=> { currentPage++; renderPage(); });

// Sort chip sync
function syncSortChips(){
  sortChips.forEach(chip => chip.classList.toggle('active', chip.dataset.sort === activeSort));
}
syncSortChips();

// Hide all sections initially
document.addEventListener('DOMContentLoaded', ()=> {
  qa('[data-section]').forEach(el => el.style.display = 'none');
});

window.openSection = openSection;
