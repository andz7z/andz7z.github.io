window.addEventListener("load", () => {
  const lines = document.querySelectorAll(".line");
  lines.forEach((line, index) => {
    line.style.animationDelay = `${3 + index * 0.8}s`;
  });
});
