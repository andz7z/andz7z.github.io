class ServicesSection {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.service-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.slider = document.querySelector('.services-slider');
        this.autoSlideInterval = null;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startAutoSlide();
        this.initScrollAnimations();
        this.initIntersectionObserver();
        this.addMouseEffects();
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

        // Touch swipe support
        this.initTouchEvents();

        // Pause auto-slide on hover
        this.slider.addEventListener('mouseenter', () => this.pauseAutoSlide());
        this.slider.addEventListener('mouseleave', () => this.resumeAutoSlide());
    }

    initTouchEvents() {
        let startX = 0;
        let endX = 0;

        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.slider.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        this.slider.addEventListener('touchend', () => {
            const diff = startX - endX;
            const minSwipeDistance = 50;

            if (Math.abs(diff) > minSwipeDistance) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const prevSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.animateTransition(prevSlide, 'prev');
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const nextSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
        this.animateTransition(nextSlide, 'next');
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        const direction = index > this.currentSlide ? 'next' : 'prev';
        this.animateTransition(index, direction);
    }

    animateTransition(targetSlide, direction) {
        // Add transition class for smooth animation
        this.slides.forEach(slide => {
            slide.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Add active class to target slide
        this.slides[targetSlide].classList.add('active');
        this.dots[targetSlide].classList.add('active');

        // Add direction-based animations
        this.slides.forEach((slide, index) => {
            if (index === targetSlide) {
                slide.style.transform = direction === 'next' 
                    ? 'translateX(0) scale(1)' 
                    : 'translateX(0) scale(1)';
            } else if (index === this.currentSlide) {
                slide.style.transform = direction === 'next' 
                    ? 'translateX(-100px) scale(0.9)' 
                    : 'translateX(100px) scale(0.9)';
            }
        });

        // Add particle effect
        this.createParticleEffect(direction);

        // Update current slide
        this.currentSlide = targetSlide;

        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
            this.slides.forEach(slide => {
                slide.style.transition = '';
            });
        }, 800);
    }

    createParticleEffect(direction) {
        const particles = document.createElement('div');
        particles.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.8;
            `;

            const startX = direction === 'next' ? '90%' : '10%';
            const endX = direction === 'next' ? '110%' : '-10%';
            
            particle.style.left = startX;
            particle.style.top = `${Math.random() * 100}%`;
            
            particles.appendChild(particle);

            // Animate particle
            particle.animate([
                { 
                    transform: 'translateX(0) scale(1)',
                    opacity: 0.8 
                },
                { 
                    transform: `translateX(${direction === 'next' ? '20px' : '-20px'}) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                delay: Math.random() * 200
            });

            setTimeout(() => particle.remove(), 600);
        }

        this.slider.appendChild(particles);
        setTimeout(() => particles.remove(), 600);
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
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

    initScrollAnimations() {
        // Parallax effect for background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.services-section');
            const rate = scrolled * -0.5;
            
            if (parallax) {
                parallax.style.transform = `translateY(${rate}px)`;
            }
        });

        // Stagger animation for feature cards on slide change
        this.observeFeatureCards();
    }

    observeFeatureCards() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const featureCards = entry.target.querySelectorAll('.feature-card');
                    featureCards.forEach((card, index) => {
                        card.style.animationDelay = `${index * 0.2}s`;
                    });
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this.slider);
    }

    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    
                    // Add floating animation to 3D icons
                    const icons = entry.target.querySelectorAll('.icon-3d');
                    icons.forEach(icon => {
                        this.addFloatingAnimation(icon);
                    });
                }
            });
        }, { threshold: 0.1 });

        observer.observe(this.slider);
    }

    addFloatingAnimation(element) {
        element.style.animation = 'float 6s ease-in-out infinite';
        
        // Add keyframes if not already added
        if (!document.querySelector('#float-animation')) {
            const style = document.createElement('style');
            style.id = 'float-animation';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: rotateY(0deg) rotateX(10deg) translateY(0px); }
                    50% { transform: rotateY(180deg) rotateX(10deg) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addMouseEffects() {
        // Magnetic effect for navigation buttons
        this.addMagneticEffect(this.prevBtn);
        this.addMagneticEffect(this.nextBtn);

        // Hover effect for dots
        this.dots.forEach(dot => {
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'scale(1.4)';
                dot.style.background = 'rgba(255, 255, 255, 0.6)';
            });

            dot.addEventListener('mouseleave', () => {
                if (!dot.classList.contains('active')) {
                    dot.style.transform = 'scale(1)';
                    dot.style.background = 'rgba(255, 255, 255, 0.3)';
                }
            });
        });

        // Gradient follow effect
        this.slider.addEventListener('mousemove', (e) => {
            const rect = this.slider.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            this.slider.style.background = `
                radial-gradient(circle at ${x}% ${y}%, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    transparent 50%),
                rgba(255, 255, 255, 0.05)
            `;
        });

        this.slider.addEventListener('mouseleave', () => {
            this.slider.style.background = 'rgba(255, 255, 255, 0.05)';
        });
    }

    addMagneticEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
        });
    }

    // Method to manually trigger slide change from other components
    triggerSlideChange(slideIndex) {
        this.goToSlide(slideIndex);
    }

    // Cleanup method
    destroy() {
        this.pauseAutoSlide();
        this.prevBtn.removeEventListener('click', this.prevSlide);
        this.nextBtn.removeEventListener('click', this.nextSlide);
        
        this.dots.forEach(dot => {
            dot.removeEventListener('click', this.goToSlide);
        });

        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// Additional utility functions
class ServicesUtils {
    static preloadFonts() {
        const font = new FontFace('Noverich', 'url(assets/fonts/noverich.otf)');
        const roboto = new FontFace('Roboto', 'url(assets/fonts/roboto.ttf)');

        Promise.all([font.load(), roboto.load()])
            .then(loadedFonts => {
                loadedFonts.forEach(font => document.fonts.add(font));
                console.log('All fonts loaded successfully');
            })
            .catch(error => {
                console.warn('Font loading failed, using fallback fonts:', error);
            });
    }

    static addLoadingState() {
        const loader = document.createElement('div');
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            font-family: 'Roboto', sans-serif;
        `;
        loader.innerHTML = `
            <div class="loading-spinner">
                <div style="width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 20px;">Loading Services...</p>
            </div>
        `;
        document.body.appendChild(loader);

        // Remove loader when everything is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.5s ease';
                setTimeout(() => loader.remove(), 500);
            }, 1000);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Preload fonts
    ServicesUtils.preloadFonts();
    
    // Add loading state
    ServicesUtils.addLoadingState();

    // Initialize services section
    const servicesSection = new ServicesSection();

    // Make it globally available for other components
    window.servicesSection = servicesSection;

    // Add some console art for fun
    console.log(`
        🚀 Services Section Loaded!
        ► Navigation: Arrow Keys or Click
        ► Auto-slide: Every 5 seconds
        ► Touch: Swipe support
        ► Effects: 3D Icons + Particles
    `);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ServicesSection, ServicesUtils };
}
