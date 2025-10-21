// js/main.js

/* HOW TO EDIT
  - This is the main entry point for all site JavaScript.
  - It imports other section-specific JS files (currently placeholders).
  - It handles global logic:
    1. `initApp()`: Runs on DOMContentLoaded, sets up everything.
    2. `handleIntroAnimation()`: Manages the initial blur-in.
    3. `setupNavigation()`: Handles nav link clicks (scrolling).
    4. `setupSectionObserver()`: Uses IntersectionObserver to update nav active state.
    5. `setupModal()`: Controls the Privacy/TOS dialogs.
    6. `setupScrollListeners()`: Updates the scroll progress bar.
    7. `checkReducedMotion()`: Disables animations if user prefers.
*/

// Import section-specific modules.
// These are currently placeholders but allow for future expansion.
import './home.js';
import './about.js';
import './services.js';
import './portfolio.js';
import './reviews.js';
import './contact.js';

// --- Constants ---
const SELECTORS = {
    mainContainer: '#main-content',
    nav: '.main-nav',
    navLinks: '.nav-item[data-target]',
    sections: 'section.fullscreen[data-section-name]',
    scrollProgress: '.scroll-progress',
    modalTriggers: 'button[data-modal-target]',
    modalCloseBtns: 'button[data-modal-close]',
    modals: '.modal-dialog',
};

// --- State ---
let isReducedMotion = false;
let updateScrollProgress = () => {}; // Will be assigned a throttled function

// --- Utility Functions ---

/**
 * Throttles a function to run at most once per animation frame.
 * @param {function} callback - The function to throttle.
 * @returns {function} - The throttled function.
 */
function throttle(callback) {
    let ticking = false;
    return function (...args) {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                callback.apply(this, args);
                ticking = false;
            });
            ticking = true;
        }
    };
}

/**
 * Checks if the user prefers reduced motion.
 * Sets a global flag and a class on the <html> element.
 */
function checkReducedMotion() {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion = motionQuery.matches;
    if (isReducedMotion) {
        document.documentElement.classList.add('reduced-motion');
    }
    motionQuery.addEventListener('change', () => {
        isReducedMotion = motionQuery.matches;
        document.documentElement.classList.toggle('reduced-motion', isReducedMotion);
    });
}

// --- Core Logic ---

/**
 * Handles the initial page load animation (fade out loader, blur in content).
 */
function handleIntroAnimation() {
    // Use window.onload to wait for all assets (like video poster)
    window.addEventListener('load', () => {
        // Add a small delay to ensure rendering is stable
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100); // 100ms delay
    });
}

/**
 * Sets up click listeners for the main navigation links.
 * Scrolls to the corresponding section.
 */
function setupNavigation() {
    const mainContainer = document.querySelector(SELECTORS.mainContainer);
    if (!mainContainer) return;

    document.querySelectorAll(SELECTORS.navLinks).forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // We scroll the main container, not the window
                mainContainer.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: isReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });
}

/**
 * Uses IntersectionObserver to detect which section is currently visible.
 * Updates the active state on the corresponding navigation icon.
 */
function setupSectionObserver() {
    const sections = document.querySelectorAll(SELECTORS.sections);
    const navLinks = document.querySelectorAll(SELECTORS.navLinks);
    const nav = document.querySelector(SELECTORS.nav);
    if (sections.length === 0 || navLinks.length === 0 || !nav) return;

    const navLinkMap = new Map();
    navLinks.forEach(link => {
        navLinkMap.set(link.getAttribute('data-target'), link);
    });

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const targetId = `#${entry.target.id}`;
            const correspondingLink = navLinkMap.get(targetId);
            
            if (!correspondingLink) return;

            // Add 'is-visible' class to section for content animations
            entry.target.classList.toggle('is-visible', entry.isIntersecting);

            // Set 'active' state on nav icon
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                // Remove 'active' from all other links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add 'active' to the current link
                correspondingLink.classList.add('active');
            }

            // --- "Magnet" Effect ---
            // Add a 'magnet-active' class when section is *approaching* (e.g., 20% visible)
            // but not yet fully 'active' (e.g., 60% visible).
            // This threshold array [0.2, 0.6] triggers the callback at both points.
            if (entry.intersectionRatio > 0.2 && entry.intersectionRatio < 0.6) {
                correspondingLink.classList.add('magnet-active');
            } else {
                correspondingLink.classList.remove('magnet-active');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        root: document.querySelector(SELECTORS.mainContainer), // Observe scrolling within the main container
        threshold: [0.2, 0.6, 0.8], // Fire at 20%, 60%, and 80% visibility
    });

    sections.forEach(section => observer.observe(section));
}


/**
 * Sets up listeners for the modal dialogs (Privacy & TOS).
 * Uses native <dialog> element methods.
 */
function setupModal() {
    const modalTriggers = document.querySelectorAll(SELECTORS.modalTriggers);
    const modals = document.querySelectorAll(SELECTORS.modals);
    const mainContainer = document.querySelector(SELECTORS.mainContainer);

    // Function to open a modal
    const openModal = (dialog) => {
        if (dialog) {
            dialog.showModal();
            // Add class to main content to prevent scrolling
            if (mainContainer) mainContainer.classList.add('scroll-locked');
        }
    };

    // Function to close a modal
    const closeModal = (dialog) => {
        if (dialog) {
            // Add a class to trigger the closing animation
            dialog.classList.add('is-closing');
            
            // Wait for animation to finish before truly closing
            dialog.addEventListener('animationend', () => {
                dialog.classList.remove('is-closing');
                dialog.close();
            }, { once: true });
            
            dialog.addEventListener('transitionend', () => {
                dialog.classList.remove('is-closing');
                dialog.close();
            }, { once: true });
        }
    };

    // Open triggers
    modalTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            openModal(modal);
        });
    });

    // Close triggers
    modals.forEach(dialog => {
        // Close button inside modal
        const closeBtn = dialog.querySelector('button[data-modal-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(dialog));
        }

        // Close when clicking the backdrop
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                closeModal(dialog);
            }
        });

        // Re-enable main scrolling when modal is fully closed
        dialog.addEventListener('close', () => {
            if (mainContainer) mainContainer.classList.remove('scroll-locked');
        });
    });
}


/**
 * Sets up scroll event listeners for the scroll progress bar.
 * Uses rAF throttling for performance.
 */
function setupScrollListeners() {
    const mainContainer = document.querySelector(SELECTORS.mainContainer);
    const scrollProgressBar = document.querySelector(SELECTORS.scrollProgress);
    if (!mainContainer || !scrollProgressBar) return;

    // Create the throttled function
    updateScrollProgress = throttle(() => {
        const scrollAmount = mainContainer.scrollTop;
        const maxScroll = mainContainer.scrollHeight - mainContainer.clientHeight;
        const progress = (scrollAmount / maxScroll) * 100;
        
        // Update the progress bar width
        // Use 3D transform for hardware acceleration if possible, but width is fine.
        scrollProgressBar.style.width = `${progress}%`;
    });

    // Add passive event listener for scroll performance
    mainContainer.addEventListener('scroll', updateScrollProgress, { passive: true });
}

/**
 * Initializes the application.
 * Runs once the DOM is fully loaded.
 */
function initApp() {
    checkReducedMotion();
    handleIntroAnimation();
    setupNavigation();
    setupSectionObserver();
    setupModal();
    setupScrollListeners();
}

// --- Execution ---
document.addEventListener('DOMContentLoaded', initApp);
