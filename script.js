// --- FADE-IN / FADE-OUT pe scroll ---
const fadeSections = document.querySelectorAll('.fade-section');

const observerOptions = {
  threshold: 0.25
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, observerOptions);

fadeSections.forEach(sec => fadeObserver.observe(sec));


// --- SCROLL INTERACTIV pentru panou ---
window.addEventListener('scroll', () => {
  const blurBox = document.querySelector('.blur-box');
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.body.offsetHeight;

  // Control dinamic asupra poziției panoului
  if (blurBox) {
    const progress = scrollTop / (docHeight - windowHeight);
    const translateY = Math.max(0, 150 - progress * 300);
    blurBox.style.transform = `translateY(${translateY}px)`;
  }

  // Adaugă o ușoară transparență bara blurată în funcție de scroll
  const blurBar = document.querySelector('.blur-bar');
  if (blurBar) {
    blurBar.style.opacity = 1 - Math.min(scrollTop / (windowHeight * 0.8), 0.3);
  }
});
