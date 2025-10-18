// Script doar pentru declanșarea ușoară a animației
window.addEventListener("load", () => {
  const lines = document.querySelectorAll(".line");
  lines.forEach((line, index) => {
    line.style.animationDelay = `${index * 0.8}s`;
  });
});
