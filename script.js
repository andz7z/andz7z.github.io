// ===== STELE =====
const starsContainer = document.getElementById('stars');
const numStars = 150;

for (let i = 0; i < numStars; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.top = Math.random() * 100 + '%';
  star.style.left = Math.random() * 100 + '%';
  star.style.animationDelay = Math.random() * 3 + 's';
  starsContainer.appendChild(star);
}

// Efect mouse: stelele fug ușor
document.addEventListener('mousemove', e => {
  const { innerWidth, innerHeight } = window;
  const x = e.clientX / innerWidth - 0.5;
  const y = e.clientY / innerHeight - 0.5;
  starsContainer.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
});

// ===== TRANZIȚII INTRO / MAIN =====
const loader = document.getElementById('loader');
const main = document.getElementById('main');

setTimeout(() => {
  loader.classList.add('blur-out');
  setTimeout(() => {
    loader.style.display = 'none';
    main.classList.add('show');
  }, 1000); // după blur out
}, 3000); // 3 secunde intro
