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

// === SELECTORS ===
const form = document.getElementById("review-form");
const stars = document.querySelectorAll("#rating-stars span");
const container = document.getElementById("reviews-container");
const noReviews = document.getElementById("no-reviews");
const thankMsg = document.getElementById("thankyou-message");
const sortSelect = document.getElementById("sort-select");
let currentRating = 0;
let allReviews = [];

// === STAR RATING ===
stars.forEach(star => {
  star.addEventListener("click", () => {
    currentRating = parseInt(star.dataset.value);
    stars.forEach(s => s.classList.toggle("active", s.dataset.value <= currentRating));
  });
});

// === SUBMIT REVIEW ===
form.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  const gender = form.querySelector("input[name='gender']:checked")?.value;

  if (!name || !message || currentRating === 0 || !gender) {
    alert("Please fill all fields and select rating + gender!");
    return;
  }

  const reviewRef = db.ref("reviews").push();
  reviewRef.set({
    name,
    message,
    gender,
    rating: currentRating,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  });

  form.reset();
  currentRating = 0;
  stars.forEach(s => s.classList.remove("active"));

  thankMsg.textContent = `✨ Thank you for your review, ${name}!`;
  thankMsg.classList.remove("hidden");
  setTimeout(() => thankMsg.classList.add("show"), 100);
  setTimeout(() => thankMsg.classList.remove("show"), 4000);
});

// === LIKE/DISLIKE (local) ===
function handleVote(id, type) {
  const key = `review_vote_${id}`;
  if (localStorage.getItem(key)) return alert("You've already reacted to this review!");
  localStorage.setItem(key, type);
  const count = document.getElementById(`${type}-${id}`);
  count.textContent = parseInt(count.textContent) + 1;
}

// === SORT + DISPLAY ===
sortSelect.addEventListener("change", () => renderReviews(allReviews));

function renderReviews(reviews) {
  container.innerHTML = "";
  if (!reviews.length) {
    noReviews.style.display = "block";
    return;
  }
  noReviews.style.display = "none";

  const sort = sortSelect.value;
  const sorted = [...reviews].sort((a, b) => {
    if (sort === "newest") return new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time);
    if (sort === "oldest") return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
    if (sort === "highest") return b.rating - a.rating;
    if (sort === "lowest") return a.rating - b.rating;
  });

  sorted.forEach((rev, idx) => {
    const id = idx + "-" + Math.random().toString(36).substring(2, 7);
    const avatarSrc = rev.gender === "female"
      ? "assets/logos/reviews/female.png"
      : "assets/logos/reviews/male.png";

    const item = document.createElement("div");
    item.className = "review-item";
    item.innerHTML = `
      <div class="review-avatar"><img src="${avatarSrc}" alt="${rev.gender}"></div>
      <div class="review-content">
        <div class="review-header">
          <strong>${rev.name}</strong>
          <span class="review-stars">${"★".repeat(rev.rating)}</span>
        </div>
        <div class="review-message">${rev.message}</div>
        <div class="review-date">📅 ${rev.date} · ⏰ ${rev.time}</div>
        <div class="review-actions">
          <button onclick="handleVote('${id}','like')">👍 <span id="like-${id}">0</span></button>
          <button onclick="handleVote('${id}','dislike')">👎 <span id="dislike-${id}">0</span></button>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

// === LOAD REVIEWS + STATS ===
function loadReviews() {
  db.ref("reviews").on("value", snapshot => {
    if (!snapshot.exists()) {
      allReviews = [];
      renderReviews(allReviews);
      updateStats([]);
      return;
    }
    const data = Object.values(snapshot.val());
    allReviews = data.reverse();
    renderReviews(allReviews);
    updateStats(allReviews);
  });
}

// === UPDATE STATS ===
function updateStats(reviews) {
  const total = reviews.length;
  const counts = [0,0,0,0,0,0]; // index = rating
  reviews.forEach(r => counts[r.rating]++);
  const sum = reviews.reduce((a,b) => a + b.rating, 0);
  const avg = total ? (sum / total).toFixed(1) : 0;

  document.getElementById("average-rating").textContent = avg;
  document.getElementById("average-stars").textContent = "★".repeat(Math.round(avg)) + "☆".repeat(5 - Math.round(avg));
  for (let i = 0; i <= 5; i++) {
    const el = document.getElementById(`count-${i}`);
    if (el) el.textContent = counts[i];
  }
  document.getElementById("count-total").textContent = total;
}

window.addEventListener("load", loadReviews);
