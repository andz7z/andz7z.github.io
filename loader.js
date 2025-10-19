document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader-screen");
  const landing = document.querySelector(".landing-page");
  const vision = document.getElementById("vision-text");
  const content = document.querySelector(".content");

  // 1️⃣ Ascundem landing și content la start
  landing.style.opacity = "0";
  content.style.opacity = "0";

  // 2️⃣ Loader fade + blur
  setTimeout(() => {
    loader.style.filter = "blur(15px)";
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";

      // 3️⃣ Arătăm landing
      landing.style.opacity = "1";

      // Spargem textul în litere
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
    }, 1000);
  }, 3000);

  // 4️⃣ Content apare la scroll
  window.addEventListener("scroll", () => {
    const trigger = 50; // scroll minim
    if (window.scrollY > trigger && !content.classList.contains("visible")) {
      content.classList.add("visible");
    }
  });
});
