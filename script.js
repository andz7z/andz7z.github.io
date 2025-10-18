// === Responsive Spline Background ===
(function() {
  const iframe = document.querySelector('.spline-iframe');
  if (!iframe) return;

  function fitIframe() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw < 800) {
      iframe.style.width = Math.max(vh * 2.2, vw * 1.6) + 'px';
      iframe.style.height = Math.max(vh * 1.2, vh) + 'px';
    } else {
      iframe.style.width = Math.max(vh * 1.6, vw * 0.9) + 'px';
      iframe.style.height = Math.max(vh * 0.9, vh * 0.9) + 'px';
    }
  }

  window.addEventListener('resize', fitIframe, { passive: true });
  fitIframe();
})();
