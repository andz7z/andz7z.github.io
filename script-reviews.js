// === FIREBASE CONFIG ===
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
const form = document.getElementById("review-form");
const container = document.getElementById("reviews-container");
const noReviews = document.getElementById("no-reviews");
const charCount = document.getElementById("char-count");
const stars = document.querySelectorAll("#rating-stars span");
const serviceButtons = document.querySelectorAll("#service-pick button");

let selectedRating = 0;
let selectedService = null;
let reviews = [];
let currentPage = 1;
const perPage = 10;

// === STAR SELECTION ===
stars.forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.value);
    stars.forEach(s => s.classList.toggle("active", Number(s.dataset.value) <= selectedRating));
  });
});

// === SERVICE PICK ===
serviceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedService = btn.dataset.value;
    serviceButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// === CHARACTER COUNT ===
const messageInput = document.getElementById("message");
messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length} / 100`;
});

// === SUBMIT REVIEW ===
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const gender = form.gender.value;
  const message = form.message.value.trim();
  if (!name || !gender || !message || !selectedRating || !selectedService) {
    return alert("⚠️ Please fill all fields!");
  }

  const review = {
    name,
    gender,
    message,
    rating: selectedRating,
    service: selectedService,
    date: new Date().toLocaleString()
  };

  db.ref("reviews").push(review);
  alert("✅ Review submitted!");
  form.reset();
  selectedRating = 0;
  selectedService = null;
  stars.forEach(s => s.classList.remove("active"));
  serviceButtons.forEach(b => b.classList.remove("active"));
  charCount.textContent = "0 / 100";
});

// === DISPLAY REVIEWS ===
function loadReviews() {
  db.ref("reviews").on("value", snapshot => {
    reviews = [];
    const ratings = { web: [], prog: [], edit: [] };

    snapshot.forEach(child => {
      const r = child.val();
      r.rating = Number(r.rating);
      reviews.push(r);
      ratings[r.service]?.push(r.rating);
    });
    reviews.reverse();

    updateAvgs(ratings);
    renderPage(currentPage);
  });
}

function updateAvgs(ratings) {
  const all = [...ratings.web, ...ratings.prog, ...ratings.edit];
  const avg = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : 0;

  const overall = avg(all);
  const web = avg(ratings.web);
  const prog = avg(ratings.prog);
  const edit = avg(ratings.edit);

  document.getElementById("avg-value").textContent = overall.toFixed(2);
  document.getElementById("avg-web").textContent = `🌐 ${web.toFixed(2)}`;
  document.getElementById("avg-prog").textContent = `💻 ${prog.toFixed(2)}`;
  document.getElementById("avg-edit").textContent = `🎬 ${edit.toFixed(2)}`;

  // donut fill update
  const donut = document.getElementById("avg-donut");
  const percent = (overall / 5) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percent / 100) * circumference;
  donut.style.strokeDasharray = `${circumference}`;
  donut.style.strokeDashoffset = `${offset}`;
}

// === PAGINATION ===
const prev = document.getElementById("prev-page");
const next = document.getElementById("next-page");
const info = document.getElementById("page-info");

prev.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
};
next.onclick = () => {
  if (currentPage * perPage < reviews.length) {
    currentPage++;
    renderPage(currentPage);
  }
};

function renderPage(page) {
  container.innerHTML = "";
  const start = (page - 1) * perPage;
  const visible = reviews.slice(start, start + perPage);

  if (!visible.length) {
    noReviews.style.display = "block";
    document.querySelector(".pagination").classList.add("hidden");
    return;
  }

  noReviews.style.display = "none";
  document.querySelector(".pagination").classList.remove("hidden");
  info.textContent = `Page ${page}`;

  visible.forEach(r => {
    const img = `assets/logos/reviews/${r.gender}.gif`;
    const icon = r.service === "web" ? "🌐" : r.service === "prog" ? "💻" : "🎬";

    const card = document.createElement("div");
    card.className = "review-card glassy";
    card.innerHTML = `
      <div class="review-header">
        <img src="${img}" alt="${r.gender}">
        <div class="review-meta">
          <h4>${r.name}</h4>
          <p>${icon} ${r.service}</p>
        </div>
        <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      </div>
      <p class="review-text">${r.message}</p>
      <small>${r.date}</small>
    `;
    card.addEventListener("click", () => card.classList.toggle("zoomed"));
    container.appendChild(card);
  });
}

window.addEventListener("load", loadReviews);
