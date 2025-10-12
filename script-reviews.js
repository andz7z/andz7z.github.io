// === FIREBASE ===
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

// === ELEMENTE ===
const reviewSection = document.getElementById("reviews");
const showReviewsBtn = document.getElementById("show-reviews-btn");
const form = document.getElementById("review-form");
const stars = document.querySelectorAll(".rating-stars span");
const ratingInput = document.getElementById("rating");
const reviewsList = document.getElementById("reviews-list");
const filterSelect = document.getElementById("filter");
const pagination = document.getElementById("pagination");
const avgStarsElem = document.getElementById("avg-stars");

// === AFISARE LA CLICK PE BUTON ===
showReviewsBtn.addEventListener("click", () => {
  reviewSection.classList.toggle("visible");
  reviewSection.classList.toggle("hidden");
});

// === SISTEM STELE SIMPLU ===
let selectedRating = 0;
stars.forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.dataset.value);
    ratingInput.value = selectedRating;
    stars.forEach(s => s.classList.toggle("selected", parseInt(s.dataset.value) <= selectedRating));
  });
});

// === SUBMIT FORM ===
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const gender = document.getElementById("gender").value;
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim().slice(0,100);
  const rating = parseInt(ratingInput.value);
  if (!name || !gender || !service || !rating || !message) return alert("Please fill all fields!");
  
  db.ref("reviews").push({
    name, gender, service, rating, message, date: new Date().toISOString()
  });
  form.reset();
  stars.forEach(s => s.classList.remove("selected"));
  selectedRating = 0;
  alert("✅ Review sent!");
});

// === AFISARE REVIEW-URI ===
let reviewsData = [];
let currentPage = 1;
const REVIEWS_PER_PAGE = 10;

function renderStars(rating) {
  return Array.from({length:5},(_,i)=>`<span class="${i<rating?'filled':''}">★</span>`).join('');
}

function renderReviews() {
  let sorted = [...reviewsData];
  const filter = filterSelect.value;
  if (filter === "recent") sorted.sort((a,b)=>new Date(b.date)-new Date(a.date));
  if (filter === "oldest") sorted.sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (filter === "highest") sorted.sort((a,b)=>b.rating-a.rating);
  if (filter === "lowest") sorted.sort((a,b)=>a.rating-b.rating);

  const totalPages = Math.ceil(sorted.length / REVIEWS_PER_PAGE);
  const start = (currentPage - 1) * REVIEWS_PER_PAGE;
  const pageReviews = sorted.slice(start, start + REVIEWS_PER_PAGE);

  reviewsList.innerHTML = pageReviews.map(r => `
    <div class="review-card">
      <img src="assets/logos/${r.gender}.gif" alt="${r.gender}">
      <div class="review-info">
        <div class="name">${r.name}</div>
        <div class="service">${r.service}</div>
        <div class="stars">${renderStars(r.rating)}</div>
        <div class="message">${r.message}</div>
      </div>
    </div>
  `).join('');

  pagination.innerHTML = "";
  for (let i=1; i<=totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.toggle("active", i===currentPage);
    btn.onclick = () => { currentPage = i; renderReviews(); };
    pagination.appendChild(btn);
  }

  const avg = (reviewsData.reduce((sum,r)=>sum+r.rating,0)/reviewsData.length||0).toFixed(1);
  avgStarsElem.textContent = `⭐ ${avg}`;
}

db.ref("reviews").on("value", snap => {
  reviewsData = [];
  snap.forEach(child => reviewsData.push(child.val()));
  renderReviews();
});

filterSelect.addEventListener("change", ()=>{currentPage=1; renderReviews();});
