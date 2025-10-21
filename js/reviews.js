// js/reviews.js
/*
HOW TO EDIT REVIEWS SECTION JAVASCRIPT:
- Review data: Load from external JSON or API
- Carousel: Implement auto-rotation if desired
- Animations: Add entrance effects for reviews
*/

class ReviewsSection {
    constructor() {
        this.section = document.getElementById('reviews');
        this.reviewCards = this.section?.querySelectorAll('.review-card');
        this.init();
    }
    
    init() {
        this.setupAnimations();
        this.setupInteractions();
        // this.loadReviews(); // Uncomment to load reviews dynamically
    }
    
    setupAnimations() {
        if (!this.section) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateReviews();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(this.section);
    }
    
    animateReviews() {
        if (!this.reviewCards) return;
        
        this.reviewCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 300);
        });
    }
    
    setupInteractions() {
        // Add any review-specific interactions here
        if (!this.reviewCards) return;
        
        this.reviewCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
    
    async loadReviews() {
        try {
            // Example of loading reviews from external source
            const response = await fetch('/api/reviews');
            const reviews = await response.json();
            this.renderReviews(reviews);
        } catch (error) {
            console.warn('Could not load reviews, using static content:', error);
        }
    }
    
    renderReviews(reviews) {
        // Implementation for dynamically rendering reviews
        // This would update the review cards with actual data
    }
}

// Initialize reviews section
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ReviewsSection();
    });
} else {
    new ReviewsSection();
}

export default ReviewsSection;
