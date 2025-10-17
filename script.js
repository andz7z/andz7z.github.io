window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("main-content");

  // Afișează loaderul timp de 3 secunde
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
      mainContent.classList.remove("hidden");
    }, 1000); // timp pentru efectul de blur-out
  }, 3000);
});
