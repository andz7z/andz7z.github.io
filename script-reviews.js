// script-reviews.js (înlocuiește tot conținutul vechi cu acesta)

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

// === ELEMENTS ===
const showBtn = document.getElementById("show-reviews-btn");
const panel = document.getElementById("reviews-panel");
const closeBtn = document.getElementById("close-reviews");
const form = document.getElementById("review-form");
const avatarImg = document.getElementById("preview-avatar");
const genderBtns = document.querySelectorAll(".gender-btn");
const serviceBtns = document.querySelectorAll(".service-btn");
const serviceInput = document.getElementById("service");
const ratingStars = document.querySelectorAll(".rating-star");
const ratingInput = document.getElementById("rating");
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
const reviewsListEl = document.getElementById("reviews-list");
const listStats = document.getElementById("list-stats");
const paginationEl = document.getElementById("pagination");
const avgStarsElem = document.getElementById("avg-stars");
const filterBtns = document.querySelectorAll(".filter-btn");

let reviewsData = [];
let selectedGender = "male";
let selectedService = "";
let selectedRating = 0;
let currentPage = 1;
const REVIEWS_PER_PAGE = 10;
let currentFilter = "recent";

// === SHOW / HIDE PANEL ===
showBtn?.addEventListener("click", () => {
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
});
closeBtn?.addEventListener("click", closePanel);
function closePanel() {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
}

// close when clicking backdrop
document.querySelector(".reviews-backdrop").addEventListener("click", closePanel);

// === GENDER SELECT ===
genderBtns.forEach(btn=>{
  btn.addEventListener("click", () => {
    genderBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    selectedGender = btn.dataset.gender;
    avatarImg.src = `assets/logos/${selectedGender}.gif`;
  });
});
// default select first gender
if(genderBtns[0]) { genderBtns[0].classList.add("active"); selectedGender = genderBtns[0].dataset.gender; avatarImg.src = `assets/logos/${selectedGender}.gif`; }

// === SERVICE SELECT (emoji buttons) ===
serviceBtns.forEach(btn=>{
  btn.addEventListener("click", () => {
    serviceBtns.forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedService = btn.dataset.service;
    serviceInput.value = selectedService;
  });
});

// === RATING STARS (click simple, accessible) ===
function setRating(val){
  selectedRating = val;
  ratingInput.value = val;
  ratingStars.forEach(s=>{
    const v = parseInt(s.dataset.value,10);
    s.classList.toggle("selected", v <= val);
    s.setAttribute("aria-pressed", v <= val ? "true" : "false");
  });
}
ratingStars.forEach(st=>{
  st.addEventListener("click", ()=> setRating(parseInt(st.dataset.value,10)));
});
setRating(0); // initial

// === CHAR COUNTER ===
messageInput.addEventListener("input", () => {
  const len = messageInput.value.length;
  charCount.textContent = `${len}/100`;
  if(len > 100) messageInput.value = messageInput.value.slice(0,100);
});

// === FORM SUBMIT ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const message = messageInput.value.trim().slice(0,100);
  const gender = selectedGender;
  const service = serviceInput.value || selectedService;
  const rating = parseInt(ratingInput.value,10) || 0;
  if(!name || !service || !rating || !message) { alert("Please complete all fields (name, service, rating, message)."); return; }

  // push to firebase
  try {
    await db.ref("reviews").push({
      name, gender, service, rating, message, date: new Date().toISOString()
    });
    // reset form visually
    form.reset();
    setRating(0);
    serviceBtns.forEach(b=>b.classList.remove("selected"));
    selectedService = "";
    charCount.textContent = "0/100";
    // feedback
    alert("✅ Review sent!");
  } catch (err) {
    console.error(err);
    alert("Error saving review. Check console.");
  }
});

// === LOAD REVIEWS FROM FIREBASE ===
db.ref("reviews").on("value", snap => {
  reviewsData = [];
  snap.forEach(child => {
    const val = child.val();
    // ensure we have date and numeric rating
    reviewsData.push({
      name: val.name || "Anonymous",
      gender: val.gender || "male",
      service: val.service || "Web Dev",
      rating: Number(val.rating) || 0,
      message: (val.message || "").slice(0,100),
      date: val.date || new Date().toISOString()
    });
  });
  currentPage = 1;
  render();
});

// === RENDER HELPERS ===
function renderStarsInline(rating){
  let out = "";
  for(let i=1;i<=5;i++){
    out += `<span class="${i<=rating? 'star-filled' : 'star-empty'}">★</span>`;
  }
  return out;
}

function sortData(arr, filter){
  const copy = [...arr];
  if(filter === "recent") return copy.sort((a,b)=> new Date(b.date) - new Date(a.date));
  if(filter === "oldest") return copy.sort((a,b)=> new Date(a.date) - new Date(b.date));
  if(filter === "highest") return copy.sort((a,b)=> b.rating - a.rating);
  if(filter === "lowest") return copy.sort((a,b)=> a.rating - b.rating);
  return copy;
}

function render(){
  // stats
  const total = reviewsData.length;
  const avg = total ? (reviewsData.reduce((s,r)=>s+r.rating,0)/total).toFixed(1) : "0.0";
  avgStarsElem.textContent = `⭐ ${avg} / 5`;
  listStats.textContent = `${total} review${total!==1?'s':''}`;

  // prepare sorted + paginated
  const sorted = sortData(reviewsData, currentFilter);
  const totalPages = Math.max(1, Math.ceil(sorted.length / REVIEWS_PER_PAGE));
  if(currentPage > totalPages) currentPage = 1;
  const start = (currentPage - 1) * REVIEWS_PER_PAGE;
  const pageItems = sorted.slice(start, start + REVIEWS_PER_PAGE);

  // render items
  reviewsListEl.innerHTML = pageItems.map(r => {
    const date = new Date(r.date).toLocaleString();
    return `
      <article class="review-item" role="article">
        <img src="assets/logos/${r.gender}.gif" alt="${r.gender}" />
        <div class="review-meta">
          <div class="review-top">
            <div class="review-name">${escapeHtml(r.name)}</div>
            <div class="review-service">· ${escapeHtml(r.service)}</div>
          </div>
          <div class="review-stars">${renderStarsInline(r.rating)}</div>
          <div class="review-msg">${escapeHtml(r.message)}</div>
          <div class="review-date" style="font-size:.75rem; opacity:.6; margin-top:6px;">${date}</div>
        </div>
      </article>
    `;
  }).join("") || `<div style="padding:18px;color:#ddd">No reviews yet — be the first ✨</div>`;

  // pagination
  paginationEl.innerHTML = "";
  for(let i=1;i<=totalPages;i++){
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i===currentPage ? "active" : "";
    btn.addEventListener("click", ()=>{ currentPage = i; render(); });
    paginationEl.appendChild(btn);
  }
}

// simple escape to avoid injecting html from reviews
function escapeHtml(str){
  return String(str).replace(/[&<>"'`]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;', '`':'&#96;'}[s]));
}

// === FILTER BUTTONS ===
filterBtns.forEach(btn=>{
  btn.addEventListener("click", () => {
    filterBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    currentPage = 1;
    render();
  });
});
// default active filter
const defFilterBtn = document.querySelector('.filter-btn[data-filter="recent"]');
if(defFilterBtn) { defFilterBtn.classList.add("active"); currentFilter = "recent"; }

// === keyboard close (esc) ===
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && panel.classList.contains("open")) closePanel();
});
