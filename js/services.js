class ServicesSection {
    constructor() {
        this.currentSlide = 0;
        this.categories = document.querySelectorAll('.service-category');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.autoSlideInterval = null;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startAutoSlide();
        this.optimizeAnimations();
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Dot indicators
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch swipe with throttling
        this.initTouchEvents();

        // Pause auto-slide on hover
        const container = document.querySelector('.services-container');
        container.addEventListener('mouseenter', () => this.pauseAutoSlide());
        container.addEventListener('mouseleave', () => this.resumeAutoSlide());
    }

    initTouchEvents() {
        let startX = 0;
        let isSwiping = false;

        document.querySelector('.services-container').addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
        }, { passive: true });

        document.querySelector('.services-container').addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            e.preventDefault();
        }, { passive: false });

        document.querySelector('.services-container').addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const minSwipeDistance = 50;

            if (Math.abs(diff) > minSwipeDistance) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isSwiping = false;
        }, { passive: true });
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        const prevSlide = this.currentSlide === 0 ? this.categories.length - 1 : this.currentSlide - 1;
        this.switchSlide(prevSlide, 'prev');
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        const nextSlide = this.currentSlide === this.categories.length - 1 ? 0 : this.currentSlide + 1;
        this.switchSlide(nextSlide, 'next');
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        const direction = index > this.currentSlide ? 'next' : 'prev';
        this.switchSlide(index, direction);
    }

    switchSlide(targetIndex, direction) {
        this.isAnimating = true;

        // Update active states
        this.categories[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        this.categories[targetIndex].classList.add('active');
        this.dots[targetIndex].classList.add('active');

        this.currentSlide = targetIndex;

        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    resumeAutoSlide() {
        if (!this.autoSlideInterval) {
            this.startAutoSlide();
        }
    }

    optimizeAnimations() {
        // Use will-change for better performance
        this.categories.forEach(category => {
            category.style.willChange = 'transform, opacity';
        });
        
        // Clean up will-change after animations
        setTimeout(() => {
            this.categories.forEach(category => {
                category.style.willChange = 'auto';
            });
        }, 1000);
    }

    // Cleanup
    destroy() {
        this.pauseAutoSlide();
        this.prevBtn.removeEventListener('click', this.prevSlide);
        this.nextBtn.removeEventListener('click', this.nextSlide);
    }
}

// Initialize with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ServicesSection();
    } catch (error) {
        console.warn('Services section initialization failed:', error);
    }
});
