// ===== reviews.js =====
// Așteaptă ca _firebase (db, auth) să existe pe window (inițializat în index.html)
(function () {
  const firebaseExports = window._firebase;
  if (!firebaseExports) {
    console.error("Firebase nu este inițializat. Asigură-te că ai pus firebaseConfig în index.html.");
    return;
  }

  const db = firebaseExports.db;
  const auth = firebaseExports.auth;

  // Optional: anonymous auth pentru a avea user.uid
  auth.onAuthStateChanged(user => {
    if (!user) {
      auth.signInAnonymously().catch(err => console.warn("Anon sign-in error:", err));
    }
  });

  // DOM elements
  const reviewForm = document.getElementById("reviewForm");
  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("message");
  const starButtons = document.querySelectorAll("#starInput .star");
  const reviewsList = document.getElementById("reviewsList");
  const statusSpan = document.getElementById("reviewStatus");

  let currentRating = 5; // default
  const RATE_LIMIT_MS = 4000; // client-side simple throttle

  // star UI
  function updateStarUI(r) {
    starButtons.forEach(btn => {
      const v = parseInt(btn.dataset.value, 10);
      btn.classList.toggle("selected", v <= r);
      btn.setAttribute("aria-checked", v === r ? "true" : "false");
    });
  }
  updateStarUI(currentRating);

  starButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentRating = parseInt(btn.dataset.value, 10);
      updateStarUI(currentRating);
    });
  });

  // simple client-side anti-spam (very basic)
  let lastSubmission = 0;

  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmission < RATE_LIMIT_MS) {
      statusSpan.textContent = "Te rog așteaptă puțin înainte de a mai trimite.";
      return;
    }

    const name = nameInput.value.trim() || "Anonim";
    const message = messageInput.value.trim();
    const rating = currentRating;

    if (message.length < 5) {
      statusSpan.textContent = "Mesajul e prea scurt.";
      return;
    }

    // disable form while saving
    statusSpan.textContent = "Se trimite...";
    const submitBtn = document.getElementById("submitReview");
    submitBtn.disabled = true;

    try {
      // optional: dacă vrei uid: const uid = auth.currentUser?.uid || null;
      await db.collection("reviews").add({
        name,
        message,
        rating,
        createdAt: firebaseExports.firebase.firestore.FieldValue.serverTimestamp(),
        // uid: uid
      });

      lastSubmission = Date.now();
      statusSpan.textContent = "Mulțumim! Review trimis.";
      reviewForm.reset();
      currentRating = 5;
      updateStarUI(currentRating);
      setTimeout(() => statusSpan.textContent = "", 3000);
    } catch (err) {
      console.error("Eroare salvare review:", err);
      statusSpan.textContent = "Eroare la trimitere, încearcă iar.";
    } finally {
      submitBtn.disabled = false;
    }
  });

  // function to render a single review
  function createReviewCard(doc) {
    const data = doc.data ? doc.data() : doc; // suport în caz că apelăm manual
    const el = document.createElement("div");
    el.className = "review-card";
    const initials = (data.name || "A").toString().trim().charAt(0).toUpperCase();

    const timeText = data.createdAt && data.createdAt.toDate
      ? timeAgo(data.createdAt.toDate())
      : "recent";

    el.innerHTML = `
      <div class="review-avatar">${initials}</div>
      <div class="review-content">
        <div class="review-meta">
          <div>
            <div class="review-name">${escapeHtml(data.name||"Anonim")}</div>
            <div class="review-time">${timeText}</div>
          </div>
          <div class="review-rating" aria-hidden="true">${renderStars(data.rating)}</div>
        </div>
        <div class="review-message">${escapeHtml(data.message)}</div>
      </div>
    `;
    return el;
  }

  // helper to render stars
  function renderStars(n) {
    n = Math.max(0, Math.min(5, Number(n) || 0));
    let s = "";
    for (let i=0;i<5;i++){
      s += i < n ? "★" : "☆";
    }
    return `<span aria-hidden="true">${s}</span>`;
  }

  // escape HTML
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'", "&#039;");
  }

  // humanized time-ago (simplu)
  function timeAgo(d) {
    const s = Math.floor((Date.now() - d.getTime())/1000);
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s/60)}m`;
    if (s < 86400) return `${Math.floor(s/3600)}h`;
    return `${Math.floor(s/86400)}d`;
  }

  // realtime listener
  reviewsList.innerHTML = `<div class="loader">Încărcare review-uri...</div>`;
  db.collection("reviews")
    .orderBy("createdAt", "desc")
    .limit(50)
    .onSnapshot(snapshot => {
      reviewsList.innerHTML = "";
      if (snapshot.empty) {
        reviewsList.innerHTML = `<div class="muted">Nu există review-uri încă. Fii primul!</div>`;
        return;
      }
      snapshot.forEach(doc => {
        const card = createReviewCard(doc);
        reviewsList.appendChild(card);
      });
    }, err => {
      console.error("Eroare la citire reviews:", err);
      reviewsList.innerHTML = `<div class="muted">Nu am putut încărca review-urile.</div>`;
    });

})();
