// Loader timeout + video transition
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const video = document.querySelector(".background-video");

  // Așteaptă 3s apoi ascunde loaderul
  setTimeout(() => {
    loader.classList.add("fade-out");
    video.classList.add("active");
  }, 3000);
});
