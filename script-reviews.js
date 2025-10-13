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

// ---------- UTILS ----------
function q(sel){ return document.querySelector(sel); }
function qa(sel){ return Array.from(document.querySelectorAll(sel)); }
function escapeHtml(s){
  if(!s) return "";
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

// ---------- CLIENT ID pentru vot unic (browser-based) ----------
let clientId = localStorage.getItem('andz_clientId');
if(!clientId){
  clientId = 'c_' + Math.random().toString(36).slice(2,10);
  localStorage.setItem('andz_clientId', clientId);
}

// ---------- DOM HOOKS ----------
const form = q('#review-form');
const msgInput = q('#message');
const charCount = q('#char-count');
const starEls = qa('#rating-stars span[data-value]');
const serviceBtns = qa('#service-pick button[data-value]');
const reviewsContainer = q('#reviews-container');
const noReviewsBox = q('#no-reviews');
const avgValueEl = q('#avg-value');
const avgWebEl = q('#avg-web');
const avgProgEl = q('#avg-prog');
const avgEditEl = q('#avg-edit');
const avgDonut = q('#avg-donut');
const reviewsBg = q('.reviews-bg') || q('.avg-sub') || document.body;
const paginationEl = q('.pagination');
const prevBtn = q('#prev-page');
const nextBtn = q('#next-page');
const pageInfo = q('#page-info');
const sortFilter = q('#sort-filter');
const serviceFilter = q('#service-filter');

// ---------- STATE ----------
let selectedRating = 0;
let selectedService = null;
let reviews = []; // toate review-urile luate din DB
let currentPage = 1;
const PER_PAGE = 10;
let activeSort = sortFilter ? sortFilter.value : 'recent';
let activeService = serviceFilter ? serviceFilter.value : 'all';

// ---------- SAFETY DOM ----------
if(!reviewsContainer){
  console.error('Missing #reviews-container element in DOM.');
}

// ---------- STAR RATING UI ----------
if(starEls && starEls.length){
  starEls.forEach(s => {
    s.addEventListener('click', function(){
      const v = Number(this.dataset.value) || 0;
      selectedRating = v;
      starEls.forEach(x => x.classList.toggle('active', Number(x.dataset.value) <= v));
    });
  });
}

// ---------- SERVICE PICK ----------
if(serviceBtns && serviceBtns.length){
  serviceBtns.forEach(b => {
    b.addEventListener('click', function(){
      serviceBtns.forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      selectedService = this.dataset.value;
    });
  });
}

// ---------- CHAR COUNT ----------
if(msgInput && charCount){
  msgInput.addEventListener('input', function(){
    charCount.textContent = `${this.value.length} / 200`;
  });
}

// ---------- SUBMIT REVIEW ----------
if(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
    try {
      const name = (form.name && form.name.value || '').trim();
      const gender = (form.gender && form.gender.value) || '';
      const message = (form.message && form.message.value || '').trim();
      if(!name || !gender || !message || !selectedRating || !selectedService){
        return alert('Completeaza toate campurile si alege rating + serviciu.');
      }
      const review = {
        name: name,
        gender: gender, // 'male' sau 'female'
        message: message,
        rating: Number(selectedRating),
        service: selectedService,
        date: new Date().toISOString(),
        likes: 0,
        dislikes: 0
      };

      // Push review in Firebase
      db.ref('reviews').push(review).then(() => {
        // --- Efect fade-in / fade-out cu imaginea potrivita rating+gender ---
        try {
          let rGender = review.gender || 'male';
          let rRating = Number(review.rating) || 0;
          let starType = '3star';
          if (rRating <= 2) starType = '1star';
          else if (rRating >= 5) starType = '5star';

          const fadeContainer = document.createElement('div');
          fadeContainer.className = 'rating-fade-overlay';
          const fadeImg = document.createElement('img');
          // fisierele GIF: 1star_icon_female.gif / 1star_icon_male.gif etc.
          fadeImg.src = `assets/logos/reviews/${starType}_icon_${rGender}.gif`;
          fadeImg.className = 'fade-star-img';
          fadeContainer.appendChild(fadeImg);
          document.body.appendChild(fadeContainer);
          // mic delay pentru tranzitie
          setTimeout(() => fadeContainer.classList.add('show'), 50);
          // inchide dupa 1.8s
          setTimeout(() => {
            fadeContainer.classList.remove('show');
            setTimeout(() => {
              if(fadeContainer && fadeContainer.remove) fadeContainer.remove();
            }, 600);
          }, 1800);
        } catch(e){ console.warn('Fade overlay failed', e); }

        // reset form UI
        form.reset();
        selectedRating = 0;
        selectedService = null;
        if(starEls && starEls.length) starEls.forEach(s => s.classList.remove('active'));
        if(serviceBtns && serviceBtns.length) serviceBtns.forEach(b => b.classList.remove('active'));
        if(charCount) charCount.textContent = '0 / 200';
      }).catch(err => {
        console.error('Error writing review', err);
        alert('Eroare la salvare. Vezi consola.');
      });

    } catch(err){
      console.error(err);
    }
  });
}

