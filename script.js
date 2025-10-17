// ==============================================
// STARFIELD ANIMATION + INTERACTIVITY
// ==============================================

// Selectează containerul de stele
const starContainer = document.getElementById("stars");
const numStars = 150; // numărul de stele

// Creează și poziționează stelele
for (let i = 0; i < numStars; i++) {
  const star = document.createElement("div");
  star.classList.add("star");

  const size = Math.random() * 2 + 1; // dimensiune între 1 și 3px
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;

  // animație individuală de sclipire
  const duration = Math.random() * 5 + 5;
  const delay = Math.random() * 5;
  star.style.animation = `twinkle ${duration}s ease-in-out ${delay}s infinite`;

  starContainer.appendChild(star);
}

// ==============================================
// TEXT INTERACTION — tilt în funcție de mișcarea mouse-ului
// ==============================================
const heroText = document.querySelector(".hero-text");
const words = document.querySelectorAll(".fade-word");

document.addEventListener("mousemove", (e) => {
  const { innerWidth, innerHeight } = window;
  const x = e.clientX / innerWidth - 0.5;
  const y = e.clientY / innerHeight - 0.5;

  words.forEach((word) => {
    word.style.transform = `rotateY(${x * 20}deg) rotateX(${y * -10}deg)`;
  });
});

document.addEventListener("mouseleave", () => {
  words.forEach((word) => {
    word.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
});
