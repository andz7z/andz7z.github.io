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

// Generate stars and interactive glow
function generateStars() {
  const starsContainer = document.querySelector(".stars");
  const totalStars = 200;
  const stars = [];

  for (let i = 0; i < totalStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animation = `twinkle ${2 + Math.random() * 4}s infinite ease-in-out`;
    starsContainer.appendChild(star);
    stars.push(star);
  }

  document.addEventListener("mousemove", (e) => {
    stars.forEach(star => {
      const rect = star.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        star.classList.add("active");
      } else {
        star.classList.remove("active");
      }
    });
  });
}

// Tilt text effect (stronger tilt)
const title = document.querySelector(".white-3d");
document.addEventListener("mousemove", (e) => {
  const rect = title.getBoundingClientRect();
  const x = e.clientX - (rect.left + rect.width / 2);
  const y = e.clientY - (rect.top + rect.height / 2);
  const tiltX = (y / rect.height) * 20; // stronger tilt
  const tiltY = -(x / rect.width) * 20;
  title.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

document.addEventListener("mouseleave", () => {
  title.style.transform = "rotateX(0deg) rotateY(0deg)";
});
