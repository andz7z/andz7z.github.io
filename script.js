// Wait 3 seconds → hide intro → show homepage title
window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const title = document.querySelector(".title");

  setTimeout(() => {
    intro.classList.add("hide");
    setTimeout(() => {
      title.classList.add("show");
    }, 800);
  }, 3000);
});
