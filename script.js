window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-screen");
  const videoBg = document.querySelector(".video-bg");

  // așteaptă 3 secunde înainte de tranziție
  setTimeout(() => {
    loader.classList.add("fade-out");
    videoBg.classList.add("show");
  }, 3000);
});
