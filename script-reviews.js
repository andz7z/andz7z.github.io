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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// === UTILS ===
function q(sel){ return document.querySelector(sel); }
function qa(sel){ return Array.from(document.querySelectorAll(sel)); }
function escapeHtml(s){
  if(!s) return "";
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

// === client id (un vot per browser)
let clientId = localStorage.getItem('andz_clientId');
if(!clientId){
  clientId = 'c_' + Math.random().toString(36).slice(2,10);
  localStorage.setItem('andz_clientId', clientId);
}

// === DOM ELEMENTS ===
const form = q('#review-form');
const msgInput = q('#message');
const charCount = q('#char-count');
const starEls = qa('#rating-stars span[data-value]');
const genderPreview = q('#preview-img');
let selectedGender = '';
const serviceBtns = qa('#service-pick button[data-value]');
const reviewsContainer = q('#reviews-container');
const paginationEl = q('.pagination');
const prevBtn = q('#prev-page');
const nextBtn = q('#next-page');
const pageInfo = q('#page-info');
const avgValueEl = q('#avg-value');
const avgWebEl = q('#avg-web');
const avgProgEl = q('#avg-prog');
const avgEditEl = q('#avg-edit');
const avgDonut = q('#avg-donut');

// === STATE ===
let selectedRating = 0;
let selectedService = null;
let reviews = [];
let currentPage = 1;
const PER_PAGE = 10;
let activeSort = 'recent';
let activeService = 'all';

// === STAR SELECTION ===
if(starEls.length){
  starEls.forEach(s => s.addEventListener('click', () => {
    selectedRating = Number(s.dataset.value);
    starEls.forEach(x => x.classList.toggle('active', Number(x.dataset.value) <= selectedRating));
    updatePreviewImage();
  }));
}

// === PREVIEW IMAGE UPDATE ===
function updatePreviewImage() {
  if (!genderPreview || !selectedGender) return;
  let imgPath = `assets/logos/reviews/3star_icon_${selectedGender}.gif`;
  if (selectedRating <= 2) imgPath = `assets/logos/reviews/1star_icon_${selectedGender}.gif`;
  else if (selectedRating === 5) imgPath = `assets/logos/reviews/5star_icon_${selectedGender}.gif`;
  genderPreview.src = imgPath;
}

// === GENDER SELECT ===
qa('input[name="gender"]').forEach(radio => {
  radio.addEventListener('change', () => {
    selectedGender = radio.value;
    updatePreviewImage();
  });
});

// === SERVICE SELECT ===
if(serviceBtns.length){
  serviceBtns.forEach(b => {
    b.addEventListener('click', function(){
      serviceBtns.forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      selectedService = this.dataset.value;
    });
  });
}

// === CHAR COUNT ===
if(msgInput && charCount){
  msgInput.addEventListener('input', () => {
    charCount.textContent = `${msgInput.value.length} / ${msgInput.maxLength}`;
  });
}

// === SUBMIT REVIEW ===
if(form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = q('#name').value.trim();
    const gender = selectedGender;
    const message = msgInput.value.trim();
    if(!name || !gender || !message || !selectedRating || !selectedService){
      return alert('Completează toate câmpurile și selectează rating + serviciu!');
    }
    let imgFile = `3star_icon_${gender}.gif`;
    if(selectedRating <= 2) imgFile = `1star_icon_${gender}.gif`;
    else if(selectedRating === 5) imgFile = `5star_icon_${gender}.gif`;

    const review = {
      name, gender, message,
      image: imgFile,
      rating: selectedRating,
      service: selectedService,
      date: new Date().toISOString(),
      likes: 0, dislikes: 0
    };
    db.ref('reviews').push(review).then(()=>{
      form.reset();
      selectedRating = 0; selectedService = null; selectedGender = '';
      starEls.forEach(s=>s.classList.remove('active'));
      serviceBtns.forEach(b=>b.classList.remove('active'));
      charCount.textContent = '0 / 100';
    });
  });
}

