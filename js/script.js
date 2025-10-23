document.addEventListener("DOMContentLoaded", function() {

    const mainNav = document.querySelector('.main-nav');
    const socialNav = document.querySelector('.social-nav');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const homeSection = document.querySelector('#home');
    const sections = document.querySelectorAll('.section');
    const currentSectionIcon = document.getElementById('current-section-icon');

    // --- Mobile Menu Logic ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav ul li a');

    if (menuToggle && mobileNav && menuClose) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
        });

        menuClose.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
        
        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }

    // --- Intersection Observer for Scroll Transitions ---

    // Observer 1: Handles fading the homepage navs and showing the scroll indicator
    const homeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Triggers when 10% of the home section is out of view
    };

    const homeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // Home is NOT visible
                if(mainNav) mainNav.style.opacity = '0';
                if(socialNav) socialNav.style.opacity = '0';
                if(scrollIndicator) {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'all';
                }
            } else {
                // Home IS visible
                if(mainNav) mainNav.style.opacity = '1';
                if(socialNav) socialNav.style.opacity = '1';
                if(scrollIndicator) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                }
            }
        });
    }, homeObserverOptions);

    if (homeSection) {
        homeObserver.observe(homeSection);
    }

    // Observer 2: Handles updating the "Currently on: [icon]" text
    const sectionObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Triggers when 50% of a section is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iconClass = entry.target.dataset.sectionIcon;
                if (currentSectionIcon && iconClass) {
                    // Update the icon
                    currentSectionIcon.className = iconClass;
                }
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        // Don't observe the home section for this
        if (section.id !== 'home') {
            sectionObserver.observe(section);
        }
    });

});
