// script-reviews.js — REFACTORED REVIEWS (Ice / Gold themes)
// păstrează inițializarea Firebase deja din proiectul tău
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

// === DOM ELEMENTS ===
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
const avgPerServiceEls = {
  web: document.getElementById("avg-web"),
  editing: document.getElementById("avg-editing"),
  programming: document.getElementById("avg-programming")
};
const pageControls = document.getElementById("pagination-controls");

let allReviews = [];
let filteredReviews = [];
let initialized = false;
let currentFilter = "all";
let currentPage = 1;
const PAGE_SIZE = 12; // între 10 și 15 conform cerinței — ajustează dacă vrei

// === PATHS AVATARE (gif specific) ===
const AVATAR_MALE = "assets/logos/reviews/male.gif";
const AVATAR_FEMALE = "assets/logos/reviews/female.gif";

// === HELPERS ===
const escapeHtml = s => s?.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) || "";
const avatarForGender = g => (g === "female" ? AVATAR_FEMALE : AVATAR_MALE);
const serviceEmoji = s => s === "editing" ? "🎬" : s === "programming" ? "💻" : "🌐";
const serviceLabel = s => s === "editing" ? "Editing" : s === "programming" ? "Programming" : "Web Dev";

// === STAR PICKER ===
function setStarsValue(val) {
  ratingInput.value = val;
  document.querySelectorAll("#star-picker .star").forEach(star => {
    star.classList.toggle("selected", Number(star.dataset.value) <= val);
  });
}
document.querySelectorAll("#star-picker .star").forEach(star => {
  star.addEventListener("click", () => setStarsValue(Number(star.dataset.value)));
  star.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setStarsValue(Number(star.dataset.value));
    }
  });
});
setStarsValue(5);

// === CHAR COUNTER ===
function updateCharCount() {
  charCount.textContent = `${messageInput.value.length} / 100`;
}
messageInput.addEventListener("input", updateCharCount);
updateCharCount();

// === FORM SUBMIT ===
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const rating = Number(ratingInput.value);
  const message = messageInput.value.trim().slice(0, 100);
  const service = serviceSelect.value;
  const gender = form.querySelector("input[name='gender']:checked")?.value || "male";

  if (!name || !rating || !message) {
    return alert("Te rog completează toate câmpurile.");
  }

  const data = {
    name,
    rating,
    message,
    service,
    gender,
    timestamp: Date.now(),
    displayDate: new Date().toLocaleString()
  };

  db.ref("reviews").push(data).then(() => {
    form.reset();
    setStarsValue(5);
    updateCharCount();
    showToast("Review trimis ✅");
  }).catch(err => {
    console.error(err);
    alert("Eroare la trimitere — încearcă din nou.");
  });
});

// === FIREBASE LOADING (lazy init) ===
function initReviewsOnce() {
  if (initialized) return;
  initialized = true;
  loadReviews();
  attachFilterButtons();
  attachPaginationControls();
  showToast("Reviews inițializat");
}

// read reviews
function loadReviews() {
  db.ref("reviews").on("value", snap => {
    const arr = [];
    snap.forEach(ch => {
      const val = ch.val();
      arr.push({
        key: ch.key,
        name: val.name || "Anon",
        rating: Number(val.rating || 0),
        message: val.message || "",
        service: val.service || "web",
        gender: val.gender || "male",
        timestamp: val.timestamp || Date.now(),
        displayDate: val.displayDate || val.date || new Date().toLocaleString()
      });
    });
    allReviews = arr;
    currentPage = 1;
    applyFilterAndSort();
  });
}

// === STATS ===
function computeStats(reviews) {
  if (!reviews.length) return { avg: 0, total: 0 };
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  return { avg: Number(avg.toFixed(2)), total: reviews.length };
}

function computePerServiceStats(reviews) {
  const groups = { web: [], editing: [], programming: [] };
  reviews.forEach(r => {
    if (!groups[r.service]) groups[r.service] = [];
    groups[r.service].push(r);
  });
  return {
    web: computeStats(groups.web),
    editing: computeStats(groups.editing),
    programming: computeStats(groups.programming)
  };
}