// === LOAD REVIEWS FROM FIREBASE ===
function loadReviews(){
  db.ref('reviews').on('value', snapshot => {
    const arr = [];
    const ratings = { web: [], prog: [], edit: [] };
    snapshot.forEach(ch => {
      const val = ch.val();
      val.id = ch.key;
      arr.push(val);
      if(val.service && ratings[val.service]) ratings[val.service].push(Number(val.rating));
    });
    reviews = arr.sort((a,b)=>new Date(b.date)-new Date(a.date));
    updateAvgs(ratings);
    renderPage();
  });
}

// === UPDATE AVERAGES ===
function updateAvgs(r){
  const avg = a => a.length ? (a.reduce((s,x)=>s+x,0)/a.length) : 0;
  const overall = avg([...r.web,...r.prog,...r.edit]);
  avgValueEl.textContent = overall.toFixed(2);
  avgWebEl.textContent = `🌐 ${avg(r.web).toFixed(2)}`;
  avgProgEl.textContent = `💻 ${avg(r.prog).toFixed(2)}`;
  avgEditEl.textContent = `🎬 ${avg(r.edit).toFixed(2)}`;
  const percent = (overall/5)*100, circ = 2*Math.PI*45;
  avgDonut.style.strokeDasharray = circ;
  avgDonut.style.strokeDashoffset = circ - (percent/100)*circ;
}

// === PAGINATION + RENDER ===
function getFilteredSorted(){
  let arr = reviews.slice();
  if(activeService !== 'all') arr = arr.filter(r=>r.service===activeService);
  if(activeSort==='oldest') arr.sort((a,b)=>new Date(a.date)-new Date(b.date));
  else if(activeSort==='highest') arr.sort((a,b)=>b.rating-a.rating);
  else if(activeSort==='lowest') arr.sort((a,b)=>a.rating-b.rating);
  else arr.sort((a,b)=>new Date(b.date)-new Date(a.date));
  return arr;
}

function renderPage(){
  if(!reviewsContainer) return;
  const filtered = getFilteredSorted();
  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total/PER_PAGE));
  if(currentPage>maxPage) currentPage = maxPage;
  const start = (currentPage-1)*PER_PAGE;
  const visible = filtered.slice(start,start+PER_PAGE);
  reviewsContainer.innerHTML = '';
  if(!visible.length){
    reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
    paginationEl.classList.add('hidden');
    return;
  }
  const reviewsSection = document.querySelector('#reviews');
  if(reviewsSection && reviewsSection.classList.contains('active'))
    paginationEl.classList.remove('hidden');
  else paginationEl.classList.add('hidden');

  visible.forEach(r=>{
    const stars = '★'.repeat(r.rating)+'☆'.repeat(5-r.rating);
    const emoji = r.service==='web'?'🌐':r.service==='prog'?'💻':'🎬';
    const card = document.createElement('div');
    card.className='review-card glassy';
    card.innerHTML=`
      <div class="review-header">
        <img src="assets/logos/reviews/3star_icon_${r.gender}.gif" class="author-img">
        <div class="review-meta">
          <h4>${escapeHtml(r.name)} <span>${emoji}</span></h4>
        </div>
        <div class="review-rating">${stars}</div>
      </div>
      <p class="review-text">${escapeHtml(r.message)}</p>
      <div class="review-actions-row">
        <div>
          <button class="like-btn" data-id="${r.id}">👍 ${r.likes||0}</button>
          <button class="dislike-btn" data-id="${r.id}">👎 ${r.dislikes||0}</button>
          <button class="reply-btn" data-id="${r.id}">💬 Reply</button>
        </div>
        <small>${new Date(r.date).toLocaleString()}</small>
      </div>
    `;
    reviewsContainer.appendChild(card);
    card.querySelector('.like-btn').onclick=()=>voteReview(r.id,'likes');
    card.querySelector('.dislike-btn').onclick=()=>voteReview(r.id,'dislikes');
    card.querySelector('.reply-btn').onclick=()=>openRepliesModal(r);
  });
  pageInfo.textContent=`Page ${currentPage} / ${maxPage}`;
  prevBtn.onclick=()=>{if(currentPage>1){currentPage--;renderPage();}};
  nextBtn.onclick=()=>{if(currentPage<maxPage){currentPage++;renderPage();}};
}

