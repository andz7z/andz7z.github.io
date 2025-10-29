// Main JavaScript file - handles common functionality
class App {
    constructor() {
        this.init();
    }

    init() {
        this.setupBurgerMenu();
        this.setupSmoothScrolling();
        this.setupAccessibility();
    }

    setupBurgerMenu() {
        const burgerMenu = document.querySelector('.burger-menu');
        const navOverlay = document.querySelector('.nav-overlay');
        const navLinks = document.querySelectorAll('.nav-link');

        burgerMenu.addEventListener('click', () => {
            const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
            burgerMenu.setAttribute('aria-expanded', !isExpanded);
            navOverlay.setAttribute('aria-hidden', isExpanded);
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.setAttribute('aria-expanded', 'false');
                navOverlay.setAttribute('aria-hidden', 'true');
            });
        });

        // Close menu when clicking outside
        navOverlay.addEventListener('click', (e) => {
            if (e.target === navOverlay) {
                burgerMenu.setAttribute('aria-expanded', 'false');
                navOverlay.setAttribute('aria-hidden', 'true');
            }
        });
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling with offset for fixed elements
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupAccessibility() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const burgerMenu = document.querySelector('.burger-menu');
                const navOverlay = document.querySelector('.nav-overlay');
                burgerMenu.setAttribute('aria-expanded', 'false');
                navOverlay.setAttribute('aria-hidden', 'true');
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
