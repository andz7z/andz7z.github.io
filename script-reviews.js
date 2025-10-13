// script-reviews.js (REFACTORED & FIXED)
// Single-file replacement — use this instead of the previous broken version.

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

// ===== utils =====
function q(sel){ return document.querySelector(sel); }
function qa(sel){ return Array.from(document.querySelectorAll(sel)); }
function escapeHtml(s){
  if(!s && s !== 0) return "";
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

// one-vote-per-client helper
let clientId = localStorage.getItem('andz_clientId');
if(!clientId){
  clientId = 'c_' + Math.random().toString(36).slice(2,10);
  localStorage.setItem('andz_clientId', clientId);
}

// ===== DOM Hooks (ensure they exist in your index.html) =====
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

if(!reviewsContainer){
  console.error('Missing #reviews-container in DOM — reviews will not render.');
}

// ===== state =====
let selectedRating = 0;
let selectedGender = '';
let selectedService = null;
let reviews = [];
let currentPage = 1;
const PER_PAGE = 10;
let activeSort = sortFilter ? sortFilter.value : 'recent';
let activeService = serviceFilter ? serviceFilter.value : 'all';

// ===== UI helpers =====
function updatePreviewImage() {
  if(!genderPreview) return;
  const gender = selectedGender || 'male';
  let img = `assets/logos/reviews/3star_icon_${gender}.gif`;
  if(selectedRating <= 2) img = `assets/logos/reviews/1star_icon_${gender}.gif`;
  else if(selectedRating === 5) img = `assets/logos/reviews/5star_icon_${gender}.gif`;
  // smooth swap
  genderPreview.classList.add('fade-out');
  setTimeout(()=>{ genderPreview.src = img; genderPreview.classList.remove('fade-out'); genderPreview.classList.add('fade-in'); }, 180);
}

// stars
if(starEls.length){
  starEls.forEach(el=>{
    el.addEventListener('click', () => {
      selectedRating = Number(el.dataset.value) || 0;
      starEls.forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= selectedRating));
      updatePreviewImage();
    });
  });
}

// gender radios (form)
qa('input[name="gender"]').forEach(r => r.addEventListener('change', () => {
  selectedGender = r.value;
  updatePreviewImage();
}));

// service pick
if(serviceBtns.length){
  serviceBtns.forEach(btn=>{
    btn.addEventListener('click', function(){
      serviceBtns.forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      selectedService = this.dataset.value;
    });
  });
}

// char count
if(msgInput && charCount){
  msgInput.addEventListener('input', ()=> charCount.textContent = `${msgInput.value.length} / ${msgInput.maxLength || 200}`);
}

// ===== SUBMIT REVIEW =====
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
    let imgFile = `3star_icon_${gender}.gif`;
    if(selectedRating <= 2) imgFile = `1star_icon_${gender}.gif`;
    else if(selectedRating === 5) imgFile = `5star_icon_${gender}.gif`;

    const payload = {
      name,
      gender,
      image: imgFile,
      message,
      rating: Number(selectedRating),
      service: selectedService,
      date: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };

    db.ref('reviews').push(payload)
      .then(()=>{
        // reset minimal UI
        form.reset();
        selectedRating = 0; selectedGender = ''; selectedService = null;
        starEls.forEach(s=>s.classList.remove('active'));
        serviceBtns.forEach(b=>b.classList.remove('active'));
        if(charCount) charCount.textContent = '0 / 100';
        showToast('Review trimis ✅');
      })
      .catch(err=>{
        console.error('Review push error', err);
        alert('Eroare la trimitere. Vezi consola.');
      });
  });
}

