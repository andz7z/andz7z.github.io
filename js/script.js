// =======================
// VIDEO LOADER SCRIPT
// =======================
window.addEventListener("load", () => {
  const loader = document.getElementById("video-loader");
  const video = document.getElementById("loader-video");
  const overlay = document.querySelector(".loader-overlay");

  // După 0.5s scoatem blurul (efect cinematic de clarificare)
  setTimeout(() => {
    video.style.filter = "blur(0px)";
    video.style.opacity = "1";
    video.style.transform = "scale(1)";
    overlay.style.backdropFilter = "blur(0px)";
    overlay.style.opacity = "0.2";
  }, 600);

  // Când se termină videoclipul => fade out complet
  video.addEventListener("ended", () => {
    loader.classList.add("fade-out");
    setTimeout(() => loader.style.display = "none", 2500);
  });

  // Fallback (dacă se încarcă înainte să se termine video-ul)
  setTimeout(() => {
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(() => loader.style.display = "none", 2500);
    }
  }, 9000);
});
