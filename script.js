setTimeout(() => {
  const loader = document.querySelector('.loader-screen');
  const landing = document.querySelector('.landing-page');

  // blur out loading
  loader.style.filter = "blur(15px)";
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
    landing.classList.remove('hidden');

    // blur in landing
    setTimeout(() => {
      landing.classList.add('active');
    }, 100);
  }, 1000);
}, 3000);
setTimeout(() => {
  const loader = document.querySelector('.loader-screen');
  const landing = document.querySelector('.landing-page');

  // blur out loading
  loader.style.filter = "blur(15px)";
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
    landing.classList.remove('hidden');

    // blur in landing
    setTimeout(() => {
      landing.classList.add('active');
      // după ce e activ, pornește efectul pe litere
      document.querySelectorAll('.vision-title span').forEach((span, i) => {
        span.style.animationPlayState = 'running';
      });
    }, 100);
  }, 1000);
}, 3000);
