class ServicesSection {
    constructor() {
        this.currentCategory = 'web-dev';
        this.categories = ['web-dev', 'programming', 'video-editing'];
        this.panels = document.querySelectorAll('.service-panel');
        this.buttons = document.querySelectorAll('.category-btn');
        this.prevArrow = document.querySelector('.prev-arrow');
        this.nextArrow = document.querySelector('.next-arrow');
        this.autoSlideInterval = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startAutoSlide();
        this.initScrollAnimations();
        this.initTextSplitting();
        this.createParticles();
    }

    bindEvents() {
        // Category buttons
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.switchCategory(category);
            });
        });

        // Navigation arrows
        this.prevArrow.addEventListener('click', () => this.previousCategory());
        this.nextArrow.addEventListener('click', () => this.nextCategory());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousCategory();
            if (e.key === 'ArrowRight') this.nextCategory();
        });

        // Touch swipe
        this.initTouchEvents();

        // Pause auto-slide on interaction
        const interactiveElements = document.querySelectorAll('.category-btn, .nav-arrow');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.pauseAutoSlide());
            el.addEventListener('mouseleave', () => this.resumeAutoSlide());
        });
    }

    initTouchEvents() {
        let startX = 0;
        let startY = 0;

        document.querySelector('.services-content').addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.querySelector('.services-content').addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only consider horizontal swipes with minimal vertical movement
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextCategory();
                } else {
                    this.previousCategory();
                }
            }

            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    switchCategory(category) {
        if (this.currentCategory === category) return;

        // Update buttons
        this.buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Update panels with transition
        this.panels.forEach(panel => {
            if (panel.dataset.category === category) {
                panel.classList.add('active');
                this.animatePanelIn(panel);
            } else if (panel.classList.contains('active')) {
                this.animatePanelOut(panel).then(() => {
                    panel.classList.remove('active');
                });
            }
        });

        this.currentCategory = category;
        this.resetAutoSlide();
    }

    animatePanelIn(panel) {
        return new Promise(resolve => {
            panel.style.transform = 'translateY(50px) scale(0.95)';
            panel.style.opacity = '0';
            
            requestAnimationFrame(() => {
                panel.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                panel.style.transform = 'translateY(0) scale(1)';
                panel.style.opacity = '1';
                
                setTimeout(resolve, 800);
            });
        });
    }

    animatePanelOut(panel) {
        return new Promise(resolve => {
            panel.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            panel.style.transform = 'translateY(-50px) scale(0.95)';
            panel.style.opacity = '0';
            
            setTimeout(resolve, 600);
        });
    }

    nextCategory() {
        const currentIndex = this.categories.indexOf(this.currentCategory);
        const nextIndex = (currentIndex + 1) % this.categories.length;
        this.switchCategory(this.categories[nextIndex]);
    }

    previousCategory() {
        const currentIndex = this.categories.indexOf(this.currentCategory);
        const prevIndex = (currentIndex - 1 + this.categories.length) % this.categories.length;
        this.switchCategory(this.categories[prevIndex]);
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextCategory();
        }, 8000);
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

    resetAutoSlide() {
        this.pauseAutoSlide();
        this.resumeAutoSlide();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Animate feature cards with delays
                    const cards = entry.target.querySelectorAll('.feature-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animated');
                        }, index * 200);
                    });
                }
            });
        }, observerOptions);

        observer.observe(document.querySelector('.services-section'));
    }

    initTextSplitting() {
        const title = document.querySelector('.section-title');
        if (title) {
            const text = title.textContent;
            title.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.1}s`;
                title.appendChild(span);
            });
        }
    }

    createParticles() {
        const particlesContainer = document.querySelector('.bg-particles');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255,255,255,${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                top: ${posY}%;
                left: ${posX}%;
                animation: particleFloat ${duration}s infinite ${delay}s;
            `;
            
            particlesContainer.appendChild(particle);
        }

        // Add particle float animation
        if (!document.querySelector('#particle-animations')) {
            const style = document.createElement('style');
            style.id = 'particle-animations';
            style.textContent = `
                @keyframes particleFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                    25% { transform: translate(100px, -50px) scale(1.2); opacity: 0.8; }
                    50% { transform: translate(50px, -100px) scale(0.8); opacity: 0.3; }
                    75% { transform: translate(-50px, -50px) scale(1.1); opacity: 0.7; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    destroy() {
        this.pauseAutoSlide();
        // Clean up event listeners
        this.buttons.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
    }
}

// Initialize with performance check
document.addEventListener('DOMContentLoaded', () => {
    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            new ServicesSection();
        });
    } else {
        // Fallback
        setTimeout(() => {
            new ServicesSection();
        }, 500);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServicesSection;
}