// === RENDER HELPERS ===
function renderStarsInline(val) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="mini-star ${i + 1 <= val ? 'active' : ''}">★</span>`
  ).join("");
}

function renderReviewCard(r) {
  const emoji = serviceEmoji(r.service);
  const avatar = avatarForGender(r.gender);
  // layout aerisit, glassy card
  return `
    <article class="review-card glass">
      <div class="rc-left">
        <div class="rc-avatar"><img src="${avatar}" alt="avatar"></div>
        <div class="rc-meta">
          <div class="rc-name">${escapeHtml(r.name)}</div>
          <div class="rc-service">${emoji} <span class="rc-service-label">${serviceLabel(r.service)}</span></div>
        </div>
      </div>
      <div class="rc-right">
        <div class="rc-stars" aria-hidden="true">${renderStarsInline(r.rating)}</div>
        <div class="rc-msg">${escapeHtml(r.message)}</div>
        <div class="rc-footer"> <small class="rc-date">${escapeHtml(r.displayDate)}</small> </div>
      </div>
    </article>
  `;
}

// === FILTER / SORT / PAGINATION LOGIC ===
function applyFilterAndSort() {
  const sortMode = sortSelect.value;
  let arr = [...allReviews];

  // filter
  if (currentFilter !== "all") arr = arr.filter(r => r.service === currentFilter);

  // sort
  if (sortMode === "newest") arr.sort((a, b) => b.timestamp - a.timestamp);
  if (sortMode === "oldest") arr.sort((a, b) => a.timestamp - b.timestamp);
  if (sortMode === "highest") arr.sort((a, b) => b.rating - a.rating);
  if (sortMode === "lowest") arr.sort((a, b) => a.rating - b.rating);

  filteredReviews = arr;
  renderReviewsPage();
  renderStats();
}

function renderReviewsPage() {
  reviewsList.innerHTML = "";
  if (!filteredReviews.length) {
    noReviews.style.display = "block";
    pageControls.innerHTML = "";
    return;
  } else {
    noReviews.style.display = "none";
  }
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filteredReviews.slice(start, end);
  // populate
  reviewsList.innerHTML = pageItems.map(r => renderReviewCard(r)).join("");
  renderPageControls(Math.ceil(filteredReviews.length / PAGE_SIZE));
}

// pagination control render
function renderPageControls(totalPages) {
  if (totalPages <= 1) {
    pageControls.innerHTML = "";
    return;
  }
  let html = `<div class="pager">`;
  html += `<button class="pager-btn" data-action="prev" ${currentPage===1?'disabled':''}>‹ Prev</button>`;
  // show up to 5 page numbers centered
  const showRange = 5;
  let start = Math.max(1, currentPage - Math.floor(showRange/2));
  let finish = Math.min(totalPages, start + showRange - 1);
  if (finish - start < showRange -1) start = Math.max(1, finish - showRange + 1);
  for (let p = start; p <= finish; p++) {
    html += `<button class="pager-num ${p===currentPage?'active':''}" data-page="${p}">${p}</button>`;
  }
  html += `<button class="pager-btn" data-action="next" ${currentPage===totalPages?'disabled':''}>Next ›</button>`;
  html += `</div>`;
  pageControls.innerHTML = html;

  // attach handlers
  pageControls.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const act = btn.dataset.action;
      if (act === "prev") currentPage = Math.max(1, currentPage - 1);
      else if (act === "next") currentPage = Math.min(totalPages, currentPage + 1);
      else if (btn.dataset.page) currentPage = Number(btn.dataset.page);
      renderReviewsPage();
    });
  });
}

function attachPaginationControls() {
  // placeholder (pageControls is updated by renderPageControls)
}

// attach filter buttons
function attachFilterButtons() {
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.addEventListener("click", () => {
      const f = b.dataset.filter;
      currentFilter = f === "all" ? "all" : f;
      // toggle active class
      document.querySelectorAll(".filter-btn").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      currentPage = 1;
      applyFilterAndSort();
    });
  });
  sortSelect.addEventListener("change", () => { currentPage = 1; applyFilterAndSort(); });
}

// === STATS RENDER ===
function renderStats() {
  const totalStat = computeStats(allReviews);
  avgValueEl.textContent = totalStat.avg.toFixed ? totalStat.avg.toFixed(2) : totalStat.avg;
  totalCountEl.textContent = totalStat.total;

  const per = computePerServiceStats(allReviews);
  avgPerServiceEls.web.textContent = per.web.total ? per.web.avg.toFixed(2) : "—";
  avgPerServiceEls.editing.textContent = per.editing.total ? per.editing.avg.toFixed(2) : "—";
  avgPerServiceEls.programming.textContent = per.programming.total ? per.programming.avg.toFixed(2) : "—";
}

// === UTILS: toast ===
function showToast(text, ms = 2200) {
  const n = document.getElementById("notif-text");
  const wrap = document.getElementById("notification");
  if (!n || !wrap) return;
  n.textContent = `✨ ${text}`;
  wrap.classList.add("show");
  setTimeout(() => wrap.classList.remove("show"), ms);
}

// === INIT (lazy) ===
// Initialize when Reviews button is clicked (the nav button has inline onclick openSection('reviews'))
document.addEventListener("DOMContentLoaded", () => {
  const reviewsBtn = document.querySelector("button[onclick=\"openSection('reviews')\"]");
  if (reviewsBtn) {
    reviewsBtn.addEventListener("click", () => {
      // small delay to wait for section to become visible
      setTimeout(initReviewsOnce, 220);
    });
  } else {
    // fallback: initialize immediately
    initReviewsOnce();
  }
});

// Expose applyFilterAndSort for external triggers
window.reviewsApplyFilterAndSort = applyFilterAndSort;
