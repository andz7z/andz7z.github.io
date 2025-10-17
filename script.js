// Aura interacționează cu mișcarea mouse-ului
const aura = document.querySelector(".aura");

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  aura.style.transform = `rotate(${x / 3}deg) translate(${x}px, ${y}px) scale(1.05)`;
});
