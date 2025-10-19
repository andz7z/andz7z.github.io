setTimeout(() => {
  const loader = document.querySelector('.loader-screen');
  const landing = document.querySelector('.landing-page');
  const vision = document.getElementById('vision-text');

  // fade loader
  loader.style.filter = "blur(15px)";
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
    landing.classList.remove('hidden');

    // activare hero (aparitie)
    setTimeout(() => {
      landing.classList.add('active');

      setTimeout(() => {
        // Sparge textul în litere individuale (dacă nu e spart deja)
        if (!vision.dataset.split) {
          const letters = [...vision.textContent];
          vision.textContent = "";
          letters.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--i', i);
            vision.appendChild(span);
          });
          vision.dataset.split = true;
        }
        vision.classList.add('show');
        const letters = vision.querySelectorAll('span');
        letters.forEach((span, i) => {
          span.style.animationDelay = `${i * 0.12}s`;
        });

        // asigură scroll la buton (dacă utilizatorul apasă)
        const goBtn = document.querySelector('.card-shell .btn.primary');
        if (goBtn) {
          goBtn.addEventListener('click', () => {
            const section = document.getElementById('section-x');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }

      }, 400);
    }, 100);
  }, 1000);
}, 3000);
