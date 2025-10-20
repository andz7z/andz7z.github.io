document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const video = document.querySelector(".background-video");

  // Loader: 3 secunde, apoi dispare
  setTimeout(() => {
    loader.classList.add("fade-out");
    video.classList.add("active");
  }, 3000);

  // Scroll smooth (redundant pentru compatibilitate)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: "smooth"
        });
      }
    });
  });
});
