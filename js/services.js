class UltimateServicesPro {
    constructor() {
        this.currentService = 'web';
        this.services = ['web', 'code', 'video'];
        this.navItems = document.querySelectorAll('.nav-item');
        this.serviceContents = document.querySelectorAll('.service-content');
        this.controlDots = document.querySelectorAll('.control-dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.progressText = document.querySelector('.progress-text');
        this.progressFill = document.querySelector('.progress-fill');
        this.statNumbers = document.querySelectorAll('.stat-number');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startAutoRotate();
        this.initAnimations();
        this.createFloatingShapes();
        this.animateStats();
    }

    bindEvents() {
        // Navigation items
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const service = item.dataset.service;
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
        const interactiveElements = document.querySelectorAll('.nav-item, .control-btn, .control-dot');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.pauseAutoRotate());
            el.addEventListener('mouseleave', () => this.resumeAutoRotate());
            el.addEventListener('touchstart', () => this.pauseAutoRotate());
        });
    }

    initTouchEvents() {
        let startX = 0;
        let startY = 0;

        document.querySelector('.service-content-area').addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.querySelector('.service-content-area').addEventListener('touchend', (e) => {
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

        // Update navigation items
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.service === service);
        });

        // Update control dots
        this.controlDots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.service === service);
        });

        // Update service content with enhanced animation
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

        // Update progress
        this.updateProgress(service);

        this.currentService = service;
        this.resetAutoRotate();
    }

    animateContentIn(content) {
        return new Promise(resolve => {
            content.style.transform = 'translateY(30px)';
            content.style.opacity = '0';
            
            requestAnimationFrame(() => {
                content.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                content.style.transform = 'translateY(0)';
                content.style.opacity = '1';
                
                // Animate features with staggered delay
                const features = content.querySelectorAll('.feature-card');
                features.forEach((feature, index) => {
                    setTimeout(() => {
                        feature.style.opacity = '1';
                        feature.style.transform = 'translateX(0)';
                    }, index * 200 + 300);
                });

                // Animate tech items
                const techItems = content.querySelectorAll('.tech-item');
                techItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 150 + 500);
                });

                // Animate advantage cards
                const advantageCards = content.querySelectorAll('.advantage-card');
                advantageCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100 + 700);
                });
                
                setTimeout(resolve, 800);
            });
        });
    }

    animateContentOut(content) {
        return new Promise(resolve => {
            content.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            content.style.transform = 'translateY(-30px)';
            content.style.opacity = '0';
            
            // Reset all animations
            const animatedElements = content.querySelectorAll('.feature-card, .tech-item, .advantage-card');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
            });
            
            setTimeout(resolve, 400);
        });
    }

    updateProgress(service) {
        const currentIndex = this.services.indexOf(service) + 1;
        const total = this.services.length;
        const progress = (currentIndex / total) * 100;
        
        this.progressText.textContent = `Service ${currentIndex} of ${total}`;
        this.progressFill.style.width = `${progress}%`;
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
        }, 8000);
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

    initAnimations() {
        // Initialize all elements with starting state
        this.serviceContents.forEach(content => {
            const animatedElements = content.querySelectorAll('.feature-card, .tech-item, .advantage-card');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
            });
        });

        // Animate initial active content
        const activeContent = document.querySelector('.service-content.active');
        if (activeContent) {
            this.animateContentIn(activeContent);
        }
    }

    createFloatingShapes() {
        const container = document.querySelector('.floating-shapes');
        const shapeCount = 12;

        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = 'float-element';
            
            const size = Math.random() * 20 + 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            shape.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: rgba(255,255,255,${Math.random() * 0.2 + 0.05});
                top: ${posY}%;
                left: ${posX}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            `;
            
            container.appendChild(shape);
        }
    }

    animateStats() {
        this.statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }

    destroy() {
        this.pauseAutoRotate();
    }
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical resources
    const preloadStyles = document.createElement('style');
    preloadStyles.textContent = `
        .services-section * {
            transform-style: preserve-3d;
            backface-visibility: hidden;
        }
        
        .nav-item,
        .feature-card,
        .advantage-card {
            will-change: transform, opacity;
        }
    `;
    document.head.appendChild(preloadStyles);

    // Initialize after a brief delay for better performance
    setTimeout(() => {
        new UltimateServicesPro();
    }, 100);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltimateServicesPro;
}
