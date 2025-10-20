// Asigură că pagina pornește mereu de sus
window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  const videoSection = document.querySelector(".video-section");

  // Fade-out loader după 3s
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.filter = "blur(10px)";
    setTimeout(() => {
      loader.style.display = "none";
      videoSection.classList.remove("hidden");
      videoSection.querySelector("video").style.filter = "blur(0px)";
    }, 1000);
  }, 3000);
});

// Scroll smooth către secțiuni
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}
window.addEventListener("load", () => {
  document.querySelector(".loader-wrapper").classList.add("fade-out");
  setTimeout(() => {
    document.querySelector(".loader-wrapper").style.display = "none";
    document.querySelector(".video-section").classList.remove("hidden");
  }, 1000);
});
