window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hide"), 3000);
});

const auraOverlay = document.querySelector(".aura-overlay");
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  auraOverlay.style.setProperty("--x", `${x}%`);
  auraOverlay.style.setProperty("--y", `${y}%`);
});
