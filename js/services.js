// Services section specific functionality

class ServicesSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupServiceCards();
    }

    setupServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCard(card, false);
            });
        });
    }

    animateCard(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
        }
    }
}

// Initialize services section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ServicesSection();
});
