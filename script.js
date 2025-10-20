// Activează efectul overlap text
document.querySelectorAll("[overlap-text]").forEach(e => {
  e.innerHTML = [...e.innerText]
    .map((c, i) => `<span style="--i:${i}">${c}</span>`)
    .join("");
});

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-screen");
  const videoBg = document.querySelector(".video-background");
  const mainContent = document.querySelector(".fade-section");

  // După 3 secunde dispare loaderul
  setTimeout(() => {
    loader.classList.add("hidden");

    // După un mic delay apare videoclipul + conținutul fade-in
    setTimeout(() => {
      videoBg.classList.add("active");
      mainContent.classList.add("active");
    }, 800);
  }, 3000);
});
