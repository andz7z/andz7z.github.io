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


// === FORM HANDLING ===
const form = document.getElementById("review-form");

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const rating = form.rating.value.trim();
  const message = form.message.value.trim();
  const service = form.querySelector("input[name='service']:checked")?.value || "webdev";
  const avatarChoice = form.querySelector("input[name='avatar_choice']:checked")?.value || "male";
  const avatarPath = avatarChoice === "female"
    ? "assets/logos/reviews/female.gif"
    : "assets/logos/reviews/male.gif";

  if (!name || !rating || !message) return alert("Please fill all fields!");

  const reviewRef = db.ref("reviews").push();
  reviewRef.set({
    name,
    rating,
    message,
    service,
    avatar: avatarPath,
    date: new Date().toLocaleString()
  });

  form.reset();
  document.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));
  alert("✅ Review sent!");
});


// === DISPLAY REVIEWS ===
function loadReviews() {
  const reviewsList = document.getElementById("reviews-list");
  const noReviews = document.getElementById("no-reviews");
  const avgOverall = document.getElementById("site-avg");
  const avgWeb = document.getElementById("avg-web");
  const avgEdit = document.getElementById("avg-editing");
  const avgProg = document.getElementById("avg-programming");
  const paginationWrap = document.getElementById("pagination-wrap");

  const PER_PAGE = 10;
  let currentPage = 1;
  let reviewsArray = [];

  const escapeHtml = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  function avgCalc(arr, type) {
    const filtered = arr.filter(r => r.service === type);
    if (!filtered.length) return "—";
    const sum = filtered.reduce((a, b) => a + Number(b.rating), 0);
    return (sum / filtered.length).toFixed(1);
  }

  function renderReviews() {
    const total = reviewsArray.length;
    if (!total) {
      noReviews.style.display = "block";
      reviewsList.innerHTML = "";
      return;
    }
    noReviews.style.display = "none";

    const pages = Math.ceil(total / PER_PAGE);
    if (currentPage > pages) currentPage = pages;
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const slice = reviewsArray.slice(start, end);

    reviewsList.innerHTML = "";

    slice.forEach((r, i) => {
      const div = document.createElement("div");
      div.className = "review-card";
      div.style.animationDelay = `${i * 0.07}s`;
      div.innerHTML = `
        <img class="review-avatar" src="${r.avatar}" alt="avatar">
        <div class="review-body">
          <div class="review-head">
            <div class="review-name">${escapeHtml(r.name)}</div>
            <div class="review-meta">⭐ ${r.rating} · ${
              r.service === "webdev" ? "🌐 Web Dev" :
              r.service === "editing" ? "🎬 Editing" : "💻 Programming"
            }</div>
          </div>
          <div class="review-text">${escapeHtml(r.message)}</div>
          <div class="review-footer">🕓 ${r.date}</div>
        </div>
      `;
      reviewsList.appendChild(div);
    });

    paginationWrap.innerHTML = "";
    for (let p = 1; p <= pages; p++) {
      const btn = document.createElement("button");
      btn.className = "page-btn" + (p === currentPage ? " active" : "");
      btn.textContent = p;
      btn.addEventListener("click", () => {
        currentPage = p;
        renderReviews();
      });
      paginationWrap.appendChild(btn);
    }

    // averages
    const avg = (
      reviewsArray.reduce((a, b) => a + Number(b.rating), 0) / total
    ).toFixed(1);
    avgOverall.textContent = avg;
    avgWeb.textContent = avgCalc(reviewsArray, "webdev");
    avgEdit.textContent = avgCalc(reviewsArray, "editing");
    avgProg.textContent = avgCalc(reviewsArray, "programming");
  }

  db.ref("reviews").on("value", snap => {
    reviewsArray = [];
    if (!snap.exists()) {
      renderReviews();
      return;
    }
    snap.forEach(child => {
      const v = child.val();
      reviewsArray.unshift(v);
    });
    renderReviews();
  });
}

window.addEventListener("load", loadReviews);


// === STARS INTERACTION (new system) ===
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("rating");
  const messageInput = document.getElementById("message");
  const charsLeft = document.getElementById("chars-left");

  stars.forEach((star, index) => {
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("hovered", i <= index);
      });
    });
    star.addEventListener("mouseleave", () => {
      stars.forEach((s) => s.classList.remove("hovered"));
    });
    star.addEventListener("click", () => {
      ratingInput.value = index + 1;
      stars.forEach((s, i) => {
        s.classList.toggle("selected", i <= index);
      });
    });
  });

  if (messageInput && charsLeft) {
    messageInput.addEventListener("input", () => {
      const left = 100 - messageInput.value.length;
      charsLeft.textContent = left;
    });
  }
});

  messageInput.addEventListener("input", () => {
    charsLeft.textContent = 100 - messageInput.value.length;
  });
});
