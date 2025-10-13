// script-reviews.js — FINAL (Replies iMessage style + fixes)
// Replaces previous file. Ensure index.html contains required IDs referenced below.

// === FIREBASE CONFIG ===
const firebaseConfig = {
  apiKey: "AIzaSyCGn9V5dUPM3m_LxzQuiwDWB5vUc24bF6c",
  authDomain: "andz-reviews-67306.firebaseapp.com",
  databaseURL: "https://andz-reviews-67306-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "andz-reviews-67306",
  storageBucket: "andz-reviews-67306.firebasestorage.app",
  messagingSenderId: "314000134063",
  appId: "1:314000134063:web:850f55c638f8ef34e7695a"
};
if (!firebase.apps?.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// === utils ===
function q(s){ return document.querySelector(s); }
function qa(s){ return Array.from(document.querySelectorAll(s)); }
function escapeHtml(s){
  if(s === null || s === undefined) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// client id
let clientId = localStorage.getItem('andz_clientId');
if(!clientId){ clientId = 'c_'+Math.random().toString(36).slice(2,10); localStorage.setItem('andz_clientId', clientId); }

// === DOM hooks ===
const form = q('#review-form');
const msgInput = q('#message');
const charCount = q('#char-count');
const starEls = qa('#rating-stars span[data-value]');
const genderPreview = q('#preview-img');
const serviceBtns = qa('#service-pick button[data-value]');
const reviewsContainer = q('#reviews-container');
const noReviewsBox = q('#no-reviews');
const paginationEl = q('.pagination');
const prevBtn = q('#prev-page');
const nextBtn = q('#next-page');
const pageInfo = q('#page-info');

const avgValueEl = q('#avg-value');
const avgWebEl = q('#avg-web');
const avgProgEl = q('#avg-prog');
const avgEditEl = q('#avg-edit');
const avgDonut = q('#avg-donut');

const sortFilter = q('#sort-filter');
const serviceFilter = q('#service-filter');
const sortChips = qa('.sort-chip');

// replies modal items (must exist in index.html)
const repliesModal = q('#replies-modal');
const repliesBody = q('#replies-body');
const repliesTitle = q('#replies-title');
const repliesClose = q('#replies-close');
const sendReplyBtn = q('#send-reply');
const replyMsgInput = q('#reply-message');
const replyNameInput = q('#reply-name');
const replyGenderRadios = qa('input[name="reply-gender"]');

// === state ===
let selectedRating = 0;
let selectedGender = '';
let selectedService = null;
let reviews = [];
let currentPage = 1;
const PER_PAGE = 10;
let activeSort = sortFilter ? sortFilter.value : 'recent';
let activeService = serviceFilter ? serviceFilter.value : 'all';

let activeReviewId = null;
let replyGender = 'male';

// === UI helpers ===
function updatePreviewImage(){
  if(!genderPreview) return;
  const g = selectedGender || 'male';
  let img = `assets/logos/reviews/3star_icon_${g}.gif`;
  if(selectedRating <= 2) img = `assets/logos/reviews/1star_icon_${g}.gif`;
  else if(selectedRating === 5) img = `assets/logos/reviews/5star_icon_${g}.gif`;
  genderPreview.classList.add('fade-out');
  setTimeout(()=>{ genderPreview.src = img; genderPreview.classList.remove('fade-out'); }, 160);
}

// star rating
if(starEls.length){
  starEls.forEach(s => s.addEventListener('click', ()=>{
    selectedRating = Number(s.dataset.value) || 0;
    starEls.forEach(x => x.classList.toggle('active', Number(x.dataset.value) <= selectedRating));
    updatePreviewImage();
  }));
}

// gender radios (form)
qa('input[name="gender"]').forEach(r => r.addEventListener('change', ()=>{ selectedGender = r.value; updatePreviewImage(); }));

// service pick
if(serviceBtns.length){
  serviceBtns.forEach(b => b.addEventListener('click', function(){
    serviceBtns.forEach(x=>x.classList.remove('active'));
    this.classList.add('active');
    selectedService = this.dataset.value;
  }));
}

// char count
if(msgInput && charCount) msgInput.addEventListener('input', ()=> charCount.textContent = `${msgInput.value.length} / ${msgInput.maxLength || 200}`);

// submit review
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const nameEl = q('#name');
    const name = nameEl ? nameEl.value.trim() : '';
    const gender = selectedGender || (form.gender && form.gender.value) || '';
    const message = msgInput ? msgInput.value.trim() : '';
    if(!name || !gender || !message || !selectedRating || !selectedService){
      return alert('Completează toate câmpurile și selectează rating + serviciu.');
    }
    let img = `3star_icon_${gender}.gif`;
    if(selectedRating <= 2) img = `1star_icon_${gender}.gif`;
    else if(selectedRating === 5) img = `5star_icon_${gender}.gif`;

    const payload = {
      name, gender, image: img, message,
      rating: Number(selectedRating), service: selectedService,
      date: new Date().toISOString(), likes: 0, dislikes: 0
    };
    db.ref('reviews').push(payload)
      .then(()=> {
        form.reset();
        selectedRating = 0; selectedGender = ''; selectedService = null;
        starEls.forEach(s=>s.classList.remove('active'));
        serviceBtns.forEach(b=>b.classList.remove('active'));
        if(charCount) charCount.textContent = '0 / 100';
        showToast('Review trimis ✅');
      })
      .catch(err => { console.error('Review push err', err); alert('Eroare la trimitere. Vezi consola.'); });
  });
}

