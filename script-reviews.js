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

// DOM
const form = document.getElementById("review-form");
const nameInput = document.getElementById("name");
const ratingInput = document.getElementById("rating");
const messageInput = document.getElementById("message");
const serviceSelect = document.getElementById("service");
const starPicker = document.getElementById("star-picker");
const charCount = document.getElementById("char-count");
const sortSelect = document.getElementById("sort-select");
const reviewsList = document.getElementById("reviews-list");
const noReviews = document.getElementById("no-reviews");
const avgValueEl = document.getElementById("avg-value");
const totalCountEl = document.getElementById("total-count");
const paginationEl = document.getElementById("pagination");

let allReviews = []; // full array from firebase
let currentFilter = "all";
let perPage = 10;
let currentPage = 1;

// avatar assets
const AVATAR_MALE = "assets/logos/male.png";
const AVATAR_FEMALE = "assets/logos/female.png";

// util
const escapeHtml = s => s?.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) || "";
const avatarForGender = g => (g === "female" ? AVATAR_FEMALE : AVATAR_MALE);
const serviceEmoji = s => s === "editing" ? "🎬" : s === "programming" ? "💻" : "🌐";

// STARS picker logic (refreshed)
function setStarsValue(v) {
  ratingInput.value = v;
  document.querySelectorAll("#star-picker .star").forEach(st => {
    st.classList.toggle("selected", Number(st.dataset.value) <= v);
  });
}
document.querySelectorAll("#star-picker .star").forEach(s => {
  s.addEventListener("click", () => {
    setStarsValue(Number(s.dataset.value));
  });
  s.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setStarsValue(Number(s.dataset.value));
    }
  });
});
setStarsValue(5);

// char count
function updateCharCount(){ charCount.textContent = `${messageInput.value.length} / 100`; }
messageInput.addEventListener("input", updateCharCount);
updateCharCount();

// submit handler
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const rating = Number(ratingInput.value) || 0;
  const message = messageInput.value.trim().slice(0,100);
  const service = serviceSelect.value;
  const gender = form.querySelector("input[name='gender']:checked")?.value || "male";
  if (!name || !rating || !message) return alert("Te rog completează toate câmpurile.");

  const payload = {
    name, rating, message, service, gender,
    timestamp: Date.now(),
    displayDate: new Date().toLocaleString()
  };
  db.ref("reviews").push(payload).then(() => {
    form.reset();
    setStarsValue(5);
    updateCharCount();
    // nice UX: small flash on submit then stay
  }).catch(err => console.error(err));
});

// load reviews with fallbacks
function loadReviews(){
  db.ref("reviews").on("value", snap => {
    const arr = [];
    snap.forEach(ch => {
      const v = ch.val() || {};
      arr.push({
        key: ch.key,
        name: v.name || "Anon",
        rating: Number(v.rating || 0),
        message: v.message || "",
        service: v.service || "web",
        gender: v.gender || "male",
        timestamp: v.timestamp || (v.date ? new Date(v.date).getTime() : Date.now()),
        displayDate: v.displayDate || v.date || new Date((v.timestamp)||Date.now()).toLocaleString()
      });
    });
    // newest first native order
    allReviews = arr.sort((a,b)=>b.timestamp - a.timestamp);
    currentPage = 1;
    renderPage();
  }, err => console.error("Firebase read:", err));
}

// compute stats
function computeStats(arr){
  if (!arr.length) return {avg:0,total:0};
  const sum = arr.reduce((a,r)=>a + Number(r.rating || 0), 0);
  return { avg: (sum/arr.length).toFixed(2), total: arr.length };
}

// render stars small
function renderStarsInline(rating){
  let s = "";
  for (let i=1;i<=5;i++){
    s += `<span class="mini-star ${i<=rating ? 'active' : ''}">★</span>`;
  }
  return s;
}

