// Loader timeout
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  const videoSection = document.querySelector(".video-section");

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

// Scroll function
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}
