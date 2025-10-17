// Fade out loader and show homepage
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.querySelector(".loader-screen");
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
      document.querySelector(".homepage").classList.remove("hidden");
      generateStars();
    }, 1000);
  }, 3000);
});

// Generate interactive stars
function generateStars() {
  const starsContainer = document.querySelector(".stars");
  for (let i = 0; i < 200; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animation = `twinkle ${2 + Math.random() * 4}s infinite ease-in-out`;
    starsContainer.appendChild(star);
  }

  // Glow effect following mouse movement
  document.addEventListener("mousemove", (e) => {
    const stars = document.querySelectorAll(".star");
    stars.forEach(star => {
      const rect = star.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const intensity = Math.max(0, 1 - dist / 250);
      star.style.boxShadow = intensity > 0.2 ? `0 0 ${10 * intensity}px ${4 * intensity}px #ad5fff` : "none";
    });
  });
}

// 3D tilt text movement
const title = document.querySelector(".white-3d");
document.addEventListener("mousemove", (e) => {
  const rect = title.getBoundingClientRect();
  const x = e.clientX - (rect.left + rect.width / 2);
  const y = e.clientY - (rect.top + rect.height / 2);
  const tiltX = (y / rect.height) * 10;
  const tiltY = -(x / rect.width) * 10;
  title.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});
document.addEventListener("mouseleave", () => {
  title.style.transform = "rotateX(0deg) rotateY(0deg)";
});
