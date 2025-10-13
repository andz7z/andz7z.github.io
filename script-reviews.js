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
const bg = document.querySelector(".reviews-bg");

let selectedRating = 0;
let selectedService = null;
let reviews = [];
let currentPage = 1;
const perPage = 10;

// === STAR SELECT ===
stars.forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.value);
    stars.forEach(s => s.classList.toggle("active", Number(s.dataset.value) <= selectedRating));
  });
});

// === SERVICE SELECT ===
serviceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedService = btn.dataset.value;
    serviceButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// === CHAR COUNT ===
const messageInput = document.getElementById("message");
messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length} / 100`;
});

// === CONFETTI EFFECT ===
function launchConfetti() {
  const confetti = document.createElement("div");
  confetti.className = "confetti";
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1500);
}

// === SUBMIT REVIEW ===
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const gender = form.gender.value;
  const message = form.message.value.trim();

  if (!name || !gender || !message || !selectedRating || !selectedService)
    return alert("⚠️ Please fill all fields!");

  const review = {
    name,
    gender,
    message,
    rating: selectedRating,
    service: selectedService,
    date: new Date().toLocaleString(),
    likes: 0,
    replies: []
  };

  db.ref("reviews").push(review);
  form.reset();
  selectedRating = 0;
  selectedService = null;
  stars.forEach(s => s.classList.remove("active"));
  serviceButtons.forEach(b => b.classList.remove("active"));
  charCount.textContent = "0 / 100";
  launchConfetti();
});

// === UPDATE AVERAGES ===
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

  // donut progress
  const donut = document.getElementById("avg-donut");
  const percent = (overall / 5) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percent / 100) * circumference;
  donut.style.strokeDasharray = `${circumference}`;
  donut.style.strokeDashoffset = `${offset}`;

  // dynamic glow mood
  let color = "#ffd95a";
  if (overall < 2.5) color = "#ff6961"; // red
  else if (overall < 4) color = "#6fc3ff"; // blue
  bg.style.background = `
    radial-gradient(circle at top left, ${color}20, transparent 70%),
    radial-gradient(circle at bottom right, ${color}25, transparent 70%)
  `;
}

// === LOAD REVIEWS ===
function loadReviews() {
  db.ref("reviews").on("value", snapshot => {
    reviews = [];
    const ratings = { web: [], prog: [], edit: [] };
    const counts = {};

    snapshot.forEach(child => {
      const r = child.val();
      r.rating = Number(r.rating);
      reviews.push({ id: child.key, ...r });
      ratings[r.service]?.push(r.rating);
      counts[r.name] = (counts[r.name] || 0) + 1;
    });

    reviews = reviews.map(r => ({
      ...r,
      badge:
        counts[r.name] >= 5
          ? "🏆 Top Reviewer"
          : counts[r.name] >= 3
          ? "💡 Contributor"
          : null,
      totalReviews: counts[r.name]
    }));

    reviews.reverse();
    updateAvgs(ratings);
    renderPage(currentPage, true);
  });
}

// === PAGINATION ===
const prev = document.getElementById("prev-page");
const next = document.getElementById("next-page");
const info = document.getElementById("page-info");

prev.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage, false);
  }
};
next.onclick = () => {
  if (currentPage * perPage < reviews.length) {
    currentPage++;
    renderPage(currentPage, false);
  }
};

// === RENDER REVIEWS ===
function renderPage(page, animate) {
  const list = document.querySelector(".reviews-container");
  list.style.opacity = 0;

  setTimeout(() => {
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
      const icon =
        r.service === "web"
          ? "🌐"
          : r.service === "prog"
          ? "💻"
          : "🎬";

      const card = document.createElement("div");
      card.className = "review-card glassy review-fade";
      card.innerHTML = `
        <div class="review-header">
          <img src="${img}" alt="${r.gender}">
          <div class="review-meta">
            <h4>${r.name}</h4>
            <p>${icon} ${r.service}</p>
            ${
              r.badge
                ? `<span class="badge">${r.badge}</span>`
                : ""
            }
            <small>${r.totalReviews} reviews</small>
          </div>
          <div class="review-stars">${"★".repeat(
            r.rating
          )}${"☆".repeat(5 - r.rating)}</div>
        </div>
        <p class="review-text">${r.message}</p>
        <small class="review-date">${r.date}</small>
        <div class="review-actions">
          <button class="like-btn">👍 ${r.likes || 0}</button>
          <button class="reply-btn">💬 Reply</button>
          <div class="reply-list"></div>
        </div>
      `;

      // Like button
      const likeBtn = card.querySelector(".like-btn");
      likeBtn.addEventListener("click", () => {
        db.ref(`reviews/${r.id}/likes`).transaction(l => (l || 0) + 1);
      });

      // Reply button
      const replyBtn = card.querySelector(".reply-btn");
      replyBtn.addEventListener("click", () => {
        const replyList = card.querySelector(".reply-list");
        const input = document.createElement("input");
        input.placeholder = "Write a reply...";
        input.className = "reply-input";
        replyList.appendChild(input);
        input.focus();

        input.addEventListener("keypress", e => {
          if (e.key === "Enter" && input.value.trim()) {
            db.ref(`reviews/${r.id}/replies`).push({
              text: input.value,
              date: new Date().toLocaleString()
            });
            input.remove();
          }
        });
      });

      // Display replies live
      const replyList = card.querySelector(".reply-list");
      db.ref(`reviews/${r.id}/replies`).on("value", snap => {
        replyList.innerHTML = "";
        snap.forEach(rep => {
          const d = rep.val();
          const p = document.createElement("p");
          p.className = "reply-item";
          p.textContent = `↳ ${d.text}`;
          replyList.appendChild(p);
        });
      });

      container.appendChild(card);
    });

    // smooth reveal
    window.scrollTo({ top: container.offsetTop - 100, behavior: "smooth" });
    setTimeout(() => (list.style.opacity = 1), animate ? 300 : 0);
  }, 250);
}

window.addEventListener("load", loadReviews);
