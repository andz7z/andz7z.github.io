setTimeout(() => {
  const loader = document.querySelector('.loader-screen');
  const landing = document.querySelector('.landing-page');

  loader.style.filter = "blur(15px)";
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
    landing.classList.remove('hidden');

    setTimeout(() => {
      landing.classList.add('active');

      // apare fiecare cuvânt la rând
      const words = ["vision", "build", "lead"];
      words.forEach((id, i) => {
        setTimeout(() => {
          const el = document.getElementById(id);
          el.classList.add('show');

          // desparte literele pentru efect hover individual
          if (!el.dataset.split) {
            const text = el.textContent;
            el.textContent = "";
            [...text].forEach(letter => {
              const span = document.createElement('span');
              span.textContent = letter;
              el.appendChild(span);
            });
            el.dataset.split = true;
          }
        }, i * 800); // delay între cuvinte
      });
    }, 200);
  }, 1000);
}, 3000);
