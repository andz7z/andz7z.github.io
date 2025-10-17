// După 2 secunde, ascunde intro-ul, redă sunetul și arată meniul principal
window.addEventListener("load", () => {
  const body = document.body;
  const mainMenu = document.getElementById("mainMenu");
  const sound = document.getElementById("introSound");

  setTimeout(() => {
    // Schimbă fundalul + activează blur
    body.style.background = "#c0c0c0";
    body.style.filter = "blur(8px)";

    // Redă sunetul
    sound.play().catch(err => console.log("Audio blocked:", err));

    // După un mic delay, scoate blur-ul și arată meniul
    setTimeout(() => {
      mainMenu.classList.add("visible");
      body.style.filter = "blur(0)";
    }, 400);
  }, 2000);
});
