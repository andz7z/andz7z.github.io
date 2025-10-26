// Services Section - Final Optimized Version
class ServicesSection {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 3;
        this.isAnimating = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollProgress = 0;
        this.autoAdvanceInterval = null;
        
        this.init();
    }

    init() {
        this.checkFonts();
        this.createParticles();
        this.initSlider();
        this.initScrollAnimations();
        this.initMouseEffects();
        this.initMagneticButtons();
        this.initServiceAnimations();
        this.optimizePerformance();
        
        console.log('🚀 Services Section initialized successfully!');
    }

    checkFonts() {
        // Add font loading states
        document.documentElement.classList.add('font-loading');
        
        // Simulate font loading (in real project, use FontFaceObserver)
        setTimeout(() => {
            document.documentElement.classList.remove('font-loading');
            document.documentElement.classList.add('font-loaded');
        }, 100);
    }

    createParticles() {
        const container = document.querySelector('.particles-container');
        if (!container) return;
        
        const particleCount = 30; // Reduced for performance
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            const type = Math.random() > 0.8 ? 'spark' : 'normal';
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${type === 'spark' ? 
                    'radial-gradient(circle, #ffffff, transparent)' : 
                    'rgba(255, 255, 255, 0.2)'};
                border-radius: ${type === 'spark' ? '0' : '50%'};
                left: ${posX}%;
                top: ${posY}%;
                animation: floatParticle ${duration}s ease-in-out infinite;
                animation-delay: ${delay}s;
                pointer-events: none;
                filter: ${type === 'spark' ? 'blur(0.5px)' : 'none'};
                opacity: 0;
            `;
            
            container.appendChild(particle);
            
            // Stagger appearance
            setTimeout(() => {
                particle.style.opacity = '1';
            }, delay * 1000);
        }
    }

    initSlider() {
        this.slides = document.querySelectorAll('.service-slide');
        this.dotsContainer = document.querySelector('.slider-dots');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.progressFill = document.querySelector('.progress-fill');

        if (!this.slides.length || !this.dotsContainer) {
            console.warn('Slider elements not found');
            return;
        }

        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });

        this.dots = document.querySelectorAll('.slider-dots .dot');

        // Navigation events
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.querySelector('.services-section')?.getBoundingClientRect().top < window.innerHeight) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });

        // Touch swipe support
        this.initTouchEvents();

        // Auto-advance
        this.startAutoAdvance();
    }

    initTouchEvents() {
        let startX = 0;
        let startY = 0;
        
        this.sliderTrack = document.querySelector('.slider-track');
        
        this.sliderTrack?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.sliderTrack?.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only consider horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Reset auto-advance
        this.resetAutoAdvance();
        
        const currentSlide = this.slides[this.currentSlide];
        const nextSlide = this.slides[index];
        
        // Hide current slide
        currentSlide.classList.remove('active');
        this.dots[this.currentSlide]?.classList.remove('active');
        
        this.currentSlide = index;
        
        // Prepare next slide
        nextSlide.style.opacity = '0';
        nextSlide.style.transform = index > this.currentSlide ? 'translateX(100px)' : 'translateX(-100px)';
        
        setTimeout(() => {
            nextSlide.classList.add('active');
            this.dots[this.currentSlide]?.classList.add('active');
            
            // Update progress
            if (this.progressFill) {
                this.progressFill.style.transform = `translateX(${this.currentSlide * 100}%)`;
            }
            
            // Animate entrance
            requestAnimationFrame(() => {
                nextSlide.style.opacity = '1';
                nextSlide.style.transform = 'translateX(0)';
                
                // Animate features and buttons
                this.animateSlideContent(nextSlide);
            });
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 800);
        }, 50);
    }

    animateSlideContent(slide) {
        const features = slide.querySelectorAll('.feature');
        const buttons = slide.querySelectorAll('.action-btn');
        
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.classList.add('visible');
            }, index * 100);
        });
        
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.classList.add('visible');
            }, (features.length + index) * 100);
        });
    }

    prevSlide() {
        const newIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(newIndex);
    }

    nextSlide() {
        const newIndex = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.goToSlide(newIndex);
    }

    startAutoAdvance() {
        this.autoAdvanceInterval = setInterval(() => {
            if (!this.isAnimating && this.isSectionInView()) {
                this.nextSlide();
            }
        }, 6000);
    }

    resetAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.startAutoAdvance();
        }
    }

    isSectionInView() {
        const section = document.querySelector('.services-section');
        if (!section) return false;
        
        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
    }

    initScrollAnimations() {
        this.section = document.querySelector('.services-section');
        if (!this.section) return;
        
        const observerOptions = {
            threshold: [0, 0.3, 0.6, 1],
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const ratio = entry.intersectionRatio;
                    this.scrollProgress = ratio;
                    
                    this.animateOnScroll(ratio);
                    
                    if (ratio > 0.5 && !this.section.classList.contains('active')) {
                        this.section.classList.add('active');
                        this.animateTitle();
                    }
                }
            });
        }, observerOptions);

        this.observer.observe(this.section);
    }

    animateOnScroll(progress) {
        // Smooth parallax effects
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            const y = progress * 50 * speed;
            shape.style.transform = `translateY(${y}px) rotate(${progress * 180}deg)`;
        });
    }

    animateTitle() {
        const titleLines = document.querySelectorAll('.title-line');
        const underline = document.querySelector('.underline-progress');
        const subtitle = document.querySelector('.section-subtitle');
        
        titleLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'titleReveal 1s ease forwards';
            }, index * 300);
        });
        
        setTimeout(() => {
            if (underline) underline.style.animation = 'underlineFlow 2s ease-in-out infinite';
        }, 1000);
        
        setTimeout(() => {
            if (subtitle) subtitle.style.animation = 'fadeInUp 1s ease forwards';
        }, 1500);
    }

    initMouseEffects() {
        // Only init on non-touch devices
        if ('ontouchstart' in window) return;
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateMouseEffects();
        });

        this.createMouseTrail();
    }

    updateMouseEffects() {
        // Magnetic buttons
        const buttons = document.querySelectorAll('.action-btn, .nav-btn');
        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = this.mouseX - centerX;
            const distanceY = this.mouseY - centerY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                const moveX = distanceX * force * 0.05;
                const moveY = distanceY * force * 0.05;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
    }

    createMouseTrail() {
        const trail = document.createElement
