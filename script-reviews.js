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

// script-reviews.js
// Presupunere: firebase este inițializat și ai db = firebase.database();
// Include acest fișier DUPĂ firebase & firebase database script.

// === util
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

// === client id for 1-vote-per-client (browser-based)
let clientId = localStorage.getItem('andz_clientId');
if(!clientId){
  clientId = 'c_' + Math.random().toString(36).slice(2,10);
  localStorage.setItem('andz_clientId', clientId);
}

// === DOM hooks (guard in case HTML structure slightly different)
const form = q('#review-form');
const msgInput = q('#message');
const charCount = q('#char-count');
const starEls = qa('#rating-stars span[data-value]');
const genderPreview = q('#preview-img');
let selectedGender = '';
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

// filters area (will be placed under AVG in HTML)
const sortWrapper = q('#sort-wrapper'); // optional wrapper if present
// fallback: we will use elements with ids below - ensure they exist in HTML
const sortFilter = q('#sort-filter');
const serviceFilter = q('#service-filter');

// state
let selectedRating = 0;
let selectedService = null;
let reviews = []; // array of reviews fetched
let currentPage = 1;
const PER_PAGE = 10;
let activeSort = sortFilter ? sortFilter.value : 'recent';
let activeService = serviceFilter ? serviceFilter.value : 'all';

// --- safety: make sure required DOM exists
if(!reviewsContainer){
  console.error('Missing #reviews-container element in DOM.');
}

// === star rating UI
if(starEls && starEls.length){
  starEls.forEach(s => {
    s.addEventListener('click', function(){
      const v = Number(this.dataset.value) || 0;
      selectedRating = v;
      starEls.forEach(x => x.classList.toggle('active', Number(x.dataset.value) <= v));
      updatePreviewImage(); // 🔥 actualizează poza la schimbarea ratingului
    });
  });
}
// === Function: update preview image based on rating & gender ===
function updatePreviewImage() {
  if (!genderPreview || !selectedGender) return;

  // dacă nu a ales ratingul, default e 3-star
  let imgPath = `assets/logos/reviews/3star_icon_${selectedGender}.gif`;

  if (selectedRating >= 1 && selectedRating <= 2)
    imgPath = `assets/logos/reviews/1star_icon_${selectedGender}.gif`;
  else if (selectedRating >= 3 && selectedRating <= 4)
    imgPath = `assets/logos/reviews/3star_icon_${selectedGender}.gif`;
  else if (selectedRating === 5)
    imgPath = `assets/logos/reviews/5star_icon_${selectedGender}.gif`;

  // fade effect
  genderPreview.classList.add('fade-out');
  setTimeout(() => {
    genderPreview.src = imgPath;
    genderPreview.classList.remove('fade-out');
    genderPreview.classList.add('fade-in');
  }, 250);
}
// service pick
if(serviceBtns && serviceBtns.length){
  serviceBtns.forEach(b => {
    b.addEventListener('click', function(){
      serviceBtns.forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      selectedService = this.dataset.value;
    });
  });
}
// Gender pick
const genderInputs = qa('input[name="gender"]');
if (genderInputs.length) {
  genderInputs.forEach(radio => {
    radio.addEventListener('change', () => {
      selectedGender = radio.value;
      updatePreviewImage();
    });
  });
}

// char count
if(msgInput && charCount){
  msgInput.addEventListener('input', function(){
    charCount.textContent = `${this.value.length} / 200`;
  });
}

// submit review
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
      let imgFile = `3star_icon_${gender}.gif`;
      if (selectedRating >= 1 && selectedRating <= 2)
        imgFile = `1star_icon_${gender}.gif`;
      else if (selectedRating >= 3 && selectedRating <= 4)
        imgFile = `3star_icon_${gender}.gif`;
      else if (selectedRating === 5)
        imgFile = `5star_icon_${gender}.gif`;
      
      const review = {
        name: name,
        gender: gender,
        image: imgFile,
        message: message,
        rating: Number(selectedRating),
        service: selectedService,
        date: new Date().toISOString(),
        likes: 0,
        dislikes: 0
      };
      db.ref('reviews').push(review).then(() => {
        // reset form UI
        form.reset();
        selectedRating = 0;
        selectedService = null;
        if(starEls && starEls.length) starEls.forEach(s => s.classList.remove('active'));
        if(serviceBtns && serviceBtns.length) serviceBtns.forEach(b => b.classList.remove('active'));
        if(charCount) charCount.textContent = '0 / 200';
        // optional small feedback
      }).catch(err => {
        console.error('Error writing review', err);
        alert('Eroare la salvare. Vezi consola.');
      });
    } catch(err){
      console.error(err);
    }
  });
}

// === Filters handlers
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

// style sort buttons UI function (for visual transparent chips)
function updateSortButtonsUI(){
  // if using select, style selected option via CSS; if you use custom buttons, adapt here.
  // We'll add .active class to the selected option's wrapper (if present)
  const wrappers = qa('.sort-chip');
  wrappers.forEach(w => w.classList.toggle('active', w.dataset?.sort === activeSort));
}

