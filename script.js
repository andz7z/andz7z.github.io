// După 3 secunde -> fade out la loader + fade in la video
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".loader-screen").classList.add("fade-out");
    document.querySelector(".video-bg").classList.add("show");
  }, 3000);
});
