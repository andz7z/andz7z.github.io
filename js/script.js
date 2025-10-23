/*
 * SCRIPT.JS
 * * Logică Globală:
 * - Preloader
 * - Navigare Smooth Scroll
 * - Logică Scroll (Fade navigație home, show/hide Scroll-to-top)
 * - Animații Secțiuni (IntersectionObserver)
 * - Meniu Mobil (Toggle)
 */

document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.querySelector('.preloader');
    const homeNav = document.querySelector('.home-nav');
    const scrollTopBtn = document.querySelector('#scrollTopBtn');
    const sections = document.querySelectorAll('.section');
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    // 1. ======== PRELOADER ========
    // Folosim 'load' pentru a aștepta încărcarea tuturor resurselor (imagini)
    window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
        // Eliminăm preloader-ul din DOM după terminarea tranziției
        preloader.addEventListener('transitionend', () => {
            preloader.remove();
        });
    });

    // 2. ======== LOGICĂ SCROLL ========
    let homeHeight = document.querySelector('#home').offsetHeight;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;

        // A. Fade-out navigație Home
        if (homeNav) { // Verificăm dacă navigația home există (pt. mobil)
            if (scrollTop > homeHeight * 0.5) {
                homeNav.classList.add('hidden');
            } else {
                homeNav.classList.remove('hidden');
            }
        }

        // B. Show/Hide Scroll-to-Top Button
        if (scrollTop > homeHeight * 0.8) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // 3. ======== SCROLL-TO-TOP BUTTON CLICK ========
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 4. ======== ANIMAȚII SECȚIUNI (IntersectionObserver) ========
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Odată animat, nu mai observăm
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null, // Viewport
        threshold: 0.2 // 20% vizibil
    });

    // Observăm toate secțiunile, cu excepția #home
    sections.forEach(section => {
        if (section.id !== 'home') {
            sectionObserver.observe(section);
        }
    });

    // 5. ======== MENIU MOBIL (TOGGLE) ========
    const toggleMenu = () => {
        burgerMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        // Prevenim scroll-ul pe body când meniul e deschis
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : 'auto';
    };

    burgerMenu.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);

    // Închide meniul la click pe un link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 6. ======== SMOOTH SCROLL PENTRU TOATE LINK-URILE ANCORĂ ========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});
