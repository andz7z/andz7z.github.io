setTimeout(() => {
  const loader = document.querySelector('.loader-screen');
  const landing = document.querySelector('.landing-page');
  const vision = document.getElementById('vision-text');

  loader.style.filter = "blur(15px)";
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
    landing.classList.remove('hidden');

    setTimeout(() => {
      landing.classList.add('active');

      setTimeout(() => {
        // Sparge textul în litere individuale
        if (!vision.dataset.split) {
          const letters = [...vision.textContent];
          vision.textContent = "";
          letters.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--i', i);

            const mirror = span.cloneNode(true);
            vision.appendChild(span);
          });
          vision.dataset.split = true;
        }
        vision.classList.add('show');
        const letters = vision.querySelectorAll('span');
        letters.forEach((span, i) => {
          span.style.animationDelay = `${i * 0.12}s`;
        });
      }, 400);
    }, 100);
  }, 1000);
}, 3000);
// Detectează scroll pentru apariția cardului
window.addEventListener('scroll', () => {
  const card = document.querySelector('.blur-card');
  const rect = card.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (rect.top < windowHeight - 100) {
    card.classList.add('visible');
  }
});
// scroll automat spre card
document.querySelector('.scroll-btn').addEventListener('click', () => {
  const cardSection = document.querySelector('.scroll-section');
  cardSection.scrollIntoView({ behavior: 'smooth' });
});