// === load reviews ===
function loadReviews(){
  db.ref('reviews').on('value', snap=>{
    const arr = [];
    const ratings = { web: [], prog: [], edit: [] };
    const counts = {};
    snap.forEach(child=>{
      const v = child.val();
      const obj = Object.assign({}, v);
      obj.id = child.key;
      obj.rating = Number(obj.rating) || 0;
      arr.push(obj);
      if(obj.service){
        if(obj.service === 'web') ratings.web.push(obj.rating);
        else if(obj.service === 'prog') ratings.prog.push(obj.rating);
        else if(obj.service === 'edit') ratings.edit.push(obj.rating);
      }
      counts[obj.name] = (counts[obj.name] || 0) + 1;
    });

    const enhanced = arr.map(r=>{
      let badge = null;
      const c = counts[r.name] || 0;
      if(c >= 5) badge = '🏆 Top Reviewer';
      else if(c >= 3) badge = '💡 Contributor';
      return Object.assign({}, r, { totalReviews: c, badge });
    });

    enhanced.sort((a,b)=> new Date(b.date) - new Date(a.date));
    reviews = enhanced;
    updateAvgs(ratings);
    renderPage();
  }, err => console.error('Firebase read error', err));
}

// === averages ===
function updateAvgs(r){
  const avg = a => a.length ? (a.reduce((s,x)=>s+x,0)/a.length) : 0;
  const overall = avg([...r.web, ...r.prog, ...r.edit]);
  if(avgValueEl) avgValueEl.textContent = overall ? overall.toFixed(2) : '0.00';
  if(avgWebEl) avgWebEl.textContent = `🌐 ${avg(r.web).toFixed(2)}`;
  if(avgProgEl) avgProgEl.textContent = `💻 ${avg(r.prog).toFixed(2)}`;
  if(avgEditEl) avgEditEl.textContent = `🎬 ${avg(r.edit).toFixed(2)}`;
  if(avgDonut){
    try{
      const percent = (overall/5)*100;
      const circ = 2*Math.PI*45;
      avgDonut.style.strokeDasharray = circ;
      avgDonut.style.strokeDashoffset = circ - (percent/100)*circ;
    }catch(e){}
  }
}

// === filters
if(sortFilter) sortFilter.addEventListener('change', ()=>{ activeSort = sortFilter.value; currentPage = 1; renderPage(); });
if(serviceFilter) serviceFilter.addEventListener('change', ()=>{ activeService = serviceFilter.value; currentPage = 1; renderPage(); });

// === get filtered/sorted
function getFilteredSorted(){
  let arr = reviews.slice();
  if(activeService && activeService !== 'all') arr = arr.filter(r=>r.service === activeService);
  if(activeSort === 'recent') arr.sort((a,b)=> new Date(b.date) - new Date(a.date));
  else if(activeSort === 'oldest') arr.sort((a,b)=> new Date(a.date) - new Date(b.date));
  else if(activeSort === 'highest') arr.sort((a,b)=> b.rating - a.rating || new Date(b.date)-new Date(a.date));
  else if(activeSort === 'lowest') arr.sort((a,b)=> a.rating - b.rating || new Date(b.date)-new Date(a.date));
  return arr;
}

