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

    // Reset any problematic styles
    servicesSection.style.overflow = 'visible';
    servicesSection.style.zIndex = '2';
    document.body.style.overflowX = 'hidden';

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.15,
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
        let isFlipped = false;

        // Click to flip
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            isFlipped = !isFlipped;
            this.classList.toggle('flipped', isFlipped);
            playCardFlipSound();
        });

        // Mouse move 3D effect - only for front side
        card.addEventListener('mousemove', function(e) {
            if (isFlipped) return;
            
            const cardRect = this.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            const rotateX = (mouseY / cardRect.height) * 8;
            const rotateY = (mouseX / cardRect.width) * -8;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Mouse leave - reset transform
        card.addEventListener('mouseleave', function() {
            if (isFlipped) return;
            
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });

        // Close card when clicking outside
        document.addEventListener('click', function(e) {
            if (isFlipped && !card.contains(e.target)) {
                isFlipped = false;
                card.classList.remove('flipped');
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }
        });
    });

    // Button effects
    const serviceButtons = document.querySelectorAll('.service-btn');
    const ctaButton = document.querySelector('.cta-button');

    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            createRippleEffect(this);
            playButtonClickSound();
            
            // Here you would typically navigate to service details
            console.log('Service button clicked:', this.closest('.service-card').dataset.service);
        });
    });

    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            createSparkleEffect(this);
            playCTAClickSound();
            
            // Smooth scroll to contact section or open modal
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Fallback: show alert
                setTimeout(() => {
                    alert('Let\'s work together! This would typically scroll to the contact section.');
                }, 500);
            }
        });
    }

    // Create particle background
    createParticleBackground(servicesSection);

    // Initialize magnetic buttons
    initMagneticButtons();
}

// Particle Background Effect
function createParticleBackground(container) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(container), i * 300);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 2 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 15;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: 100%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;
    
    container.appendChild(particle);
    
    // Clean up particles after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, (duration + delay) * 1000);
}

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
            
            const deltaX = (x - centerX) / centerX * 5;
            const deltaY = (y - centerY) / centerY * 5;
            
            this.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// Visual Effects
function createRippleEffect(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

function createSparkleEffect(button) {
    const sparkleCount = 6;
    
    for (let i = 0; i < sparkleCount; i++) {
        createSparkle(button);
    }
}

function createSparkle(button) {
    const sparkle = document.createElement('div');
    const angle = (Math.random() * 360) * Math.PI / 180;
    const distance = 30 + Math.random() * 40;
    
    sparkle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        left: 50%;
        top: 50%;
        animation: sparkleMove 0.8s ease-out forwards;
        box-shadow: 0 0 4px white;
    `;
    
    button.appendChild(sparkle);
    
    setTimeout(() => {
        const endX = 50 + Math.cos(angle) * distance;
        const endY = 50 + Math.sin(angle) * distance;
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

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(2);
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
`;
document.head.appendChild(style);

// Sound Effects (subtle)
function playCardFlipSound() {
    // Simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silent fail if audio context is not supported
    }
}

function playButtonClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
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
        for (let i = 0; i < 2; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            const freq = 400 + (i * 200);
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + (i * 0.05));
            gainNode.gain.setValueAtTime(0.04, audioContext.currentTime + (i * 0.05));
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (i * 0.05) + 0.15);
            
            oscillator.start(audioContext.currentTime + (i * 0.05));
            oscillator.stop(audioContext.currentTime + (i * 0.05) + 0.15);
        }
    } catch (e) {
        // Silent fail
    }
}
