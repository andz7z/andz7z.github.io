// Logica JavaScript specifică pentru secțiunea #reviews
// reviews.js
function initReviews() {
    // Carusel pentru recenzii (simplificat)
    initReviewsCarousel();
}

function initReviewsCarousel() {
    // Într-o implementare completă, aici s-ar implementa un carusel real
    // Pentru demonstrație, doar adăugăm un efect de hover
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}
