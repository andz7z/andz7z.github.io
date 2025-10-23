class PortfolioApp {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navItems = document.querySelectorAll('.nav-item');
        this.backToTop = document.querySelector('.back-to-top');
        this.progressBar = document.querySelector('.progress-bar');
        this.navbar = document.querySelector('.navbar');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.updateProgressBar();
        this.checkSectionVisibility();
    }

    setupEventListeners() {
        // Navigation clicks
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.getAttribute('data-section');
                this.scrollToSection(sectionId);
            });
        });

        // Back to top
        this.backToTop.addEventListener('click', () => {
            this.scrollToSection('home');
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.updateProgressBar();
            this.checkSectionVisibility();
            this.toggleBackToTop();
            this.handleNavbarVisibility();
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fadeElements = entry.target.querySelectorAll('.fade-in, .fade-in-delay');
                    fadeElements.forEach(el => el.classList.add('visible'));
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        
        this.progressBar.style.width = `${progress}%`;
    }

    checkSectionVisibility() {
        const homeSection = document.getElementById('home');
        const homeRect = homeSection.getBoundingClientRect();
        
        if (homeRect.bottom > window.innerHeight * 0.8) {
            document.body.classList.add('on-home');
        } else {
            document.body.classList.remove('on-home');
        }
    }

    toggleBackToTop() {
        if (window.pageYOffset > window.innerHeight * 0.5) {
            this.backToTop.classList.add('visible');
        } else {
            this.backToTop.classList.remove('visible');
        }
    }

    handleNavbarVisibility() {
        if (window.pageYOffset > 100) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            this.navbar.style.backdropFilter = 'blur(10px)';
        } else {
            this.navbar.style.background = 'transparent';
            this.navbar.style.backdropFilter = 'none';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