// ===== LOAD REVIEWS =====
function loadReviewsOnce(callback){
  // single on('value') listener to keep data live
  db.ref('reviews').on('value', snapshot=>{
    const arr = [];
    const ratings = { web: [], prog: [], edit: [] };
    const counts = {};
    snapshot.forEach(child=>{
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

    // attach badges
    const enhanced = arr.map(r=>{
      let badge = null;
      const c = counts[r.name] || 0;
      if(c >= 5) badge = '🏆 Top Reviewer';
      else if(c >= 3) badge = '💡 Contributor';
      return Object.assign({}, r, { totalReviews: c, badge });
    });

    // sort most recent by default
    enhanced.sort((a,b)=>new Date(b.date) - new Date(a.date));
    reviews = enhanced;
    updateAvgs(ratings);
    renderPage();
    if(typeof callback === 'function') callback();
  }, err=>{
    console.error('Firebase read error', err);
    if(typeof callback === 'function') callback(err);
  });
}

// ===== AVERAGES UI =====
function updateAvgs(ratings){
  const avg = arr => arr.length ? (arr.reduce((s,x)=>s+x,0)/arr.length) : 0;
  const overallArr = [...ratings.web, ...ratings.prog, ...ratings.edit];
  const overall = overallArr.length ? avg(overallArr) : 0;
  if(avgValueEl) avgValueEl.textContent = overall ? overall.toFixed(2) : '0.00';
  if(avgWebEl) avgWebEl.textContent = `🌐 ${avg(ratings.web).toFixed(2)}`;
  if(avgProgEl) avgProgEl.textContent = `💻 ${avg(ratings.prog).toFixed(2)}`;
  if(avgEditEl) avgEditEl.textContent = `🎬 ${avg(ratings.edit).toFixed(2)}`;
  if(avgDonut){
    try{
      const percent = (overall / 5) * 100;
      const circumference = 2 * Math.PI * 45;
      const offset = circumference - (percent/100)*circumference;
      avgDonut.style.strokeDasharray = `${circumference}`;
      avgDonut.style.strokeDashoffset = `${offset}`;
    }catch(e){}
  }
}

// ===== FILTER + SORT HELPERS =====
if(sortFilter) sortFilter.addEventListener('change', ()=>{ activeSort = sortFilter.value; currentPage = 1; renderPage(); updateSortChipsUI(); });
if(serviceFilter) serviceFilter.addEventListener('change', ()=>{ activeService = serviceFilter.value; currentPage = 1; renderPage(); });

// update visual chips
function updateSortChipsUI(){
  sortChips.forEach(ch=>{
    ch.classList.toggle('active', ch.dataset.sort === activeSort);
  });
}

// ===== GET FILTERED + SORTED ARRAY =====
function getFilteredSorted(){
  let arr = reviews.slice();
  if(activeService && activeService !== 'all') arr = arr.filter(r=>r.service === activeService);
  if(activeSort === 'recent') arr.sort((a,b)=> new Date(b.date)-new Date(a.date));
  else if(activeSort === 'oldest') arr.sort((a,b)=> new Date(a.date)-new Date(b.date));
  else if(activeSort === 'highest') arr.sort((a,b)=> b.rating - a.rating || new Date(b.date)-new Date(a.date));
  else if(activeSort === 'lowest') arr.sort((a,b)=> a.rating - b.rating || new Date(b.date)-new Date(a.date));
  return arr;
}

// ===== RENDER PAGE =====
function renderPage(){
  if(!reviewsContainer) return;
  const filtered = getFilteredSorted();
  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / PER_PAGE));
  if(currentPage > maxPage) currentPage = maxPage;
  const start = (currentPage - 1) * PER_PAGE;
  const visible = filtered.slice(start, start + PER_PAGE);

  // clear
  reviewsContainer.innerHTML = '';

  if(!visible.length){
    if(noReviewsBox) noReviewsBox.style.display = 'block';
    if(paginationEl) paginationEl.classList.add('hidden');
    return;
  } else {
    if(noReviewsBox) noReviewsBox.style.display = 'none';
    // show pagination only if reviews section is active
    const reviewsSection = document.querySelector('#reviews');
    if(reviewsSection && reviewsSection.classList.contains('active')) {
      if(paginationEl) paginationEl.classList.remove('hidden');
    } else {
      if(paginationEl) paginationEl.classList.add('hidden');
    }
  }

  visible.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'review-card glassy review-fade';
    const gender = r.gender || 'male';
    let img = `assets/logos/reviews/3star_icon_${gender}.gif`;
    if(r.rating <= 2) img = `assets/logos/reviews/1star_icon_${gender}.gif`;
    else if(r.rating === 5) img = `assets/logos/reviews/5star_icon_${gender}.gif`;
    const svcEmoji = r.service === 'web' ? '🌐' : r.service === 'prog' ? '💻' : '🎬';
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);

    // build markup (ensure like/dislike have inner span for count)
    card.innerHTML = `
      <div class="review-header">
        <img class="author-img" src="${img}" alt="${escapeHtml(gender)}">
        <div class="review-meta">
          <div class="meta-top">
            <h4 class="meta-name">${escapeHtml(r.name)} <span class="service-emoji">${svcEmoji}</span> ${r.badge ? `<span class="badge">${r.badge}</span>` : ''}</h4>
            <div class="meta-sub"><small class="meta-count">${r.totalReviews || 1} reviews</small></div>
          </div>
        </div>
        <div class="review-rating">${stars}</div>
      </div>
      <p class="review-text">${escapeHtml(r.message)}</p>
      <div class="review-actions-row">
        <div class="action-left">
          <button class="like-btn btn-like" data-id="${r.id}" aria-label="Like">👍 <span class="like-count">${r.likes || 0}</span></button>
          <button class="dislike-btn btn-dislike" data-id="${r.id}" aria-label="Dislike">👎 <span class="dislike-count">${r.dislikes || 0}</span></button>
          <button class="reply-btn" data-id="${r.id}">💬 <span class="reply-count">0</span></button>
        </div>
        <div class="action-right">
          <small class="review-date">${new Date(r.date).toLocaleString()}</small>
        </div>
      </div>
      <div class="reply-list" id="replies-${r.id}"></div>
    `;
    reviewsContainer.appendChild(card);

    // wire buttons
    const likeBtn = card.querySelector('.like-btn');
    const dislikeBtn = card.querySelector('.dislike-btn');
    const replyBtn = card.querySelector('.reply-btn');
    const likeCountSpan = card.querySelector('.like-count');
    const dislikeCountSpan = card.querySelector('.dislike-count');
    const replyListEl = card.querySelector(`#replies-${r.id}`);

    // ensure text color kept (fix for "white bg / no font")
    if(likeBtn) likeBtn.style.color = 'inherit';
    if(dislikeBtn) dislikeBtn.style.color = 'inherit';

    // vote handlers with single-vote-per-client (transaction + stored key)
    if(likeBtn){
      likeBtn.addEventListener('click', function(){
        const reviewId = this.dataset.id;
        const key = `vote_${reviewId}_${clientId}`;
        if(localStorage.getItem(key)){
          alert('Ai votat deja acest review.');
          return;
        }
        db.ref(`reviews/${reviewId}/likes`).transaction(v => (v||0)+1);
        localStorage.setItem(key, '1');
        // optimistic UI
        likeCountSpan.textContent = Number(likeCountSpan.textContent || 0) + 1;
        this.disabled = true;
      });
    }
    if(dislikeBtn){
      dislikeBtn.addEventListener('click', function(){
        const reviewId = this.dataset.id;
        const key = `vote_${reviewId}_${clientId}`;
        if(localStorage.getItem(key)){
          alert('Ai votat deja acest review.');
          return;
        }
        db.ref(`reviews/${reviewId}/dislikes`).transaction(v => (v||0)+1);
        localStorage.setItem(key, '-1');
        dislikeCountSpan.textContent = Number(dislikeCountSpan.textContent || 0) + 1;
        this.disabled = true;
      });
    }

    // Inline replies display (show up to 2) & live count
    const repliesRef = db.ref(`reviews/${r.id}/replies`);
    // detach first to avoid double
    repliesRef.off('value');
    repliesRef.on('value', snap=>{
      const val = snap.val() || {};
      const keys = Object.keys(val);
      const count = keys.length;
      const replyCountSpan = card.querySelector('.reply-count');
      if(replyCountSpan) replyCountSpan.textContent = count;
      // inline preview (first 2 replies)
      replyListEl.innerHTML = '';
      const firstTwo = keys.slice(0,2);
      firstTwo.forEach(k=>{
        const rep = val[k];
        if(!rep) return;
        const div = document.createElement('div');
        div.className = 'reply-inline';
        const imgSrc = `assets/logos/reviews/3star_icon_${rep.gender || 'male'}.gif`;
        div.innerHTML = `
          <img class="reply-author-img" src="${imgSrc}" alt="">
          <div style="text-align:left;">
            <strong>${escapeHtml(rep.name)}</strong>
            <small style="display:block; opacity:.7;">${new Date(rep.date).toLocaleDateString()}</small>
            <div class="reply-text-inline">${escapeHtml(rep.message || rep.text || '')}</div>
          </div>
        `;
        replyListEl.appendChild(div);
      });
    });

    // open reply modal
    if(replyBtn){
      replyBtn.addEventListener('click', ()=> openRepliesModalForReview(r));
    }
  });

  // pagination UI update
  if(pageInfo) pageInfo.textContent = `Page ${currentPage} / ${maxPage}`;
  if(prevBtn) prevBtn.disabled = currentPage <= 1;
  if(nextBtn) nextBtn.disabled = currentPage >= maxPage;
}