function voteReview(id,type){
  db.ref(`reviews/${id}/${type}`).transaction(v=>(v||0)+1);
}

// === INITIAL LOAD ===
loadReviews();
// =====================
// CMD 2/3 - REPLIES SYSTEM
// =====================

// DOM hooks pentru modal replies (asigură-te că ai aceste elemente în index.html)
const repliesModal = q('#replies-modal');          // wrapper modal
const repliesBody = q('#replies-body');            // container replies list
const repliesTitle = q('#replies-title');          // titlu modal
const repliesClose = q('#replies-close');          // buton închidere
const sendReplyBtn = q('#send-reply');             // buton trimitere reply
const replyMsgInput = q('#reply-message');         // textarea reply
const replyNameInput = q('#reply-name');           // input nume reply (obligatoriu)
const replyGenderRadios = qa('input[name="reply-gender"]'); // radio gender in modal

let activeReviewId = null;
let replyGender = 'male';

// asigurare elemente existente
if(!repliesModal || !repliesBody || !repliesTitle || !repliesClose || !sendReplyBtn || !replyMsgInput || !replyNameInput){
  console.warn('Elemente modal replies lipsesc din DOM; verifică index.html pentru: #replies-modal, #replies-body, #replies-title, #replies-close, #send-reply, #reply-message, #reply-name');
}

// radio gender handling
replyGenderRadios.forEach(r => r.addEventListener('change', () => replyGender = r.value));

// inchidere modal
if(repliesClose){
  repliesClose.addEventListener('click', () => {
    repliesModal.classList.add('hidden');
    // detach listeners from previous review to avoid duplicate events
    if(activeReviewId) db.ref(`reviews/${activeReviewId}/replies`).off();
    activeReviewId = null;
  });
}

// funcție de deschidere modal și încărcare replies
function openRepliesModal(review){
  activeReviewId = review.id;
  repliesTitle.textContent = `${review.name} — comment section`;
  repliesModal.classList.remove('hidden');
  replyMsgInput.value = '';
  replyNameInput.value = '';
  // default gender
  replyGender = 'male';
  const firstRadio = replyGenderRadios.find(r => r.value === 'male');
  if(firstRadio) firstRadio.checked = true;

  loadRepliesForReview(activeReviewId);
  // actualizează counterul afișat pe card (optional)
  updateReplyCountForReview(activeReviewId);
}

