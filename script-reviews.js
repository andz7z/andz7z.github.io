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
// Updated script-reviews.js
// requires existing firebase initialization (unchanged)

// elements
const form = document.getElementById("review-form");
const container = document.getElementById("reviews-container");
const noReviews = document.getElementById("no-reviews");
const charCount = document.getElementById("char-count");
const stars = document.querySelectorAll("#rating-stars span");
const serviceButtons = document.querySelectorAll("#service-pick button");
const bg = document.querySelector(".reviews-bg");
const paginationEl = document.querySelector(".pagination");
const footer = document.querySelector("footer");

// local state
let selectedRating = 0;
let selectedService = null;
let reviews = [];
let currentPage = 1;
const perPage = 10;

// ---------- small client identity (for 1 vote per client) ----------
let clientId = localStorage.getItem("andz_clientId");
if (!clientId) {
  clientId = 'c_' + Math.random().toString(36).slice(2, 10);
  localStorage.setItem("andz_clientId", clientId);
}
// Note: Using clientId prevents double-votes per browser. IP-based enforcement requires server-side logging (see notes).

// === stars
stars.forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = Number(star.dataset.value);
    stars.forEach(s => s.classList.toggle("active", Number(s.dataset.value) <= selectedRating));
  });
});

// === service buttons
serviceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedService = btn.dataset.value;
    serviceButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// char count
