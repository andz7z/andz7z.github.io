import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// trimite review
const form = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("reviewName").value.trim();
  const message = document.getElementById("reviewText").value.trim();

  if (!name || !message) {
    alert("Completează toate câmpurile!");
    return;
  }

  try {
    await addDoc(collection(db, "reviews"), {
      name,
      message,
      createdAt: new Date()
    });

    form.reset();
    alert("✅ Review trimis cu succes!");

    // adaugă instant în listă
    const newReview = document.createElement("div");
    newReview.textContent = `${name}: ${message}`;
    reviewsList.appendChild(newReview);
  } catch (error) {
    console.error("Eroare la trimitere:", error);
    alert("❌ Eroare la trimiterea review-ului.");
  }
});

// afișează review-urile deja existente
const querySnapshot = await getDocs(collection(db, "reviews"));
querySnapshot.forEach((doc) => {
  const data = doc.data();
  const div = document.createElement("div");
  div.textContent = `${data.name}: ${data.message}`;
  reviewsList.appendChild(div);
});
