// După 3.5 secunde, face tranziția de la intro la meniul principal
window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const menu = document.getElementById("menu");

  setTimeout(() => {
    intro.style.display = "none"; // ascunde intro-ul complet
    menu.classList.add("active"); // afișează meniul cu fade
  }, 3600);
});