// === Load reviews from Firebase
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
      // default: most recent first
      enhanced.sort((a,b) => new Date(b.date) - new Date(a.date));
      reviews = enhanced;
      updateAvgs(ratings);
      renderPage();
    });
  } catch(err){
    console.error('loadReviews error', err);
  }
}

// === update avg UI
function updateAvgs(ratings){
  const avg = arr => arr.length ? (arr.reduce((s,x) => s + x, 0) / arr.length) : 0;
  const overallArr = [...ratings.web, ...ratings.prog, ...ratings.edit];
  const overall = avg(overallArr);
  if(avgValueEl) avgValueEl.textContent = overall ? overall.toFixed(2) : '0.00';
  if(avgWebEl) avgWebEl.textContent = `🌐 ${avg(ratings.web).toFixed(2)}`;
  if(avgProgEl) avgProgEl.textContent = `💻 ${avg(ratings.prog).toFixed(2)}`;
  if(avgEditEl) avgEditEl.textContent = `🎬 ${avg(ratings.edit).toFixed(2)}`;
  // donut visual (if exists)
  if(avgDonut){
    try {
      const percent = (overall / 5) * 100;
      const circumference = 2 * Math.PI * 45;
      const offset = circumference - (percent / 100) * circumference;
      avgDonut.style.strokeDasharray = `${circumference}`;
      avgDonut.style.strokeDashoffset = `${offset}`;
    } catch(e){}
  }
  // bg accent
  if(reviewsBg){
    let color = '#ffd95a';
    if(overall < 2.5) color = '#ff6961';
    else if(overall >= 4) color = '#6fc3ff';
    reviewsBg.style.background = `linear-gradient(180deg, ${color}10, transparent 40%)`;
  }
}

// === get filtered + sorted array
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

// === render page
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
  
  // 🔥 paginarea vizibilă doar în secțiunea Reviews
  const reviewsSection = document.querySelector('#reviews') || document.querySelector('#reviews-section') || document.querySelector('.reviews');
  if (reviewsSection && reviewsSection.classList.contains('active')) {
    if (paginationEl) paginationEl.classList.remove('hidden');
  } else {
    if (paginationEl) paginationEl.classList.add('hidden');
  }
}
    visible.forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card glassy';
      let img = `assets/logos/reviews/3star_icon_${r.gender || 'male'}.gif`;
      if (r.rating >= 1 && r.rating <= 2)
        img = `assets/logos/reviews/1star_icon_${r.gender || 'male'}.gif`;
      else if (r.rating >= 3 && r.rating <= 4)
        img = `assets/logos/reviews/3star_icon_${r.gender || 'male'}.gif`;
      else if (r.rating === 5)
        img = `assets/logos/reviews/5star_icon_${r.gender || 'male'}.gif`;
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
          <div class="review-rating">${stars}</div>
        </div>
        <p class="review-text">${escapeHtml(r.message)}</p>
        <div class="review-actions-row">
          <div class="action-left">
            <button class="like-btn" data-id="${r.id}">👍 <span class="like-count">${r.likes || 0}</span></button>
            <button class="dislike-btn" data-id="${r.id}">👎 <span class="dislike-count">${r.dislikes || 0}</span></button>
            <button class="reply-btn" data-id="${r.id}">💬 <span class="reply-count">0</span></button>
          </div>
          <div class="action-right">
            <small class="review-date">${new Date(r.date).toLocaleString()}</small>
          </div>
        </div>
        <div class="reply-list" id="replies-${r.id}"></div>
      `;
      reviewsContainer.appendChild(card);

      // wire like/dislike
      const likeBtn = card.querySelector('.like-btn');
      const dislikeBtn = card.querySelector('.dislike-btn');
      const likeCountSpan = card.querySelector('.like-count');
      const dislikeCountSpan = card.querySelector('.dislike-count');
      const replyBtn = card.querySelector('.reply-btn');
      const replyListEl = card.querySelector(`#replies-${r.id}`);
      // === REPLIES MODAL HANDLING ===
const modal = document.getElementById('replies-modal');
const modalBody = document.getElementById('replies-body');
const modalTitle = document.getElementById('replies-title');
const closeBtn = document.getElementById('replies-close');
const sendBtn = document.getElementById('send-reply');
const msgInputReply = document.getElementById('reply-message');
let activeReviewId = null;
let replyGender = 'male';

document.querySelectorAll('input[name="reply-gender"]').forEach(r => {
  r.addEventListener('change', () => replyGender = r.value);
});

if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');

// când apăsăm pe 💬
replyBtn.addEventListener('click', () => {
  activeReviewId = r.id;
  modalTitle.textContent = `${r.name}'s review comment section 💬`;
  modal.classList.remove('hidden');
  loadRepliesForReview(r.id);
});

