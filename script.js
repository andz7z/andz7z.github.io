// === FADE-IN PE SCROLL ===
const fadeSections = document.querySelectorAll('.fade-section');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.3 });

fadeSections.forEach(sec => fadeObserver.observe(sec));
