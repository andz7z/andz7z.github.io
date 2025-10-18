// Optional small tweak: fit iframe height properly when resizing
window.addEventListener('resize', () => {
  const iframe = document.querySelector('.spline-iframe');
  if (iframe) {
    iframe.style.height = window.innerHeight + 'px';
  }
});
