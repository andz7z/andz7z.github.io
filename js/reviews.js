// ===== MODUL REVIEWS - JAVASCRIPT SPECIFIC PENTRU SECȚIUNEA REVIEWS =====

function initializeReviewsModule() {
    console.log('Reviews module initialized');
    
    // Inițializează sistemul de reviews
    setupReviewCards();
    initReviewsCarousel(); // Pentru viitoare implementări carousel
}

function animateReviewsSection() {
    const reviewsContainer = document.querySelector('.reviews-container');
    
    if (reviewsContainer && !reviewsContainer.classList.contains('animated')) {
        reviewsContainer.classList.add('animated');
        
        // Configurează delay-urile pentru animații
        const reviewCards = document.querySelectorAll('.review-card');
        reviewCards.forEach((card, index) => {
            card.style.animationDelay = `${0.2 + index * 0.2}s`;
        });
    }
}

function setupReviewCards() {
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
        // Efect de hover cu shadow dinamic
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 35px rgba(138, 43, 226, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
        
        // Interacțiune la click pentru a marca ca util
        card.addEventListener('click', function() {
            const wasHelpful = confirm('A fost acest review util?');
            if (wasHelpful) {
                // Aici poți adăuga logica pentru tracking
                console.log('Review marked as helpful');
            }
        });
    });
}

// Sistem de carousel pentru reviews (pentru viitor)
function initReviewsCarousel() {
    // Această funcționalitate poate fi extinsă pentru a afișa reviews într-un carousel
    // Momentan, reviews sunt afișate static
}

// Generare stele dinamice (dacă rating-ul vine dintr-o sursă externă)
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

window.animateReviewsSection = animateReviewsSection;    // Într-o implementare reală, aceasta ar deschide un modal
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
