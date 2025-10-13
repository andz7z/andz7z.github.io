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
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

// === CLIENT ID ===
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

// === STATE ===
let selectedRating = 0;
let selectedService = null;
let selectedGender = "female";
let currentStars = 3;
let reviews = [];
let currentPage = 1;
const PER_PAGE = 10;
let activeSort = sortFilter ? sortFilter.value : 'recent';
let activeService = serviceFilter ? serviceFilter.value : 'all';

// === AVATAR PREVIEW ===
const avatarPreview = document.getElementById("review-avatar-preview");

function updateAvatar(){
  if (!avatarPreview) return;
  let type = "3star";
  if (currentStars <= 2) type = "1star";
  else if (currentStars >= 5) type = "5star";
  const newSrc = `assets/logos/reviews/${type}_icon_${selectedGender}.gif`;
  avatarPreview.classList.add("fade");
  setTimeout(() => {
    avatarPreview.src = newSrc;
    avatarPreview.classList.remove("fade");
  }, 200);
}
// === STAR RATING ===
if(starEls.length){
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

// === GENDER SELECT ===
document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener('change', () => {
    selectedGender = radio.value;
    updateAvatar();
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

// === CHARACTER COUNT ===
if(msgInput && charCount){
  msgInput.addEventListener('input', function(){
    charCount.textContent = `${this.value.length} / 100`;
  });
}

// === SUBMIT FORM ===
if(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
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
      form.reset();
      selectedRating = 0;
      selectedService = null;
      starEls.forEach(s => s.classList.remove('active'));
      serviceBtns.forEach(b => b.classList.remove('active'));
      charCount.textContent = '0 / 100';
      currentStars = 3;
      updateAvatar();
    });
  });
}
// === LOAD & RENDER REVIEWS ===
function loadReviews(){
  db.ref('reviews').on('value', snapshot => {
    const arr = [];
    const ratings = { web: [], prog: [], edit: [] };
    snapshot.forEach(child => {
      const val = child.val();
      const obj = { ...val, id: child.key, rating: Number(val.rating) || 0 };
      arr.push(obj);
      if(val.service) ratings[val.service]?.push(obj.rating);
    });
    reviews = arr;
    updateAvgs(ratings);
    renderPage();
  });
}

function updateAvgs(ratings){
  const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
  const overallArr = [...ratings.web, ...ratings.prog, ...ratings.edit];
  const overall = avg(overallArr);
  if(avgValueEl) avgValueEl.textContent = overall ? overall.toFixed(2) : '0.00';
  if(avgWebEl) avgWebEl.textContent = `🌐 ${avg(ratings.web).toFixed(2)}`;
  if(avgProgEl) avgProgEl.textContent = `💻 ${avg(ratings.prog).toFixed(2)}`;
  if(avgEditEl) avgEditEl.textContent = `🎬 ${avg(ratings.edit).toFixed(2)}`;
  if(avgDonut){
    const percent = (overall / 5) * 100;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percent / 100) * circumference;
    avgDonut.style.strokeDasharray = `${circumference}`;
    avgDonut.style.strokeDashoffset = `${offset}`;
  }
}

function renderPage(){
  if(!reviewsContainer) return;
  reviewsContainer.innerHTML = '';
  const filtered = reviews.slice();
  filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
  if(!filtered.length){
    noReviewsBox.style.display = 'block';
    return;
  } else noReviewsBox.style.display = 'none';

  filtered.forEach(r => {
    const type = r.rating <= 2 ? '1star' : (r.rating >= 5 ? '5star' : '3star');
    const img = `assets/logos/reviews/${type}_icon_${r.gender || 'male'}.gif`;
    const svc = r.service === 'web' ? '🌐' : r.service === 'prog' ? '💻' : '🎬';
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-header">
        <img class="author-img" src="${img}" alt="">
        <div class="review-meta">
          <h4>${escapeHtml(r.name)} <span>${svc}</span></h4>
        </div>
        <div class="review-rating">${stars}</div>
      </div>
      <p class="review-text">${escapeHtml(r.message)}</p>
      <div class="review-footer"><small>${new Date(r.date).toLocaleString()}</small></div>
    `;
    reviewsContainer.appendChild(card);
  });
}

window.addEventListener('load', () => {
  loadReviews();
  updateAvatar();
});
