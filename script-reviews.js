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

// === UTILS & STATE ===
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

let clientId = localStorage.getItem('andz_clientId');
if(!clientId){
  clientId = 'c_' + Math.random().toString(36).slice(2,10);
  localStorage.setItem('andz_clientId', clientId);
}

// DOM hooks
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
const avatarPreview = q('#review-avatar-preview'); // may be null if not present

// app state
let selectedRating = 0;
let selectedService = null;
let selectedGender = "female"; // default preview
let currentStars = 3;
let reviews = [];
let currentPage = 1;
const PER_PAGE = 10;
let activeSort = sortFilter ? sortFilter.value : 'recent';
let activeService = serviceFilter ? serviceFilter.value : 'all';

// safety
if(!reviewsContainer){
  console.error('Missing #reviews-container element in DOM.');
}

// helper: map rating -> type string for icon filename
function ratingToType(r){
  const n = Number(r) || 0;
  if(n <= 2) return '1star';
  if(n >= 5) return '5star';
  return '3star';
}
// ======================= UI BEHAVIORS =======================

// Star rating UI
if(starEls && starEls.length){
  starEls.forEach(s => {
    s.addEventListener('click', function(){
      const v = Number(this.dataset.value) || 0;
      selectedRating = v;
      currentStars = v;
      starEls.forEach(x => x.classList.toggle('active', Number(x.dataset.value) <= v));
      updateAvatar();
    });
  });
}

// Gender input listener -> update selectedGender & preview
document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener('change', () => {
    selectedGender = radio.value;
    updateAvatar();
  });
});

// Avatar preview update function (smooth transition)
function updateAvatar(){
  if(!avatarPreview) return;
  const type = ratingToType(currentStars || selectedRating || 3);
  const genderKey = (selectedGender || 'female').toLowerCase();
  const newSrc = `assets/logos/reviews/${type}_icon_${genderKey}.gif`;
  // quick fade transition
  avatarPreview.classList.add('fade');
  setTimeout(() => {
    avatarPreview.src = newSrc;
    avatarPreview.classList.remove('fade');
  }, 200);
}

// Service pick buttons
if(serviceBtns && serviceBtns.length){
  serviceBtns.forEach(b => {
    b.addEventListener('click', function(){
      serviceBtns.forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      selectedService = this.dataset.value;
    });
  });
}

// Char count limit
if(msgInput && charCount){
  msgInput.addEventListener('input', function(){
    const max = this.getAttribute('maxlength') || 100;
    charCount.textContent = `${this.value.length} / ${max}`;
  });
}

// Submit review
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
        name,
        gender,
        message,
        rating: Number(selectedRating),
        service: selectedService,
        date: new Date().toISOString(),
        likes: 0,
        dislikes: 0
      };
      db.ref('reviews').push(review).then(() => {
        // reset UI
        form.reset();
        selectedRating = 0;
        currentStars = 3;
        selectedService = null;
        starEls.forEach(s => s.classList.remove('active'));
        serviceBtns.forEach(b => b.classList.remove('active'));
        if(charCount) charCount.textContent = '0 / 100';
        updateAvatar();
      }).catch(err => {
        console.error('Error writing review', err);
        alert('Eroare la salvare. Vezi consola.');
      });
    } catch(err){
      console.error(err);
    }
  });
}

// Sort / service filters
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

// ======================= DATA LOAD & RENDER =======================

function loadReviews(){
  try {
    db.ref('reviews').on('value', snapshot => {
      const arr = [];
      const ratings = { web: [], prog: [], edit: [] };
      const counts = {};
      snapshot.forEach(child => {
        const val = child.val() || {};
        const obj = Object.assign({}, val, { id: child.key, rating: Number(val.rating) || 0 });
        arr.push(obj);
        if(obj.service) {
          if(obj.service === 'web') ratings.web.push(obj.rating);
          else if(obj.service === 'prog') ratings.prog.push(obj.rating);
          else if(obj.service === 'edit') ratings.edit.push(obj.rating);
        }
        counts[obj.name] = (counts[obj.name] || 0) + 1;
      });
      // attach badges
      const enhanced = arr.map(r => {
        let badge = null;
        const c = counts[r.name] || 0;
        if(c >= 5) badge = '🏆 Top Reviewer';
        else if(c >= 3) badge = '💡 Contributor';
        return Object.assign({}, r, { totalReviews: c, badge });
      });
      // default sorting: most recent
      enhanced.sort((a,b) => new Date(b.date) - new Date(a.date));
      reviews = enhanced;
      updateAvgs(ratings);
      renderPage();
    });
  } catch(err){
    console.error('loadReviews error', err);
  }
}

