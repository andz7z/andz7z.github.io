const fadeSections = document.querySelectorAll(".fade-section");
const background = document.querySelector(".background");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const windowH = window.innerHeight;

  // Fade in/out secțiuni
  fadeSections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollY > sectionTop + sectionHeight / 2) {
      section.classList.add("fade-out");
    } else if (scrollY < sectionTop + sectionHeight) {
      section.classList.remove("fade-out");
    }
  });

  // Parallax subtil pentru fundal
  background.style.transform = `translateY(${scrollY * 0.2}px)`;
});
