// Reviews section specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initReviewCards();
});

function initReviewCards() {
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach((card, index) => {
        // Staggered animation
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in-up');
        
        // Star animation
        const stars = card.querySelectorAll('.fa-star');
        
        stars.forEach((star, starIndex) => {
            star.style.animationDelay = `${index * 0.2 + starIndex * 0.1}s`;
            star.classList.add('pulse');
        });
    });
}
