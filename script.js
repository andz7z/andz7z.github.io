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

      // apare textul complet cu delay-uri între cuvinte
      setTimeout(() => {
        vision.classList.add('show');

        // descompune literele pentru hover individual
        if (!vision.dataset.split) {
          const textNodes = [];
          vision.childNodes.forEach(node => {
            if (node.nodeType === 3) {
              [...node.textContent].forEach(letter => {
                const span = document.createElement('span');
                span.textContent = letter;
                textNodes.push(span);
              });
            } else {
              textNodes.push(node);
            }
          });
          vision.textContent = "";
          textNodes.forEach(el => vision.appendChild(el));
          vision.dataset.split = true;
        }
      }, 400);
    }, 100);
  }, 1000);
}, 3000);
