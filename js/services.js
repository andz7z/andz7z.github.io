// Services Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize services section
    initServicesSection();
});

function initServicesSection() {
    const serviceCards = document.querySelectorAll('.service-card');
    const section = document.querySelector('.services-section');
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize card interactions
    initCardInteractions();
    
    // Initialize background effects
    initBackgroundEffects();
    
    // Initialize magnetic button effect
    initMagneticButtons();
}

// Scroll animations for cards
function initScrollAnimations() {
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
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0) rotateY(0)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });

    // Observe section title and description
    const title = document.querySelector('.section-title');
    const description = document.querySelector('.section-description');
    if (title) observer.observe(title);
    if (description) observer.observe(description);
}

// Card interactions and effects
function initCardInteractions() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        // Mouse move tilt effect
        card.addEventListener('mousemove', (e) => {
            if (!card.classList.contains('flipped')) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `
                    perspective(1500px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale3d(1.02, 1.02, 1.02)
                `;
                
                // Parallax effect for inner elements
                const icon = card.querySelector('.card-icon');
                const title = card.querySelector('.card-title');
                
                if (icon) {
                    icon.style.transform = `translate(${rotateY * 0.5}px, ${rotateX * 0.5}px)`;
                }
                
                if (title) {
                    title.style.transform = `translate(${rotateY * 0.3}px, ${rotateX * 0.3}px)`;
                }
            }
        });
        
        // Mouse leave reset
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('flipped')) {
                card.style.transform = 'perspective(1500px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                
                const icon = card.querySelector('.card-icon');
                const title = card.querySelector('.card-title');
                
                if (icon) icon.style.transform = 'translate(0, 0)';
                if (title) title.style.transform = 'translate(0, 0)';
            }
        });
        
        // Click to flip with animation
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
            const inner = this.querySelector('.card-inner');
            
            if (this.classList.contains('flipped')) {
                inner.style.transform = 'rotateY(180deg) scale(0.95)';
                // Add glow effect
                this.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.2)';
            } else {
                inner.style.transform = 'rotateY(0deg) scale(1)';
                this.style.boxShadow = '';
            }
        });
        
        // Touch device support
        let touchStartX = 0;
        let touchStartY = 0;
        
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        card.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = Math.abs(touchEndX - touchStartX);
            const diffY = Math.abs(touchEndY - touchStartY);
            
            // If it's a tap (not swipe)
            if (diffX < 10 && diffY < 10) {
                card.click();
            }
        });
    });
}

// Background effects and particles
function initBackgroundEffects() {
    const bgElements = document.querySelector('.bg-elements');
    if (!bgElements) return;
    
    // Create additional floating particles
    createFloatingParticles();
    
    // Mouse move background parallax
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const circles = document.querySelectorAll('.bg-circle');
        circles.forEach((circle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * 20 * speed;
            const y = (mouseY - 0.5) * 20 * speed;
            
            circle.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        // Grid movement
        const grid = document.querySelector('.bg-grid');
        if (grid) {
            const gridX = (mouseX - 0.5) * 10;
            const gridY = (mouseY - 0.5) * 10;
            grid.style.transform = `translate(${gridX}px, ${gridY}px)`;
        }
    });
}

// Create floating particles
function createFloatingParticles() {
    const bgElements = document.querySelector('.bg-elements');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3});
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            animation: floatParticle ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            pointer-events: none;
        `;
        
        bgElements.appendChild(particle);
    }
    
    // Add particle animation to CSS
    if (!document.querySelector('#particle-animations')) {
        const style = document.createElement('style');
        style.id = 'particle-animations';
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: ${Math.random() * 0.5 + 0.2};
                }
                90% {
                    opacity: ${Math.random() * 0.5 + 0.2};
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Magnetic button effect
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.card-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) * 0.2;
            const moveY = (y - centerY) * 0.2;
            
            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
        
        // Ripple effect on click
        button.addEventListener('click', function(e) {
            // Prevent card flip when button is clicked
            e.stopPropagation();
            
            createRippleEffect(e, this);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Ripple effect for buttons
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to CSS
if (!document.querySelector('#ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Handle window resize
window.addEventListener('resize', function() {
    // Re-initialize animations if needed
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach(particle => particle.remove());
    
    setTimeout(() => {
        createFloatingParticles();
    }, 100);
});

// Performance optimization
let ticking = false;

function updateOnScroll() {
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Export functions for global access if needed
window.servicesSection = {
    init: initServicesSection,
    refresh: function() {
        document.querySelectorAll('.floating-particle').forEach(p => p.remove());
        createFloatingParticles();
    }
};
