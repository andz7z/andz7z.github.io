// script.js

// Așteptăm 3 secunde apoi ascundem loaderul și arătăm video-ul
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.querySelector(".loader-container");
    const videoBg = document.querySelector(".video-bg");

    // Aplicăm efect de blur out pe loader
    loader.style.filter = "blur(20px)";
    loader.style.opacity = "0";

    // Activăm tranziția video-ului
    videoBg.style.opacity = "1";
    videoBg.style.filter = "blur(0px)";

    // După ce s-a terminat tranziția, eliminăm loaderul din DOM
    setTimeout(() => loader.remove(), 1000);
  }, 3000);
});
