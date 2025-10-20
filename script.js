window.addEventListener("load", () => {
  const loaderScreen = document.querySelector(".loader-screen");
  const bgVideo = document.getElementById("bg-video");

  setTimeout(() => {
    // Blur out loader
    loaderScreen.style.filter = "blur(10px)";
    loaderScreen.style.opacity = "0";

    // Blur in video
    bgVideo.style.filter = "blur(0px)";
    bgVideo.style.opacity = "1";

    // Remove loader from DOM after transition
    setTimeout(() => loaderScreen.remove(), 1000);
  }, 3000); // 3 sec
});
