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
const container = document.getElementById("reviews-container");
const noReviews = document.getElementById("no-reviews");

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const rating = Number(form.rating.value.trim());
  const message = form.message.value.trim();

  if (!name || !message || rating < 1) {
    alert("Please provide your name, a message, and a rating between 1 and 5 stars!");
    return;
  }
  
  const service = form.querySelector("input[name='service']:checked")?.value || "webdev";
  const avatarChoice = form.querySelector("input[name='avatar_choice']:checked")?.value || "male";
  const avatarPath = avatarChoice === "female" 
    ? "assets/logos/reviews/female.gif" 
    : "assets/logos/reviews/male.gif";

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
  alert("✅ Review sent!");
});


// === DISPLAY REVIEWS ===
function loadReviews() {
  const reviewsList = document.getElementById("reviews-list");
  const noReviews = document.getElementById("no-reviews");
  const siteAvgEl = document.getElementById("site-avg");
  const siteCountEl = document.getElementById("site-count");
  const siteStarsEl = document.getElementById("site-stars");
  const paginationWrap = document.getElementById("pagination-wrap");

  const PER_PAGE = 10;
  let currentPage = 1;
  let reviewsArray = [];

  // safe text
  const escapeHtml = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const renderMiniStars = (rate) => {
    let out = "";
    for (let i = 1; i <= 5; i++) {
      out += i <= Math.round(rate)
        ? '<span class="mini">★</span>'
        : '<span class="mini">☆</span>';
    }
    return out;
  };

  function renderReviewsArray() {
    const total = reviewsArray.length;
    if (total === 0) {
      noReviews.style.display = "block";
      reviewsList.innerHTML = "";
      siteAvgEl.textContent = "—";
      siteCountEl.textContent = "0 reviews";
      siteStarsEl.innerHTML = "";
      paginationWrap.innerHTML = "";
      return;
    }

    noReviews.style.display = "none";

    let sum = 0;
    for (const r of reviewsArray) sum += Number(r.rating || 0);
    const avg = (sum / total) || 0;
    siteAvgEl.textContent = avg.toFixed(1);
    siteCountEl.textContent = `${total} review${total > 1 ? "s" : ""}`;
    siteStarsEl.innerHTML = renderMiniStars(avg);
    // === separate averages by service ===
let webSum = 0, webCount = 0;
let editSum = 0, editCount = 0;
let progSum = 0, progCount = 0;

for (const r of reviewsArray) {
  const val = Number(r.rating || 0);
  if (r.service === "webdev") { webSum += val; webCount++; }
  else if (r.service === "editing") { editSum += val; editCount++; }
  else if (r.service === "programming") { progSum += val; progCount++; }
}

document.getElementById("avg-web").textContent = webCount ? (webSum / webCount).toFixed(1) : "—";
document.getElementById("avg-edit").textContent = editCount ? (editSum / editCount).toFixed(1) : "—";
document.getElementById("avg-prog").textContent = progCount ? (progSum / progCount).toFixed(1) : "—";

    const pages = Math.ceil(total / PER_PAGE);
    if (currentPage > pages) currentPage = pages;
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pageSlice = reviewsArray.slice(start, end);

    reviewsList.innerHTML = "";

    pageSlice.forEach(r => {
      const avatar = r.avatar || "assets/logos/reviews/male.gif";
      const serviceEmoji =
        r.service === "webdev"
          ? "🌐 Web Dev"
          : r.service === "editing"
          ? "🎬 Editing"
          : r.service === "programming"
          ? "💻 Programming"
          : "";

      const div = document.createElement("div");
      div.className = "review-card";
      div.innerHTML = `
        <img class="review-avatar" src="${avatar}" alt="avatar">
        <div class="review-body">
          <div class="review-head">
            <div>
              <div class="review-name">${escapeHtml(r.name)}</div>
              <div class="review-meta">
                <span class="review-stars">${renderMiniStars(Number(r.rating))}</span>
                <span style="margin-left:8px">${serviceEmoji}</span>
              </div>
            </div>
            <div class="review-rating-big">⭐ ${Number(r.rating)}</div>
          </div>
          <div class="review-text">${escapeHtml(r.message)}</div>
          <div class="review-footer">🕓 ${escapeHtml(r.date)}</div>
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
        renderReviewsArray();
      });
      paginationWrap.appendChild(btn);
    }
  }

  db.ref("reviews").on("value", snapshot => {
    reviewsArray = [];
    if (!snapshot.exists()) {
      renderReviewsArray();
      return;
    }
    snapshot.forEach(child => {
      const val = child.val();
      reviewsArray.unshift({
        name: val.name || "Anonymous",
        rating: val.rating || 0,
        message: val.message || "",
        service: val.service || "",
        avatar: val.avatar || "",
        date: val.date || ""
      });
    });
    renderReviewsArray();
  });
}

window.addEventListener("load", loadReviews);

// === STAR RATING SYSTEM ===
const starContainer = document.querySelector(".star-rating");
const starElems = starContainer.querySelectorAll(".star");
const ratingInput = document.getElementById("rating-value");

starElems.forEach(star => {
  star.addEventListener("mouseover", () => {
    const value = Number(star.dataset.value);
    starElems.forEach(s => {
      s.classList.toggle("active", Number(s.dataset.value) <= value);
    });
  });

  star.addEventListener("click", () => {
    const value = Number(star.dataset.value);
    ratingInput.value = value;
    starContainer.dataset.selected = value;
  });
});

starContainer.addEventListener("mouseleave", () => {
  const selected = Number(starContainer.dataset.selected);
  starElems.forEach(s => {
    s.classList.toggle("active", Number(s.dataset.value) <= selected);
  });
});

// === BLOCK ZERO STARS ON SUBMIT ===
form.addEventListener("submit", e => {
  e.preventDefault();
  const rating = Number(ratingInput.value);
  const name = form.name.value.trim();
  const message = form.message.value.trim();

  if (!name || !message || rating < 1) {
    alert("Please choose between 1 and 5 stars and fill in all fields!");
    return;
  }

  // ... restul codului de salvare review
});

// === UI ENHANCEMENTS ===
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("rating");
  const messageInput = document.getElementById("message");
  const charsLeft = document.getElementById("chars-left");

  stars.forEach((star, index) => {
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("selected", i <= index);
      });
    });
    star.addEventListener("mouseleave", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("selected", i < ratingInput.value);
      });
    });
    star.addEventListener("click", () => {
      ratingInput.value = index + 1;
      stars.forEach((s, i) => {
        s.classList.toggle("selected", i < ratingInput.value);
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
