class UltimateServices {
    constructor() {
        this.currentService = 'web';
        this.services = ['web', 'code', 'video'];
        this.navCards = document.querySelectorAll('.nav-card');
        this.serviceContents = document.querySelectorAll('.service-content');
        this.controlDots = document.querySelectorAll('.control-dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.autoRotateInterval = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startAutoRotate();
        this.initScrollAnimations();
        this.initParallax();
        this.createFloatingParticles();
    }

    bindEvents() {
        // Navigation cards
        this.navCards.forEach(card => {
            card.addEventListener('click', () => {
                const service = card.dataset.service;
                this.switchService(service);
            });
        });

        // Control dots
        this.controlDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const service = dot.dataset.service;
                this.switchService(service);
            });
        });

        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousService());
        this.nextBtn.addEventListener('click', () => this.nextService());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousService();
            if (e.key === 'ArrowRight') this.nextService();
        });

        // Touch swipe
        this.initTouchEvents();

        // Pause auto-rotate on interaction
        const interactiveElements = document.querySelectorAll('.nav-card, .control-btn, .control-dot');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.pauseAutoRotate());
            el.addEventListener('mouseleave', () => this.resumeAutoRotate());
        });
    }

    initTouchEvents() {
        let startX = 0;
        let startY = 0;

        document.querySelector('.services-display').addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.querySelector('.services-display').addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextService();
                } else {
                    this.previousService();
                }
            }

            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    switchService(service) {
        if (this.currentService === service) return;

        // Update navigation cards
        this.navCards.forEach(card => {
            card.classList.toggle('active', card.dataset.service === service);
        });

        // Update control dots
        this.controlDots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.service === service);
        });

        // Update service content with animation
        this.serviceContents.forEach(content => {
            if (content.dataset.service === service) {
                this.animateContentIn(content);
                content.classList.add('active');
            } else if (content.classList.contains('active')) {
                this.animateContentOut(content).then(() => {
                    content.classList.remove('active');
                });
            }
        });

        this.currentService = service;
        this.resetAutoRotate();
    }

    animateContentIn(content) {
        return new Promise(resolve => {
            content.style.transform = 'translateY(50px)';
            content.style.opacity = '0';
            
            requestAnimationFrame(() => {
                content.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                content.style.transform = 'translateY(0)';
                content.style.opacity = '1';
                
                // Animate features with delay
                const features = content.querySelectorAll('.feature');
                features.forEach((feature, index) => {
                    setTimeout(() => {
                        feature.style.opacity = '1';
                        feature.style.transform = 'translateX(0)';
                    }, index * 200 + 300);
                });
                
                setTimeout(resolve, 800);
            });
        });
    }

    animateContentOut(content) {
        return new Promise(resolve => {
            content.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            content.style.transform = 'translateY(-50px)';
            content.style.opacity = '0';
            
            // Reset features
            const features = content.querySelectorAll('.feature');
            features.forEach(feature => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateX(-20px)';
            });
            
            setTimeout(resolve, 600);
        });
    }

    nextService() {
        const currentIndex = this.services.indexOf(this.currentService);
        const nextIndex = (currentIndex + 1) % this.services.length;
        this.switchService(this.services[nextIndex]);
    }

    previousService() {
        const currentIndex = this.services.indexOf(this.currentService);
        const prevIndex = (currentIndex - 1 + this.services.length) % this.services.length;
        this.switchService(this.services[prevIndex]);
    }

    startAutoRotate() {
        this.autoRotateInterval = setInterval(() => {
            this.nextService();
        }, 7000);
    }

    pauseAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    resumeAutoRotate() {
        if (!this.autoRotateInterval) {
            this.startAutoRotate();
        }
    }

    resetAutoRotate() {
        this.pauseAutoRotate();
        this.resumeAutoRotate();
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Animate navigation cards
                    const cards = document.querySelectorAll('.nav-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.3 });

        observer.observe(document.querySelector('.services-section'));
    }

    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.float-element');
            
            parallaxElements.forEach((el, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    createFloatingParticles() {
        const container = document.querySelector('.floating-elements');
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'float-element particle';
            
            const size = Math.random() * 8 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: rgba(255,255,255,${Math.random() * 0.3 + 0.1});
                top: ${posY}%;
                left: ${posX}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;
            
            container.appendChild(particle);
        }
    }

    destroy() {
        this.pauseAutoRotate();
    }
}

// Initialize with enhanced performance
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical animations
    const style = document.createElement('style');
    style.textContent = `
        .services-section * {
            transform-style: preserve-3d;
            backface-visibility: hidden;
        }
    `;
    document.head.appendChild(style);

    // Initialize services
    setTimeout(() => {
        new UltimateServices();
    }, 100);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltimateServices;
}
