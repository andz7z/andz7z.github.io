// Main JavaScript File
class PortfolioSite {
    constructor() {
        this.init();
    }

    init() {
        this.setupProgressBar();
        this.setupNavigation();
        this.setupScrollBehavior();
        this.setupSectionTransitions();
        this.setupNavAnimations();
    }

    // Progress Bar
    setupProgressBar() {
        window.addEventListener('scroll', () => {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset;
            const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
            document.querySelector('.progress-bar').style.width = scrollPercent + '%';
        });
    }

    // Navigation Setup
    setupNavigation() {
        // Burger menu toggle
        const burgerMenu = document.querySelector('.burger-menu');
        const burgerIcon = document.querySelector('.burger-icon');

        burgerIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            burgerMenu.classList.toggle('active');
        });

        // Close burger menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!burgerMenu.contains(e.target)) {
                burgerMenu.classList.remove('active');
            }
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    burgerMenu.classList.remove('active');
                }
            });
        });
    }

    // Scroll Behavior
    setupScrollBehavior() {
        let lastScrollTop = 0;
        const nav = document.querySelector('.main-nav');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for navigation transition
            if (scrollTop > 100) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }

            // Section activation based on scroll position
            this.activateCurrentSection();
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    // Section Transitions
    setupSectionTransitions() {
        // Initial section activation
        this.activateCurrentSection();
    }

    // Activate current section based on scroll position
    activateCurrentSection() {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.pageYOffset + window.innerHeight / 2;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Deactivate all sections
                sections.forEach(s => s.classList.remove('active'));
                // Activate current section
                section.classList.add('active');
            }
        });
    }

    // Navigation Animations
    setupNavAnimations() {
        const navItems = document.querySelectorAll('.nav-item');
        
        // Staggered animation for nav items
        navItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in-left');
        });
    }
}

// Initialize the site when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSite();
});

// Add CSS for fade-in-left animation
const style = document.createElement('style');
style.textContent = `
    .fade-in-left {
        animation: fadeInLeft 0.8s ease forwards;
        opacity: 0;
    }
`;
document.head.appendChild(style);
