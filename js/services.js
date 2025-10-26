// Services Section - Enhanced JavaScript
class ServicesSection {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 3;
        this.isAnimating = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollProgress = 0;
        
        this.init();
    }

    init() {
        this.createParticles();
        this.initSlider();
        this.initScrollAnimations();
        this.initMouseEffects();
        this.initMagneticButtons();
        this.initParallaxEffects();
        this.initServiceAnimations();
        
        // Performance optimization
        this.optimizeAnimations();
    }

    // Create advanced particle system
    createParticles() {
        const container = document.querySelector('.particles-container');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 4 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            const type = Math.random() > 0.7 ? 'spark' : 'normal';
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${type === 'spark' ? 
                    'radial-gradient(circle, #ffffff, transparent)' : 
                    'rgba(255, 255, 255, 0.3)'};
                border-radius: ${type === 'spark' ? '0' : '50%'};
                left: ${posX}%;
                top: ${posY}%;
                animation: floatParticle${type === 'spark' ? 'Spark' : ''} ${duration}s ease-in-out infinite;
                animation-delay: ${delay}s;
                pointer-events: none;
                filter: ${type === 'spark' ? 'blur(1px)' : 'none'};
            `;
            
            container.appendChild(particle);
        }

        // Add particle animations to CSS
        this.addParticleAnimations();
    }

    addParticleAnimations() {
        if (!document.querySelector('#particle-animations')) {
            const style = document.createElement('style');
            style.id = 'particle-animations';
            style.textContent = `
                @keyframes floatParticle {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                        opacity: 0;
                    }
                    10% {
                        opacity: ${Math.random() * 0.5 + 0.2};
                    }
                    50% {
                        transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(180deg) scale(${Math.random() * 0.5 + 0.5});
                    }
                    90% {
                        opacity: ${Math.random() * 0.5 + 0.2};
                    }
                }
                
                @keyframes floatParticleSpark {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(45deg) scale(1.5);
                    }
                    80% {
                        opacity: 0.5;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Advanced slider with 3D effects
    initSlider() {
        this.slides = document.querySelectorAll('.service-slide');
        this.dots = document.querySelector('.slider-dots');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.progressFill = document.querySelector('.progress-fill');

        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dots.appendChild(dot);
        });

        this.dots = document.querySelectorAll('.slider-dots .dot');

        // Navigation events
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Auto-advance
        this.startAutoAdvance();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Update current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        this.currentSlide = index;
        
        // Add entrance animation class
        this.slides[this.currentSlide].style.opacity = '0';
        this.slides[this.currentSlide].style.transform = 'translateX(100px) scale(0.95)';
        
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
            
            // Update progress
            this.progressFill.style.transform = `translateX(${this.currentSlide * 100}%)`;
            
            // Animate entrance
            requestAnimationFrame(() => {
                this.slides[this.currentSlide].style.opacity = '1';
                this.slides[this.currentSlide].style.transform = 'translateX(0) scale(1)';
                
                // Start service-specific animations
                this.startServiceAnimations(this.currentSlide);
            });
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 800);
        }, 50);
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
        setInterval(() => {
            if (!this.isAnimating && document.querySelector('.services-section').getBoundingClientRect().top < window.innerHeight * 0.8) {
                this.nextSlide();
            }
        }, 5000);
    }

    // Scroll animations with parallax
    initScrollAnimations() {
        this.section = document.querySelector('.services-section');
        
        const observerOptions = {
            threshold: [0, 0.2, 0.5, 0.8, 1],
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const ratio = entry.intersectionRatio;
                    this.scrollProgress = ratio;
                    
                    // Animate elements based on scroll progress
                    this.animateOnScroll(ratio);
                    
                    if (ratio > 0.5 && !this.section.classList.contains('active')) {
                        this.section.classList.add('active');
                        this.animateTitle();
                    }
                }
            });
        }, observerOptions);

        this.observer.observe(this.section);

        // Scroll progress for individual elements
        this.initElementScrollAnimations();
    }

    animateOnScroll(progress) {
        // Parallax background elements
        const shapes = document.querySelectorAll('.shape');
        const grid = document.querySelector('.animated-grid');
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const y = progress * 100 * speed;
            shape.style.transform = `translateY(${y}px) rotate(${progress * 360}deg)`;
        });
        
        if (grid) {
            grid.style.transform = `translate(${progress * 50}px, ${progress * 50}px)`;
        }
        
        // Magnetic field intensity
        const magneticField = document.querySelector('.magnetic-field');
        if (magneticField) {
            const intensity = progress * 0.05;
            magneticField.style.boxShadow = `0 0 ${200 + progress * 100}px ${100 + progress * 50}px rgba(255, 255, 255, ${0.02 + intensity})`;
        }
    }

    initElementScrollAnimations() {
        const elements = document.querySelectorAll('.service-features .feature, .service-actions .action-btn');
        
        elements.forEach((element, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, index * 100);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    // Mouse effects and interactions
    initMouseEffects() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            this.updateMouseEffects();
        });

        // Mouse trail effect
        this.createMouseTrail();
    }

    updateMouseEffects() {
        // Magnetic cursor effect on buttons
        const buttons = document.querySelectorAll('.action-btn, .nav-btn');
        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = this.mouseX - centerX;
            const distanceY = this.mouseY - centerY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                const moveX = distanceX * force * 0.1;
                const moveY = distanceY * force * 0.1;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                button.style.transform = 'translate(0, 0)';
            }
        });

        // Background elements follow mouse
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.0002;
            const moveX = (this.mouseX - window.innerWidth / 2) * speed;
            const moveY = (this.mouseY - window.innerHeight / 2) * speed;
            
            shape.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        });
    }

    createMouseTrail() {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        document.body.appendChild(trail);

        let trailElements = [];
        const trailLength = 5;

        // Create trail elements
        for (let i = 0; i < trailLength; i++) {
            const element = document.createElement('div');
            element.className = 'trail-dot';
            element.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: rgba(255, 255, 255, ${0.3 - i * 0.05});
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                transition: transform 0.1s ease;
            `;
            trail.appendChild(element);
            trailElements.push(element);
        }

        let mousePositions = [];
        
        document.addEventListener('mousemove', (e) => {
            mousePositions.unshift({x: e.clientX, y: e.clientY});
            
            if (mousePositions.length > trailLength) {
                mousePositions = mousePositions.slice(0, trailLength);
            }
            
            trailElements.forEach((dot, index) => {
                if (mousePositions[index]) {
                    dot.style.transform = `translate(${mousePositions[index].x - 3}px, ${mousePositions[index].y - 3}px)`;
                    dot.style.opacity = (1 - index / trailLength).toString();
                }
            });
        });
    }

    // Advanced magnetic buttons
    initMagneticButtons() {
        const buttons = document.querySelectorAll('.action-btn.primary');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.createRippleEffect(button);
                button.style.transform = 'scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
            
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.createClickWave(e, button);
            });
        });
    }

    createRippleEffect(button) {
        const ripple = document.createElement('div');
        ripple.className = 'button-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: rippleExpand 0.6s ease-out;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createClickWave(event, element) {
        const wave = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        wave.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
            border-radius: 50%;
            top: ${y - 50}px;
            left: ${x - 50}px;
            animation: waveExpand 0.8s ease-out;
            pointer-events: none;
        `;
        
        element.appendChild(wave);
        
        setTimeout(() => {
            wave.remove();
        }, 800);
    }

    // Parallax effects
    initParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            const bgElements = document.querySelector('.bg-elements');
            if (bgElements) {
                bgElements.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Service-specific animations
    initServiceAnimations() {
        this.startServiceAnimations(0);
    }

    startServiceAnimations(slideIndex) {
        const slide = this.slides[slideIndex];
        
        switch(slideIndex) {
            case 0: // Web Development
                this.animateCodeWindow();
                break;
            case 1: // Programming
                this.animateAlgorithm();
                break;
            case 2: // Video Editing
                this.animateTimeline();
                break;
        }
    }

    animateCodeWindow() {
        const codeLines = document.querySelectorAll('.code-line.animated');
        codeLines.forEach((line, index) => {
            line.style.animation = `codeTyping 2s ease-in-out ${index * 0.5}s infinite`;
        });
    }

    animateAlgorithm() {
        const nodes = document.querySelectorAll('.algo-node');
        nodes.forEach((node, index) => {
            node.style.animation = `nodePulse 3s ease-in-out ${index}s infinite`;
        });
    }

    animateTimeline() {
        const clips = document.querySelectorAll('.timeline-clip');
        const playhead = document.querySelector('.playhead');
        
        clips.forEach((clip, index) => {
            clip.style.animation = `timelinePlay 4s ease-in-out ${index}s infinite`;
        });
        
        if (playhead) {
            playhead.style.animation = 'playheadMove 4s linear infinite';
        }
    }

    // Title animation sequence
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

    // Performance optimization
    optimizeAnimations() {
        // Use will-change for better performance
        const animatedElements = document.querySelectorAll('.service-slide, .shape, .particle');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });

        // Throttle scroll events
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateScrollEffects() {
        // Update any scroll-based effects here
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ServicesSection();
});

// Add CSS animations
if (!document.querySelector('#services-animations')) {
    const style = document.createElement('style');
    style.id = 'services-animations';
    style.textContent = `
        @keyframes rippleExpand {
            0% {
                width: 0;
                height: 0;
                opacity: 1;
            }
            100% {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
        
        @keyframes waveExpand {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(3);
                opacity: 0;
            }
        }
        
        .service-features .feature,
        .service-actions .action-btn {
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        
        .services-section.active .service-features .feature,
        .services-section.active .service-actions .action-btn {
            opacity: 1;
            transform: translateX(0);
        }
    `;
    document.head.appendChild(style);
}

// Export for global access
window.ServicesSection = ServicesSection;