// încarcă reply-urile pentru o recenzie; atasează listener 'value' pentru actualizări live
function loadRepliesForReview(reviewId){
  // safety: curăță container
  repliesBody.innerHTML = '<p class="muted">Loading replies…</p>';

  // detach anterior
  db.ref(`reviews/${reviewId}/replies`).off();

  // attach new listener
  db.ref(`reviews/${reviewId}/replies`).on('value', snap => {
    repliesBody.innerHTML = '';
    if(!snap.exists()){
      repliesBody.innerHTML = '<p class="muted">No replies yet. Be the first!</p>';
      return;
    }

    // colectăm toate replies într-un array sortat după dată ascendentă
    const arr = [];
    snap.forEach(child => {
      const val = child.val();
      val.id = child.key;
      arr.push(val);
    });
    arr.sort((a,b) => new Date(a.date) - new Date(b.date));

    // construire DOM
    arr.forEach(r => {
      const wrapper = document.createElement('div');
      wrapper.className = 'reply-item glassy';
      const avatar = `assets/logos/reviews/3star_icon_${r.gender || 'male'}.gif`;
      wrapper.innerHTML = `
        <div class="reply-top">
          <img class="reply-avatar" src="${avatar}" alt="${escapeHtml(r.name || '')}">
          <div class="reply-meta">
            <strong class="reply-name">${escapeHtml(r.name || 'Anonymous')}</strong>
            <small class="reply-date">${new Date(r.date).toLocaleString()}</small>
          </div>
        </div>
        <div class="reply-text">${escapeHtml(r.message)}</div>
        <div class="reply-actions">
          <button class="reply-like" data-id="${r.id}">👍 <span class="count-like">${r.likes||0}</span></button>
          <button class="reply-dislike" data-id="${r.id}">👎 <span class="count-dislike">${r.dislikes||0}</span></button>
        </div>
      `;
      repliesBody.appendChild(wrapper);

      // atașăm evenimentele pentru like/dislike pe reply
      const likeBtn = wrapper.querySelector('.reply-like');
      const dislikeBtn = wrapper.querySelector('.reply-dislike');

      likeBtn.onclick = () => {
        const path = `reviews/${reviewId}/replies/${r.id}/likes`;
        db.ref(path).transaction(v => (v||0) + 1);
      };
      dislikeBtn.onclick = () => {
        const path = `reviews/${reviewId}/replies/${r.id}/dislikes`;
        db.ref(path).transaction(v => (v||0) + 1);
      };
    });

    // actualizează counterul din card (dacă e afișat)
    updateReplyCountForReview(reviewId);
  });
}

// trimite reply — validare nume + mesaj (nu se acceptă Anonymous)
if(sendReplyBtn){
  sendReplyBtn.addEventListener('click', () => {
    const name = (replyNameInput.value || '').trim();
    const msg = (replyMsgInput.value || '').trim();
    if(!activeReviewId) return alert('Nicio recenzie selectată.');
    if(!name) return alert('Introdu numele înainte de a trimite reply.');
    if(!msg) return alert('Scrie un mesaj înainte de a trimite.');

    const payload = {
      name,
      gender: replyGender || 'male',
      message: msg,
      likes: 0,
      dislikes: 0,
      date: new Date().toISOString()
    };

    // push reply
    db.ref(`reviews/${activeReviewId}/replies`).push(payload)
      .then(() => {
        // clear inputs and refresh (listener va actualiza lista automat)
        replyMsgInput.value = '';
        replyNameInput.value = '';
        // actualizează counterul în card
        updateReplyCountForReview(activeReviewId);
      })
      .catch(err => {
        console.error('Error pushing reply:', err);
        alert('Eroare la trimitere. Vezi consola.');
      });
  });
}

// utilitar: actualizează badge-ul/număr reply din cardul principal
function updateReplyCountForReview(reviewId){
  // găsește butonul/elementul din DOM cu data-id === reviewId și update span.reply-count
  db.ref(`reviews/${reviewId}/replies`).once('value').then(snap => {
    const count = snap.exists() ? Object.keys(snap.val()).length : 0;
    // update în card (dacă e afișat)
    const btn = document.querySelector(`.reply-btn[data-id="${reviewId}"]`);
    if(btn){
      const span = btn.querySelector('.reply-count') || (() => {
        const s = document.createElement('span');
        s.className = 'reply-count';
        btn.appendChild(s);
        return s;
      })();
      span.textContent = count;
    }
  }).catch(e=>{
    console.warn('updateReplyCountForReview err', e);
  });
}
// =====================
// CMD 3/3 — FINALIZARE + OPTIMIZĂRI
// =====================

// === PROTECȚII + CLEANUP ===

