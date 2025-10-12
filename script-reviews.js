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
    alert("Please fill in all fields and select a rating + gender!");
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
    const entries = Object.values(data).reverse();

    entries.forEach(({ name, message, gender, rating, date, time }) => {
      const item = document.createElement("div");
      item.className = "review-item";

      const avatarSrc = gender === "female"
        ? "assets/logos/reviews/female.png"
        : "assets/logos/reviews/male.png";

      item.innerHTML = `
        <div class="review-avatar"><img src="${avatarSrc}" alt="${gender}"></div>
        <div class="review-content">
          <div class="review-header">
            <strong>${name}</strong>
            <span class="review-stars">${"★".repeat(rating)}</span>
          </div>
          <div class="review-message">${message}</div>
          <div class="review-date">📅 ${date} · ⏰ ${time}</div>
        </div>
      `;
      container.appendChild(item);
    });
  });
}
window.addEventListener("load", loadReviews);
