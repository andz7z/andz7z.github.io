// script.js — logica generală pentru site

// Smooth scroll între secțiuni
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Observator pentru inițializarea secțiunilor când devin vizibile
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      switch (id) {
        case "about":
          initAboutSection();
          break;
        case "services":
          initServicesSection();
          break;
        case "reviews":
          initReviewsSection();
          break;
        case "contact":
          initContactSection();
          break;
      }
    }
  });
}, { threshold: 0.2 });

sections.forEach(section => observer.observe(section));
