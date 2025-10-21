// Main JavaScript file - Controls core functionality

class PortfolioApp {
    constructor() {
        this.currentSection = 'home';
        this.sections = document.querySelectorAll('.section');
        this.navIcons = document.querySelectorAll('.nav-icon');
        this.progressBar = document.querySelector('.progress-bar');
        this.compactNav = document.querySelector('.compact-navbar');
        this.currentSectionText = document.querySelector('.current-section');
        
        this.init();
    }
    
    init() {
        // Initialize all event listeners
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupIntersectionObserver();
        
        // Set initial active section
        this.setActiveSection('home');
        
        // Initialize modules
        if (typeof HomeModule !== 'undefined') new HomeModule();
        if (typeof AboutModule !== 'undefined') new AboutModule();
        if (typeof ServicesModule !== 'undefined') new ServicesModule();
        if (typeof PortfolioModule !== 'undefined') new PortfolioModule();
        if (typeof ReviewsModule !== 'undefined') new ReviewsModule();
        if (typeof ContactModule !== 'undefined') new ContactModule();
    }
    
    setupEventListeners() {
        // Navigation clicks
        this.navIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const section = icon.getAttribute('href').substring(1);
                this.setActiveSection(section);
            });
        });
        
        // Back button in compact nav
        document.querySelector('.back-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.setActiveSection('home');
        });
        
        // Window scroll for progress bar and compact nav
        window.addEventListener('scroll', this.debounce(() => {
            this.updateProgressBar();
            this.toggleCompactNav();
        }, 10));
    }
    
    setupScrollEffects() {
        // Smooth scrolling for anchor links
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
    
    setupIntersectionObserver() {
        // Observe section changes for updating navigation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.setActiveSection(sectionId);
                }
            });
        }, { threshold: 0.5 });
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    setActiveSection(sectionId) {
        // Update sections
        this.sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        // Update navigation
        this.navIcons.forEach(icon => {
            icon.classList.remove('active');
            if (icon.getAttribute('href') === `#${sectionId}`) {
                icon.classList.add('active');
            }
        });
        
        // Update current section
        this.currentSection = sectionId;
        this.updateCurrentSectionText();
    }
    
    updateCurrentSectionText() {
        const sectionNames = {
            'home': 'Home',
            'about': 'About',
            'services': 'Services',
            'portfolio': 'Portfolio',
            'reviews': 'Reviews',
            'contact': 'Contact'
        };
        
        this.currentSectionText.textContent = `Currently on: ${sectionNames[this.currentSection]}`;
    }
    
    updateProgressBar() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        this.progressBar.style.width = scrolled + "%";
    }
    
    toggleCompactNav() {
        if (window.scrollY > 200) {
            this.compactNav.classList.add('visible');
        } else {
            this.compactNav.classList.remove('visible');
        }
    }
    
    // Utility function to debounce events for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
