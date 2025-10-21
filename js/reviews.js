// js/reviews.js

// Reviews section specific functionality

function initReviews() {
    const reviewCards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentIndex = 0;
    
    // Function to show a specific review
    function showReview(index) {
        // Hide all reviews
        reviewCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected review and update dot
        reviewCards[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentIndex = index;
    }
    
    // Next review function
    function nextReview() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= reviewCards.length) {
            nextIndex = 0;
        }
        showReview(nextIndex);
    }
    
    // Previous review function
    function prevReview() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = reviewCards.length - 1;
        }
        showReview(prevIndex);
    }
    
    // Add event listeners to navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevReview);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextReview);
    }
    
    // Add event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showReview(index);
        });
    });
    
    // Auto-advance reviews (optional)
    let autoAdvance = setInterval(nextReview, 5000);
    
    // Pause auto-advance on hover
    const slider = document.querySelector('.reviews-slider');
    if (slider) {
        slider.addEventListener('mouseenter', function() {
            clearInterval(autoAdvance);
        });
        
        slider.addEventListener('mouseleave', function() {
            autoAdvance = setInterval(nextReview, 5000);
        });
    }
}
