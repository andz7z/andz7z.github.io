/*
 * FILE: js/main.js
 * PURPOSE: Global scripts for navigation and scroll progress.
 */

document.addEventListener('DOMContentLoaded', () => {

    const progressBar = document.getElementById('scroll-progress-bar');
    const mainNav = document.getElementById('main-nav');
    const burgerBtn = document.getElementById('burger-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

    // --- 1. Scroll Progress Bar Handler ---
    
    const updateScrollProgress = () => {
        // scrollTop: How far scrolled from the top
        const scrollTop = document.documentElement.scrollTop;
        // scrollHeight: Total height of the document
        const scrollHeight = document.documentElement.scrollHeight;
        // clientHeight: Height of the visible window
        const clientHeight = document.documentElement.clientHeight;

        // Calculate percentage scrolled
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

        // Update the progress bar width
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    };

    // --- 2. Navigation Transform Handler ---

    const updateNavTransform = () => {
        // --- Scroll Threshold Customization ---
        // Pixels to scroll before nav transforms into burger
        const scrollThreshold = 100; 
        // ------------------------------------

        if (mainNav) {
            if (window.scrollY > scrollThreshold) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        }
    };

    // --- 3. Burger Menu Toggle Handler ---

    const toggleMobileMenu = () => {
        if (burgerBtn && mobileMenu) {
            // Toggle 'active' class on both button (for 'X' animation)
            // and menu (for visibility)
            burgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        }
    };

    // --- 4. Close Mobile Menu on Link Click ---

    const closeMobileMenu = () => {
        if (burgerBtn && mobileMenu) {
            burgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    };

    // --- Event Listeners ---
    
    // Listen for scroll events to update progress bar and nav
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateNavTransform();
    });

    // Listen for clicks on the burger button
    if (burgerBtn) {
        burgerBtn.addEventListener('click', toggleMobileMenu);
    }

    // Listen for clicks on mobile menu links to close the menu
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

});
