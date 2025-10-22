/* ANDZ — Lehadus Andrei */

// Global initialization and utilities
class ANDZApp {
    constructor() {
        this.currentSection = 'home';
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSections();
        this.setCurrentYear();
        this.setupSmoothScroll();
        this.setupProgressBar();
        this.setupModal();
    }

    setupEventListeners() {
        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        
        // Navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Back to home button
        const backBtn = document.querySelector('.back-home-btn');
        if (backBtn) {
            backBtn.addEventListener('click', this.scrollToHome.bind(this));
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        // Reduced motion preference
        this.handleReducedMotion();
    }

    handleScroll() {
        if (!this.isScrolling) {
            this.isScrolling = true;
            
            // Update progress bar
            this.updateProgressBar();
            
            // Handle section visibility
            this.handleSectionVisibility();
            
            // Handle navigation fade
            this.handleNavFade();
            
            // Clear timeout and reset scrolling flag
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 100);
        }
    }

    updateProgressBar() {
        const progressBar = document.querySelector('.progress-fill');
        const progressContainer = document.querySelector('.progress-bar');
        if (!progressBar) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;

        progressBar.style.width = `${progress}%`;
        
        // Show/hide progress bar
        if (scrollTop > 100) {
            progressContainer.classList.add('visible');
        } else {
            progressContainer.classList.remove('visible');
        }
    }

    handleSectionVisibility() {
        const sections = document.querySelectorAll('.section');
        const backBtn = document.querySelector('.back-home-btn');
        const sectionName = document.querySelector('.section-name');
        
        let currentSection = 'home';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const sectionId = section.id;
            
            // Check if section is in viewport
            if (sectionTop <= window.innerHeight / 2 && sectionBottom >= window.innerHeight / 2) {
                currentSection = sectionId;
                
                // Add active class to current section
                sections.forEach(s => s.classList.remove('active'));
                section.classList.add('active');
            }
        });
        
        // Update back button and current section
        if (currentSection !== 'home' && backBtn && sectionName) {
            backBtn.classList.add('visible');
            sectionName.textContent = this.formatSectionName(currentSection);
        } else if (backBtn) {
            backBtn.classList.remove('visible');
        }
        
        this.currentSection = currentSection;
    }

    handleNavFade() {
        const homeSection = document.getElementById('home');
        const nav = document.querySelector('.main-nav');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (!homeSection || !nav) return;
        
        const homeRect = homeSection.getBoundingClientRect();
        const isHomeVisible = homeRect.top >= 0 && homeRect.bottom <= window.innerHeight;
        
        if (isHomeVisible) {
            nav.classList.remove('fade-out');
            if (scrollIndicator) {
                scrollIndicator.classList.remove('fade-out');
            }
        } else {
            nav.classList.add('fade-out');
            if (scrollIndicator) {
                scrollIndicator.classList.add('fade-out');
            }
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('href');
        this.scrollToSection(target);
    }

    scrollToSection(sectionId) {
        const targetSection = document.querySelector(sectionId);
        if (!targetSection) return;

        this.isScrolling = true;
        
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    scrollToHome() {
        this.scrollToSection('#home');
    }

    handleKeydown(e) {
        // Escape key closes modal
        if (e.key === 'Escape') {
            this.closeModal();
        }
        
        // Arrow keys for section navigation (when not in form)
        if (!e.target.matches('input, textarea')) {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                this.scrollToNextSection();
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                this.scrollToPrevSection();
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.scrollToHome();
            } else if (e.key === 'End') {
                e.preventDefault();
                this.scrollToSection('#contact');
            }
        }
    }

    scrollToNextSection() {
        const sections = Array.from(document.querySelectorAll('.section'));
        const currentIndex = sections.findIndex(section => 
            section.getBoundingClientRect().top >= 0 && 
            section.getBoundingClientRect().top < window.innerHeight
        );
        
        if (currentIndex < sections.length - 1) {
            this.scrollToSection(`#${sections[currentIndex + 1].id}`);
        }
    }

    scrollToPrevSection() {
        const sections = Array.from(document.querySelectorAll('.section'));
        const currentIndex = sections.findIndex(section => 
            section.getBoundingClientRect().top >= 0 && 
            section.getBoundingClientRect().top < window.innerHeight
        );
        
        if (currentIndex > 0) {
            this.scrollToSection(`#${sections[currentIndex - 1].id}`);
        } else {
            this.scrollToHome();
        }
    }

    setupSmoothScroll() {
        // Use native smooth scroll if available, otherwise fallback
        if ('scrollBehavior' in document.documentElement.style) {
            // Native smooth scroll is supported
            return;
        }
        
        // Fallback for older browsers
        this.enableSmoothScrollFallback();
    }

    enableSmoothScrollFallback() {
        // Simple smooth scroll fallback
        const originalScrollTo = window.scrollTo;
        window.scrollTo = function(options) {
            if (typeof options === 'object' && options.behavior === 'smooth') {
                const start = window.pageYOffset;
                const end = options.top || 0;
                const duration = 1000;
                const startTime = performance.now();
                
                function scrollStep(timestamp) {
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = progress < 0.5 ? 
                        2 * progress * progress : 
                        -1 + (4 - 2 * progress) * progress;
                    
                    window.scrollTo(0, start + (end - start) * ease);
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(scrollStep);
                    }
                }
                
                window.requestAnimationFrame(scrollStep);
            } else {
                originalScrollTo.call(window, options);
            }
        };
    }

    setupProgressBar() {
        // Progress bar is handled in handleScroll
    }

    setupModal() {
        const tosBtn = document.getElementById('tosBtn');
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('tosModal');

        if (tosBtn && modal && closeModal) {
            tosBtn.addEventListener('click', () => {
                this.openModal();
            });

            closeModal.addEventListener('click', () => {
                this.closeModal();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    openModal() {
        const modal = document.getElementById('tosModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('tosModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    initializeSections() {
        // Initialize each section module
        if (typeof HomeSection !== 'undefined') {
            new HomeSection();
        }
        if (typeof AboutSection !== 'undefined') {
            new AboutSection();
        }
        if (typeof ServicesSection !== 'undefined') {
            new ServicesSection();
        }
        if (typeof PortfolioSection !== 'undefined') {
            new PortfolioSection();
        }
        if (typeof ReviewsSection !== 'undefined') {
            new ReviewsSection();
        }
        if (typeof ContactSection !== 'undefined') {
            new ContactSection();
        }
    }

    setCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    formatSectionName(sectionId) {
        const names = {
            'home': 'Home',
            'about': 'About',
            'services': 'Services',
            'portfolio': 'Portfolio',
            'reviews': 'Reviews',
            'contact': 'Contact'
        };
        return names[sectionId] || sectionId;
    }

    handleReducedMotion() {
        // Check if user prefers reduced motion
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01s');
            document.documentElement.style.setProperty('--transition-normal', '0.01s');
            document.documentElement.style.setProperty('--transition-slow', '0.01s');
        }
        
        // Listen for changes
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.style.setProperty('--transition-fast', '0.01s');
                document.documentElement.style.setProperty('--transition-normal', '0.01s');
                document.documentElement.style.setProperty('--transition-slow', '0.01s');
            } else {
                document.documentElement.style.setProperty('--transition-fast', '0.2s');
                document.documentElement.style.setProperty('--transition-normal', '0.3s');
                document.documentElement.style.setProperty('--transition-slow', '0.5s');
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ANDZApp();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ANDZApp;
}
