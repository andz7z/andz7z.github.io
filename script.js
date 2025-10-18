// Creează efect de reflexie la mișcarea mouse-ului
document.addEventListener("mousemove", e => {
  const text = document.getElementById("metalText");
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  text.style.backgroundPosition = `${x}% ${y}%`;
});

// Animația de apariție pe rând
window.addEventListener("DOMContentLoaded", () => {
  const metalText = document.getElementById("metalText");
  const words = metalText.innerText.split(" ");
  metalText.innerHTML = "";

  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.classList.add("word");
    span.style.animationDelay = `${i * 0.15}s`;
    metalText.appendChild(span);
  });
});
