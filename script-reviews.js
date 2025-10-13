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
let allReviews = [];
let filteredReviews = [];
let sortType = "recent";
let serviceFilter = "all";

function loadReviews() {
  db.ref("reviews").on("value", snapshot => {
    allReviews = [];
    const ratings = { web: [], prog: [], edit: [] };
    const counts = {};

    snapshot.forEach(child => {
      const r = child.val();
      r.id = child.key;
      r.rating = Number(r.rating);
      allReviews.push(r);
      ratings[r.service]?.push(r.rating);
      counts[r.name] = (counts[r.name] || 0) + 1;
    });

    // Adăugăm badge-uri în funcție de număr de recenzii
    allReviews = allReviews.map(r => ({
      ...r,
      badge:
        counts[r.name] >= 5
          ? "🏆 Top Reviewer"
          : counts[r.name] >= 3
          ? "💡 Contributor"
          : null,
      totalReviews: counts[r.name],
    }));

    applyFilters();
    updateAvgs(ratings);
  });
}

// === FILTRARE ===
function applyFilters() {
  filteredReviews = [...allReviews];

  // filtrare pe serviciu
  if (serviceFilter !== "all") {
    filteredReviews = filteredReviews.filter(r => r.service === serviceFilter);
  }

  // sortare
  if (sortType === "recent") {
    filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortType === "oldest") {
    filteredReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortType === "highest") {
    filteredReviews.sort((a, b) => b.rating - a.rating);
  } else if (sortType === "lowest") {
    filteredReviews.sort((a, b) => a.rating - b.rating);
  }

  renderPage(1, true);
}

// === SORT & FILTER EVENTS ===
document.getElementById("sort-select").addEventListener("change", e => {
  sortType = e.target.value;
  applyFilters();
});

document.getElementById("service-filter").addEventListener("change", e => {
  serviceFilter = e.target.value;
  applyFilters();
});

// === RENDER REVIEWS ===
function renderPage(page = 1, smooth = false) {
  const perPage = 10;
  const start = (page - 1) * perPage;
  const visible = filteredReviews.slice(start, start + perPage);

  const container = document.getElementById("reviews-container");
  const noReviews = document.getElementById("no-reviews");
  const pagination = document.querySelector(".pagination");

  container.innerHTML = "";
  if (!visible.length) {
    noReviews.style.display = "block";
    pagination.classList.add("hidden");
    return;
  }

  noReviews.style.display = "none";
  pagination.classList.remove("hidden");

  visible.forEach(r => {
    const img = `assets/logos/reviews/${r.gender}.gif`;
    const icon =
      r.service === "web" ? "🌐" : r.service === "prog" ? "💻" : "🎬";

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
        <button class="dislike-btn">👎 ${r.dislikes || 0}</button>
        <button class="reply-btn">💬 ${r.replies ? Object.keys(r.replies).length : 0} Replies</button>
      </div>
      <div class="reply-thread hidden"></div>
    `;

    // --- Like/Dislike per IP (localStorage-based) ---
    const userVoteKey = `vote_${r.id}`;
    const likeBtn = card.querySelector(".like-btn");
    const dislikeBtn = card.querySelector(".dislike-btn");

    const prevVote = localStorage.getItem(userVoteKey);
    if (prevVote === "like") likeBtn.classList.add("voted");
    if (prevVote === "dislike") dislikeBtn.classList.add("voted");

    likeBtn.addEventListener("click", () => handleVote(r.id, "like", likeBtn, dislikeBtn));
    dislikeBtn.addEventListener("click", () => handleVote(r.id, "dislike", dislikeBtn, likeBtn));

    // --- Replies ---
    const replyBtn = card.querySelector(".reply-btn");
    const replyThread = card.querySelector(".reply-thread");
    replyBtn.addEventListener("click", () => openReplyDialog(r.id));

    // --- Expand replies when clicked ---
    replyBtn.addEventListener("dblclick", () => toggleReplies(r.id, replyThread));

    container.appendChild(card);
  });

  if (smooth)
    window.scrollTo({ top: container.offsetTop - 80, behavior: "smooth" });
}

// === HANDLE LIKE/DISLIKE ===
function handleVote(reviewId, type, btn, oppositeBtn) {
  const key = `vote_${reviewId}`;
  const prevVote = localStorage.getItem(key);
  const ref = db.ref(`reviews/${reviewId}`);

  if (prevVote === type) return; // same vote ignored

  if (type === "like") {
    ref.child("likes").transaction(v => (v || 0) + 1);
    if (prevVote === "dislike")
      ref.child("dislikes").transaction(v => Math.max(0, (v || 0) - 1));
  } else {
    ref.child("dislikes").transaction(v => (v || 0) + 1);
    if (prevVote === "like")
      ref.child("likes").transaction(v => Math.max(0, (v || 0) - 1));
  }

  localStorage.setItem(key, type);
  btn.classList.add("voted");
  oppositeBtn.classList.remove("voted");
}

// === MINI DIALOG REPLY ===
function openReplyDialog(reviewId) {
  const dialog = document.createElement("div");
  dialog.className = "reply-dialog glassy";
  dialog.innerHTML = `
    <div class="dialog-inner">
      <h4>Leave a Reply 💬</h4>
      <label>Name</label>
      <input type="text" id="rname" placeholder="Your name" required>
      <label>Gender</label>
      <div class="gender-mini">
        <label><input type="radio" name="rgender" value="male"> Male</label>
        <label><input type="radio" name="rgender" value="female"> Female</label>
      </div>
      <textarea id="rtext" maxlength="150" placeholder="Your reply..."></textarea>
      <div class="dialog-actions">
        <button id="sendReply">Send</button>
        <button id="cancelReply">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  dialog.querySelector("#cancelReply").onclick = () => dialog.remove();

  dialog.querySelector("#sendReply").onclick = () => {
    const name = dialog.querySelector("#rname").value.trim();
    const gender = dialog.querySelector('input[name="rgender"]:checked')?.value;
    const text = dialog.querySelector("#rtext").value.trim();

    if (!name || !gender || !text)
      return alert("Please fill all fields!");

    db.ref(`reviews/${reviewId}/replies`).push({
      name,
      gender,
      text,
      date: new Date().toLocaleString(),
    });
    dialog.remove();
  };
}

// === EXPAND REPLIES ON DOUBLE CLICK ===
function toggleReplies(reviewId, container) {
  if (!container.classList.contains("loaded")) {
    db.ref(`reviews/${reviewId}/replies`).once("value", snap => {
      container.innerHTML = "";
      snap.forEach(child => {
        const rep = child.val();
        const img = `assets/logos/reviews/${rep.gender}.gif`;
        const div = document.createElement("div");
        div.className = "reply-item";
        div.innerHTML = `
          <img src="${img}" alt="${rep.gender}">
          <div>
            <strong>${rep.name}</strong><small> ${rep.date}</small>
            <p>${rep.text}</p>
          </div>
        `;
        container.appendChild(div);
      });
      container.classList.add("loaded");
    });
  }
  container.classList.toggle("hidden");
}

window.addEventListener("load", loadReviews);