// === render page ===
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
    if(paginationEl) paginationEl.classList.add('hidden');
    return;
  } else {
    if(noReviewsBox) noReviewsBox.style.display = 'none';
    const reviewsSection = q('#reviews');
    if(reviewsSection && reviewsSection.classList.contains('active')) paginationEl && paginationEl.classList.remove('hidden');
    else paginationEl && paginationEl.classList.add('hidden');
  }

  visible.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'review-card glassy';
    const gender = r.gender || 'male';
    let img = `assets/logos/reviews/3star_icon_${gender}.gif`;
    if(r.rating <= 2) img = `assets/logos/reviews/1star_icon_${gender}.gif`;
    else if(r.rating === 5) img = `assets/logos/reviews/5star_icon_${gender}.gif`;
    const emoji = r.service === 'web' ? '🌐' : r.service === 'prog' ? '💻' : '🎬';
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);

    card.innerHTML = `
      <div class="review-header">
        <img class="author-img" src="${img}" alt="">
        <div class="review-meta">
          <div class="meta-top">
            <h4 class="meta-name">${escapeHtml(r.name)} <span class="service-emoji">${emoji}</span> ${r.badge ? `<span class="badge">${r.badge}</span>` : ''}</h4>
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

    // fix style for like/dislike (prevent white bg / invisible font)
    const likeBtn = card.querySelector('.like-btn');
    const dislikeBtn = card.querySelector('.dislike-btn');
    const replyBtn = card.querySelector('.reply-btn');
    const likeCountSpan = card.querySelector('.like-count');
    const dislikeCountSpan = card.querySelector('.dislike-count');
    const replyListEl = card.querySelector(`#replies-${r.id}`);

    if(likeBtn){ likeBtn.style.background = 'transparent'; likeBtn.style.color = 'inherit'; }
    if(dislikeBtn){ dislikeBtn.style.background = 'transparent'; dislikeBtn.style.color = 'inherit'; }

    // vote handlers (simple single vote per client)
    if(likeBtn){
      likeBtn.addEventListener('click', function(){
        const reviewId = this.dataset.id;
        const key = `vote_${reviewId}_${clientId}`;
        if(localStorage.getItem(key)){ alert('Ai votat deja.'); return; }
        db.ref(`reviews/${reviewId}/likes`).transaction(v => (v||0)+1);
        localStorage.setItem(key, '1');
        if(likeCountSpan) likeCountSpan.textContent = Number(likeCountSpan.textContent||0)+1;
        this.disabled = true;
      });
    }
    if(dislikeBtn){
      dislikeBtn.addEventListener('click', function(){
        const reviewId = this.dataset.id;
        const key = `vote_${reviewId}_${clientId}`;
        if(localStorage.getItem(key)){ alert('Ai votat deja.'); return; }
        db.ref(`reviews/${reviewId}/dislikes`).transaction(v => (v||0)+1);
        localStorage.setItem(key, '-1');
        if(dislikeCountSpan) dislikeCountSpan.textContent = Number(dislikeCountSpan.textContent||0)+1;
        this.disabled = true;
      });
    }

    // Inline reply preview (up to 2)
    const rRef = db.ref(`reviews/${r.id}/replies`);
    rRef.off('value');
    rRef.on('value', snap=>{
      const data = snap.val() || {};
      const keys = Object.keys(data);
      const count = keys.length;
      const replyCountSpan = card.querySelector('.reply-count');
      if(replyCountSpan) replyCountSpan.textContent = count;
      // render up to 2 inline messages
      replyListEl.innerHTML = '';
      const firstTwo = keys.slice(0,2);
      firstTwo.forEach((k, idx)=>{
        const rep = data[k];
        if(!rep) return;
        // compact bubble style
        const div = document.createElement('div');
        div.className = 'reply-inline-bubble';
        div.style.display = 'flex';
        div.style.gap = '8px';
        div.style.alignItems = 'flex-start';
        div.style.marginTop = '8px';
        const imgSrc = `assets/logos/reviews/3star_icon_${rep.gender || 'male'}.gif`;
        div.innerHTML = `
          <img src="${imgSrc}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;border:1px solid rgba(255,255,255,0.06)" alt="">
          <div style="text-align:left">
            <div style="font-weight:700;font-size:0.95rem">${escapeHtml(rep.name)}</div>
            <div style="font-size:0.9rem;opacity:0.9;margin-top:4px">${escapeHtml(rep.message || rep.text || '')}</div>
            <div style="font-size:0.75rem;opacity:0.6;margin-top:4px">${new Date(rep.date).toLocaleString()}</div>
          </div>
        `;
        replyListEl.appendChild(div);
      });
    });

    // open full replies modal
    if(replyBtn) replyBtn.addEventListener('click', ()=> openRepliesModalForReview(r));
  });

  // pagination UI
  if(pageInfo) pageInfo.textContent = `Page ${currentPage} / ${Math.max(1, Math.ceil(getFilteredSorted().length / PER_PAGE))}`;
  if(prevBtn) prevBtn.disabled = currentPage <= 1;
  if(nextBtn) nextBtn.disabled = currentPage >= Math.max(1, Math.ceil(getFilteredSorted().length / PER_PAGE));
}

