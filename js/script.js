// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // === SCROLL PROGRESS BAR ===
    const scrollProgressBar = document.getElementById('scroll-progress-bar');

    const updateScrollProgress = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }
    };

    // === MOBILE NAVIGATION ===
    const burgerMenu = document.getElementById('burger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const closeMenu = document.getElementById('close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const openMobileNav = () => {
        if (mobileNav) mobileNav.classList.add('active');
    };

    const closeMobileNav = () => {
        if (mobileNav) mobileNav.classList.remove('active');
    };

    if (burgerMenu) {
        burgerMenu.addEventListener('click', openMobileNav);
    }
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileNav);
    }

    // === SMOOTH SCROLLING & CLOSE MOBILE NAV ON LINK CLICK ===
    const allLinks = document.querySelectorAll('a[href^="#"]');

    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // If on mobile, close the nav after clicking a link
                if (mobileNav && mobileNav.classList.contains('active')) {
                    closeMobileNav();
                }
            }
        });
    });

    // === FADE-IN ELEMENTS ON SCROLL (Intersection Observer) ===
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element must be visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Stop observing once it has faded in
            }
        });
    };

    const fadeInObserver = new IntersectionObserver(observerCallback, observerOptions);

    fadeElements.forEach(el => {
        fadeInObserver.observe(el);
    });

    // === EVENT LISTENERS ===
    window.addEventListener('scroll', () => {
        updateScrollProgress();
    });

});