function updateAvgs(ratings){
  const avg = arr => arr && arr.length ? (arr.reduce((s,x) => s + x, 0) / arr.length) : 0;
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
    reviewsBg.style.background = `linear-gradient(180deg, ${color}10, transparent 40%)`;
  }
}

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

function renderPage(){
  try {
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
      if(paginationEl) paginationEl.classList.remove('hidden');
    }

    visible.forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card glassy';
      // image uses star/type based on rating + gender
      const type = ratingToType(r.rating);
      const genderKey = (r.gender || 'female').toLowerCase();
      const img = `assets/logos/reviews/${type}_icon_${genderKey}.gif`;
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

      // like/dislike wiring
      const likeBtn = card.querySelector('.like-btn');
      const dislikeBtn = card.querySelector('.dislike-btn');
      const likeCountSpan = card.querySelector('.like-count');
      const dislikeCountSpan = card.querySelector('.dislike-count');
      const replyBtn = card.querySelector('.reply-btn');
      const replyListEl = card.querySelector(`#replies-${r.id}`);

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
            likeCountSpan.textContent = Number(likeCountSpan.textContent || 0) + 1;
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
            dislikeCountSpan.textContent = Number(dislikeCountSpan.textContent || 0) + 1;
          });
        });
      }

      // replies inline (show up to 2)
      db.ref(`reviews/${r.id}/replies`).on('value', snap => {
        const val = snap.val() || {};
        const keys = Object.keys(val || {});
        const count = keys.length;
        const replyCountSpan = card.querySelector('.reply-count');
        if(replyCountSpan) replyCountSpan.textContent = count;
        replyListEl.innerHTML = '';
        const arr = keys.map(k => ({ id: k, ...val[k] })).slice(0,2);
        arr.forEach(rep => {
          const div = document.createElement('div');
          div.className = 'reply-inline';
          const rtype = ratingToType(rep.rating || 3); // replies may not have rating but keep fallback
          const rimgType = `assets/logos/reviews/${ratingToType(rep.rating || 3)}_icon_${(rep.gender||'female').toLowerCase()}.gif`;
          div.innerHTML = `<img class="reply-author-img" src="${rimgType}" alt="">
            <strong>${escapeHtml(rep.name)}</strong> <small class="reply-date-inline">${new Date(rep.date).toLocaleDateString()}</small>
            <div class="reply-text-inline">${escapeHtml(rep.text || rep.message || '')}</div>`;
          replyListEl.appendChild(div);
        });
      });

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

// pagination listeners
if(prevBtn){
  prevBtn.addEventListener('click', function(){
    if(currentPage > 1){ currentPage -= 1; renderPage(); }
  });
}
if(nextBtn){
  nextBtn.addEventListener('click', function(){
    currentPage += 1; renderPage();
  });
}

// ======================= REPLIES (modal + nested) =======================

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

function renderRepliesTreeFragment(nodes, reviewId, depth){
  depth = depth || 0;
  const frag = document.createDocumentFragment();
  nodes.forEach(node => {
    const wrap = document.createElement('div');
    wrap.className = 'reply-node';
    wrap.style.marginLeft = (depth * 12) + 'px';
    const img = `assets/logos/reviews/${ratingToType(node.rating || 3)}_icon_${(node.gender||'female').toLowerCase()}.gif`;
    wrap.innerHTML = `<div class="reply-top"><img src="${img}" class="reply-author-img"><strong>${escapeHtml(node.name)}</strong> <small class="reply-date">${new Date(node.date).toLocaleString()}</small></div>
      <div class="reply-body">${escapeHtml(node.text)}</div>
      <div class="reply-actions"><button class="reply-to-btn" data-review="${reviewId}" data-reply="${node.id}">Reply</button></div>`;
    frag.appendChild(wrap);
    if(node.children && node.children.length){
      frag.appendChild(renderRepliesTreeFragment(node.children, reviewId, depth + 1));
    }
  });
  return frag;
}

