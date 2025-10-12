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

// === DOM Elements ===
const form = document.getElementById("review-form");
const nameInput = document.getElementById("name");
const ratingInput = document.getElementById("rating");
const messageInput = document.getElementById("message");
const serviceSelect = document.getElementById("service");
const starPicker = document.getElementById("star-picker");
const charCount = document.getElementById("char-count");

const reviewsList = document.getElementById("reviews-list");
const noReviews = document.getElementById("no-reviews");
const avgValueEl = document.getElementById("avg-value");
const totalCountEl = document.getElementById("total-count");
const sortSelect = document.getElementById("sort-select");

let allReviews = []; // local cache
let currentFilter = "all";

// assets avatars
const AVATAR_MALE = "assets/logos/male.png";
const AVATAR_FEMALE = "assets/logos/female.png";
const AVATAR_DEFAULT = AVATAR_MALE;

// --- star UI logic ---
function setStarsValue(value){
  ratingInput.value = value;
  [...starPicker.children].forEach(star => {
    const v = Number(star.dataset.value);
    if (v <= value) star.classList.add("selected"); else star.classList.remove("selected");
  });
}
starPicker.addEventListener("click", (e) => {
  const star = e.target.closest(".star");
  if (!star) return;
  const v = Number(star.dataset.value);
  setStarsValue(v);
});
starPicker.addEventListener("mouseover", (e) => {
  const star = e.target.closest(".star");
  if (!star) return;
  const v = Number(star.dataset.value);
  [...starPicker.children].forEach(s => s.classList.toggle("hover", Number(s.dataset.value) <= v));
});
starPicker.addEventListener("mouseout", () => {
  [...starPicker.children].forEach(s => s.classList.remove("hover"));
});
starPicker.addEventListener("keydown", (e) => {
  // allow keyboard rating (left/right/up/down/enter)
  const focused = document.activeElement;
  if (!focused || !focused.classList.contains("star")) return;
  let current = Number(focused.dataset.value);
  if (["ArrowLeft","ArrowDown"].includes(e.key)) current = Math.max(1, current-1);
  if (["ArrowRight","ArrowUp"].includes(e.key)) current = Math.min(5, current+1);
  if (e.key === "Enter") { setStarsValue(current); focused.blur(); }
  // move focus to new star
  const next = [...starPicker.children].find(s => Number(s.dataset.value) === current);
  if (next) next.focus();
});

// init default stars
setStarsValue(5);

// --- textarea char count & limit already enforced by maxlength ---
function updateCharCount(){
  charCount.textContent = `${messageInput.value.length} / 100`;
}
messageInput.addEventListener("input", updateCharCount);
updateCharCount();

// --- FORM SUBMIT ---
form.addEventListener("submit", e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const rating = Number(ratingInput.value) || 0;
  const message = messageInput.value.trim().slice(0,100);
  const service = serviceSelect.value;
  const gender = (form.querySelector('input[name="gender"]:checked') || {value: 'male'}).value;

  if (!name || !rating || !message) {
    return alert("Te rog completează toate câmpurile.");
  }

  const now = new Date();
  const payload = {
    name,
    rating,
    message,
    service,
    gender,
    timestamp: now.toISOString(),
    displayDate: now.toLocaleString()
  };

  const reviewRef = db.ref("reviews").push();
  reviewRef.set(payload)
    .then(() => {
      // reset form nicely
      form.reset();
      setStarsValue(5);
      updateCharCount();
      alert("✅ Review trimis!");
    })
    .catch(err => {
      console.error(err);
      alert("Eroare la trimitere. Încearcă din nou.");
    });
});

// --- UTILS: emoji & avatar map ---
function serviceEmoji(s){
  if (s === "web") return "🌐";
  if (s === "editing") return "🎬";
  if (s === "programming") return "💻";
  return "🔖";
}
function avatarForGender(g){
  if (g === "female") return AVATAR_FEMALE;
  return AVATAR_MALE;
}

