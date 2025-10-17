// După 3 secunde dispare intro-ul și apare main menu-ul
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  const mainMenu = document.getElementById("main-menu");

  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.transition = "opacity 1s ease";
    setTimeout(() => {
      intro.classList.add("hidden");
      mainMenu.classList.remove("hidden");
    }, 1000);
  }, 3000);
});