function openReplyDialog(reviewId){
  const modal = document.createElement('div');
  modal.className = 'reply-modal';
  modal.innerHTML = `<div class="reply-modal-inner">
    <button class="modal-close">×</button>
    <h3>Replies</h3>
    <div id="reply-thread" class="reply-thread"></div>
    <hr>
    <h4>Leave a reply</h4>
    <form id="leave-reply-form">
      <div class="row"><label>Name</label><input name="rname" required></div>
      <div class="row"><label>Gender</label>
        <select name="rgender" required>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="row"><label>Message</label><textarea name="rtext" maxlength="300" required></textarea></div>
      <input type="hidden" name="parentId" value="">
      <div class="row"><button type="submit">Post Reply</button></div>
    </form>
  </div>`;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');

  modal.querySelector('.modal-close').addEventListener('click', function(){
    modal.remove();
    document.body.classList.remove('modal-open');
  });

  const thread = modal.querySelector('#reply-thread');
  const rform = modal.querySelector('#leave-reply-form');

  db.ref(`reviews/${reviewId}/replies`).once('value').then(snap => {
    const obj = snap.val() || {};
    const arr = Object.keys(obj).map(k => ({ id: k, ...obj[k] }));
    const tree = buildReplyTree(arr);
    thread.innerHTML = '';
    thread.appendChild(renderRepliesTreeFragment(tree, reviewId, 0));
  }).catch(console.error);

  thread.addEventListener('click', function(e){
    if(e.target && e.target.matches('.reply-to-btn')){
      const rid = e.target.dataset.reply;
      rform.parentId.value = rid || '';
      rform.rtext.focus();
    }
  });

  rform.addEventListener('submit', function(ev){
    ev.preventDefault();
    const fd = new FormData(rform);
    const name = (fd.get('rname')||'').trim();
    const gender = fd.get('rgender') || 'female';
    const text = (fd.get('rtext')||'').trim();
    const parentId = fd.get('parentId') || null;
    if(!name || !gender || !text) return alert('Completeaza toate campurile!');
    if(parentId){
      db.ref(`reviews/${reviewId}/replies/${parentId}`).once('value').then(psnap => {
        const parent = psnap.val();
        const depth = (parent && parent.depth) ? parent.depth : 1;
        if(depth >= 7){ alert('Maxim 7 niveluri de reply.'); return; }
        const ref = db.ref(`reviews/${reviewId}/replies`).push();
        ref.set({
          name, gender, text, parentId, date: new Date().toISOString(), depth: depth + 1
        }).then(() => {
          db.ref(`reviews/${reviewId}/replies`).once('value').then(snap => {
            const obj = snap.val() || {};
            const arr = Object.keys(obj).map(k => ({ id: k, ...obj[k] }));
            const tree = buildReplyTree(arr);
            thread.innerHTML = '';
            thread.appendChild(renderRepliesTreeFragment(tree, reviewId, 0));
            rform.reset();
            rform.parentId.value = '';
          });
        });
      });
    } else {
      const ref = db.ref(`reviews/${reviewId}/replies`).push();
      ref.set({ name, gender, text, parentId: null, date: new Date().toISOString(), depth: 1 }).then(() => {
        db.ref(`reviews/${reviewId}/replies`).once('value').then(snap => {
          const obj = snap.val() || {};
          const arr = Object.keys(obj).map(k => ({ id: k, ...obj[k] }));
          const tree = buildReplyTree(arr);
          thread.innerHTML = '';
          thread.appendChild(renderRepliesTreeFragment(tree, reviewId, 0));
          rform.reset();
        });
      });
    }
  });
}

// initial load
window.addEventListener('load', function(){
  loadReviews();
  updateSortButtonsUI();
  // ensure avatar preview set
  updateAvatar();
});
