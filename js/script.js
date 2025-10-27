// =======================
// VIDEO LOADER SCRIPT
// =======================
window.addEventListener("load", () => {
  const loader = document.getElementById("video-loader");
  const video = document.getElementById("loader-video");
  const overlay = document.querySelector(".loader-overlay");
  const mainContent = document.querySelector("main");

  // Pregătește conținutul principal
  if (mainContent) {
    mainContent.style.opacity = "0";
    mainContent.style.visibility = "hidden";
  }

  // Start animația de intrare a loader-ului
  setTimeout(() => {
    if (video) {
      video.style.filter = "blur(0px)";
      video.style.opacity = "1";
    }
    if (overlay) {
      overlay.style.opacity = "0.2";
    }
  }, 500);

  const closeLoader = () => {
    if (!loader || loader.classList.contains("fade-out")) return;
    
    // Start fade-out loader
    loader.classList.add("fade-out");
    
    // Așteaptă 1.2s după începerea fade-out-ului, apoi afișează conținutul
    setTimeout(() => {
      // Ascunde loader-ul complet
      if (loader) {
        loader.style.display = "none";
      }
      
      // Afișează smooth conținutul principal
      if (mainContent) {
        mainContent.classList.add("content-visible");
      }
    }, 1200); // Corelat cu durata fade-out-ului
  };

  if (video) {
    video.addEventListener("ended", closeLoader);
  }

  // Fallback timeout
  setTimeout(closeLoader, 9000);
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

    // NAVBAR HIDE/SHOW LOGIC
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    let lastScrollTop = 0;
    const homeThreshold = 100;

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // În home section - mereu vizibil
        if (scrollTop < homeThreshold) {
            navbar.classList.remove("nav-hidden");
            lastScrollTop = scrollTop;
            return;
        }

        // Scroll în sus - arată navbar
        if (scrollTop < lastScrollTop) {
            navbar.classList.remove("nav-hidden");
        } 
        // Scroll în jos - ascunde navbar
        else if (scrollTop > lastScrollTop + 5) {
            navbar.classList.add("nav-hidden");
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});