// build card html
function reviewCardHtml(r){
  const avatar = avatarForGender(r.gender);
  const emoji = serviceEmoji(r.service);
  // show date as title (tooltip) and also as aria-label
  return `
  <div class="review-card fade-in" title="${escapeHtml(r.displayDate)}" role="article" aria-label="Review by ${escapeHtml(r.name)}">
    <div class="review-avatar"><img src="${avatar}" alt="avatar"></div>
    <div class="review-content">
      <div class="review-head">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="review-name">${escapeHtml(r.name)}</div>
          <div class="review-emoji" aria-hidden="true">${emoji}</div>
        </div>
        <div class="review-stars" aria-hidden="true">${renderStarsInline(r.rating)}</div>
      </div>
      <div class="review-msg">${escapeHtml(r.message)}</div>
    </div>
  </div>`;
}

// filtering + sorting + pagination
function getFilteredSorted(){
  let arr = [...allReviews];
  if (currentFilter && currentFilter !== "all") arr = arr.filter(x=>x.service === currentFilter);
  const mode = sortSelect.value;
  if (mode === "newest") arr.sort((a,b)=>b.timestamp - a.timestamp);
  if (mode === "oldest") arr.sort((a,b)=>a.timestamp - b.timestamp);
  if (mode === "highest") arr.sort((a,b)=>b.rating - a.rating);
  if (mode === "lowest") arr.sort((a,b)=>a.rating - b.rating);
  return arr;
}

function renderPage(){
  const list = getFilteredSorted();
  // pagination
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  if (currentPage > pages) currentPage = pages;
  const start = (currentPage-1)*perPage;
  const pageItems = list.slice(start, start + perPage);

  // render reviews
  reviewsList.innerHTML = "";
  if (!pageItems.length) {
    noReviews.style.display = "block";
  } else {
    noReviews.style.display = "none";
    pageItems.forEach(r => reviewsList.insertAdjacentHTML('beforeend', reviewCardHtml(r)));
    // after inject, ensure fade-in animations trigger
    document.querySelectorAll('.review-card.fade-in').forEach((el, i) => {
      el.style.animationDelay = `${i * 40}ms`;
      el.classList.remove('fade-in');
      void el.offsetWidth; // reflow
      el.classList.add('fade-in');
    });
  }

  // stats computed across ALL reviews (not only filtered), per your earlier request
  const stats = computeStats(allReviews);
  avgValueEl.innerHTML = `<span class="glow-star">★</span> ${stats.avg}`;
  totalCountEl.textContent = stats.total;

  // render pagination controls
  renderPagination(pages);
}

function renderPagination(pages){
  paginationEl.innerHTML = "";
  if (pages <= 1) return;
  // show first/prev
  const createBtn = (label, cls, handler) => {
    const btn = document.createElement('button');
    btn.innerText = label;
    if (cls) btn.className = cls;
    btn.addEventListener('click', handler);
    return btn;
  };
  if (currentPage > 1) paginationEl.appendChild(createBtn('«', '', ()=>{ currentPage = 1; renderPage(); }));
  if (currentPage > 1) paginationEl.appendChild(createBtn('‹', '', ()=>{ currentPage = Math.max(1,currentPage-1); renderPage(); }));

  // page numbers (smart: show around current)
  const delta = 2;
  const pagesToShow = [];
  for (let i=1;i<=pages;i++){
    if (i===1 || i===pages || (i>=currentPage-delta && i<=currentPage+delta)) pagesToShow.push(i);
  }
  let last = 0;
  pagesToShow.forEach(p=>{
    if (p - last > 1) {
      const dots = document.createElement('span'); dots.innerText = '...'; dots.style.opacity = '.6'; paginationEl.appendChild(dots);
    }
    const cls = (p===currentPage) ? 'active' : '';
    paginationEl.appendChild(createBtn(p, cls, ()=>{ currentPage = p; renderPage(); }));
    last = p;
  });

  if (currentPage < pages) paginationEl.appendChild(createBtn('›', '', ()=>{ currentPage = Math.min(pages,currentPage+1); renderPage(); }));
  if (currentPage < pages) paginationEl.appendChild(createBtn('»', '', ()=>{ currentPage = pages; renderPage(); }));
}

// filter buttons
document.querySelectorAll('.filter-btn').forEach(b=>{
  b.addEventListener('click', ()=> {
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    currentFilter = b.dataset.filter || 'all';
    currentPage = 1;
    renderPage();
  });
});

// sort change
sortSelect.addEventListener('change', ()=> { currentPage = 1; renderPage(); });

// initial load
window.addEventListener('load', ()=> {
  loadReviews();
});
