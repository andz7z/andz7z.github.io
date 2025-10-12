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
let currentRating = 0;

// === STAR RATING INTERACTION ===
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

  if (!name || !message || currentRating === 0) {
    alert("Please fill in all fields and select a rating!");
    return;
  }

  const reviewRef = db.ref("reviews").push();
  reviewRef.set({
    name,
    message,
    rating: currentRating,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  });

  // Clear fields + feedback
  form.reset();
  currentRating = 0;
  stars.forEach(s => s.classList.remove("active"));

  thankMsg.textContent = `✨ Thank you for your review, ${name}!`;
  thankMsg.classList.remove("hidden");
  setTimeout(() => thankMsg.classList.add("show"), 100);
  setTimeout(() => thankMsg.classList.remove("show"), 4000);
});

// === DISPLAY REVIEWS ===
function loadReviews() {
  db.ref("reviews").on("value", snapshot => {
    container.innerHTML = "";
    if (!snapshot.exists()) {
      noReviews.style.display = "block";
      return;
    }
    noReviews.style.display = "none";

    const data = snapshot.val();
    const entries = Object.values(data).reverse(); // cele mai noi sus

    entries.forEach(({ name, message, rating, date, time }) => {
      const item = document.createElement("div");
      item.className = "review-item";
      item.innerHTML = `
        <div class="review-header">
          <strong>${name}</strong>
          <div class="review-date">📅 ${date} <span>⏰ ${time}</span></div>
        </div>
        <div class="review-message">${message}</div>
        <div class="review-rating">${"⭐".repeat(rating)}</div>
      `;
      container.appendChild(item);
    });
  });
}
window.addEventListener("load", loadReviews);
