window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-wrapper");
  const videoSection = document.querySelector(".video-section");

  setTimeout(() => {
    loader.style.transition = "opacity 1s ease, filter 1s ease";
    loader.style.opacity = "0";
    loader.style.filter = "blur(20px)";

    setTimeout(() => {
      loader.style.display = "none";
      videoSection.classList.remove("hidden");
      videoSection.classList.add("visible");
    }, 1000);
  }, 2500);
});

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}
