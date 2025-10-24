// About Section - PERFECTIUNEA ABSOLUTĂ
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 PERFECTIUNEA ABSOLUTĂ Initialized');
    
    initQuantumParticles();
    initOrbitalSystem();
    initTimelineReveal();
    initQuantumInteractions();
    initScrollMagic();
});

function initQuantumParticles() {
    const container = document.querySelector('.quantum-particles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const tx = (Math.random() - 0.5) * 2;
        const ty = (Math.random() - 0.5) * 2;
        const duration = 10 + Math.random() * 10;
        const delay = Math.random() * 15;
        const size = 2 + Math.random() * 4;
        
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

function initOrbitalSystem() {
    const cards = document.querySelectorAll('.orbital-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');
        });
        
        // Create ripple effect on click
        card.addEventListener('click', function(e) {
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
}

function initTimelineReveal() {
    const nodes = document.querySelectorAll('.timeline-node');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'nodeReveal 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '-50px' });
    
    nodes.forEach(node => observer.observe(node));
}

function initQuantumInteractions() {
    // Add magnetic effect to CTA button
    const ctaButton = document.querySelector('.cta-button-quantum');
    
    if (ctaButton) {
        ctaButton.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 10;
            const angleY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-8px) scale(1.05) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-8px) scale(1.05) rotateX(0deg) rotateY(0deg)';
        });
    }
}

function initScrollMagic() {
    // Add scroll-triggered animations
    const elements = document.querySelectorAll('.orbital-card, .timeline-node, .cta-portal');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => scrollObserver.observe(el));
}

// Add custom animations
const style = document.createElement('style');
style.textContent = `
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
    
    .orbital-card, .timeline-node, .cta-portal {
        animation-play-state: paused;
    }
`;
document.head.appendChild(style);
