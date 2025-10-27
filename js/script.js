// =======================
// VIDEO LOADER SCRIPT
// =======================
window.addEventListener("load", () => {
  const loader = document.getElementById("video-loader");
  const video = document.getElementById("loader-video");
  const overlay = document.querySelector(".loader-overlay");
  const mainContent = document.querySelector("main");

  // Ascunde instant conținutul în spate
  mainContent.style.opacity = "0";

  setTimeout(() => {
    video.style.filter = "blur(0px)";
    video.style.opacity = "1";
    overlay.style.opacity = "0";
  }, 500);

  const closeLoader = () => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
      mainContent.style.opacity = "1"; // Afișare instant
    }, 2000);
  };

  video.addEventListener("ended", closeLoader);

  setTimeout(closeLoader, 9000); // fallback
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
const mainContent = document.querySelector("main"); // sau .home-section

window.addEventListener("load", () => {
  const loader = document.getElementById("video-loader");
  const video = document.getElementById("loader-video");
  const overlay = document.querySelector(".loader-overlay");

  // Ascunde main page la început
  mainContent.style.opacity = "0";

  setTimeout(() => {
    video.style.filter = "blur(0px)";
    overlay.style.opacity = "0.2";
  }, 600);

  video.addEventListener("ended", () => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
      // Afișează acum pagina principală
      mainContent.style.transition = "opacity 1s ease";
      mainContent.style.opacity = "1";
    }, 2500);
  });

  setTimeout(() => {
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(() => {
        loader.style.display = "none";
        mainContent.style.transition = "opacity 1s ease";
        mainContent.style.opacity = "1";
      }, 2500);
    }
  }, 9000);
});
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const homeSection = document.querySelector(".home-section");

  if (!navbar || !homeSection) return;

  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;

    if (scrollTop > lastScrollTop) {
      // Scroll în jos → ascunde navbar
      navbar.classList.add("nav-hidden");
    } else {
      // Scroll în sus → arată navbar
      navbar.classList.remove("nav-hidden");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
});
