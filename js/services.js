/* ANDZ — Lehadus Andrei */

class ServicesSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupCardAnimations();
        this.setupCardInteractions();
    }

    setupCardAnimations() {
        const serviceCards = document.querySelectorAll('.service-card');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.2
            });

            serviceCards.forEach(card => {
                observer.observe(card);
            });
        } else {
            // Fallback: show all cards
            serviceCards.forEach(card => {
                card.classList.add('visible');
            });
        }
    }

    setupCardInteractions() {
        const serviceCards = document.querySelectorAll('.service-card');

        serviceCards.forEach(card => {
            // Tilt effect on mousemove
            card.addEventListener('mousemove', (e) => {
                this.handleTiltEffect(e, card);
            });

            // Reset tilt on mouseleave
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.transition = 'transform 0.5s ease';
            });

            // Add click feedback
            card.addEventListener('click', () => {
                card.style.transform = 'translateY(-5px) scale(0.98)';
                setTimeout(() => {
                    card.style.transform = 'translateY(-10px)';
                }, 150);
            });
        });
    }

    handleTiltEffect(e, card) {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        
        const rotateX = (mouseY / cardRect.height) * -10;
        const rotateY = (mouseX / cardRect.width) * 10;
        
        card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.transition = 'transform 0.1s ease';
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ServicesSection();
});
