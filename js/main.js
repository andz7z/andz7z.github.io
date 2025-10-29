// Main JavaScript file - handles common functionality
class App {
    constructor() {
        this.init();
    }

    init() {
        this.setupBurgerMenu();
        this.setupSmoothScrolling();
        this.setupAccessibility();
        this.setupScrollEffects();
    }

    setupBurgerMenu() {
        const burgerMenu = document.querySelector('.burger-menu');
        const navOverlay = document.querySelector('.nav-overlay');
        const navLinks = document.querySelectorAll('.nav-link');

        burgerMenu.addEventListener('click', () => {
            const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
            burgerMenu.setAttribute('aria-expanded', !isExpanded);
            navOverlay.setAttribute('aria-hidden', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.setAttribute('aria-expanded', 'false');
                navOverlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        navOverlay.addEventListener('click', (e) => {
            if (e.target === navOverlay) {
                burgerMenu.setAttribute('aria-expanded', 'false');
                navOverlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
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
                    const headerHeight = 0; // Adjust if you have a fixed header
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
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
                document.body.style.overflow = 'auto';
            }
        });
    }

    setupScrollEffects() {
        // Add subtle parallax effect to home section elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const homeSection = document.querySelector('.home-section');
            const heroContent = document.querySelector('.hero-content');
            
            if (heroContent && homeSection) {
                const homeHeight = homeSection.offsetHeight;
                const scrollPercent = scrolled / homeHeight;
                
                // Parallax effect for hero content
                if (scrollPercent < 1) {
                    heroContent.style.transform = `translateY(${scrollPercent * 50}px)`;
                    heroContent.style.opacity = 1 - (scrollPercent * 2);
                }
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
