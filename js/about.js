// About Section - PERFECTIUNEA ABSOLUTĂ
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 PERFECTIUNEA ABSOLUTĂ Initialized');
    
    initMicroParticles();
    initPortrait3D();
    initSkillBars();
    initScrollProgress();
    initScrollAnimations();
    initHoverEffects();
    initMagneticButtons();
    initParallaxEffects();
    initTypewriterEffect();
    initPageTransitions();
});

// Micro Particles System
function initMicroParticles() {
    const container = document.querySelector('.micro-particles');
    if (!container) return;
    
    for (let i = 0; i < 200; i++) {
        const particle = document.createElement('div');
        particle.className = 'micro-particle';
        
        const tx = (Math.random() - 0.5) * 2;
        const ty = (Math.random() - 0.5) * 2;
        const duration = 12 + Math.random() * 8;
        const delay = Math.random() * 20;
        const size = 0.5 + Math.random() * 1.5;
        
        particle.style.setProperty('--tx', tx);
        particle.style.setProperty('--ty', ty);
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = -delay + 's';
        
        container.appendChild(particle);
    }
}

// 3D Portrait Card
function initPortrait3D() {
    const portraitCard = document.querySelector('.portrait-3d');
    if (!portraitCard) return;
    
    let isFlipped = false;
    let autoFlipTimeout;
    
    // Auto flip every 8 seconds
    function scheduleAutoFlip() {
        autoFlipTimeout = setTimeout(() => {
            isFlipped = !isFlipped;
            portraitCard.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
            scheduleAutoFlip();
        }, 8000);
    }
    
    scheduleAutoFlip();
    
    // Click to flip
    portraitCard.addEventListener('click', function(e) {
        clearTimeout(autoFlipTimeout);
        isFlipped = !isFlipped;
        this.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
        scheduleAutoFlip();
    });
    
    // Mouse move 3D effect
    portraitCard.addEventListener('mousemove', function(e) {
        if (isFlipped) return;
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;
        
        this.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
    
    portraitCard.addEventListener('mouseleave', function() {
        if (isFlipped) return;
        this.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
}

// Animated Skill Bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const percentage = skillBar.getAttribute('data-percentage');
                
                setTimeout(() => {
                    skillBar.style.width = percentage + '%';
                }, 300);
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5, rootMargin: '-50px' });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Advanced Scroll Animations
function initScrollAnimations() {
    // Add custom scroll animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(60px) scale(0.95);
                filter: blur(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
            }
        }
        
        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-60px) rotate(-5deg);
            }
            to {
                opacity: 1;
                transform: translateX(0) rotate(0deg);
            }
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(60px) rotate(5deg);
            }
            to {
                opacity: 1;
                transform: translateX(0) rotate(0deg);
            }
        }
        
        .scroll-animate {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Observe all elements
    const elements = document.querySelectorAll('.hero-profile, .skills-matrix, .experience-timeline, .projects-showcase, .final-cta');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('hero-profile')) {
                    entry.target.style.animation = 'fadeInUp 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                } else if (entry.target.classList.contains('skills-matrix')) {
                    entry.target.style.animation = 'fadeInLeft 1s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                } else if (entry.target.classList.contains('experience-timeline')) {
                    entry.target.style.animation = 'fadeInRight 1s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                } else {
                    entry.target.style.animation = 'fadeInUp 1s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '-50px' });
    
    elements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Advanced Hover Effects
function initHoverEffects() {
    // Ripple effect for all interactive elements
    const interactiveElements = document.querySelectorAll('.btn-master, .btn-cta, .project-card, .skill-category, .timeline-content');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                border-radius: 50%;
                animation: quantumRipple 0.8s ease-out;
                pointer-events: none;
                z-index: 10;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 800);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes quantumRipple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Magnetic Buttons
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-master, .btn-cta');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 15;
            const angleY = (centerX - x) / 15;
            
            const translateX = (x - centerX) / 10;
            const translateY = (y - centerY) / 10;
            
            this.style.transform = `translate(${translateX}px, ${translateY}px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.portrait-card, .skill-category, .project-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Typewriter Effect for Intro
function initTypewriterEffect() {
    const introElement = document.querySelector('.hero-intro');
    if (!introElement) return;
    
    const text = introElement.textContent;
    introElement.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            introElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    const introObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            typeWriter();
            introObserver.unobserve(introElement);
        }
    }, { threshold: 0.5 });
    
    introObserver.observe(introElement);
}

// Smooth Page Transitions
function initPageTransitions() {
    // Add smooth transition between sections
    const style = document.createElement('style');
    style.textContent = `
        .about-section {
            view-transition-name: about-section;
        }
        
        @view-transition {
            navigation: auto;
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scroll to elements
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Performance optimization
function initPerformance() {
    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Update scroll-based animations
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Preload critical images
    const criticalImages = document.querySelectorAll('.portrait-image');
    criticalImages.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.as = 'image';
            preload.href = src;
            document.head.appendChild(preload);
        }
    });
}

// Initialize performance optimizations
initPerformance();