// ===== PAGINATION HANDLERS =====
if(prevBtn) prevBtn.addEventListener('click', ()=>{ if(currentPage>1){ currentPage--; renderPage(); }});
if(nextBtn) nextBtn.addEventListener('click', ()=>{
  const filtered = getFilteredSorted();
  const maxPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if(currentPage < maxPage){ currentPage++; renderPage(); }
});

// ===== REPLIES MODAL / CHAT (uses #replies-modal markup from index.html) =====
const repliesModal = q('#replies-modal');
const repliesBody = q('#replies-body');
const repliesTitle = q('#replies-title');
const repliesClose = q('#replies-close');
const sendReplyBtn = q('#send-reply'); // note: index.html had #send-reply; if different, adapt
const replyMsgInput = q('#reply-message');
const replyNameInput = q('#reply-name'); // if not present, will fallback to ask in modal
const replyGenderRadios = qa('input[name="reply-gender"]');

let activeReviewId = null;
let replyGender = 'male';

replyGenderRadios.forEach(r => r.addEventListener('change', ()=> replyGender = r.value));

// close modal
if(repliesClose) repliesClose.addEventListener('click', ()=> {
  if(repliesModal) repliesModal.classList.add('hidden');
  if(activeReviewId) db.ref(`reviews/${activeReviewId}/replies`).off();
  activeReviewId = null;
});

