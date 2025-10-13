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

// === DOM hooks
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

// preview img in form (must exist in HTML as described earlier)
const genderPreview = q('#gender-preview');

// radio gender inputs
const genderRadios = qa('input[name="gender"]');


// filters area
const sortWrapper = q('#sort-wrapper');
const sortFilter = q('#sort-filter');
const serviceFilter = q('#service-filter');

// state
let selectedRating = 0;
let selectedService = null;
let reviews = [];
let currentPage = 1;
const PER_PAGE = 10;
let activeSort = sortFilter ? sortFilter.value : 'recent';
let activeService = serviceFilter ? serviceFilter.value : 'all';

// safety
if(!reviewsContainer){
  console.error('Missing #reviews-container element in DOM.');
}

// helper: get currently selected gender string ('male'|'female')
function getSelectedGender(){
  try {
    const g = form.querySelector('input[name="gender"]:checked');
    if(g && (g.value === 'male' || g.value === 'female')) return g.value;
  } catch(e){}
  return 'male';
}

// update preview image with fade
function updateGenderPreview(path){
  if(!genderPreview) return;
  genderPreview.classList.add('fade-out');
  setTimeout(() => {
    genderPreview.src = path;
    genderPreview.classList.remove('fade-out');
  }, 250);
}

// init preview based on selected gender (default male)
if(genderPreview){
  const initialGender = getSelectedGender();
  // default to a neutral male/female gif if your assets have them
  updateGenderPreview(`assets/logos/reviews/${initialGender}.gif`);
}

// listen for gender radio changes -> if no rating selected, show 3star_icon_GENDER (as requested earlier)
genderRadios.forEach(r => {
  r.addEventListener('change', function(){
    const g = getSelectedGender();
    if(selectedRating === 0){
      // show default three-star for gender (or just gender gif if you prefer)
      const path = `assets/logos/reviews/3star_icon_${g}.gif`;
      updateGenderPreview(path);
    } else {
      // if rating exists, show appropriate
      const prefix = selectedRating <= 2 ? '1star_icon' : (selectedRating <= 4 ? '3star_icon' : '5star_icon');
      updateGenderPreview(`assets/logos/reviews/${prefix}_${g}.gif`);
    }
  });
});