// ---------- FILTERS ----------
if(sortFilter){
  sortFilter.addEventListener('change', function(){
    activeSort = this.value;
    currentPage = 1;
    renderPage();
    updateSortButtonsUI();
  });
}
if(serviceFilter){
  serviceFilter.addEventListener('change', function(){
    activeService = this.value;
    currentPage = 1;
    renderPage();
  });
}
function updateSortButtonsUI(){
  const wrappers = qa('.sort-chip');
  wrappers.forEach(w => w.classList.toggle('active', w.dataset?.sort === activeSort));
}

// ---------- LOAD REVIEWS from Firebase ----------
function loadReviews(){
  try {
    db.ref('reviews').on('value', snapshot => {
      const arr = [];
      const ratings = { web: [], prog: [], edit: [] };
      const counts = {};
      snapshot.forEach(child => {
        const val = child.val();
        const obj = Object.assign({}, val);
        obj.id = child.key;
        obj.rating = Number(obj.rating) || 0;
        arr.push(obj);
        if(obj.service) {
          if(obj.service === 'web') ratings.web.push(obj.rating);
          else if(obj.service === 'prog') ratings.prog.push(obj.rating);
          else if(obj.service === 'edit') ratings.edit.push(obj.rating);
        }
        counts[obj.name] = (counts[obj.name] || 0) + 1;
      });
      // attach badge & count
      const enhanced = arr.map(r => {
        let badge = null;
        const c = counts[r.name] || 0;
        if(c >= 5) badge = '🏆 Top Reviewer';
        else if(c >= 3) badge = '💡 Contributor';
        return Object.assign({}, r, { totalReviews: c, badge: badge });
      });
      // default sort: most recent
      enhanced.sort((a,b) => new Date(b.date) - new Date(a.date));
      reviews = enhanced;
      updateAvgs(ratings);
      renderPage();
    });
  } catch(err){
    console.error('loadReviews error', err);
  }
}

// ---------- UPDATE AVERAGES ----------
function updateAvgs(ratings){
  const avg = arr => arr.length ? (arr.reduce((s,x) => s + x, 0) / arr.length) : 0;
  const overallArr = [...ratings.web, ...ratings.prog, ...ratings.edit];
  const overall = avg(overallArr);
  if(avgValueEl) avgValueEl.textContent = overall ? overall.toFixed(2) : '0.00';
  if(avgWebEl) avgWebEl.textContent = `🌐 ${avg(ratings.web).toFixed(2)}`;
  if(avgProgEl) avgProgEl.textContent = `💻 ${avg(ratings.prog).toFixed(2)}`;
  if(avgEditEl) avgEditEl.textContent = `🎬 ${avg(ratings.edit).toFixed(2)}`;
  if(avgDonut){
    try {
      const percent = (overall / 5) * 100;
      const circumference = 2 * Math.PI * 45;
      const offset = circumference - (percent / 100) * circumference;
      avgDonut.style.strokeDasharray = `${circumference}`;
      avgDonut.style.strokeDashoffset = `${offset}`;
    } catch(e){}
  }
  if(reviewsBg){
    let color = '#ffd95a';
    if(overall < 2.5) color = '#ff6961';
    else if(overall >= 4) color = '#6fc3ff';
    try { reviewsBg.style.background = `linear-gradient(180deg, ${color}10, transparent 40%)`; } catch(e){}
  }
}