const messageInput = document.getElementById("message");
messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length} / 100`;
});

// confetti
function launchConfetti() {
  const confetti = document.createElement("div");
  confetti.className = "confetti";
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1500);
}

// submit review
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
    date: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    votes: {}, // store votes per clientId -> 1 or -1
    replies: {}
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

// --- update averages (same logic) ---
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

  const donut = document.getElementById("avg-donut");
  const percent = (overall / 5) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percent / 100) * circumference;
  donut.style.strokeDasharray = `${circumference}`;
  donut.style.strokeDashoffset = `${offset}`;

  let color = "#ffd95a";
  if (overall < 2.5) color = "#ff6961";
  else if (overall < 4) color = "#6fc3ff";
  bg.style.background = `
    radial-gradient(circle at top left, ${color}20, transparent 70%),
    radial-gradient(circle at bottom right, ${color}25, transparent 70%)
  `;
}

// ------------ filters (new) -------------
/* Inserted filter controls in HTML (see HTML snippet below).
   The selects have IDs: sort-filter and service-filter
*/
const sortFilter = document.getElementById("sort-filter");
const serviceFilter = document.getElementById("service-filter");

let activeSort = sortFilter ? sortFilter.value : "recent";
let activeService = serviceFilter ? serviceFilter.value : "all";

if (sortFilter) {
  sortFilter.addEventListener("change", () => {
    activeSort = sortFilter.value;
    currentPage = 1;
    renderPage(currentPage, false);
  });
}
if (serviceFilter) {
  serviceFilter.addEventListener("change", () => {
    activeService = serviceFilter.value;
    currentPage = 1;
    renderPage(currentPage, false);
  });
}

// --- load reviews and build in-memory array
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

    // badges / counts
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

    // newest first
    reviews.sort((a,b) => new Date(b.date) - new Date(a.date));
    updateAvgs(ratings);
    renderPage(currentPage, true);
  });
}

// --- pagination handlers
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
  // we compute filtered length when rendering
  currentPage++;
  renderPage(currentPage, false);
};

// --- helper: apply filters + sorting, return array
function getFilteredSortedReviews() {
  let arr = [...reviews];

  if (activeService && activeService !== "all") {
    arr = arr.filter(r => r.service === activeService);
  }

  // sort:
  if (activeSort === "recent") {
    arr.sort((a,b) => new Date(b.date) - new Date(a.date));
  } else if (activeSort === "oldest") {
    arr.sort((a,b) => new Date(a.date) - new Date(b.date));
  } else if (activeSort === "highest") {
    arr.sort((a,b) => b.rating - a.rating || new Date(b.date) - new Date(a.date));
  } else if (activeSort === "lowest") {
    arr.sort((a,b) => a.rating - b.rating || new Date(b.date) - new Date(a.date));
  }

  return arr;
}

// --------- render with new layout and features ----------
function renderPage(page, animate) {
  const list = document.querySelector(".reviews-container");
  list.style.opacity = 0;

  setTimeout(() => {
    container.innerHTML = "";

    const filtered = getFilteredSortedReviews();
    const totalFiltered = filtered.length;
    const maxPage = Math.max(1, Math.ceil(totalFiltered / perPage));
    if (page > maxPage) page = maxPage, currentPage = page;

    const start = (page - 1) * perPage;
    const visible = filtered.slice(start, start + perPage);

    // show/hide no reviews
    if (!visible.length) {
      noReviews.style.display = "block";
      paginationEl.classList.add("hidden");
    } else {
      noReviews.style.display = "none";
      paginationEl.classList.remove("hidden");
    }

    info.textContent = `Page ${page} / ${maxPage}`;

    visible.forEach(r => {
      const img = `assets/logos/reviews/${r.gender}.gif`;
      const icon = r.service === "web" ? "🌐" : r.service === "prog" ? "💻" : "🎬";

      // build card (note: date moved next to actions)
      const card = document.createElement("div");
      card.className = "review-card glassy review-fade";
      card.innerHTML = `
        <div class="review-header">
          <img src="${img}" alt="${r.gender}">
          <div class="review-meta">
            <div class="meta-top">
              <h4 class="meta-name">${r.name} <span class="service-emoji">${icon}</span></h4>
              ${r.badge ? `<span class="badge">${r.badge}</span>` : ''}
            </div>
            <div class="meta-bottom"><small class="meta-count">${r.totalReviews} reviews</small></div>
          </div>
          <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        </div>

        <p class="review-text">${escapeHtml(r.message)}</p>

        <div class="review-actions-row">
          <div class="action-left">
            <button class="like-btn">👍 <span class="like-count">${r.likes || 0}</span></button>
            <button class="dislike-btn">👎 <span class="dislike-count">${r.dislikes || 0}</span></button>
            <button class="reply-btn">💬 <span class="reply-count">0</span></button>
          </div>
          <div class="action-right">
            <small class="review-date">${new Date(r.date).toLocaleString()}</small>
          </div>
        </div>

        <div class="reply-list"></div>
      `;

      // like / dislike logic: uses votes map stored in DB under reviews/<id>/votes/<clientId> = 1|-1
      const likeBtn = card.querySelector(".like-btn");
      const dislikeBtn = card.querySelector(".dislike-btn");
      const likeCountSpan = card.querySelector(".like-count");
      const dislikeCountSpan = card.querySelector(".dislike-count");

      // helper to refresh vote buttons state (disable if already voted)
      function refreshVoteState(votesSnapshot) {
        const v = votesSnapshot ? votesSnapshot[r.id] : null;
        // we keep a local reflection via clientId in localStorage to quickly disable
        const localVote = localStorage.getItem(`vote_${r.id}_${clientId}`);
        likeBtn.disabled = false;
        dislikeBtn.disabled = false;
        if (localVote === "1") likeBtn.disabled = true;
        else if (localVote === "-1") dislikeBtn.disabled = true;
      }

      // read current votes counts once
      db.ref(`reviews/${r.id}`).once("value").then(snap => {
        const data = snap.val() || {};
        likeCountSpan.textContent = data.likes || 0;
        dislikeCountSpan.textContent = data.dislikes || 0;

        // reflect local vote
        const lv = localStorage.getItem(`vote_${r.id}_${clientId}`);
        if (lv === "1") likeBtn.disabled = true;
        if (lv === "-1") dislikeBtn.disabled = true;
      });

      likeBtn.addEventListener("click", () => {
        // attempt to set vote in transaction ensuring single vote per clientId
        const voteRef = db.ref(`reviews/${r.id}/votes/${clientId}`);
        voteRef.transaction(curr => {
          if (curr && curr.vote) return curr; // already voted — don't change
          return { vote: 1, at: new Date().toISOString() };
        }, (err, committed, snap) => {
          if (err) return console.error(err);
          if (!committed) {
            alert("You already voted on this review.");
            return;
          }
          // increment likes count
          db.ref(`reviews/${r.id}/likes`).transaction(l => (l || 0) + 1);
          localStorage.setItem(`vote_${r.id}_${clientId}`, "1");
          likeBtn.disabled = true;
        });
      });

      dislikeBtn.addEventListener("click", () => {
        const voteRef = db.ref(`reviews/${r.id}/votes/${clientId}`);
        voteRef.transaction(curr => {
          if (curr && curr.vote) return curr;
          return { vote: -1, at: new Date().toISOString() };
        }, (err, committed, snap) => {
          if (err) return console.error(err);
          if (!committed) {
            alert("You already voted on this review.");
            return;
          }
          db.ref(`reviews/${r.id}/dislikes`).transaction(d => (d || 0) + 1);
          localStorage.setItem(`vote_${r.id}_${clientId}`, "-1");
          dislikeBtn.disabled = true;
        });
      });

      // replies: show total count, listen for replies changes
      const replyCountSpan = card.querySelector(".reply-count");
      const replyListEl = card.querySelector(".reply-list");
      function computeRepliesAndRender(snap) {
        replyListEl.innerHTML = "";
        const repliesObj = snap.val() || {};
        // convert to array
        const arr = Object.keys(repliesObj).map(k => ({ id: k, ...repliesObj[k] }));
        // store count
        replyCountSpan.textContent = arr.length;
        // render nested tree
        const tree = buildReplyTree(arr);
        replyListEl.appendChild(renderReplyTree(tree, r.id));
      }
      db.ref(`reviews/${r.id}/replies`).on("value", computeRepliesAndRender);

      // reply button opens dialog with all replies and a leave-reply form
      const replyBtn = card.querySelector(".reply-btn");
      replyBtn.addEventListener("click", () => openReplyDialog(r.id));

      container.appendChild(card);
    });

    // move pagination to footer and ensure it's visible
    if (footer && paginationEl) {
      footer.appendChild(paginationEl);
      paginationEl.classList.remove("hidden");
    }

    // scroll to container
    window.scrollTo({ top: container.offsetTop - 100, behavior: "smooth" });
    setTimeout(() => (list.style.opacity = 1), animate ? 300 : 0);
  }, 180);
}

// ===== replies helpers (nested, up to depth 7) =====
function buildReplyTree(flatArr) {
  // flatArr: [{id, parentId, ...}]
  const map = {};
  flatArr.forEach(r => { map[r.id] = { ...r, children: [] }; });
  const roots = [];
  flatArr.forEach(r => {
    if (r.parentId && map[r.parentId]) {
      map[r.parentId].children.push(map[r.id]);
    } else {
      roots.push(map[r.id]);
    }
  });
  return roots;
}

function renderReplyTree(nodes, reviewId, depth=0) {
  const fragment = document.createDocumentFragment();
  nodes.forEach(node => {
    const wrapper = document.createElement("div");
    wrapper.className = "reply-node";
    wrapper.style.marginLeft = `${depth * 14}px`;
    // use same format as main reviews: name + gender gif + service icon if present in node (node stores author/service if provided)
    const img = node.gender ? `assets/logos/reviews/${node.gender}.gif` : '';
    wrapper.innerHTML = `
      <div class="reply-top">
        ${img ? `<img class="reply-author-img" src="${img}" alt="${node.gender}">` : ''}
        <strong class="reply-author">${escapeHtml(node.name || 'Anon')}</strong>
        <span class="reply-date">${new Date(node.date).toLocaleString()}</span>
      </div>
      <div class="reply-body">${escapeHtml(node.text)}</div>
      <div class="reply-actions">
        <button class="reply-reply-btn" data-replyid="${node.id}" data-reviewid="${reviewId}">Reply</button>
      </div>
    `;
    fragment.appendChild(wrapper);
    if (node.children && node.children.length) {
      wrapper.appendChild(renderReplyTree(node.children, reviewId, depth + 1));
    }
  });
  return fragment;
}

// openReplyDialog: full dialog showing all replies + leave a reply form (gender, name, message)
function openReplyDialog(reviewId) {
  // modal backdrop
  const modal = document.createElement("div");
  modal.className = "reply-modal";
  modal.innerHTML = `
    <div class="reply-modal-inner">
      <button class="modal-close">×</button>
      <h3>Replies</h3>
      <div class="reply-thread" id="reply-thread"></div>
      <hr>
      <h4>Leave a reply</h4>
      <form id="leave-reply-form">
        <div class="form-row">
          <label>Name</label>
          <input name="rname" required>
        </div>
        <div class="form-row">
          <label>Gender</label>
          <select name="rgender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-row">
          <label>Message</label>
          <textarea name="rtext" maxlength="200" required></textarea>
        </div>
        <input type="hidden" name="parentId" value="">
        <div class="form-row">
          <button type="submit">Post Reply</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.classList.add("modal-open");

  const closeBtn = modal.querySelector(".modal-close");
  closeBtn.addEventListener("click", () => { modal.remove(); document.body.classList.remove("modal-open"); });

  const thread = modal.querySelector("#reply-thread");
  // load replies once and render tree
  db.ref(`reviews/${reviewId}/replies`).once("value").then(snap => {
    const obj = snap.val() || {};
    const arr = Object.keys(obj).map(k => ({ id: k, ...obj[k] }));
    thread.innerHTML = "";
    const tree = buildReplyTree(arr);
    thread.appendChild(renderReplyTreeWithControls(tree, reviewId));
  });

  // handle dynamic "Reply" button inside modal (delegation)
  thread.addEventListener("click", (ev) => {
    if (ev.target.matches(".reply-reply-btn")) {
      const rid = ev.target.dataset.replyid;
      const formParent = modal.querySelector("form[name]");
      // set parentId hidden field
      modal.querySelector("input[name='parentId']").value = rid;
      // scroll to form for convenience
      modal.querySelector("textarea[name='rtext']").focus();
    }
  });

  // leave-reply submit
  const leaveForm = modal.querySelector("#leave-reply-form");
  leaveForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(leaveForm);
    const name = formData.get("rname").trim();
    const gender = formData.get("rgender");
    const text = formData.get("rtext").trim();
    const parentId = formData.get("parentId") || null;

    if (!name || !gender || !text) return alert("Please fill all fields");

    // depth check: ensure nested depth <= 7
    if (parentId) {
      // fetch parent and compute depth
      db.ref(`reviews/${reviewId}/replies/${parentId}`).once("value").then(psnap => {
        const parent = psnap.val();
        const depth = parent?.depth ? parent.depth : 1;
        if (depth >= 7) {
          alert("Max reply depth (7) reached for this thread.");
          return;
        }
        const newReplyRef = db.ref(`reviews/${reviewId}/replies`).push();
        newReplyRef.set({
          name, gender, text, date: new Date().toISOString(), parentId: parentId, depth: depth + 1
        }).then(() => {
          // refresh thread
          db.ref(`reviews/${reviewId}/replies`).once("value").then(snap => {
            const arr = Object.keys(snap.val()||{}).map(k => ({ id: k, ...snap.val()[k] }));
            thread.innerHTML = "";
            thread.appendChild(renderReplyTreeWithControls(buildReplyTree(arr), reviewId));
            leaveForm.reset();
            modal.querySelector("input[name='parentId']").value = "";
          });
        });
      });
    } else {
      // root reply (depth = 1)
      const newReplyRef = db.ref(`reviews/${reviewId}/replies`).push();
      newReplyRef.set({ name, gender, text, date: new Date().toISOString(), parentId: null, depth: 1 }).then(() => {
        db.ref(`reviews/${reviewId}/replies`).once("value").then(snap => {
          const arr = Object.keys(snap.val()||{}).map(k => ({ id: k, ...snap.val()[k] }));
          thread.innerHTML = "";
          thread.appendChild(renderReplyTreeWithControls(buildReplyTree(arr), reviewId));
          leaveForm.reset();
        });
      });
    }
  });
}

