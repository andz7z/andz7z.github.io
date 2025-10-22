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
            goBack.classList.add('show');
        }
    }

    updateCurrentSectionIndicator() {
        const indicator = document.querySelector('.current-section');
        const iconMap = {
            home: 'fa-home',
            about: 'fa-user',
            services: 'fa-cog',
            portfolio: 'fa-briefcase',
            reviews: 'fa-star',
            contact: 'fa-envelope'
        };
        
        if (this.currentSection === 'home') {
            indicator.classList.remove('show');
        } else {
            indicator.classList.add('show');
            indicator.innerHTML = `Currently on: <i class="fas ${iconMap[this.currentSection]}"></i>`;
        }
    }

    openModal() {
        document.querySelector('.modal-overlay').classList.add('active');
    }

    closeModal() {
        document.querySelector('.modal-overlay').classList.remove('active');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
