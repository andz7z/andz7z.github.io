window.addEventListener("DOMContentLoaded", () => {
  const intro = document.querySelector(".intro-wrapper");
  const home = document.querySelector(".home");
  const header = document.querySelector(".main-header");
  const sections = document.querySelectorAll(".section");

  // Fade out intro
  setTimeout(() => {
    intro.style.filter = "blur(25px)";
    intro.style.opacity = "0";
  }, 3000);

  setTimeout(() => {
    intro.classList.add("hidden");
    home.classList.remove("hidden");
    header.classList.remove("hidden");
    setTimeout(() => {
      home.classList.add("show");
      header.classList.add("show");
    }, 100);
  }, 4200);

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
      else entry.target.classList.remove("show");
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => observer.observe(sec));

  // Parallax background movement
  window.addEventListener("scroll", () => {
    document.querySelectorAll(".parallax").forEach(el => {
      const speed = el.getAttribute("data-speed");
      el.style.backgroundPositionY = `${window.scrollY * speed}px`;
    });
  });
});
