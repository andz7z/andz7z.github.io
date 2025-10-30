// Reviews Section Specific JavaScript
class ReviewsSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupReviewsAnimations();
    }

    setupReviewsAnimations() {
        // Reviews-specific animations and functionality
        console.log('Reviews section initialized');
    }
}

// Initialize reviews section when it becomes active
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'reviews' && target.classList.contains('active')) {
                    new ReviewsSection();
                }
            }
        });
    });

    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
        observer.observe(reviewsSection, { attributes: true });
    }
});
