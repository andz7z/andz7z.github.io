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

const form = document.getElementById("review-form");
const container = document.getElementById("reviews-container");
const noReviews = document.getElementById("no-reviews");
const avgAll = document.getElementById("avg-all");
const avgWeb = document.getElementById("avg-web");
const avgProg = document.getElementById("avg-prog");
const avgEdit = document.getElementById("avg-edit");
const pagination = document.querySelector(".pagination");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

let reviews = [];
let currentPage = 1;
const perPage = 10;

// === FORM ===
let selectedRating = 0;
document.querySelectorAll("#rating-stars span").forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.dataset.value);
    document.querySelectorAll("#rating-stars span").forEach(s => s.classList.toggle("active", s.dataset.value <= selectedRating));
  });
});

// Character counter
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length} / 100`;
});

// Submit
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const gender = form.gender.value;
  const service = form.service.value;
  const message = form.message.value.trim();

  if (!name || !selectedRating || !service || !message || !gender)
    return alert("⚠️ Please fill all fields and select a rating!");

  const review = {
    name,
    rating: selectedRating,
    service,
    gender,
    message,
    date: new Date().toLocaleString()
  };

  db.ref("reviews").push(review);
  alert("✅ Review submitted!");
  form.reset();
  selectedRating = 0;
  document.querySelectorAll("#rating-stars span").forEach(s => s.classList.remove("active"));
  loadReviews();
});

// === DISPLAY ===
function renderPage(page = 1) {
  container.innerHTML = "";
  const start = (page - 1) * perPage;
  const pageReviews = reviews.slice(start, start + perPage);

  if (pageReviews.length === 0) {
    noReviews.style.display = "block";
    pagination.classList.add("hidden");
    return;
  }

  noReviews.style.display = "none";
  pagination.classList.toggle("hidden", reviews.length <= perPage);
  pageInfo.textContent = `Page ${page}`;
  pageReviews.forEach(r => {
    const imgSrc = `assets/logos/reviews/${r.gender}.gif`;
    const icon = r.service === "web" ? "🌐" : r.service === "prog" ? "💻" : "🎬";
    const div = document.createElement("div");
    div.className = "review-item glass-box";
    div.innerHTML = `
      <div class="review-header">
        <img src="${imgSrc}" alt="${r.gender}">
        <strong>${r.name}</strong>
        <span class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
      </div>
      <div class="review-body">
        <p>${icon} <b>${r.service.toUpperCase()}</b></p>
        <p>${r.message}</p>
        <small>${r.date}</small>
      </div>
    `;
    container.appendChild(div);
  });
}

function loadReviews() {
  db.ref("reviews").on("value", snapshot => {
    reviews = [];
    const ratingsByType = { web: [], prog: [], edit: [] };
    snapshot.forEach(child => {
      const r = child.val();
      reviews.push(r);
      ratingsByType[r.service]?.push(r.rating);
    });
    reviews.reverse(); // latest first

    // Calculate averages
    const allRatings = reviews.map(r => r.rating);
    const avg = arr => arr.length ? (arr.reduce((a, b) => a + b) / arr.length).toFixed(1) : "0.0";
    avgAll.textContent = avg(allRatings);
    avgWeb.textContent = avg(ratingsByType.web);
    avgProg.textContent = avg(ratingsByType.prog);
    avgEdit.textContent = avg(ratingsByType.edit);

    renderPage(currentPage);
  });
}

// Pagination
prevPageBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
};
nextPageBtn.onclick = () => {
  if (currentPage * perPage < reviews.length) {
    currentPage++;
    renderPage(currentPage);
  }
};

window.addEventListener("load", loadReviews);
