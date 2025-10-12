document.addEventListener("DOMContentLoaded", () => {
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

  // === GLOBAL VARS ===
  const form = document.getElementById("review-form");
  const reviewsContainer = document.getElementById("reviews-container");
  const charCount = document.getElementById("charCount");
  const overallStars = document.getElementById("overall-stars");
  const genderBtns = document.querySelectorAll(".gender-btn");
  const avatarPreview = document.getElementById("avatarPreview");
  const message = document.getElementById("message");

  // În caz că secțiunea nu e încă încărcată
  if (!form) return;

  // === GENDER TOGGLE ===
  let gender = "male";
  genderBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      gender = btn.dataset.gender;
      genderBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      avatarPreview.src = `assets/logos/${gender}.gif`;
    });
  });

  // === SERVICE SELECT ===
  let selectedService = "";
  document.querySelectorAll(".service-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".service-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedService = btn.dataset.service;
    });
  });

 // === STAR RATING (nou) ===
function initStarRating() {
  const stars = document.querySelectorAll("#star-rating svg");
  if (!stars.length) return; // prevenim erori dacă nu există stele încă

  let selectedRating = 0;

  stars.forEach(star => {
    star.addEventListener("mouseenter", () => {
      resetStars();
      const val = parseInt(star.dataset.value);
      stars.forEach(s => {
        if (parseInt(s.dataset.value) <= val) s.classList.add("hovered");
      });
    });

    star.addEventListener("mouseleave", () => {
      resetStars();
      highlightStars(selectedRating);
    });

    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.value);
      resetStars();
      highlightStars(selectedRating);
      document.querySelector("#review-form").dataset.rating = selectedRating; // 🔗 salvăm ratingul ales
    });
  });

  function resetStars() {
    stars.forEach(s => s.classList.remove("hovered", "active"));
  }

  function highlightStars(rating) {
    stars.forEach(s => {
      if (parseInt(s.dataset.value) <= rating) s.classList.add("active");
    });
  }
}
  
  // === CHAR COUNTER ===
  message.addEventListener("input", () => {
    charCount.textContent = message.value.length;
  });

  // === FORM SUBMIT ===
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const msg = message.value.trim();

    if (!name || !selectedService || !selectedRating || !msg) {
      alert("⚠️ Please complete all fields before submitting!");
      return;
    }
if (!selectedRating) {
  alert("Please select a rating!");
  return;
}
review.rating = selectedRating;
    const review = {
      name,
      gender,
      service: selectedService,
      rating: selectedRating,
      message: msg,
      date: new Date().toLocaleString()
    };

    db.ref("reviews").push(review);
    form.reset();
    selectedService = "";
    selectedRating = 0;
    charCount.textContent = 0;
    stars.forEach(s => (s.style.opacity = "0.4"));
    document.querySelectorAll(".service-btn").forEach(b => b.classList.remove("active"));
    alert("✅ Review sent!");
  });

  // === LOAD REVIEWS ===
  function loadReviews() {
    db.ref("reviews").on("value", snapshot => {
      reviewsContainer.innerHTML = "";
      if (!snapshot.exists()) return;

      const reviews = [];
      snapshot.forEach(c => reviews.push({ id: c.key, ...c.val() }));

      let avg = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
      overallStars.textContent = `⭐ ${avg.toFixed(1)}`;

      reviews.reverse().slice(0, 10).forEach(r => {
        const div = document.createElement("div");
        div.className = "review-item";
        div.innerHTML = `
          <strong>${r.name}</strong> ${r.service ? `(${r.service})` : ""}
          <div>${"⭐".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
          <p>${r.message}</p>
          <small>${r.date}</small>
        `;
        reviewsContainer.appendChild(div);
      });
    });
  }

  loadReviews();
});
