// Blur + transition logic
setTimeout(() => {
  const intro = document.querySelector(".intro-screen");
  intro.classList.add("blur-out");

  setTimeout(() => {
    intro.style.display = "none";
    document.querySelector(".homepage").classList.remove("hidden");
  }, 1000);
}, 3000);

// Parallax background
document.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  document.body.style.backgroundPosition = `${x * 100}% ${y * 100}%`;

  const aura = document.body.querySelector("body::before");
});