// când utilizatorul schimbă secțiunea (de exemplu, iese din Reviews),
// ascundem modalul și detasăm listener-ele Firebase pentru replies.
function closeRepliesModalSafe() {
  if (repliesModal && !repliesModal.classList.contains('hidden')) {
    repliesModal.classList.add('hidden');
  }
  if (activeReviewId) {
    db.ref(`reviews/${activeReviewId}/replies`).off();
    activeReviewId = null;
  }
}
window.addEventListener('hashchange', closeRepliesModalSafe);
window.addEventListener('popstate', closeRepliesModalSafe);

// === Debounce simplu pentru voturi (anti-spam) ===
const recentVotes = new Map();
function canVote(id, type) {
  const key = `${id}_${type}`;
  const last = recentVotes.get(key) || 0;
  const now = Date.now();
  if (now - last < 1000) return false; // 1 sec minimal
  recentVotes.set(key, now);
  return true;
}
function voteReview(id, type) {
  if (!canVote(id, type)) return;
  db.ref(`reviews/${id}/${type}`).transaction(v => (v || 0) + 1);
}

// === Helper pentru a reseta form vizual după submit ===
function resetFormUI() {
  form.reset();
  selectedRating = 0;
  selectedService = null;
  selectedGender = '';
  starEls.forEach(s => s.classList.remove('active'));
  serviceBtns.forEach(b => b.classList.remove('active'));
  charCount.textContent = '0 / 100';
  if (genderPreview) genderPreview.src = `assets/logos/reviews/3star_icon_male.gif`;
}

// === BONUS: Tooltip mini pentru succes review ===
function showTempNotif(text = 'Submitted!') {
  const n = document.createElement('div');
  n.className = 'notif-toast';
  n.textContent = text;
  document.body.appendChild(n);
  setTimeout(() => n.classList.add('show'), 10);
  setTimeout(() => {
    n.classList.remove('show');
    setTimeout(() => n.remove(), 300);
  }, 2500);
}

// CSS temporar injectat (doar dacă nu există deja)
if (!document.querySelector('#notif-toast-style')) {
  const style = document.createElement('style');
  style.id = 'notif-toast-style';
  style.textContent = `
  .notif-toast {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(0,0,0,0.7);
    color: #fff;
    padding: 10px 18px;
    border-radius: 12px;
    font-family: 'Comfortaa', sans-serif;
    font-size: 0.9rem;
    opacity: 0;
    transition: all 0.4s ease;
    z-index: 99999;
  }
  .notif-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  body.dark-mode .notif-toast {
    background: rgba(255,217,90,0.9);
    color: #000;
  }`;
  document.head.appendChild(style);
}

// === RESUBMIT form + notif integrate ===
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = q('#name').value.trim();
    const gender = selectedGender;
    const message = msgInput.value.trim();
    if (!name || !gender || !message || !selectedRating || !selectedService) {
      return alert('Completează toate câmpurile și selectează rating + serviciu!');
    }

    let imgFile = `3star_icon_${gender}.gif`;
    if (selectedRating <= 2) imgFile = `1star_icon_${gender}.gif`;
    else if (selectedRating === 5) imgFile = `5star_icon_${gender}.gif`;

    const review = {
      name,
      gender,
      message,
      image: imgFile,
      rating: selectedRating,
      service: selectedService,
      date: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };

    db.ref('reviews')
      .push(review)
      .then(() => {
        resetFormUI();
        showTempNotif('✅ Review adăugat cu succes!');
      })
      .catch(err => {
        console.error('Firebase write error', err);
        alert('Eroare la salvare. Vezi consola.');
      });
  });
}

// === Initializare completă ===
document.addEventListener('DOMContentLoaded', () => {
  loadReviews();

  // handle pagination navigation (rezolvat UI)
  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
    }
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const filtered = getFilteredSorted();
    const maxPage = Math.ceil(filtered.length / PER_PAGE);
    if (currentPage < maxPage) {
      currentPage++;
      renderPage();
    }
  });
});

// === FINAL: Log info ===
console.log('%c[ANDZ Reviews Script] ✅ Loaded successfully.', 'color:#ffd95a;font-weight:bold;');
