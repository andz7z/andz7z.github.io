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
const form = document.getElementById("review-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value;
  const message = form.message.value;
  await addDoc(collection(db, "reviews"), {
    name,
    message,
    createdAt: new Date()
  });
  form.reset();
  alert("Review trimis!");
});

// afișează review-urile
const reviewsContainer = document.getElementById("reviews-container");
const querySnapshot = await getDocs(collection(db, "reviews"));
querySnapshot.forEach((doc) => {
  const data = doc.data();
  const div = document.createElement("div");
  div.textContent = `${data.name}: ${data.message}`;
  reviewsContainer.appendChild(div);
});
