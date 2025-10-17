// ===== STELE =====
const starsContainer = document.getElementById('stars');
const numStars = 150;
const stars = [];

for (let i = 0; i < numStars; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.top = Math.random() * 100 + '%';
  star.style.left = Math.random() * 100 + '%';
  star.style.animationDelay = Math.random() * 3 + 's';
  starsContainer.appendChild(star);
  stars.push(star);
}

// Stelele apropiate de mouse se mișcă ușor spre direcția lui
document.addEventListener('mousemove', e => {
  const rect = starsContainer.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  stars.forEach(star => {
    const sx = star.offsetLeft + star.offsetWidth / 2;
    const sy = star.offsetTop + star.offsetHeight / 2;
    const dx = mx - sx;
    const dy = my - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 200) { // doar stelele apropiate
      const angle = Math.atan2(dy, dx);
      const move = (200 - dist) / 20;
      const x = Math.cos(angle) * move;
      const y = Math.sin(angle) * move;
      star.style.transform = `translate(${x}px, ${y}px)`;
    } else {
      star.style.transform = `translate(0, 0)`;
    }
  });
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
