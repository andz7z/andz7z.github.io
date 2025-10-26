// Services Section Premium JavaScript
class PremiumServices {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.categories = [];
        this.autoSlideInterval = null;
        this.slideDuration = 8000; // 8 secunde pentru conținutul mai detaliat
        this.isAnimating = false;
        this.animationDelay = 100; // Delay pentru animații succesive
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.startAutoSlide();
        this.initScrollAnimations();
        this.animateOnLoad();
        
        console.log('Premium Services initialized 🚀');
    }

    cacheElements() {
        // Elemente principale
        this.servicesSection = document.querySelector('.services-section');
        this.slides = Array.from(document.querySelectorAll('.service-slide'));
        this.categories = Array.from(document.querySelectorAll('.category'));
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.serviceCards = Array.from(document.querySelectorAll('.service-card'));
        this.featureCards = Array.from(document.querySelectorAll('.feature-card'));
        this.statItems = Array.from(document.querySelectorAll('.stat-item'));
    }

    setupEventListeners() {
        // Navigare prin categorii
        this.categories.forEach((category, index) => {
            category.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.navigateToSlide(index);
                }
            });
            
            // Efecte de hover avansate
            category.addEventListener('mouseenter', () => this.handleCategoryHover(category));
            category.addEventListener('mouseleave', () => this.handleCategoryLeave(category));
        });

        // Butoane prev/next
        this.prevBtn.addEventListener('click', () => {
            if (!this.isAnimating) this.showPrevSlide();
        });
        this.nextBtn.addEventListener('click', () => {
            if (!this.isAnimating) this.showNextSlide();
        });

        // Navigare prin tastatură
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

        // Control auto-slide la hover
        this.servicesSection.addEventListener('mouseenter', () => this.pauseAutoSlide());
        this.servicesSection.addEventListener('mouseleave', () => this.startAutoSlide());

        // Touch events pentru mobile
        this.setupTouchEvents();

        // Scroll animations
        this.setupScrollAnimations();

        // Resize optimization
        this.setupResizeHandler();
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        this.servicesSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });

        this.servicesSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
        });
    }

    handleSwipe(startX, endX, startY, endY) {
        const swipeThreshold = 50;
        const verticalThreshold = 30;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Ignoră swipe-urile verticale
        if (Math.abs(diffY) > verticalThreshold) return;

        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0 && !this.isAnimating) {
                this.showNextSlide();
            } else if (diffX < 0 && !this.isAnimating) {
                this.showPrevSlide();
            }
        }
    }

    handleKeyboardNavigation(e) {
        if (e.key === 'ArrowLeft' && !this.isAnimating) {
            this.showPrevSlide();
        } else if (e.key === 'ArrowRight' && !this.isAnimating) {
            this.showNextSlide();
        } else if (e.key === 'Escape') {
            this.pauseAutoSlide();
        }
    }

    navigateToSlide(slideIndex) {
        if (slideIndex === this.currentSlide || this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentSlide = slideIndex;
        
        this.animateSlideTransition();
        this.resetAutoSlide();
        
        // Trigger custom event pentru analytics sau alte funcționalități
        this.dispatchServiceChangeEvent();
    }

    showPrevSlide() {
        const newIndex = this.currentSlide > 0 ? this.currentSlide - 1 : this.slides.length - 1;
        this.navigateToSlide(newIndex);
    }

    showNextSlide() {
        const newIndex = this.currentSlide < this.slides.length - 1 ? this.currentSlide + 1 : 0;
        this.navigateToSlide(newIndex);
    }

    animateSlideTransition() {
        // Dezactivează slide-ul curent
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.categories.forEach(category => category.classList.remove('active'));
        
        // Adaugă clase pentru animația de ieșire
        const currentActiveSlide = this.slides[this.currentSlide];
        currentActiveSlide.style.opacity = '0';
        currentActiveSlide.style.transform = 'translateX(100px)';
        
        // Activează noul slide cu delay
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
            this.categories[this.currentSlide].classList.add('active');
            
            // Animație de intrare
            this.slides[this.currentSlide].style.opacity = '1';
            this.slides[this.currentSlide].style.transform = 'translateX(0)';
            
            // Animează elementele interne
            this.animateSlideContent();
            
            this.isAnimating = false;
        }, 300);
    }

    animateSlideContent() {
        const currentSlide = this.slides[this.currentSlide];
        const featureCards = currentSlide.querySelectorAll('.feature-card');
        const tableRows = currentSlide.querySelectorAll('.table-row');
        
        // Reset animații
        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        });
        
        tableRows.forEach(row => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-30px)';
        });
        
        // Animație feature cards
        featureCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, index * 150);
        });
        
        // Animație table rows
        tableRows.forEach((row, index) => {
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
                row.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, (featureCards.length * 150) + (index * 100));
        });
    }

    handleCategoryHover(category) {
        if (!category.classList.contains('active')) {
            category.style.transform = 'translateY(-2px) scale(1.02)';
            category.style.background = 'rgba(255, 255, 255, 0.08)';
        }
    }

    handleCategoryLeave(category) {
        if (!category.classList.contains('active')) {
            category.style.transform = 'translateY(0) scale(1)';
            category.style.background = 'transparent';
        }
    }

    // Auto-slide functionality
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            if (!this.isAnimating) {
                this.showNextSlide();
            }
        }, this.slideDuration);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    resetAutoSlide() {
        this.pauseAutoSlide();
        this.startAutoSlide();
    }

    // Scroll animations
    initScrollAnimations() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleScrollAnimation(entry.target);
                }
            });
        }, this.observerOptions);

        // Observează elementele importante
        this.serviceCards.forEach(card => this.scrollObserver.observe(card));
        this.statItems.forEach(stat => this.scrollObserver.observe(stat));
    }

    setupScrollAnimations() {
        // Adaugă event listener pentru scroll smooth
        window.addEventListener('scroll', () => {
            this.handleParallaxEffect();
        }, { passive: true });
    }

    handleScrollAnimation(element) {
        if (element.classList.contains('service-card')) {
            element.classList.add('in-view');
            this.animateCardElements(element);
        } else if (element.classList.contains('stat-item')) {
            this.animateStatItem(element);
        }
    }

    animateCardElements(card) {
        const features = card.querySelectorAll('.feature-card');
        const tableRows = card.querySelectorAll('.table-row');
        
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        tableRows.forEach((row, index) => {
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, (features.length * 200) + (index * 150));
        });
    }

    animateStatItem(stat) {
        const number = stat.querySelector('.stat-number');
        const originalNumber = number.textContent;
        
        // Animație de counting
        if (originalNumber.includes('+') || originalNumber.includes('%') || originalNumber.includes('★')) {
            this.animateValue(number, 0, parseInt(originalNumber), 2000);
        }
        
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0)';
    }

    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.textContent.includes('%') ? '%' : 
                                          element.textContent.includes('★') ? '★' : '+');
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    handleParallaxEffect() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const backgroundElements = this.servicesSection.querySelectorAll('.service-card, .stat-item');
        
        backgroundElements.forEach(element => {
            element.style.transform = `translateY(${rate * 0.3}px)`;
        });
    }

    // Animații la încărcare
    animateOnLoad() {
        // Animează elementele stat cu delay
        this.statItems.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, 1000 + (index * 200));
        });
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Recalculează layout-ul dacă este necesar
        const isMobile = window.innerWidth < 768;
        this.servicesSection.classList.toggle('mobile-view', isMobile);
    }

    dispatchServiceChangeEvent() {
        const event = new CustomEvent('premiumServiceChange', {
            detail: {
                service: this.categories[this.currentSlide].dataset.category,
                index: this.currentSlide,
                slideElement: this.slides[this.currentSlide]
            }
        });
        this.servicesSection.dispatchEvent(event);
    }

    // Public methods pentru control extern
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length && !this.isAnimating) {
            this.navigateToSlide(index);
        }
    }

    getCurrentSlide() {
        return {
            index: this.currentSlide,
            service: this.categories[this.currentSlide].dataset.category,
            element: this.slides[this.currentSlide]
        };
    }

    // Cleanup method
    destroy() {
        this.pauseAutoSlide();
        this.scrollObserver.disconnect();
        
        // Remove event listeners
        this.categories.forEach(category => {
            category.removeEventListener('click', this.navigateToSlide);
            category.removeEventListener('mouseenter', this.handleCategoryHover);
            category.removeEventListener('mouseleave', this.handleCategoryLeave);
        });
        
        this.prevBtn.removeEventListener('click', this.showPrevSlide);
        this.nextBtn.removeEventListener('click', this.showNextSlide);
        document.removeEventListener('keydown', this.handleKeyboardNavigation);
        
        console.log('Premium Services destroyed');
    }
}

// Initializare când DOM-ul este gata
document.addEventListener('DOMContentLoaded', function() {
    // Verifică dacă Intersection Observer este suportat
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported - providing fallback');
        provideFallbackAnimations();
        return;
    }

    // Inițializează serviciile premium
    window.premiumServices = new PremiumServices();

    // Performance monitoring
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'measure') {
                    console.log(`Performance: ${entry.name} - ${entry.duration}ms`);
                }
            });
        });
        perfObserver.observe({ entryTypes: ['measure'] });
    }
});

// Fallback pentru browsere vechi
function provideFallbackAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    const statItems = document.querySelectorAll('.stat-item');
    
    serviceCards.forEach(card => card.classList.add('in-view'));
    statItems.forEach(stat => stat.style.opacity = '1');
    
    console.log('Fallback animations applied');
}

// Export pentru utilizare în module (dacă este necesar)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumServices;
}
