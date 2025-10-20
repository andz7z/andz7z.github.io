window.addEventListener("load", () => {
  const loaderScreen = document.querySelector(".loader-screen");
  const bgVideo = document.getElementById("bg-video");
  const homeSection = document.getElementById("home");

  // Show video after loader
  setTimeout(() => {
    loaderScreen.style.filter = "blur(10px)";
    loaderScreen.style.opacity = "0";
    bgVideo.style.filter = "blur(0px)";
    bgVideo.style.opacity = "1";

    setTimeout(() => loaderScreen.remove(), 1000);
  }, 3000);

  // Hide video when user scrolls past home
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const homeHeight = homeSection.offsetHeight;

    if (scrollY > homeHeight - 200) {
      bgVideo.style.opacity = "0";
    } else {
      bgVideo.style.opacity = "1";
    }
  });
});