function renderReplyTreeWithControls(nodes, reviewId, depth=0) {
  // similar to renderReplyTree but includes reply buttons that set parentId in the modal flow
  const frag = document.createDocumentFragment();
  nodes.forEach(node => {
    const wrapper = document.createElement("div");
    wrapper.className = "reply-node";
    wrapper.style.marginLeft = `${depth * 14}px`;
    const img = node.gender ? `assets/logos/reviews/${node.gender}.gif` : '';
    wrapper.innerHTML = `
      <div class="reply-top">
        ${img ? `<img class="reply-author-img" src="${img}" alt="${node.gender}">` : ''}
        <strong class="reply-author">${escapeHtml(node.name || 'Anon')}</strong>
        <span class="reply-date">${new Date(node.date).toLocaleString()}</span>
      </div>
      <div class="reply-body">${escapeHtml(node.text)}</div>
      <div class="reply-actions">
        <button class="reply-reply-btn" data-replyid="${node.id}" data-reviewid="${reviewId}">Reply</button>
      </div>
    `;
    frag.appendChild(wrapper);
    if (node.children && node.children.length) {
      wrapper.appendChild(renderReplyTreeWithControls(node.children, reviewId, depth + 1));
    }
  });
  return frag;
}

// escape HTML to prevent XSS in text fields from user input
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// initial load
window.addEventListener("load", loadReviews);

// Ensure pagination appears in footer always (CSS will pin it if needed)
if (footer && paginationEl) {
  footer.appendChild(paginationEl);
  paginationEl.classList.remove("hidden");
                }
