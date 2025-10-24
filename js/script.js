/*
 * FILE: script.js
 * PROJECT: ANDZ Website
 * DESCRIPTION: Global JavaScript functions for the entire site.
*/

document.addEventListener("DOMContentLoaded", () => {

    /**
     * ======== PRELOADER FUNCTION ========
     * Fades out the preloader once the window is fully loaded.
     */
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        if (preloader) {
            // Fade out the preloader
            preloader.style.opacity = '0';
            
            // Add 'loaded' class to body to trigger load-in animations
            document.body.classList.add('loaded');
            
            // Remove preloader from DOM after transition
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // Matches CSS transition time
        }
    });

    /**
     * ======== SCROLL PROGRESS BAR ========
     * Updates the width of the progress bar based on scroll position.
     */
    const progressBar = document.getElementById('scroll-progress-bar');
    
    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        
        if (docHeight > winHeight) {
            const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
    };
    window.addEventListener('scroll', updateScrollProgress);

    /**
     * ======== MOBILE NAVIGATION ========
     * Toggles the mobile side menu and burger icon.
     */
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav ul li a');

    const toggleMenu = () => {
        mobileNav.classList.toggle('active');
    };

    if (burgerMenu && mobileNav && mobileNavClose) {
        burgerMenu.addEventListener('click', toggleMenu);
        mobileNavClose.addEventListener('click', toggleMenu);
        
        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    /**
     * ======== SMOOTH SCROLL FOR ANCHORS ========
     * Handles smooth scrolling for all anchor links (e.g., #about).
     */
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

    /**
     * ======== FADE-IN ON SCROLL (INTERSECTION OBSERVER) ========
     * Adds 'visible' class to elements with 'fade-in' class when they enter viewport.
     */
    const fadeInElements = document.querySelectorAll('.fade-in');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        fadeInElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers
        fadeInElements.forEach(el => el.classList.add('visible'));
    }

    /**
     * ======== LOGO IMAGE FALLBACK ========
     * Shows the "ANDZ" text if the icon.gif fails to load.
     */
    const logoImg = document.querySelector('.logo img');
    const logoFallback = document.querySelector('.logo-fallback');

    if (logoImg && logoFallback) {
        logoImg.addEventListener('error', () => {
            logoImg.style.display = 'none';
            logoFallback.style.display = 'block';
        });
    }

});
