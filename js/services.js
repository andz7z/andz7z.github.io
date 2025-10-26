// services.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize services section
    initServicesSection();
});

function initServicesSection() {
    // Elements
    const servicesSection = document.querySelector('.services-section');
    const serviceCards = document.querySelectorAll('.service-card');
    const sectionTitle = document.querySelector('.section-title');
    const sectionDescription = document.querySelector('.section-description');
    const servicesFooter = document.querySelector('.services-footer');
    const ctaButton = document.querySelector('.cta-button');
    const serviceButtons = document.querySelectorAll('.service-btn');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for cards
                if (entry.target.classList.contains('service-card')) {
                    const index = Array.from(serviceCards).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements
    [sectionTitle, sectionDescription, servicesFooter, ...serviceCards].forEach(el => {
        if (el) observer.observe(el);
    });

    // 3D Card Flip and Hover Effects
    serviceCards.forEach(card => {
        // Click to flip
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
            
            // Add subtle sound effect (optional)
            playCardFlipSound();
        });

        // Mouse move 3D effect
        card.addEventListener('mousemove', function(e) {
            if (this.classList.contains('flipped')) return;
            
            const cardRect = this.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            const rotateX = (mouseY / cardRect.height) * 10;
            const rotateY = (mouseX / cardRect.width) * -10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Parallax effect for inner elements
            const cardInner = this.querySelector('.card-inner');
            const cardIcon = this.querySelector('.card-icon');
            
            cardInner.style.transform = `rotateY(0deg) translateZ(20px)`;
            
            if (cardIcon) {
                cardIcon.style.transform = `translateZ(30px)`;
            }
        });

        // Mouse leave - reset transform
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('flipped')) return;
            
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            
            const cardInner = this.querySelector('.card-inner');
            const cardIcon = this.querySelector('.card-icon');
            
            cardInner.style.transform = `rotateY(0deg) translateZ(0px)`;
            
            if (cardIcon) {
                cardIcon.style.transform = `translateZ(0px)`;
            }
        });

        // Touch events for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        card.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        card.addEventListener('touchmove', function(e) {
            if (this.classList.contains('flipped')) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;
            
            const rotateY = deltaX * 0.5;
            const rotateX = deltaY * -0.5;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('touchend', function() {
            if (this.classList.contains('flipped')) return;
            
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Button hover effects
    serviceButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            createRippleEffect(this);
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            createClickEffect(this);
            playButtonClickSound();
        });
    });

    // CTA Button effects
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        ctaButton.addEventListener('click', function() {
            createSparkleEffect(this);
            playCTAClickSound();
            
            // Scroll to contact section or open modal
            setTimeout(() => {
                alert('Let\'s work together! This would typically open a contact form.');
            }, 500);
        });
    }

    // Particle background effect
    createParticleBackground(servicesSection);

    // Magnetic button effect
    initMagneticButtons();

    // Auto-rotate cards on hover (subtle)
    initAutoRotateEffect();

    // Scroll-triggered animations
    initScrollAnimations();
}

// Particle Background Effect
function createParticleBackground(container) {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const opacity = Math.random() * 0.3 + 0.1;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${opacity});
        border-radius: 50%;
        left: ${posX}%;
        top: ${posY}%;
        pointer-events: none;
        animation: floatParticle ${duration}s linear ${delay}s infinite;
    `;
    
    container.appendChild(particle);
    
    // Clean up particles after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, (duration + delay) * 1000);
}

// Add particle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
        }
    }
    
    .particle {
        z-index: 1;
    }
`;
document.head.appendChild(style);

// Magnetic Button Effect
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.service-btn, .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX * 10;
            const deltaY = (y - centerY) / centerY * 10;
            
            this.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// Auto-rotate effect for cards
function initAutoRotateEffect() {
    const cards = document.querySelectorAll('.service-card:not(.flipped)');
    
    cards.forEach(card => {
        let rotateY = 0;
        
        const rotate = () => {
            if (card.classList.contains('flipped')) return;
            
            rotateY += 0.2;
            card.style.transform = `perspective(1000px) rotateY(${Math.sin(rotateY * 0.01) * 2}deg) rotateX(${Math.cos(rotateY * 0.01) * 1}deg)`;
            
            requestAnimationFrame(rotate);
        };
        
        rotate();
    });
}

// Scroll animations
function initScrollAnimations() {
    let ticking = false;
    
    function updateOnScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const servicesSection = document.querySelector('.services-section');
        if (servicesSection) {
            servicesSection.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Visual Effects
function createRippleEffect(button) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

function createClickEffect(button) {
    const clickEffect = document.createElement('div');
    clickEffect.className = 'click-effect';
    
    clickEffect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
        animation: clickPulse 0.4s ease-out;
        pointer-events: none;
    `;
    
    button.appendChild(clickEffect);
    
    setTimeout(() => {
        if (clickEffect.parentNode) {
            clickEffect.parentNode.removeChild(clickEffect);
        }
    }, 400);
}

function createSparkleEffect(button) {
    const sparkleCount = 8;
    
    for (let i = 0; i < sparkleCount; i++) {
        createSparkle(button);
    }
}

function createSparkle(button) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    const angle = (Math.random() * 360) * Math.PI / 180;
    const distance = 50 + Math.random() * 50;
    
    const startX = 50;
    const startY = 50;
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;
    
    sparkle.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: white;
        border-radius: 50%;
        left: ${startX}%;
        top: ${startY}%;
        animation: sparkleMove 0.8s ease-out forwards;
        box-shadow: 0 0 6px white;
    `;
    
    button.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.style.left = `${endX}%`;
        sparkle.style.top = `${endY}%`;
        sparkle.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 800);
}

// Add animation keyframes to CSS
const effectStyles = document.createElement('style');
effectStyles.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes clickPulse {
        0% {
            transform: scale(0.8);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes sparkleMove {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
    
    .ripple-effect, .click-effect, .sparkle {
        z-index: 1;
    }
`;
document.head.appendChild(effectStyles);

// Sound Effects (optional - very subtle)
function playCardFlipSound() {
    // Create a subtle flip sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silent fail if Web Audio API is not supported
    }
}

function playButtonClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silent fail
    }
}

function playCTAClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a more satisfying sound for CTA
        for (let i = 0; i < 3; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            const freq = 500 + (i * 100);
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + (i * 0.05));
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime + (i * 0.05));
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (i * 0.05) + 0.2);
            
            oscillator.start(audioContext.currentTime + (i * 0.05));
            oscillator.stop(audioContext.currentTime + (i * 0.05) + 0.2);
        }
    } catch (e) {
        // Silent fail
    }
}

// Performance optimization
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
    }
}

// Make mousemove events more performant
document.querySelectorAll('.service-card').forEach(card => {
    const originalMousemove = card.onmousemove;
    card.onmousemove = throttle(function(e) {
        if (originalMousemove) originalMousemove.call(this, e);
    }, 16); // ~60fps
});
