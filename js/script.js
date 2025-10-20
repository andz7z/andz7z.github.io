// ========== Smooth Scroll ==========
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== Navbar "magnetic" effect ==========
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== Fade-in words ==========
const text = document.getElementById("animated-text");
const words = text.textContent.split(" ");
text.textContent = ""; // goli textul

words.forEach((word, i) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.style.animationDelay = `${i * 0.4}s`; // delay între cuvinte
    text.appendChild(span);
});

// ========== Observer pentru secțiuni ==========
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (id === 'about') initAboutSection?.();
                if (id === 'services') initServicesSection?.();
                if (id === 'reviews') initReviewsSection?.();
                if (id === 'contact') initContactSection?.();
            }
        });
    },
    { threshold: 0.4 }
);
document.querySelectorAll('section').forEach((sec) => observer.observe(sec));
const backToTop = document.getElementById("backToTop");

// Arată butonul doar când ești sub secțiunea #about
window.addEventListener("scroll", () => {
  const aboutSection = document.querySelector("#about");
  const scrollY = window.scrollY;

  if (aboutSection && scrollY > aboutSection.offsetTop - 100) {
    backToTop.classList.add("show", "pulse");
  } else {
    backToTop.classList.remove("show", "pulse");
  }
});

// Scroll smooth la top
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
