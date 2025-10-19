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
        // când se termină fade-ul loaderului
        vision.classList.add('show');

        // sparge textul în litere individuale
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
      }, 400);
    }, 100);
  }, 1000);
}, 3000);
