// intro -> fade -> show video
window.addEventListener('load', () => {
  const loading = document.getElementById('loading-screen');
  const main = document.getElementById('main-menu');
  const video = document.getElementById('bgVideo');

  // 2s intro (keeps showing for 2000ms)
  setTimeout(() => {
    // show video/main
    main.classList.add('visible');

    // try to play video (muted autoplay usually allowed)
    if (video) {
      const p = video.play();
      if (p && p.catch) p.catch(err => {
        // autoplay blocked: user interaction required (rare since muted attribute present)
        console.log('Video playback blocked:', err);
      });
    }

    // fade out loading screen
    loading.classList.add('hidden');

    // remove from DOM after transition to free memory / avoid blocking clicks
    setTimeout(() => {
      if (loading && loading.parentNode) loading.parentNode.removeChild(loading);
    }, 1000);
  }, 2000);
});