// open modal helper
function openRepliesModalForReview(review){
  activeReviewId = review.id;
  if(repliesModal) repliesModal.classList.remove('hidden');
  if(repliesTitle) repliesTitle.textContent = `${review.name} — comment section`;
  if(replyMsgInput) replyMsgInput.value = '';
  if(replyNameInput) replyNameInput.value = '';
  replyGender = 'male';
  const first = replyGenderRadios.find(r => r.value === 'male');
  if(first) first.checked = true;
  loadRepliesForReview(activeReviewId);
  updateReplyCountForReview(activeReviewId);
}

// load replies and render chat-style messages
function loadRepliesForReview(reviewId){
  if(!repliesBody) return;
  repliesBody.innerHTML = `<p class="muted">Loading...</p>`;
  const ref = db.ref(`reviews/${reviewId}/replies`);
  ref.off('value');
  ref.on('value', snap=>{
    repliesBody.innerHTML = '';
    const data = snap.val() || {};
    const entries = Object.entries(data).map(([k,v]) => Object.assign({ id: k }, v));
    // sort by date ascending for chat
    entries.sort((a,b)=> new Date(a.date) - new Date(b.date));
    if(entries.length === 0){
      repliesBody.innerHTML = `<p class="muted">No replies yet. Be the first!</p>`;
      return;
    }
    entries.forEach(rep=>{
      // normalize message property
      const text = rep.message || rep.text || '';
      const gender = rep.gender || 'male';
      // chat row
      const row = document.createElement('div');
      row.className = `chat-row ${gender}`;
      row.innerHTML = `
        <img class="chat-avatar" src="assets/logos/reviews/3star_icon_${gender}.gif" alt="${escapeHtml(gender)}">
        <div class="chat-bubble ${gender}">
          <div class="chat-name">${escapeHtml(rep.name || 'Anonymous')}</div>
          <div class="chat-text">${escapeHtml(text)}</div>
          <div class="chat-meta"><small>${new Date(rep.date).toLocaleString()}</small></div>
        </div>
      `;
      repliesBody.appendChild(row);

      // attach reaction buttons (optional, kept simple)
      // For now reactions are not persisted to keep behavior deterministic.
    });

    // scroll to bottom
    repliesBody.scrollTop = repliesBody.scrollHeight;
  });
}