// ---------- UTIL: FILTER + SORT ----------
function getFilteredSorted(){
  let arr = reviews.slice();
  if(activeService && activeService !== 'all'){
    arr = arr.filter(r => r.service === activeService);
  }
  if(activeSort === 'recent'){
    arr.sort((a,b) => new Date(b.date) - new Date(a.date));
  } else if(activeSort === 'oldest'){
    arr.sort((a,b) => new Date(a.date) - new Date(b.date));
  } else if(activeSort === 'highest'){
    arr.sort((a,b) => b.rating - a.rating || new Date(b.date) - new Date(a.date));
  } else if(activeSort === 'lowest'){
    arr.sort((a,b) => a.rating - b.rating || new Date(b.date) - new Date(a.date));
  }
  return arr;
}

// ---------- START LOADING ----------
loadReviews();
// ===============================================
// script-reviews.js (PARTEA 2 din 2)
// Continuarea: renderPage, replies management, modal, reactions
// ===============================================

// ---------- RENDER PAGINATION + REVIEWS ----------
function renderPage(){
  try {
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
      if(paginationEl) paginationEl.classList.remove('hidden');
    }

    visible.forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card glassy';
      // --- imagine dinamica in functie de rating+gender ---
      let gender = r.gender || 'male'; // male/female
      let rating = Number(r.rating) || 0;
      let starGroup = '3star';
      if (rating <= 2) starGroup = '1star';
      else if (rating >= 5) starGroup = '5star';
      const img = `assets/logos/reviews/${starGroup}_icon_${gender}.gif`;

      const svcEmoji = r.service === 'web' ? '🌐' : r.service === 'prog' ? '💻' : '🎬';
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
      card.innerHTML = `
        <div class="review-header">
          <img class="author-img" src="${img}" alt="${escapeHtml(r.gender || '')}">
          <div class="review-meta">
            <div class="meta-top">
              <h4 class="meta-name">${escapeHtml(r.name)} <span class="service-emoji">${svcEmoji}</span>
                ${r.badge ? `<span class="badge">${r.badge}</span>` : ''}
              </h4>
              <div class="meta-sub"><small class="meta-count">${r.totalReviews || 1} reviews</small></div>
            </div>
          </div>
          <div class="review-rating" aria-hidden="true">${stars}</div>
        </div>
        <p class="review-text">${escapeHtml(r.message)}</p>
        <div class="review-actions-row">
          <div class="action-left">
            <button class="like-btn" data-id="${r.id}">👍 <span class="like-count">${r.likes || 0}</span></button>
            <button class="dislike-btn" data-id="${r.id}">👎 <span class="dislike-count">${r.dislikes || 0}</span></button>
            <button class="reply-btn" data-id="${r.id}">💬 Replies <span class="reply-count">0</span></button>
          </div>
          <div class="action-right">
            <small class="review-date">${new Date(r.date).toLocaleString()}</small>
          </div>
        </div>
        <div class="reply-list" id="replies-${r.id}"></div>
      `;
      reviewsContainer.appendChild(card);

      // ---------- LIKE / DISLIKE ----------
      const likeBtn = card.querySelector('.like-btn');
      const dislikeBtn = card.querySelector('.dislike-btn');
      const likeCountSpan = card.querySelector('.like-count');
      const dislikeCountSpan = card.querySelector('.dislike-count');
      const replyBtn = card.querySelector('.reply-btn');
      const replyListEl = card.querySelector(`#replies-${r.id}`);

      // reflect local vote state
      const lv = localStorage.getItem(`vote_${r.id}_${clientId}`);
      if(lv === '1' && likeBtn) likeBtn.disabled = true;
      if(lv === '-1' && dislikeBtn) dislikeBtn.disabled = true;

      if(likeBtn){
        likeBtn.addEventListener('click', function(){
          const reviewId = this.dataset.id;
          const voteRef = db.ref(`reviews/${reviewId}/votes/${clientId}`);
          voteRef.transaction(curr => {
            if(curr && curr.vote) return curr;
            return { vote: 1, at: new Date().toISOString() };
          }, (err, committed) => {
            if(err) { console.error(err); return; }
            if(!committed){ alert('Ai votat deja acest review.'); return; }
            db.ref(`reviews/${reviewId}/likes`).transaction(l => (l || 0) + 1);
            localStorage.setItem(`vote_${reviewId}_${clientId}`, '1');
            likeBtn.disabled = true;
            const n = Number(likeCountSpan.textContent || 0) + 1;
            likeCountSpan.textContent = n;
          });
        });
      }
      if(dislikeBtn){
        dislikeBtn.addEventListener('click', function(){
          const reviewId = this.dataset.id;
          const voteRef = db.ref(`reviews/${reviewId}/votes/${clientId}`);
          voteRef.transaction(curr => {
            if(curr && curr.vote) return curr;
            return { vote: -1, at: new Date().toISOString() };
          }, (err, committed) => {
            if(err) { console.error(err); return; }
            if(!committed){ alert('Ai votat deja acest review.'); return; }
            db.ref(`reviews/${reviewId}/dislikes`).transaction(d => (d || 0) + 1);
            localStorage.setItem(`vote_${reviewId}_${clientId}`, '-1');
            dislikeBtn.disabled = true;
            const n = Number(dislikeCountSpan.textContent || 0) + 1;
            dislikeCountSpan.textContent = n;
          });
        });
      }

      // ---------- INLINE REPLIES (up to 2) ----------
      db.ref(`reviews/${r.id}/replies`).on('value', snap => {
        const val = snap.val() || {};
        const keys = Object.keys(val);
        const count = keys.length;
        const replyCountSpan = card.querySelector('.reply-count');
        if(replyCountSpan) replyCountSpan.textContent = count;
        replyListEl.innerHTML = '';
        const arr = keys.map(k => ({ id: k, ...val[k] })).slice(0,2);
        arr.forEach(rep => {
          const div = document.createElement('div');
          div.className = 'reply-inline';
          const img = `assets/logos/reviews/3star_icon_${(rep.gender || 'male')}.gif`;
          // Instagram-like inline reply small
          div.innerHTML = `
            <img class="reply-author-img" src="${img}" alt="">
            <div class="reply-inline-body">
              <strong>${escapeHtml(rep.name)}</strong>
              <small class="reply-date-inline">${new Date(rep.date).toLocaleDateString()}</small>
              <div class="reply-text-inline">${escapeHtml(rep.text)}</div>
            </div>
          `;
          replyListEl.appendChild(div);
        });
      });

      // ---------- OPEN REPLY DIALOG ----------
      if(replyBtn){
        replyBtn.addEventListener('click', function(){
          openReplyDialog(r.id);
        });
      }
    });

    // pagination UI
    if(pageInfo) pageInfo.textContent = `Page ${currentPage} / ${maxPage}`;
    if(prevBtn) prevBtn.disabled = currentPage <= 1;
    if(nextBtn) nextBtn.disabled = currentPage >= maxPage;
    const footer = document.querySelector('footer');
    if(footer && paginationEl){
      footer.appendChild(paginationEl);
      paginationEl.classList.remove('hidden');
    }

  } catch(err){
    console.error('renderPage error', err);
  }
}

