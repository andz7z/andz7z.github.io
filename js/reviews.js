/* FILE: js/reviews.js */
document.addEventListener('DOMContentLoaded', () => {
    // Aici se poate adăuga JS specific secțiunii "Reviews"
    // De exemplu, un carusel de review-uri sau efectul de lumină parallax.
    
    // Exemplu pt. efectul de lumină parallax (dacă dorești)
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${(x / rect.width) * 100 - 50}%`);
            card.style.setProperty('--y', `${(y / rect.height) * 100 - 50}%`);
        });
    });
});
