// Reviews section specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const reviewsSection = document.getElementById('reviews');
    
    // Asigurăm că secțiunea reviews are înălțimea de 100vh
    reviewsSection.style.height = '100vh';
    
    // Adăugăm un efect de fade-in la încărcare
    reviewsSection.style.opacity = '0';
    setTimeout(() => {
        reviewsSection.style.transition = 'opacity 1s ease';
        reviewsSection.style.opacity = '1';
    }, 500);
});
