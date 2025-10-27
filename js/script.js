// =======================
// VIDEO LOADER SCRIPT
// =======================
window.addEventListener("load", () => {
  const loader = document.getElementById("video-loader");
  const video = document.getElementById("loader-video");
  const overlay = document.querySelector(".loader-overlay");
  const mainContent = document.querySelector("main");

  // Ascunde instant conținutul principal
  if (mainContent) {
    mainContent.style.opacity = "0";
    mainContent.style.visibility = "hidden";
  }

  setTimeout(() => {
    if (video) video.style.filter = "blur(0px)";
    if (video) video.style.opacity = "1";
    if (overlay) overlay.style.opacity = "0";
  }, 500);

  const closeLoader = () => {
    if (loader) loader.classList.add("fade-out");
    
    setTimeout(() => {
      if (loader) loader.style.display = "none";
      
      // Afișare smooth a conținutului principal
      if (mainContent) {
        mainContent.style.transition = "opacity 1.5s ease-in-out";
        mainContent.style.visibility = "visible";
        mainContent.style.opacity = "1";
      }
    }, 2000);
  };

  if (video) {
    video.addEventListener("ended", closeLoader);
  }

  setTimeout(closeLoader, 9000); // fallback
});

// =======================
// NAV BAR & BURGER MENU SCRIPT
// =======================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // NAVBAR HIDE/SHOW LOGIC - VERSIUNEA FINALĂ
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    let lastScrollTop = 0;
    const homeSectionHeight = window.innerHeight; // Înălțimea ferestrei ≈ home section

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Regula 1: În home section (primele 100px) - mereu vizibil
        if (scrollTop < 100) {
            navbar.classList.remove("nav-hidden");
            lastScrollTop = scrollTop;
            return;
        }

        // Regula 2: Scroll în sus - arată navbar
        if (scrollTop < lastScrollTop) {
            navbar.classList.remove("nav-hidden");
        } 
        // Regula 3: Scroll în jos - ascunde navbar (oricunde în pagină)
        else if (scrollTop > lastScrollTop) {
            navbar.classList.add("nav-hidden");
        }

        lastScrollTop = scrollTop;
    });
});
