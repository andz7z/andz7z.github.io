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

let allReviews = [];
let currentFilter = "all";

const AVATAR_MALE = "assets/logos/male.png";
const AVATAR_FEMALE = "assets/logos/female.png";

// === UTILITĂȚI ===
const escapeHtml = s => s?.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) || "";

const avatarForGender = g => (g === "female" ? AVATAR_FEMALE : AVATAR_MALE);
const serviceEmoji = s => s === "editing" ? "🎬" : s === "programming" ? "💻" : "🌐";

// === SISTEM DE STELE ===
function setStarsValue(val) {
  ratingInput.value = val;
  document.querySelectorAll("#star-picker .star").forEach(star => {
    star.classList.toggle("selected", Number(star.dataset.value) <= val);
  });
}
document.querySelectorAll("#star-picker .star").forEach(star => {
  star.addEventListener("click", () => setStarsValue(Number(star.dataset.value)));
});
setStarsValue(5);

// === CONTOR DE CARACTERE ===
function updateCharCount() {
  charCount.textContent = `${messageInput.value.length} / 100`;
}
messageInput.addEventListener("input", updateCharCount);
updateCharCount();

// === TRIMITERE REVIEW ===
form.addEventListener("submit", e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const rating = Number(ratingInput.value);
  const message = messageInput.value.trim().slice(0, 100);
  const service = serviceSelect.value;
  const gender = form.querySelector("input[name='gender']:checked")?.value || "male";

  if (!name || !rating || !message) return alert("Te rog completează toate câmpurile.");

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
    alert("✅ Review trimis!");
  });
});

// === CITIRE ȘI AFIȘARE REVIEW-URI ===
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
    refreshUI();
  });
}

function computeStats(reviews) {
  if (!reviews.length) return { avg: 0, total: 0 };
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  return { avg: avg.toFixed(2), total: reviews.length };
}

function renderStarsInline(val) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="mini-star ${i + 1 <= val ? 'active' : ''}">★</span>`
  ).join("");
}

function renderReviewCard(r) {
  const emoji = serviceEmoji(r.service);
  const avatar = avatarForGender(r.gender);
  return `
    <div class="review-card" title="${r.displayDate}">
      <div class="review-avatar"><img src="${avatar}" alt="avatar"></div>
      <div class="review-content">
        <div class="review-head">
          <span class="review-name">${escapeHtml(r.name)}</span>
          <span class="review-stars">${renderStarsInline(r.rating)}</span>
          <span class="review-emoji">${emoji}</span>
        </div>
        <div class="review-msg">${escapeHtml(r.message)}</div>
      </div>
    </div>
  `;
}

function refreshUI() {
  const sortMode = sortSelect.value;
  let arr = [...allReviews];
  if (sortMode === "newest") arr.sort((a, b) => b.timestamp - a.timestamp);
  if (sortMode === "oldest") arr.sort((a, b) => a.timestamp - b.timestamp);
  if (sortMode === "highest") arr.sort((a, b) => b.rating - a.rating);
  if (sortMode === "lowest") arr.sort((a, b) => a.rating - b.rating);

  reviewsList.innerHTML = "";
  if (!arr.length) {
    noReviews.style.display = "block";
  } else {
    noReviews.style.display = "none";
    arr.forEach(r => (reviewsList.innerHTML += renderReviewCard(r)));
  }

  const { avg, total } = computeStats(allReviews);
  avgValueEl.textContent = avg;
  totalCountEl.textContent = total;
}

sortSelect.addEventListener("change", refreshUI);
window.addEventListener("load", loadReviews);
