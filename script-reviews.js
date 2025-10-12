// === FIREBASE SETUP ===
const firebaseConfig = {
    apiKey: "AIzaSyCGn9V5dUPM3m_LxzQuiwDWB5vUc24bF6c",
    authDomain: "andz-reviews-67306.firebaseapp.com",
    projectId: "andz-reviews-67306",
    storageBucket: "andz-reviews-67306.firebasestorage.app",
    messagingSenderId: "314000134063",
    appId: "1:314000134063:web:850f55c638f8ef34e7695a"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// === FORM HANDLING ===
const form = document.getElementById("review-form");
const container = document.getElementById("reviews-container");
const noReviews = document.getElementById("no-reviews");

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const rating = form.rating.value.trim();
  const message = form.message.value.trim();

  if (!name || !rating || !message) return alert("Please fill all fields!");

  const reviewRef = db.ref("reviews").push();
  reviewRef.set({
    name,
    rating,
    message,
    date: new Date().toLocaleString()
  });

  form.reset();
  alert("✅ Review sent!");
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

    snapshot.forEach(child => {
      const { name, rating, message, date } = child.val();
      const div = document.createElement("div");
      div.className = "review-item";
      div.innerHTML = `
        <strong>${name}</strong> <span>⭐${rating}</span>
        <p>${message}</p>
        <small>${date}</small>
      `;
      container.appendChild(div);
    });
  });
}

window.addEventListener("load", loadReviews);