// încarcă reply-urile
function loadRepliesForReview(reviewId) {
  modalBody.innerHTML = '<p>Loading...</p>';
  db.ref(`reviews/${reviewId}/replies`).on('value', snap => {
    const data = snap.val() || {};
    modalBody.innerHTML = '';

    Object.entries(data).forEach(([key, rep]) => {
      const avatarSrc = `assets/logos/reviews/3star_icon_${rep.gender || 'male'}.gif`;
      const wrapper = document.createElement('div');
      wrapper.className = `chat-row ${rep.gender || 'male'}`;

      const avatar = document.createElement('img');
      avatar.className = 'chat-avatar';
      avatar.src = avatarSrc;
      avatar.alt = rep.gender || 'avatar';

      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${rep.gender || 'male'}`;
      bubble.innerHTML = `<div class="chat-name">${escapeHtml(rep.name || 'Anonymous')}</div>
                          <div class="chat-text">${escapeHtml(rep.text)}</div>`;

      // Reacții ascunse sub săgeată
      const toggle = document.createElement('button');
      toggle.className = 'reaction-toggle';
      toggle.textContent = '▶';
      const reactions = document.createElement('div');
      reactions.className = 'reactions-bar hidden';

      const emojis = ['❤️','😂','😡','👍','👎'];
      emojis.forEach(e => {
        const count = rep.reactions && rep.reactions[e] ? Object.keys(rep.reactions[e]).length : 0;
        const btn = document.createElement('button');
        btn.className = 'reaction-btn';
        btn.dataset.emoji = e;
        btn.dataset.id = key;
        btn.innerHTML = `${e} <span class="reaction-count">${count}</span>`;
        reactions.appendChild(btn);
        // === ACTIVEAZĂ reacțiile la reply-uri ===
modalBody.querySelectorAll('.reply-like-btn, .reply-dislike-btn').forEach(btn => {
  btn.onclick = e => {
    const replyId = btn.dataset.id;
    const type = btn.classList.contains('reply-like-btn') ? 'likes' : 'dislikes';
    db.ref(`reviews/${activeReviewId}/replies/${replyId}/${type}`).transaction(val => (val || 0) + 1);
  };
});
      });

      toggle.addEventListener('click', () => {
        reactions.classList.toggle('hidden');
        toggle.textContent = reactions.classList.contains('hidden') ? '▶' : '▼';
      });

      bubble.appendChild(toggle);
      bubble.appendChild(reactions);

      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
      modalBody.appendChild(wrapper);
    });
  });
}
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
          }, (err, committed, snap) => {
            if(err) { console.error(err); return; }
            if(!committed){
              alert('Ai votat deja acest review.');
              return;
            }
            // inc likes
            db.ref(`reviews/${reviewId}/likes`).transaction(l => (l || 0) + 1);
            localStorage.setItem(`vote_${reviewId}_${clientId}`, '1');
            likeBtn.disabled = true;
            // update UI optimistic
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
          }, (err, committed, snap) => {
            if(err) { console.error(err); return; }
            if(!committed){
              alert('Ai votat deja acest review.');
              return;
            }
            db.ref(`reviews/${reviewId}/dislikes`).transaction(d => (d || 0) + 1);
            localStorage.setItem(`vote_${reviewId}_${clientId}`, '-1');
            dislikeBtn.disabled = true;
            const n = Number(dislikeCountSpan.textContent || 0) + 1;
            dislikeCountSpan.textContent = n;
          });
        });
      }

      // replies: monitor replies child count and render
      db.ref(`reviews/${r.id}/replies`).on('value', snap => {
        const val = snap.val() || {};
        const keys = Object.keys(val);
        const count = keys.length;
        const replyCountSpan = card.querySelector('.reply-count');
        if(replyCountSpan) replyCountSpan.textContent = count;
        // render thread inline (collapsed) - show top-level replies inline (1 level), full view in modal
        replyListEl.innerHTML = '';
        const arr = keys.map(k => ({ id: k, ...val[k] })).slice(0,2); // show up to 2 replies inline
        arr.forEach(rep => {
          const div = document.createElement('div');
          div.className = 'reply-inline';
          const img = `assets/logos/reviews/3star_icon_${rep.gender || 'male'}.gif`;
          div.innerHTML = `<img class="reply-author-img" src="${img}" alt="">
            <strong>${escapeHtml(rep.name)}</strong> <small class="reply-date-inline">${new Date(rep.date).toLocaleDateString()}</small>
            <div class="reply-text-inline">${escapeHtml(rep.text)}</div>`;
          replyListEl.appendChild(div);
        });
      });

      // open reply modal
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
    // ensure pagination placed in footer (if footer exists)
    const footer = document.querySelector('footer');
    if(footer && paginationEl){
      footer.appendChild(paginationEl);
      paginationEl.classList.remove('hidden');
    }

  } catch(err){
    console.error('renderPage error', err);
  }
}

// pagination listeners
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

// === replies modal & nested replies (max depth 7)
function buildReplyTree(flat){
  const map = {};
  flat.forEach(r => { map[r.id] = Object.assign({}, r, { children: [] }); });
  const roots = [];
  flat.forEach(r => {
    if(r.parentId && map[r.parentId]) map[r.parentId].children.push(map[r.id]);
    else roots.push(map[r.id]);
  });
  return roots;
}

// === initial load
window.addEventListener('load', function(){
  loadReviews();
  updateSortButtonsUI();
});
