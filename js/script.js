// =======================
// VIDEO LOADER SCRIPT
// =======================
window.addEventListener("load", () => {
  const loader = document.getElementById("video-loader");
  const video = document.getElementById("loader-video");
  const overlay = document.querySelector(".loader-overlay");

  // După 0.5s scoatem blurul (efect cinematic de clarificare)
  setTimeout(() => {
    video.style.filter = "blur(0px)";
    video.style.opacity = "1";
    video.style.transform = "scale(1)";
    overlay.style.backdropFilter = "blur(0px)";
    overlay.style.opacity = "0.2";
  }, 600);

  // Când se termină videoclipul => fade out complet
  video.addEventListener("ended", () => {
    loader.classList.add("fade-out");
    setTimeout(() => loader.style.display = "none", 2500);
  });

  // Fallback (dacă se încarcă înainte să se termine video-ul)
  setTimeout(() => {
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(() => loader.style.display = "none", 2500);
    }
  }, 9000);
});
// =======================
// NAV BAR & BURGER MENU SCRIPT
// =======================

// Așteaptă ca documentul HTML să fie încărcat
document.addEventListener('DOMContentLoaded', function() {
    
    // Selectează elementele de care avem nevoie
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Verifică dacă elementele există înainte de a adăuga event listener-ul
    if (hamburger && navMenu) {
        // Adaugă un event listener pentru 'click' pe burger
        hamburger.addEventListener('click', () => {
            // Comută (adaugă/elimină) clasa 'active' pe burger
            hamburger.classList.toggle('active');
            
            // Comută (adaugă/elimină) clasa 'active' pe meniu
            navMenu.classList.toggle('active');
        });
    }

    // (Opțional, dar recomandat) Închide meniul când se dă click pe un link
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Elimină clasa 'active' ca să se închidă meniul
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

});
