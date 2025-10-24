/* js/home.js */

document.addEventListener("DOMContentLoaded", () => {

    /**
     * Handles the mobile navigation menu (burger button).
     */
    function handleMobileMenu() {
        const burgerMenu = document.querySelector('.burger-menu');
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        if (!burgerMenu || !mobileNav) return;

        // Toggle menu on burger click
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // Initialize home-specific scripts
    handleMobileMenu();
});
