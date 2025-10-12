// === FIREBASE SETUP ===
const firebaseConfig = {
  apiKey: "AIzaSyCGn9V5dUPM3m_LxzQuiwDWB5vUc24bF6c",
  authDomain: "andz-reviews-67306.firebaseapp.com",
  databaseURL: "https://andz-reviews-67306-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "andz-reviews-67306",
  storageBucket: "andz-reviews-67306.firebasedestorage.app",
  messagingSenderId: "314000134063",
  appId: "1:314000134063:web:850f55c638f8ef34e7695a"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Elements
const form = document.getElementById("review-form");
const container = document.getElementById("reviews-container");
const noReviews = document.getElementById("no-reviews");
const pagination = document.querySelector(".pagination");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

// AVG elements (buttons show + circles)
const avgAllBtn = document.getElementById("avg-all");
const avgWebBtn = document.getElementById("avg-web");
const avgProgBtn = document.getElementById("avg-prog");
const avgEditBtn = document.getElementById("avg-edit");
const avgCircleAll = document.getElementById("avg-circle-all");
const avgCircleWeb = document.getElementById("avg-circle-web");
const avgCircleProg = document.getElementById("avg-circle-prog");
const avgCircleEdit = document.getElementById("avg-circle-edit");

let reviews = [];
let currentPage = 1;
const perPage = 10;

// ----- Rating stars (interactive) -----
let selectedRating = 0;
const starEls = document.querySelectorAll("#rating-stars span");
starEls.forEach(st => {
  st.addEventListener("click", () => {
    selectedRating = Number(st.dataset.value);
    starEls.forEach(s => {
      s.classList.toggle("active", Number(s.dataset.value) <= selectedRating);
    });
  });
});

// ----- Service buttons (select by click) -----
let selectedService = null;
const svcBtns = document.querySelectorAll(".svc-btn");
svcBtns.forEach(b => {
  b.addEventListener("click", () => {
    selectedService = b.dataset.value;
    svcBtns.forEach(x => x.classList.remove("svc-active"));
    b.classList.add("svc-active");
  });
});

// ----- Char counter -----
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length} / 100`;
});

// ----- Form submit -----
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const gender = form.gender.value; // radio
  const message = form.message.value.trim();
  const service = selectedService;
  const rating = selectedRating;

  if (!name || !gender || !message || !service || !rating) {
    return alert("⚠️ Please complete all fields and select rating & service.");
  }

  const review = {
    name,
    gender,
    message,
    service,
    rating: Number(rating),
    date: new Date().toLocaleString()
  };

  db.ref("reviews").push(review)
    .then(() => {
      alert("✅ Review submitted!");
      form.reset();
      selectedRating = 0;
      selectedService = null;
      starEls.forEach(s => s.classList.remove("active"));
      svcBtns.forEach(x => x.classList.remove("svc-active"));
      charCount.textContent = "0 / 100";
      // reload handled by listener below
    })
    .catch(err => {
      console.error(err);
      alert("❌ Error sending review.");
    });
});

// ----- Render single review card -----
function makeReviewCard(r) {
  const imgSrc = `assets/logos/reviews/${r.gender}.gif`;
  const icon = r.service === "web" ? "🌐" : r.service === "prog" ? "💻" : "🎬";
  const wrapper = document.createElement("div");
  wrapper.className = "review-item card-zoom";
  wrapper.innerHTML = `
    <div class="review-top">
      <img src="${imgSrc}" alt="${r.gender}" class="review-avatar">
      <div class="review-meta">
        <strong class="review-name">${r.name}</strong>
        <div class="review-service">${icon} <span class="review-service-tag">${r.service}</span></div>
      </div>
      <div class="review-score">
        <div class="score-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <small class="review-date">${r.date}</small>
      </div>
    </div>
    <div class="review-text">${escapeHtml(r.message)}</div>
  `;

  // click zoom effect
  wrapper.addEventListener("click", () => {
    wrapper.classList.add("zoomed");
    setTimeout(() => wrapper.classList.remove("zoomed"), 550);
  });

  return wrapper;
}

// simple escape to avoid injected markup
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// ----- Pagination render -----
function renderPage(page = 1) {
  container.innerHTML = "";
  const start = (page - 1) * perPage;
  const pageReviews = reviews.slice(start, start + perPage);

  if (!pageReviews.length) {
    noReviews.style.display = "block";
    pagination.classList.add("hidden");
    return;
  }
  noReviews.style.display = "none";
  pagination.classList.toggle("hidden", reviews.length <= perPage);
  pageInfo.textContent = `Page ${page}`;

  pageReviews.forEach(r => {
    container.appendChild(makeReviewCard(r));
  });
}

// ----- Load reviews from Firebase & calculate avgs -----
function loadReviews() {
  db.ref("reviews").on("value", snapshot => {
    reviews = [];
    const perType = { web: [], prog: [], edit: [] };
    snapshot.forEach(child => {
      const r = child.val();
      // ensure rating is number
      r.rating = Number(r.rating);
      reviews.push(r);
      if (r.service && perType[r.service]) perType[r.service].push(Number(r.rating));
    });

    // sort latest first
    reviews.sort((a, b) => {
      try { return new Date(b.date) - new Date(a.date); } catch { return 0; }
    });

    // averages
    const avg = arr => arr && arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const allArr = reviews.map(r => r.rating);
    const overall = avg(allArr);
    const webAvg = avg(perType.web);
    const progAvg = avg(perType.prog);
    const editAvg = avg(perType.edit);

    // set text (1 decimal)
    setAvgDisplay(avgAllBtn, avgCircleAll, overall);
    setAvgDisplay(avgWebBtn, avgCircleWeb, webAvg);
    setAvgDisplay(avgProgBtn, avgCircleProg, progAvg);
    setAvgDisplay(avgEditBtn, avgCircleEdit, editAvg);

    // if current page is out of range, reset
    const maxPage = Math.max(1, Math.ceil(reviews.length / perPage));
    if (currentPage > maxPage) currentPage = maxPage;

    renderPage(currentPage);
  });
}

function setAvgDisplay(btnEl, circleEl, value) {
  const v = Number(value) || 0;
  const text = v ? v.toFixed(1) : "0.0";
  const span = btnEl.querySelector(".avg-val");
  if (span) span.textContent = text;
  if (circleEl) circleEl.querySelector("span").textContent = text;
  // visual size / glow based on value
  circleEl && circleEl.setAttribute("data-score", String(Math.round(v * 10)));
}

// ----- Pagination events -----
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

// ----- AVG button click to focus/zoom related reviews -----
function focusByService(service) {
  // simple visual flash on matching cards
  const cards = Array.from(document.querySelectorAll(".review-item"));
  cards.forEach(c => {
    const tag = c.querySelector(".review-service-tag")?.textContent;
    if (!service || (service === "all") || tag === service) {
      c.classList.add("highlight");
      setTimeout(() => c.classList.remove("highlight"), 900);
    } else {
      // slightly dim unrelated
      c.classList.add("dim");
      setTimeout(() => c.classList.remove("dim"), 900);
    }
  });
}

avgAllBtn.addEventListener("click", () => { focusByService("all"); animateAvgBtn(avgAllBtn); });
avgWebBtn.addEventListener("click", () => { focusByService("web"); animateAvgBtn(avgWebBtn); });
avgProgBtn.addEventListener("click", () => { focusByService("prog"); animateAvgBtn(avgProgBtn); });
avgEditBtn.addEventListener("click", () => { focusByService("edit"); animateAvgBtn(avgEditBtn); });

function animateAvgBtn(el) {
  el.classList.add("pop");
  setTimeout(() => el.classList.remove("pop"), 450);
}

// initial load
window.addEventListener("load", loadReviews);
