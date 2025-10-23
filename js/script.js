document.addEventListener('DOMContentLoaded', () => {

    // --- SMOOTH SCROLL FOR ALL ANCHOR LINKS ---
    const navLinks = document.querySelectorAll('.main-nav a, .scroll-to-top, .logo-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor jump
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- INTERSECTION OBSERVER FOR NAVIGATION AND SECTION TRACKING ---
    const homeNav = document.querySelector('.main-nav');
    const socialLinks = document.querySelector('.social-links');
    const scrollManager = document.querySelector('.scroll-manager');
    const currentSectionName = document.getElementById('current-section-name');
    const currentSectionIcon = document.getElementById('current-section-icon');
    
    const sections = document.querySelectorAll('.fullscreen-section');

    // Map icons to section names
    const sectionIcons = {};
    document.querySelectorAll('.main-nav a').forEach(a => {
        const sectionName = a.getAttribute('data-section-name');
        const iconSVG = a.querySelector('svg').cloneNode(true);
        iconSVG.setAttribute('width', '16');
        iconSVG.setAttribute('height', '16');
        sectionIcons[sectionName] = iconSVG.outerHTML;
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.35 // reduc pragul de la 0.6 → 0.35
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const navLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`);
                let sectionName = 'Home';
                let sectionIconHTML = sectionIcons['Home'] || '';

                if (navLink) {
                    sectionName = navLink.getAttribute('data-section-name');
                    sectionIconHTML = sectionIcons[sectionName];
                }

                currentSectionName.textContent = sectionName;
                currentSectionIcon.innerHTML = sectionIconHTML;

                // Control visibility for home vs. others
                if (sectionId === 'home') {
                    homeNav.classList.remove('hidden');
                    socialLinks.classList.remove('hidden');
                    scrollManager.classList.remove('visible');
                } else {
                    homeNav.classList.add('hidden');
                    socialLinks.classList.add('hidden');
                    scrollManager.classList.add('visible');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 🔥 FIX: Detectăm și manual când suntem foarte sus (scrollY < 150)
    window.addEventListener('scroll', () => {
        if (window.scrollY < 150) {
            homeNav.classList.remove('hidden');
            socialLinks.classList.remove('hidden');
            scrollManager.classList.remove('visible');
            currentSectionName.textContent = 'Home';
            currentSectionIcon.innerHTML = sectionIcons['Home'] || '';
        }
    });
});
// --- SCROLL PROGRESS BAR ---
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
});
// intro
window.addEventListener("load", () => {
  const loader = document.getElementById("pre-load");
  const main = document.getElementById("main-content");

  setTimeout(() => {
    loader.classList.add("hide");
    main.style.filter = "blur(0)";
    main.style.opacity = "1";
  }, 3000);
});
window.addEventListener("load", () => {
  const loader = document.getElementById("pre-load");
  const main = document.getElementById("main-content");
  const fadeElements = document.querySelectorAll(".fade-in-element");

  setTimeout(() => {
    // ascunde loader
    loader.classList.add("hide");
    main.style.filter = "blur(0)";
    main.style.opacity = "1";

    // activează fade-in la toate elementele
    fadeElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add("visible");
      }, i * 200); // decalaj mic între apariții (200ms)
    });

  }, 3000);
});
