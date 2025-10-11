// ===============================
// Firebase Configuration
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔧 înlocuiește cu datele tale din Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBGKXuWCXFn1JzKP6nNyKNhbBVO6rVfPzk",
  authDomain: "andz-portfolio.firebaseapp.com",
  projectId: "andz-portfolio",
  storageBucket: "andz-portfolio.firebasestorage.app",
  messagingSenderId: "808482872175",
  appId: "1:808482872175:web:c526c7c2c69b40def4269a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===============================
// Event: când DOM-ul e gata
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("review-form");
  const reviewsContainer = document.getElementById("reviews-container");

  // 🔹 Adăugare review
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();
    const rating = document.getElementById("rating").value;

    if (!name || !message) return;

    await addDoc(collection(db, "reviews"), {
      name,
      message,
      rating,
      date: new Date()
    });

    reviewForm.reset();
    loadReviews();
  });

  // 🔹 Afișare review-uri
  async function loadReviews() {
    reviewsContainer.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "reviews"));
    querySnapshot.forEach((doc) => {
      const r = doc.data();
      const div = document.createElement("div");
      div.classList.add("review");
      div.innerHTML = `
        <p><strong>${r.name}</strong> (${r.rating}⭐)</p>
        <p>${r.message}</p>
      `;
      reviewsContainer.appendChild(div);
    });
  }

  // nu încărcăm automat — doar când se apasă pe Reviews
  window.loadReviews = loadReviews;
});
