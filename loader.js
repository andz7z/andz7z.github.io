document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader-screen");
  const landing = document.querySelector(".landing-page");
  const vision = document.getElementById("vision-text");
  const content = document.querySelector(".content");

  // 1️⃣ Setăm content inițial ascuns
  landing.classList.add("hidden");
  content.classList.add("hidden");

  // 2️⃣ Loader fade + blur după 3 secunde
  setTimeout(() => {
    loader.style.filter = "blur(15px)";
    loader.style.opacity = "0";

    // 3️⃣ După 1 secundă ascundem loader-ul și afișăm landing
    setTimeout(() => {
      loader.style.display = "none";
      landing.classList.remove("hidden");

      // 4️⃣ Adăugăm clasa active pentru animații suplimentare
      setTimeout(() => {
        landing.classList.add("active");

        // 5️⃣ Spargem textul în litere și adăugăm animația
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

        // 6️⃣ Apariția content-ului cu fade-in după ce textul animat începe
        setTimeout(() => {
          content.classList.remove("hidden");
          content.classList.add("visible"); // clasa vizibilă pentru fade-in CSS
        }, 800); // ajustați delay-ul după cum vrei
      }, 100); // delay pentru landing active
    }, 1000); // delay pentru fade loader
  }, 3000); // timpul total de loading
});