// --- LOAD & RENDER REVIEWS ---
function computeStats(reviews){
  if (!reviews.length) return {avg: 0, total:0};
  const sum = reviews.reduce((acc,r)=>acc + Number(r.rating || 0), 0);
  const avg = +(sum / reviews.length).toFixed(2);
  return {avg, total: reviews.length};
}

function renderStarsInline(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= rating ? 'selected' : ''}">★</span>`;
  }
  return html;
}

function renderReviewCard(review, key){
  const avatar = avatarForGender(review.gender || "male");
  const emoji = serviceEmoji(review.service || "web");
  const dateText = review.displayDate || review.date || new Date(review.timestamp || Date.now()).toLocaleString();
  const ratingNum = Number(review.rating) || 0;

  const wrapper = document.createElement("div");
  wrapper.className = "review-card";
  wrapper.dataset.key = key;
  wrapper.dataset.service = review.service || "unknown";
  wrapper.innerHTML = `
    <div class="review-avatar">
      <img src="${avatar}" alt="${review.gender} avatar" loading="lazy">
    </div>
    <div class="review-content">
      <div class="review-head">
        <div class="review-meta">
          <div>
            <span class="review-name">${escapeHtml(review.name)}</span>
            <span class="review-stars">${renderStarsInline(ratingNum)}</span>
            <span class="review-emoji">${emoji}</span>
          </div>
        </div>
        <div class="review-date">${escapeHtml(dateText)}</div>
      </div>
      <div class="review-msg">${escapeHtml(review.message)}</div>
    </div>
  `;
  return wrapper;
}

// basic escape to avoid injection
function escapeHtml(s){
  if(!s) return "";
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'", "&#039;");
}

// sort helper
function sortReviews(arr, mode){
  const copy = [...arr];
  if (mode === "newest") return copy.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  if (mode === "oldest") return copy.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
  if (mode === "highest") return copy.sort((a,b) => Number(b.rating) - Number(a.rating));
  if (mode === "lowest") return copy.sort((a,b) => Number(a.rating) - Number(b.rating));
  return copy;
}

function filterReviews(arr, filter){
  if (!filter || filter === "all") return arr;
  return arr.filter(r => (r.service || "") === filter);
}

function refreshUI(){
  // build filtered + sorted list
  let toShow = filterReviews(allReviews, currentFilter);
  toShow = sortReviews(toShow, sortSelect.value);

  // stats
  const stats = computeStats(filterReviews(allReviews, "all")); // stats across all reviews
  avgValueEl.textContent = (stats.avg || 0).toFixed(2);
  totalCountEl.textContent = stats.total;

  // render list
  reviewsList.innerHTML = "";
  if (!toShow.length){
    noReviews.style.display = "block";
    return;
  } else {
    noReviews.style.display = "none";
  }

toShow.forEach(r => {
  const card = renderReviewCard(r, r.key);
  reviewsList.appendChild(card);
});
    
function loadReviews() {
  db.ref("reviews").on("value", snapshot => {
    const arr = [];
    snapshot.forEach(child => {
      const val = child.val() || {};
      const safe = {
        name: val.name || "Anon",
        rating: Number(val.rating || 0),
        message: val.message || "",
        service: val.service || "web",
        gender: val.gender || "male",
        timestamp: val.timestamp || new Date(val.date || Date.now()).toISOString(),
        displayDate: val.displayDate || val.date || new Date().toLocaleString(),
      };
      arr.push({ key: child.key, ...safe });
    });
    allReviews = arr;
    refreshUI();
  }, err => {
    console.error("Firebase read error:", err);
  });
}
// --- Sort & filter handlers ---
sortSelect.addEventListener("change", () => refreshUI());

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    currentFilter = f === "all" ? "all" : f;
    refreshUI();
  });
});

// init - set default filter button active
document.querySelectorAll(".filter-btn").forEach(b => {
  if (b.dataset.filter === "all") b.classList.add("active");
});

// --- startup ---
window.addEventListener("load", () => {
  loadReviews();
  updateCharCount();
});