// send reply
if(sendReplyBtn){
  sendReplyBtn.addEventListener('click', ()=>{
    if(!activeReviewId) return alert('Nicio recenzie selectată.');
    const name = (replyNameInput && replyNameInput.value.trim()) || '';
    const message = (replyMsgInput && replyMsgInput.value.trim()) || '';
    if(!name) return alert('Introdu numele înainte de a trimite reply.');
    if(!message) return alert('Scrie un mesaj înainte de a trimite.');
    const payload = {
      name,
      gender: replyGender || 'male',
      message,
      likes: 0,
      dislikes: 0,
      date: new Date().toISOString()
    };
    db.ref(`reviews/${activeReviewId}/replies`).push(payload)
      .then(()=>{
        if(replyMsgInput) replyMsgInput.value = '';
        if(replyNameInput) replyNameInput.value = '';
        // listener will update UI
      })
      .catch(err=>{
        console.error('Reply push error', err);
        alert('Eroare la trimitere reply.');
      });
  });
}

// update inline reply count helper (used after push)
function updateReplyCountForReview(reviewId){
  db.ref(`reviews/${reviewId}/replies`).once('value').then(snap=>{
    const count = snap.exists() ? Object.keys(snap.val()).length : 0;
    const btn = document.querySelector(`.reply-btn[data-id="${reviewId}"]`);
    if(btn){
      const span = btn.querySelector('.reply-count') || (() => {
        const s = document.createElement('span'); s.className='reply-count'; btn.appendChild(s); return s;
      })();
      span.textContent = count;
    }
  }).catch(e=>console.warn('updateReplyCount err', e));
}

// ===== small UI toast =====
function showToast(text, timeout=1800){
  const t = document.createElement('div');
  t.className = 'andz-toast';
  t.textContent = text;
  t.style.position = 'fixed';
  t.style.bottom = '22px';
  t.style.left = '50%';
  t.style.transform = 'translateX(-50%)';
  t.style.background = 'rgba(0,0,0,0.75)';
  t.style.color = '#fff';
  t.style.padding = '8px 12px';
  t.style.borderRadius = '10px';
  t.style.zIndex = 99999;
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity = '1', 20);
  setTimeout(()=>{ t.style.opacity = '0'; setTimeout(()=>t.remove(), 300); }, timeout);
}

// ===== cleanup listeners when leaving reviews section or unload =====
function detachAllRepliesListeners(){
  try{
    reviews.forEach(r => {
      if(r && r.id) db.ref(`reviews/${r.id}/replies`).off();
    });
  }catch(e){/* ignore */}
}
window.addEventListener('beforeunload', detachAllRepliesListeners);

// ===== initialize (single call) =====
document.addEventListener('DOMContentLoaded', ()=>{
  loadReviewsOnce();
  updateSortChipsUI();
});

// final log
console.log('[ANDZ] reviews script loaded.');
