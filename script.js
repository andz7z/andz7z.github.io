window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-screen");
  const video = document.getElementById("bg-video");

  // asigură-te că începe video-ul
  video.play().catch(() => console.log("Autoplay blocat, dar e mutat."));

  // după 3 secunde: fade out loader + fade in video
  setTimeout(() => {
    loader.classList.add("fade-out");
    video.classList.add("show");
  }, 3000);
});
