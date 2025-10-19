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

        // Activează fade-ul
        vision.classList.add('show');
      }, 400);
    }, 100);
  }, 1000);
}, 3000);
