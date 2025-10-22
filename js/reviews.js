// Reviews section specific functionality

class ReviewsSection {
    constructor() {
        this.currentReview = 0;
        this.reviews = [
            {
                text: "ANDZ delivered beyond our expectations. The attention to detail and modern approach transformed our digital presence completely.",
                author: "Sarah Johnson",
                position: "CEO, TechInnovate"
            },
            {
                text: "Working with ANDZ was a game-changer for our brand. Their innovative solutions and cutting-edge designs set new standards.",
                author: "Michael Chen",
                position: "Marketing Director, VisionCorp"
            },
            {
                text: "The level of professionalism and creativity ANDZ brings to every project is exceptional. Highly recommended for premium results.",
                author: "Emily Rodriguez",
                position: "Product Manager, NextGen Labs"
            }
        ];
        this.init();
    }

    init() {
        this.setupReviewsSlider();
        this.createReviewDots();
        this.showReview(0);
    }

    setupReviewsSlider() {
        // Auto-advance reviews every 5 seconds
        setInterval(() => {
            this.nextReview();
        }, 5000);
    }

    createReviewDots() {
        const navContainer = document.querySelector('.reviews-nav');
        
        this.reviews.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.showReview(index);
            });
            
            navContainer.appendChild(dot);
        });
    }

    showReview(index) {
        this.currentReview = index;
        
        const review = this.reviews[index];
        const reviewCard = document.querySelector('.review-card');
        
        // Update review content with fade effect
        reviewCard.style.opacity = '0';
        
        setTimeout(() => {
            reviewCard.querySelector('.review-text').textContent = review.text;
            reviewCard.querySelector('.author-info h4').textContent = review.author;
            reviewCard.querySelector('.author-info p').textContent = review.position;
            reviewCard.style.opacity = '1';
        }, 300);
        
        // Update active dot
        document.querySelectorAll('.nav-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    nextReview() {
        const nextIndex = (this.currentReview + 1) % this.reviews.length;
        this.showReview(nextIndex);
    }
}

// Initialize reviews section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReviewsSection();
});
