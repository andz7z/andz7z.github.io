/* ANDZ — Lehadus Andrei */

class ReviewsSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupReviewAnimations();
        this.setupReviewInteractions();
    }

    setupReviewAnimations() {
        const reviewCards = document.querySelectorAll('.review-card');

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

            reviewCards.forEach(card => {
                observer.observe(card);
            });
        } else {
            // Fallback: show all cards
            reviewCards.forEach(card => {
                card.classList.add('visible');
            });
        }
    }

    setupReviewInteractions() {
        const reviewCards = document.querySelectorAll('.review-card');

        reviewCards.forEach(card => {
            // 3D rotation effect
            card.addEventListener('mousemove', (e) => {
                this.handleReviewTilt(e, card);
            });

            // Reset rotation
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-10px) rotateY(5deg)';
                card.style.transition = 'transform 0.5s ease';
            });

            // Click effect
            card.addEventListener('click', () => {
                card.style.transform = 'translateY(-5px) scale(0.98) rotateY(0deg)';
                setTimeout(() => {
                    card.style.transform = 'translateY(-10px) rotateY(5deg)';
                }, 150);
            });
        });
    }

    handleReviewTilt(e, card) {
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
    new ReviewsSection();
});
