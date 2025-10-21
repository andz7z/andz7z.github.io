// Services section specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initServiceCards();
});

function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        // Staggered animation
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in-up');
        
        // Interactive hover effects
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.card-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}
