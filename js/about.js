// About Section - ULTIMATE LEVEL
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚡ ULTIMATE LEVEL Initialized');
    
    initQuantumDots();
    initPortrait3D();
    initScrollSections();
    initSkillProgress();
    initInteractiveElements();
    initScrollIndicator();
    initMicroInteractions();
    initMagneticEffects();
    initPageTransitions();
    initPerformance();
});

// Quantum Dots System
function initQuantumDots() {
    const container = document.querySelector('.quantum-dots');
    if (!container) return;
    
    for (let i = 0; i < 80; i++) {
        const dot = document.createElement('div');
        dot.className = 'quantum-dot';
        
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = 3 + Math.random() * 2;
        
        dot.style.left = left + '%';
        dot.style.top = top + '%';
        dot.style.animationDelay = -delay + 's';
        dot.style.animationDuration = duration + 's';
        
        container.appendChild(dot);
    }
}

// Advanced 3D Portrait
function initPortrait3D() {
    const portrait = document.querySelector('.portrait-ultimate');
    if (!portrait) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let portraitX = 0;
    let portraitY = 0;
    
    // Mouse move effect
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    // Smooth portrait rotation
    function animatePortrait() {
        portraitX += (mouseX - portraitX) * 0.05;
        portraitY += (mouseY - portraitY) * 0.05;
        
        const rotateY = portraitX * 10;
        const rotateX = -portraitY * 10;
        const translateZ = Math.abs(portraitX) * 20 + Math.abs(portraitY) * 20;
        
        portrait.style.transform = `
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            translateZ(${translateZ}px)
        `;
        
        // Animate layers
        const layers = portrait.querySelectorAll('.portrait-layer');
        layers.forEach((layer, index) => {
            const depth = (index + 1) * 20;
            const layerX = portraitX * depth * 0.5;
            const layerY = portraitY * depth * 0.5;
            
            layer.style.transform = `translateZ(${depth}px) translateX(${layerX}px) translateY(${layerY}px)`;
        });
        
        requestAnimationFrame(animatePortrait);
    }
    
    animatePortrait();
    
    // Click to reset
    portrait.addEventListener('click', () => {
        mouseX = 0;
        mouseY = 0;
    });
}

// Scroll Section Reveal
function initScrollSections() {
    const sections = document.querySelectorAll('.content-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.skill-ultimate, .experience-item, .project-ultimate');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '-50px'
    });
    
    sections.forEach(section => {
        // Hide children initially
        const children = section.querySelectorAll('.skill-ultimate, .experience-item, .project-ultimate');
        children.forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        });
        
        observer.observe(section);
    });
}

// Animated Skill Progress
function initSkillProgress() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const percentage = skillBar.parentElement.nextElementSibling.textContent;
                const numericValue = parseInt(percentage);
                
                setTimeout(() => {
                    skillBar.style.width = numericValue + '%';
                }, 200);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Interactive Elements
function initInteractiveElements() {
    // Ripple effect
    const interactiveElements = document.querySelectorAll('.skill-ultimate, .experience-item, .project-ultimate, .btn-ultimate');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', function(e) {
            createRipple(this, e);
        });
    });
    
    // Hover sound simulation
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.2s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.4s ease';
        });
    });
}

function createRipple(element, e) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
        border-radius: 50%;
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Scroll Indicator
function initScrollIndicator() {
    const dots = document.querySelectorAll('.indicator-dot');
    const sections = document.querySelectorAll('.content-section');
    
    // Click to scroll
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (sections[index]) {
                sections[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active dot on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observer.observe(section));
}

// Micro Interactions
function initMicroInteractions() {
    // Typing effect for title
    const title = document.querySelector('.ultimate-title');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        const titleObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                titleObserver.unobserve(title);
            }
        });
        
        titleObserver.observe(title);
    }
    
    // Availability status animation
    const status = document.querySelector('.availability-status');
    if (status) {
        status.addEventListener('click', function() {
            this.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    }
}

// Magnetic Effects
function initMagneticEffects() {
    const magneticElements = document.querySelectorAll('.btn-ultimate, .skill-ultimate, .project-ultimate');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 10;
            const moveY = (y - centerY) / 10;
            
            this.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// Smooth Page Transitions
function initPageTransitions() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes rotate {
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
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

// Performance Optimizations
function initPerformance() {
    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Update any scroll-based animations
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
