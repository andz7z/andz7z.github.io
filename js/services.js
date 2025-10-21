// js/services.js
/*
HOW TO EDIT SERVICES SECTION JAVASCRIPT:
- Service cards: Add custom hover animations
- Interactions: Implement click handlers for service details
- Dynamic content: Service data can be loaded from JSON
*/

class ServicesSection {
    constructor() {
        this.section = document.getElementById('services');
        this.serviceCards = this.section?.querySelectorAll('.service-card');
        this.init();
    }
    
    init() {
        this.setupAnimations();
        this.setupCardInteractions();
    }
    
    setupAnimations() {
        if (!this.section) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCards();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(this.section);
    }
    
    animateCards() {
        if (!this.serviceCards) return;
        
        this.serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
        });
    }
    
    setupCardInteractions() {
        if (!this.serviceCards) return;
        
        this.serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleCardClick(card);
            });
            
            // Add touch support for mobile
            card.addEventListener('touchstart', () => {
                card.classList.add('touched');
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                card.classList.remove('touched');
            }, { passive: true });
        });
    }
    
    handleCardClick(card) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(139, 92, 246, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2;
        const y = rect.height / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        
        card.style.position = 'relative';
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Initialize services section
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ServicesSection();
    });
} else {
    new ServicesSection();
}

export default ServicesSection;
