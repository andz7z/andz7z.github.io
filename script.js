window.addEventListener("DOMContentLoaded", () => {
  const intro = document.querySelector(".intro-wrapper");
  const home = document.querySelector(".home");

  // After 3 seconds, blur and fade out the loader
  setTimeout(() => {
    intro.style.filter = "blur(20px)";
    intro.style.opacity = "0";
  }, 3000);

  // Then show main content
  setTimeout(() => {
    intro.classList.add("hidden");
    home.classList.remove("hidden");
    setTimeout(() => home.classList.add("show"), 100);
  }, 4200);
});
