// Main JavaScript file - Controls overall functionality

class PortfolioApp {
    constructor() {
        this.currentSection = 'home';
        this.sections = ['home', 'about', 'services', 'portfolio', 'reviews', 'contact'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.updateCurrentSectionIndicator();
    }

    setupEventListeners() {
        // Navigation icons
        document.querySelectorAll('.nav-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Go back button
        document.querySelector('.go-back').addEventListener('click', () => {
            this.navigateToSection('home');
        });

        // TOS link
        document.querySelector('.tos-link').addEventListener('click', () => {
            this.openModal();
        });

        // Close modal
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        // Modal overlay click
        document.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Discover button
        document.querySelector('.discover-btn').addEventListener('click', () => {
            this.navigateToSection('about');
        });
    }

    setupScrollBehavior() {
        let isScrolling = false;
        
        window.addEventListener('wheel', (e) => {
            if (isScrolling) return;
            
            isScrolling = true;
            
            const currentIndex = this.sections.indexOf(this.currentSection);
            let nextIndex;
            
            if (e.deltaY > 0 && currentIndex < this.sections.length - 1) {
                // Scroll down
                nextIndex = currentIndex + 1;
            } else if (e.deltaY < 0 && currentIndex > 0) {
                // Scroll up
                nextIndex = currentIndex - 1;
            } else {
                isScrolling = false;
                return;
            }
            
            this.navigateToSection(this.sections[nextIndex]);
            
            // Reset scrolling flag after animation
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }, { passive: true });
    }

    navigateToSection(section) {
        // Update current section
        this.currentSection = section;
        
        // Update active section
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');
        
        // Update navigation UI
        this.updateNavigationUI();
        this.updateCurrentSectionIndicator();
    }

    updateNavigationUI() {
        const navbar = document.querySelector('.navbar');
        const goBack = document.querySelector('.go-back');
        
        if (this.currentSection === 'home') {
            navbar.style.opacity = '1';
            goBack.classList.remove('show');
        } else {
            navbar.style.opacity = '0';
            goBack.classList.add
