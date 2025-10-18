// Fade pe secțiuni în funcție de scroll
const fadeSections = document.querySelectorAll(".fade-section");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const windowH = window.innerHeight;

  fadeSections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    // Dacă secțiunea e în afara view-ului, fade out
    if (scrollY > sectionTop + sectionHeight / 2) {
      section.classList.add("fade-out");
    } else if (scrollY < sectionTop + sectionHeight) {
      section.classList.remove("fade-out");
    }
  });

  // Parallax subtil pe fundal
  const background = document.querySelector(".background");
  background.style.transform = `translateY(${scrollY * 0.2}px)`;
});

// Reveal delay pentru text
window.addEventListener("load", () => {
  const lines = document.querySelectorAll(".line");
  lines.forEach((line, index) => {
    line.style.animationDelay = `${3 + index * 0.8}s`;
  });
});
