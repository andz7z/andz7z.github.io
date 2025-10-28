// ===== REVIEWS SECTION INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    initReviewsAnimations();
    initReviewsParallax();
});

function initReviewsAnimations() {
    const reviewsSection = document.getElementById('reviews');
    const reviewItems = document.querySelectorAll('.review-item');
    
    if (!reviewsSection || !reviewItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                reviewItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 250);
                });
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(reviewsSection);
    
    // Set initial styles for animation with staggered directions
    reviewItems.forEach((item, index) => {
        const direction = index % 2 === 0 ? -50 : 50;
        item.style.opacity = '0';
        item.style.transform = `translateX(${direction}px)`;
        item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });
}

function initReviewsParallax() {
    const reviewsSection = document.getElementById('reviews');
    
    if (!reviewsSection) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        // Apply subtle parallax to background
        reviewsSection.style.backgroundPosition = `center ${rate}px`;
    });
}