// === star rating UI (fixed: use backticks for template strings)
if(starEls && starEls.length){
  starEls.forEach(s => {
    s.addEventListener('click', function(){
      const v = Number(this.dataset.value) || 0;
      selectedRating = v;
      starEls.forEach(x => x.classList.toggle('active', Number(x.dataset.value) <= v));

      // determine gender and image path properly using backticks
      const gender = getSelectedGender();
      let prefix = '3star_icon';
      if(v <= 2) prefix = '1star_icon';
      else if(v === 5) prefix = '5star_icon';
      // build path with backticks (template literal)
      const imgPath = `assets/logos/reviews/${prefix}_${gender}.gif`;
      updateGenderPreview(imgPath);
    });
  });
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
      const review = {
        name: name,
        gender: gender,
        message: message,
        rating: Number(selectedRating),
        service: selectedService,
        date: new Date().toISOString(),
        likes: 0,
        dislikes: 0
      };
      db.ref('reviews').push(review).then(() => {
        form.reset();
        selectedRating = 0;
        selectedService = null;
        if(starEls && starEls.length) starEls.forEach(s => s.classList.remove('active'));
        if(serviceBtns && serviceBtns.length) serviceBtns.forEach(b => b.classList.remove('active'));
        if(charCount) charCount.textContent = '0 / 200';
        // reset preview to default 3star of male (or keep gender default)
        const g = getSelectedGender();
        updateGenderPreview(`assets/logos/reviews/3star_icon_${g}.gif`);
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

function updateSortButtonsUI(){
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
      const enhanced = arr.map(r => {
        let badge = null;
        const c = counts[r.name] || 0;
        if(c >= 5) badge = '🏆 Top Reviewer';
        else if(c >= 3) badge = '💡 Contributor';
        return Object.assign({}, r, { totalReviews: c, badge: badge });
      });
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
    arr.sort((a,b) => a.rating - b.rating || new Date(a.date) - new Date(a.date));
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
      // default author image path uses gender gif; but we will swap replies images to 3star icons
      const img = `assets/logos/reviews/${r.gender || 'male'}.gif`;
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
          }, (err, committed, snap) => {
            if(err) { console.error(err); return; }
            if(!committed){
              alert('Ai votat deja acest review.');
              return;
            }
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

      // replies: monitor replies and render modern chat style
      db.ref(`reviews/${r.id}/replies`).on('value', snap => {
        const val = snap.val() || {};
        const keys = Object.keys(val);
        const count = keys.length;
        const replyCountSpan = card.querySelector('.reply-count');
        if(replyCountSpan) replyCountSpan.textContent = count;

        replyListEl.innerHTML = '';

        // make an inline reply form (small) on top of replies for quick reply (uses same fields)
        const replyFormId = `reply-form-${r.id}`;
        const replyFormHtml = `
          <div class="reply-form-inline" style="margin:8px 0; display:flex; gap:8px; align-items:flex-start;">
            <img class="reply-author-img" src="assets/logos/reviews/3star_icon_${getSelectedGender()}.gif" alt="you" style="width:38px;height:38px;border-radius:50%;">
            <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
              <input type="text" id="reply-name-${r.id}" placeholder="Nume..." style="padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
              <textarea id="reply-text-${r.id}" placeholder="Mesaj..." rows="2" style="padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);"></textarea>
              <div style="display:flex;gap:8px;">
                <select id="reply-gender-${r.id}" style="padding:6px;border-radius:8px;">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <button id="reply-send-${r.id}" style="padding:6px 10px;border-radius:8px;">Reply</button>
              </div>
            </div>
          </div>
        `;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = replyFormHtml;
        replyListEl.appendChild(wrapper);

        // wire send reply
        const sendBtn = wrapper.querySelector(`#reply-send-${r.id}`);
        const nameInp = wrapper.querySelector(`#reply-name-${r.id}`);
        const txtInp = wrapper.querySelector(`#reply-text-${r.id}`);
        const genderSel = wrapper.querySelector(`#reply-gender-${r.id}`);

        sendBtn.addEventListener('click', function(){
          const rn = (nameInp.value || '').trim();
          const rt = (txtInp.value || '').trim();
          const rg = genderSel.value || 'male';
          if(!rn || !rt) return alert('Completeaza nume si mesaj pentru reply.');
          const replyObj = {
            name: rn,
            text: rt,
            gender: rg,
            date: new Date().toISOString(),
            reactions: { heart:0, haha:0, anger:0 }
          };
          db.ref(`reviews/${r.id}/replies`).push(replyObj).then(() => {
            nameInp.value = '';
            txtInp.value = '';
          }).catch(err => {
            console.error('Reply save error', err);
            alert('Eroare la trimitere reply.');
          });
        });

        // render existing replies sorted by date ascending
        const arr = keys.map(k => ({ id: k, ...val[k] })).sort((a,b)=> new Date(a.date) - new Date(b.date));
        arr.forEach(rep => {
          const div = document.createElement('div');
          div.className = 'reply-inline modern-reply';
          const imgPath = `assets/logos/reviews/3star_icon_${rep.gender || 'male'}.gif`;
          div.innerHTML = `
            <img class="reply-author-img" src="${imgPath}" alt="">
            <div class="reply-bubble">
              <div class="reply-header">
                <strong>${escapeHtml(rep.name)}</strong>
                <small>${new Date(rep.date).toLocaleString()}</small>
              </div>
              <div class="reply-text">${escapeHtml(rep.text)}</div>
              <div class="reply-reactions" data-reply-id="${rep.id}">
                <button class="react-btn" data-type="heart">❤️ <span class="count">${(rep.reactions && rep.reactions.heart) || 0}</span></button>
                <button class="react-btn" data-type="haha">😂 <span class="count">${(rep.reactions && rep.reactions.haha) || 0}</span></button>
                <button class="react-btn" data-type="anger">😡 <span class="count">${(rep.reactions && rep.reactions.anger) || 0}</span></button>
              </div>
            </div>
          `;
          replyListEl.appendChild(div);

          // wire reaction buttons (optimistic UI + firebase update)
          const reactBtns = div.querySelectorAll('.react-btn');
          reactBtns.forEach(btn => {
            btn.addEventListener('click', function(){
              const type = this.dataset.type;
              const replyId = rep.id;
              const reactRef = db.ref(`reviews/${r.id}/replies/${replyId}/reactions/${type}`);
              reactRef.transaction(curr => (curr || 0) + 1);
            });
          });
        });

      });

      // open reply modal - focus on reply list top (if needed)
      if(replyBtn){
        replyBtn.addEventListener('click', function(){
          // scroll to this card's reply section
          replyListEl.scrollIntoView({behavior:'smooth', block:'center'});
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
    currentPage += 1;
    renderPage();
  });
}

// start
loadReviews();
