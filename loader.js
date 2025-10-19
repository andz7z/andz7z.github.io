document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader-screen");
  const landing = document.querySelector(".landing-page");
  const vision = document.getElementById("vision-text");
  const content = document.querySelector(".content");

  // Ascundem landing și content
  landing.classList.add("hidden");
  content.style.display = "none";

  // Loader fade + blur
  setTimeout(() => {
    loader.style.filter = "blur(15px)";
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
      landing.classList.remove("hidden");

      // Forțăm scroll sus
      window.scrollTo(0, 0);

      // Landing active + animație text
      setTimeout(() => {
        landing.classList.add("active");

        if (vision && !vision.dataset.split) {
          const letters = [...vision.textContent];
          vision.textContent = "";
          letters.forEach((char, i) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.setProperty("--i", i);
            vision.appendChild(span);
          });
          vision.dataset.split = "true";
        }

        if (vision) {
          vision.classList.add("show");
          const letters = vision.querySelectorAll("span");
          letters.forEach((span, i) => {
            span.style.animationDelay = `${i * 0.12}s`;
          });
        }
      }, 100);
    }, 1000);
  }, 3000);

  // Apariție content la scroll
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const trigger = 100; // scroll minim înainte să apară content
    if (scrollY > trigger && content.style.display === "none") {
      content.style.display = "block";     // devine vizibil
      setTimeout(() => {
        content.classList.add("visible");  // fade-in
      }, 10);
    }
  });
});