// pagination buttons
if(prevBtn) prevBtn.addEventListener('click', ()=>{ if(currentPage>1){ currentPage--; renderPage(); }});
if(nextBtn) nextBtn.addEventListener('click', ()=>{ const max = Math.max(1, Math.ceil(getFilteredSorted().length / PER_PAGE)); if(currentPage < max){ currentPage++; renderPage(); }});

// === Replies modal (chat style iMessage) ===
replyGenderRadios.forEach(r => r.addEventListener('change', ()=> replyGender = r.value));

// close modal
if(repliesClose) repliesClose.addEventListener('click', ()=>{
  if(repliesModal) repliesModal.classList.add('hidden');
  if(activeReviewId) db.ref(`reviews/${activeReviewId}/replies`).off();
  activeReviewId = null;
});

// open helper
function openRepliesModalForReview(review){
  activeReviewId = review.id;
  if(repliesModal) repliesModal.classList.remove('hidden');
  if(repliesTitle) repliesTitle.textContent = `${review.name} — comments`;
  if(replyMsgInput) replyMsgInput.value = '';
  if(replyNameInput) replyNameInput.value = '';
  replyGender = 'male';
  const first = replyGenderRadios.find(r=>r.value==='male'); if(first) first.checked = true;
  loadRepliesForReview(activeReviewId);
  updateReplyCountForReview(activeReviewId);
}

// load replies and render as chat bubbles alternating sides to mimic iMessage
function loadRepliesForReview(reviewId){
  if(!repliesBody) return;
  repliesBody.innerHTML = '<p class="muted">Loading…</p>';
  const ref = db.ref(`reviews/${reviewId}/replies`);
  ref.off('value');
  ref.on('value', snap=>{
    repliesBody.innerHTML = '';
    const data = snap.val() || {};
    const entries = Object.entries(data).map(([k,v]) => Object.assign({ id: k }, v));
    entries.sort((a,b)=> new Date(a.date) - new Date(b.date));
    if(entries.length === 0){
      repliesBody.innerHTML = '<p class="muted">No replies yet. Fii primul!</p>';
      return;
    }
    // render each as a chat row. alternate sides by index (even = left, odd = right)
    entries.forEach((rep, i)=>{
      const text = rep.message || rep.text || '';
      const gender = rep.gender || 'male';
      const side = (i % 2 === 0) ? 'left' : 'right'; // alternate
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.marginBottom = '12px';
      row.style.alignItems = 'flex-end';
      if(side === 'left') row.style.justifyContent = 'flex-start';
      else row.style.justifyContent = 'flex-end';

      // bubble container
      const bubble = document.createElement('div');
      bubble.style.maxWidth = '75%';
      bubble.style.padding = '10px 12px';
      bubble.style.borderRadius = '18px';
      bubble.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)';
      bubble.style.fontSize = '0.95rem';
      bubble.style.lineHeight = '1.2';
      bubble.style.background = (side === 'left') ? 'linear-gradient(180deg,#ffffff10,#ffffff06)' : 'linear-gradient(180deg,#6fc3ff,#4da6e6)';
      bubble.style.color = (side === 'left') ? 'inherit' : '#021323';
      bubble.style.textAlign = 'left';
      bubble.style.display = 'inline-block';

      // avatar
      const avatar = document.createElement('img');
      avatar.src = `assets/logos/reviews/3star_icon_${gender}.gif`;
      avatar.alt = '';
      avatar.style.width = '40px';
      avatar.style.height = '40px';
      avatar.style.borderRadius = '12px';
      avatar.style.objectFit = 'cover';
      avatar.style.margin = side === 'left' ? '0 10px 0 0' : '0 0 0 10px';
      avatar.style.border = '1px solid rgba(255,255,255,0.06)';

      // bubble content
      const nameEl = document.createElement('div');
      nameEl.textContent = rep.name || 'Anonymous';
      nameEl.style.fontWeight = '700';
      nameEl.style.marginBottom = '6px';
      nameEl.style.fontSize = '0.92rem';

      const textEl = document.createElement('div');
      textEl.innerHTML = escapeHtml(text);
      textEl.style.whiteSpace = 'pre-wrap';

      const timeEl = document.createElement('div');
      timeEl.textContent = new Date(rep.date).toLocaleString();
      timeEl.style.fontSize = '0.72rem';
      timeEl.style.opacity = '0.6';
      timeEl.style.marginTop = '6px';

      bubble.appendChild(nameEl);
      bubble.appendChild(textEl);
      bubble.appendChild(timeEl);

      if(side === 'left'){
        row.appendChild(avatar);
        row.appendChild(bubble);
      } else {
        row.appendChild(bubble);
        row.appendChild(avatar);
      }
      repliesBody.appendChild(row);
    });

    // scroll bottom
    repliesBody.scrollTop = repliesBody.scrollHeight;
  });
}

