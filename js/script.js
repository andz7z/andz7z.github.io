document.addEventListener('DOMContentLoaded', () => {

    // --- SMOOTH SCROLL FOR ALL ANCHOR LINKS ---
    const navLinks = document.querySelectorAll('.main-nav a, .scroll-to-top, .logo-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor jump
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Use smooth scrolling
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
    
    // Select all sections to observe
    const sections = document.querySelectorAll('.fullscreen-section');
    
    // Icons mapping for the "Currently on" display
    // We get this from the 'data-section-name' on the nav links
    const sectionIcons = {};
    document.querySelectorAll('.main-nav a').forEach(a => {
        const sectionName = a.getAttribute('data-section-name');
        const iconSVG = a.querySelector('svg').cloneNode(true);
        iconSVG.setAttribute('width', '16');
        iconSVG.setAttribute('height', '16');
        sectionIcons[sectionName] = iconSVG.outerHTML;
    });

    const observerOptions = {
        root: null, // Observes intersections with the viewport
        rootMargin: '0px',
        threshold: 0.6 // 60% of the section must be visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Find the corresponding nav link to get the name and icon
                const navLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`);
                let sectionName = 'Home'; // Default
                let sectionIconHTML = sectionIcons['Home']; // Default

                if (navLink) {
                    sectionName = navLink.getAttribute('data-section-name');
                    sectionIconHTML = sectionIcons[sectionName];
                }

                // Update the "Currently on" display
                currentSectionName.textContent = sectionName;
                currentSectionIcon.innerHTML = sectionIconHTML;

                // Handle fading of homepage elements
                if (sectionId === 'home') {
                    // We are on the homepage
                    homeNav.classList.remove('hidden');
                    socialLinks.classList.remove('hidden');
                    scrollManager.classList.remove('visible');
                } else {
                    // We are NOT on the homepage
                    homeNav.classList.add('hidden');
                    socialLinks.classList.add('hidden');
                    scrollManager.classList.add('visible');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});
