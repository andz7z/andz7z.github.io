// ===== JAVASCRIPT SPECIFIC PENTRU SECȚIUNEA REVIEWS =====

document.addEventListener('DOMContentLoaded', function() {
    initReviewsAnimations();
    initReviewsInteractions();
    initReviewsCarousel();
});

// Animații specifice pentru secțiunea Reviews
function initReviewsAnimations() {
    const reviewCards = document.querySelectorAll('.review-card');
    
    // Setează delay-uri pentru animații
    reviewCards.forEach((card, index) => {
        card.style.animationDelay = `${0.3 + index * 0.1}s`;
    });
    
    // Intersection Observer pentru trigger la scroll
    const reviewsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateReviewStars();
                reviewsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
        reviewsObserver.observe(reviewsSection);
    }
}

// Animație pentru stelele din recenzii
function animateReviewStars() {
    const starContainers = document.querySelectorAll('.review-stars');
    
    starContainers.forEach(container => {
        const stars = container.querySelectorAll('.fa-star, .fa-star-half-alt');
        stars.forEach((star, index) => {
            star.style.animation = `starPop 0.3s ease ${index * 0.1}s forwards`;
        });
    });
}

// Interacțiuni pentru secțiunea Reviews
function initReviewsInteractions() {
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
        // Efect de expand la hover
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
        
        // Click pentru a citi întreaga recenzie
        card.addEventListener('click', function() {
            const reviewerName = this.querySelector('h4').textContent;
            const reviewText = this.querySelector('p').textContent;
            showFullReview(reviewerName, reviewText);
        });
    });
}

// Carousel pentru recenzii (pentru versiunea mobile)
function initReviewsCarousel() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;
    
    // Verifică dacă suntem pe un dispozitiv mobil
    if (window.innerWidth <= 768) {
        reviewsGrid.style.overflowX = 'auto';
        reviewsGrid.style.scrollSnapType = 'x mandatory';
        reviewsGrid.style.display = 'flex';
        reviewsGrid.style.gap = '1rem';
        reviewsGrid.style.padding = '1rem 0';
        
        const reviewCards = document.querySelectorAll('.review-card');
        reviewCards.forEach(card => {
            card.style.flex = '0 0 85%';
            card.style.scrollSnapAlign = 'start';
        });
        
        // Adaugă indicatori pentru carousel
        addCarouselIndicators(reviewCards.length);
    }
}

// Adaugă indicatori pentru carousel
function addCarouselIndicators(count) {
    const reviewsSection = document.getElementById('reviews');
    const container = reviewsSection.querySelector('.container');
    
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    indicators.style.display = 'flex';
    indicators.style.justifyContent = 'center';
    indicators.style.gap = '0.5rem';
    indicators.style.marginTop = '1rem';
    
    for (let i = 0; i < count; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        indicator.style.width = '10px';
        indicator.style.height = '10px';
        indicator.style.borderRadius = '50%';
        indicator.style.border = 'none';
        indicator.style.backgroundColor = i === 0 ? '#8A2BE2' : 'rgba(255, 255, 255, 0.3)';
        indicator.style.cursor = 'pointer';
        indicator.style.transition = 'background-color 0.3s ease';
        
        indicator.addEventListener('click', () => {
            scrollToReview(i);
        });
        
        indicators.appendChild(indicator);
    }
    
    container.appendChild(indicators);
    
    // Actualizează indicatorii la scroll
    const reviewsGrid = document.querySelector('.reviews-grid');
    reviewsGrid.addEventListener('scroll', updateCarouselIndicators);
}

// Funcție pentru afișarea recenziei complete
function showFullReview(name, text) {
    // Într-o implementare reală, aceasta ar deschide un modal
    console.log(`Recenzie completă de la ${name}: ${text}`);
}

// Adaugă animația starPop în CSS prin JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes starPop {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        70% {
            transform: scale(1.2);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
