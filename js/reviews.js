// Functionality for the Reviews Carousel
document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.querySelector('.reviews-carousel');
    const reviewItems = reviewsContainer ? reviewsContainer.querySelectorAll('.review-item') : [];
    const navDots = reviewsContainer ? reviewsContainer.querySelectorAll('.nav-dot') : [];
    let currentIndex = 0;

    if (reviewItems.length === 0) return;

    function updateCarousel(newIndex) {
        if (newIndex < 0 || newIndex >= reviewItems.length) return;

        // Transition out current review and dot
        gsap.to(reviewItems[currentIndex], { opacity: 0, y: 10, duration: 0.5, onComplete: () => {
            reviewItems[currentIndex].classList.add('hidden');
        }});
        navDots[currentIndex].classList.remove('active');

        currentIndex = newIndex;

        // Transition in new review and dot
        reviewItems[currentIndex].classList.remove('hidden');
        gsap.fromTo(reviewItems[currentIndex], { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 });
        navDots[currentIndex].classList.add('active');
    }

    // Auto-advance feature
    setInterval(() => {
        const nextIndex = (currentIndex + 1) % reviewItems.length;
        updateCarousel(nextIndex);
    }, 8000); // Change review every 8 seconds

    // Dot navigation
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateCarousel(index));
    });

    // Ensure only the first one is visible on load
    reviewItems.forEach((item, index) => {
        if (index !== 0) item.classList.add('hidden');
    });
});
