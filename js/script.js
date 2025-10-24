/* js/script.js */

document.addEventListener("DOMContentLoaded", () => {

    /**
     * Handles the scroll progress bar at the top of the page.
     */
    function handleScrollProgressBar() {
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            
            progressBar.style.width = `${scrollPercentage}%`;
        });
    }

    /**
     * Handles the fade-in-on-scroll animation for all sections.
     * Uses Intersection Observer to add/remove 'is-visible' class.
     */
    function handleSectionFadeIn() {
        const sections = document.querySelectorAll('.section');
        if (sections.length === 0) return;

        const options = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.2 // 20% of the section must be visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    // Optional: remove class to re-animate on scroll up
                    // entry.target.classList.remove('is-visible'); 
                }
            });
        }, options);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Handles the UI state change between the home section and other sections.
     * Uses Intersection Observer on the #home section.
     * Toggles 'on-home' and 'off-home' classes on the <body> element.
     */
    function handleHomeSectionUI() {
        const homeSection = document.querySelector('#home');
        if (!homeSection) return;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // 10% visibility triggers the change
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // User is ON the home section
                    document.body.classList.add('on-home');
                    document.body.classList.remove('off-home');
                } else {
                    // User is OFF the home section
                    document.body.classList.add('off-home');
                    document.body.classList.remove('on-home');
                }
            });
        }, options);

        observer.observe(homeSection);
    }

    // Initialize all global scripts
    handleScrollProgressBar();
    handleSectionFadeIn();
    handleHomeSectionUI();
});
