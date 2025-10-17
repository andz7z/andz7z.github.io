// Fade out loader and show homepage
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.querySelector(".loader-screen");
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
      document.querySelector(".homepage").classList.remove("hidden");
    }, 1000);
  }, 3000);
});

// Create subtle random stars
const starsContainer = document.querySelector(".stars");
for (let i = 0; i < 150; i++) {
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.opacity = 0.5 + Math.random() * 0.5;
  star.style.animation = `twinkle ${3 + Math.random() * 5}s infinite ease-in-out`;
  starsContainer.appendChild(star);
}

// Twinkle animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}`;
document.head.appendChild(style);

// Tilt metal text towards mouse
const title = document.querySelector(".metal-text");
document.addEventListener("mousemove", (e) => {
  const rect = title.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const tiltX = (y / rect.height) * 10;
  const tiltY = -(x / rect.width) * 10;
  title.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

document.addEventListener("mouseleave", () => {
  title.style.transform = "rotateX(0deg) rotateY(0deg)";
});
