// About Section - VISUAL MASTERPIECE JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 VISUAL MASTERPIECE About Section Initialized');
    
    // Initialize Visual Environment
    initVisualEnvironment();
    
    // Create Particle Rain
    createParticleRain();
    
    // Initialize 3D Gallery
    init3DGallery();
    
    // Initialize Floating Cards
    initFloatingCards();
    
    // Initialize Timeline Animation
    initTimelineAnimation();
    
    // Initialize Scroll Animations
    initMasterScrollAnimations();
    
    // Initialize Interactive Effects
    initInteractiveEffects();
});

// Initialize Visual Environment
function initVisualEnvironment() {
    // Add dynamic grid animation
    const grid = document.querySelector('.quantum-grid');
    if (grid) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            grid.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Create Particle Rain
function createParticleRain() {
    const container = document.querySelector('.particle-rain');
    if (!container) return;
    
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const left = Math.random() * 100;
        const size = 1 + Math.random() * 3;
        const duration = 3 + Math.random() * 7;
        const delay = Math.random() * 5;
        
        particle.style.left = `${left}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        
        container.appendChild(particle);
    }
}

// Initialize 3D Gallery
function init3DGallery() {
    const galleryTrack = document.querySelector('.gallery-track');
    if (!galleryTrack) return;
    
    let isPaused = false;
    let mouseX = 0;
    let mouseY = 0;
    
    // Pause on hover
    galleryTrack.addEventListener('mouseenter', () => {
        isPaused = true;
        galleryTrack.style.animationPlayState = 'paused';
    });
    
    galleryTrack.addEventListener('mouseleave', () => {
        isPaused = false;
        galleryTrack.style.animationPlayState = 'running';
    });
    
    // Mouse drag rotation
    let isDragging = false;
    let startX, startY, startRotationY;
    
    galleryTrack.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startRotationY = getCurrentRotation(galleryTrack);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !isPaused) return;
        
        const deltaX = e.clientX - startX;
        const newRotation = startRotationY + (deltaX * 0.5);
        
        galleryTrack.style.transform = `translate(-50%, -50%) rotateY(${newRotation}deg)`;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    function getCurrentRotation(element) {
        const transform = window.getComputedStyle(element).transform;
        if (transform === 'none') return 0;
        
        const values = transform.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];
        
        return Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }
}

// Initialize Floating Cards
function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateY(-20px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });
}

// Initialize Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'timelineFadeIn 1s ease forwards';
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        timelineObserver.observe(item);
    });
}

// Initialize Scroll Animations
function initMasterScrollAnimations() {
    // Add custom animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes masterFadeInUp {
            from {
                opacity: 0;
                transform: translateY(80px) scale(0.9);
                filter: blur(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
            }
        }
        
        @keyframes masterFadeIn {
            from {
                opacity: 0;
                transform: scale(0.8) rotateX(10deg);
            }
            to {
                opacity: 1;
                transform: scale(1) rotateX(0deg);
            }
        }
        
        .master-title, .hero-subtitle, .gallery-3d, .floating-cards, .animated-timeline, .masterpiece-cta {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Observe elements
    const masterElements = document.querySelectorAll('.master-title, .hero-subtitle, .gallery-3d, .floating-cards, .animated-timeline, .masterpiece-cta');
    
    const masterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('gallery-3d')) {
                    entry.target.style.animation = 'masterFadeIn 2s ease forwards';
                } else {
                    entry.target.style.animation = 'masterFadeInUp 1.5s ease forwards';
                }
                masterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    masterElements.forEach(el => {
        if (el.classList.contains('gallery-3d')) {
            el.style.opacity = '0';
            el.style.transform = 'scale(0.8) rotateX(10deg)';
        } else {
            el.style.opacity = '0';
            el.style.transform = 'translateY(80px) scale(0.9)';
            el.style.filter = 'blur(20px)';
        }
        masterObserver.observe(el);
    });
}

// Initialize Interactive Effects
function initInteractiveEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button-master');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)';
            ripple.style.borderRadius = '50%';
            ripple.style.position = 'absolute';
            ripple.style.animation = 'masterRipple 0.8s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes masterRipple {
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

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initVisualEnvironment,
        createParticleRain,
        init3DGallery,
        initFloatingCards,
        initTimelineAnimation,
        initMasterScrollAnimations,
        initInteractiveEffects
    };
}
