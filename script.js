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
// scroll automat la secțiunea următoare
window.addEventListener('DOMContentLoaded', () => {
  const scrollBtn = document.querySelector('.scroll-btn');
  const nextSection = document.querySelector('.scroll-section');

  if (scrollBtn && nextSection) {
    scrollBtn.addEventListener('click', () => {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// animația de apariție a cardului la scroll
window.addEventListener('scroll', () => {
  const card = document.querySelector('.blur-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  if (rect.top < windowHeight - 100) {
    card.classList.add('visible');
  }
});
