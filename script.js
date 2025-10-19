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
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-screen");
  const landing = document.querySelector(".landing-page");
  const visionText = document.getElementById("vision-text");

  // Loader dispare + titlu apare
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.filter = "blur(10px)";
    setTimeout(() => {
      loader.style.display = "none";
      visionText.classList.add("show");
    }, 1000);
  }, 2000);
});

// === Efect de fade pentru video la scroll ===
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  const triggerPoint = window.innerHeight * 0.4;

  if (window.scrollY > triggerPoint) {
    hero.classList.add("scrolled");
  } else {
    hero.classList.remove("scrolled");
  }
});