// ---------- PAGINATION HANDLERS ----------
if(prevBtn){
  prevBtn.addEventListener('click', function(){
    if(currentPage > 1){ currentPage -= 1; renderPage(); }
  });
}
if(nextBtn){
  nextBtn.addEventListener('click', function(){
    currentPage += 1;
    renderPage();
  });
}

// ---------- REPLIES: modal dialog + replies CRUD + reactions ----------
let activeReplyModal = null;

function openReplyDialog(reviewId){
  // fetch review snapshot quickly
  db.ref(`reviews/${reviewId}`).once('value').then(s => {
    const review = s.val() || {};
    // build modal
    if(activeReplyModal) activeReplyModal.remove();
    const modal = document.createElement('div');
    modal.className = 'reply-modal';
    modal.innerHTML = `
      <div class="reply-modal-card glassy">
        <div class="reply-modal-header">
          <h3>Replies</h3>
          <button class="reply-modal-close" aria-label="Close">×</button>
        </div>
        <div class="reply-modal-body" id="reply-thread"></div>
        <form id="reply-form-modal" class="reply-form-modal">
          <div class="reply-form-row">
            <label class="small">Gender</label>
            <div class="gender-pick-modal">
              <label><input type="radio" name="r_gender" value="male" checked> <img src="assets/logos/reviews/3star_icon_male.gif" alt="male"></label>
              <label><input type="radio" name="r_gender" value="female"> <img src="assets/logos/reviews/3star_icon_female.gif" alt="female"></label>
            </div>
          </div>
          <div class="reply-form-row">
            <label class="small">Name</label>
            <input type="text" name="r_name" placeholder="Your name" required>
          </div>
          <div class="reply-form-row">
            <label class="small">Message</label>
            <textarea name="r_text" maxlength="300" placeholder="Write a reply..." required></textarea>
          </div>
          <div class="reply-form-actions">
            <button type="submit" class="btn-glow">Send Reply</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    activeReplyModal = modal;

    // close handler
    modal.querySelector('.reply-modal-close').addEventListener('click', () => {
      modal.remove();
      activeReplyModal = null;
    });

    // render existing thread (live)
    const threadEl = modal.querySelector('#reply-thread');
    function renderThread(snapshotVal){
      const val = snapshotVal || {};
      const keys = Object.keys(val).sort((a,b) => {
        const da = new Date(val[a].date || 0);
        const dbb = new Date(val[b].date || 0);
        return da - dbb;
      });
      threadEl.innerHTML = '';
      keys.forEach(k => {
        const rep = val[k];
        const gender = rep.gender || 'male';
        const avatar = `assets/logos/reviews/3star_icon_${gender}.gif`; // reply form uses 3star icon
        const wrap = document.createElement('div');
        wrap.className = 'reply-thread-item';
        wrap.innerHTML = `
          <img class="reply-avatar" src="${avatar}" alt="">
          <div class="reply-content">
            <div class="reply-row-top">
              <strong>${escapeHtml(rep.name)}</strong>
              <small class="reply-date">${new Date(rep.date).toLocaleString()}</small>
            </div>
            <div class="reply-text">${escapeHtml(rep.text)}</div>
            <div class="reply-reactions" data-reply-id="${k}">
              <button class="react-btn" data-react="like">❤️ <span class="count-like">${rep.reactions && rep.reactions.like ? rep.reactions.like : 0}</span></button>
              <button class="react-btn" data-react="haha">😂 <span class="count-haha">${rep.reactions && rep.reactions.haha ? rep.reactions.haha : 0}</span></button>
              <button class="react-btn" data-react="angry">😡 <span class="count-angry">${rep.reactions && rep.reactions.angry ? rep.reactions.angry : 0}</span></button>
            </div>
          </div>
        `;
        // reaction handlers (delegated later)
        threadEl.appendChild(wrap);
      });
      // delegate reaction clicks
      threadEl.querySelectorAll('.react-btn').forEach(btn => {
        btn.addEventListener('click', function(){
          const react = this.dataset.react;
          const replyId = this.closest('.reply-reactions').dataset.replyId;
          // increment reaction in DB at reviews/{reviewId}/replies/{replyId}/reactions/{react}
          const path = `reviews/${reviewId}/replies/${replyId}/reactions/${react}`;
          db.ref(path).transaction(v => (v || 0) + 1);
        });
      });
    }

    // subscribe live to replies for that review
    const repliesRef = db.ref(`reviews/${reviewId}/replies`);
    const onReplies = repliesRef.on('value', snap => {
      renderThread(snap.val());
    });

    // submit reply from modal
    const replyFormModal = modal.querySelector('#reply-form-modal');
    replyFormModal.addEventListener('submit', function(e){
      e.preventDefault();
      const data = new FormData(replyFormModal);
      const rName = (data.get('r_name') || '').trim();
      const rGender = (data.get('r_gender') || 'male');
      const rText = (data.get('r_text') || '').trim();
      if(!rName || !rText) return alert('Completeaza nume si mesajul reply-ului.');
      const replyObj = {
        name: rName,
        gender: rGender,
        text: rText,
        date: new Date().toISOString(),
        reactions: { like: 0, haha: 0, angry: 0 }
      };
      // push reply
      repliesRef.push(replyObj).then(() => {
        replyFormModal.reset();
      }).catch(err => {
        console.error('Failed to push reply', err);
        alert('Eroare la trimiterea reply-ului.');
      });
    });

    // when modal removed, detach listener
    modal.addEventListener('DOMNodeRemoved', function(e){
      if(e.target === modal){
        try { repliesRef.off('value', onReplies); } catch(e){}
        activeReplyModal = null;
      }
    });

  }).catch(err => {
    console.error('Cannot open reply dialog', err);
  });
}

// ---------- OPTIONAL: buildReplyTree (kept for compatibility if needed) ----------
function buildReplyTree(flat){
  // if you have nested replies structure, you can rework this function. For now replies are flat under review.
  const map = {};
  (flat || []).forEach(r => { map[r.id] = Object.assign({}, r, { children: [] }); });
  return Object.values(map);
}

// ---------- STUB: any other utilities preserved from original can be added here ----------

// ---------- STYLES NOTE ----------
/*
  Adauga urmatorul CSS (daca nu e deja) in style.css:

  .rating-fade-overlay { position: fixed; inset:0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.6); opacity:0; pointer-events:none; transition:opacity .6s ease; z-index:9999; }
  .rating-fade-overlay.show { opacity:1; pointer-events:auto; }
  .fade-star-img { width:180px; height:180px; object-fit:contain; border-radius:12px; animation:pulseStar 1.6s ease-in-out infinite alternate; filter: drop-shadow(0 0 25px rgba(255,255,255,0.5)); }
  @keyframes pulseStar {0%{transform:scale(.9);opacity:.7}50%{transform:scale(1.05);opacity:1}100%{transform:scale(.9);opacity:.8}}
  .reply-modal { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.45); z-index:9998; }
  .reply-modal-card{ width: min(820px, 96%); max-height:88vh; overflow:auto; padding:18px; border-radius:14px; }
  .reply-thread-item{ display:flex; gap:12px; padding:10px 6px; align-items:flex-start; }
  .reply-avatar{ width:48px; height:48px; border-radius:12px; object-fit:cover; }
  .reply-content{ text-align:left; flex:1; }
  .reply-reactions button{ margin-right:8px; }
  (personalizează după gust în style.css)
*/

// ---------- final: expose small helper for debugging ----------
window.andzReviews = {
  reload: loadReviews,
  render: renderPage
};