// send reply (requires name + message)
if(sendReplyBtn){
  sendReplyBtn.addEventListener('click', ()=>{
    if(!activeReviewId) return alert('Nicio recenzie selectată.');
    const name = (replyNameInput && replyNameInput.value.trim()) || '';
    const message = (replyMsgInput && replyMsgInput.value.trim()) || '';
    if(!name) return alert('Introdu numele înainte de a trimite reply.');
    if(!message) return alert('Scrie un mesaj înainte de a trimite.');
    const payload = {
      name, gender: replyGender || 'male', message,
      likes: 0, dislikes: 0, date: new Date().toISOString()
    };
    db.ref(`reviews/${activeReviewId}/replies`).push(payload)
      .then(()=> {
        if(replyMsgInput) replyMsgInput.value = '';
        if(replyNameInput) replyNameInput.value = '';
        // replies listener will update modal automatically
      })
      .catch(err=> { console.error('Reply push err', err); alert('Eroare la trimitere reply.'); });
  });
}

// update reply count helper
function updateReplyCountForReview(reviewId){
  db.ref(`reviews/${reviewId}/replies`).once('value').then(snap=>{
    const count = snap.exists() ? Object.keys(snap.val()).length : 0;
    const btn = document.querySelector(`.reply-btn[data-id="${reviewId}"]`);
    if(btn){
      const span = btn.querySelector('.reply-count') || (()=>{ const s = document.createElement('span'); s.className='reply-count'; btn.appendChild(s); return s; })();
      span.textContent = count;
    }
  }).catch(e=>console.warn('updateReplyCount err', e));
}

// cleanup listeners when closing modal or unloading
if(repliesClose) repliesClose.addEventListener('click', ()=>{
  if(activeReviewId) db.ref(`reviews/${activeReviewId}/replies`).off();
  activeReviewId = null;
});
window.addEventListener('beforeunload', ()=> {
  try{ reviews.forEach(r => { if(r && r.id) db.ref(`reviews/${r.id}/replies`).off(); }); }catch(e){}
});

// small toast
function showToast(txt, t=1600){
  const el = document.createElement('div');
  el.textContent = txt;
  el.style.position = 'fixed';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.bottom = '28px';
  el.style.padding = '8px 12px';
  el.style.background = 'rgba(0,0,0,0.75)';
  el.style.color = '#fff';
  el.style.borderRadius = '10px';
  el.style.zIndex = 99999;
  document.body.appendChild(el);
  setTimeout(()=> el.style.opacity = '1', 10);
  setTimeout(()=> { el.style.opacity = '0'; setTimeout(()=> el.remove(), 300); }, t);
}

// init
document.addEventListener('DOMContentLoaded', ()=>{
  loadReviews();
  // pagination buttons
  if(prevBtn) prevBtn.addEventListener('click', ()=>{ if(currentPage>1){ currentPage--; renderPage(); }});
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ const max = Math.max(1, Math.ceil(getFilteredSorted().length / PER_PAGE)); if(currentPage < max){ currentPage++; renderPage(); }});
});

console.log('[ANDZ] script-reviews.js loaded (iMessage replies enabled).');
