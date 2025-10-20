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
// BACK TO TOP 
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("small");
  } else {
    navbar.classList.remove("small");
  }
});
