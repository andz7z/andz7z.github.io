window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-screen");
  const videoBg = document.querySelector(".video-background");

  // După 3 secunde, loaderul dispare
  setTimeout(() => {
    loader.classList.add("hidden");

    // După un mic delay, activează blur-in pentru video
    setTimeout(() => {
      videoBg.classList.add("active");
    }, 800);
  }, 3000);
});
