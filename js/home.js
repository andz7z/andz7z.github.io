// Home Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const homeCard = document.getElementById('homeCard');
    
    // Add any home-specific interactions here
    // Example: Parallax effect for the glass card
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        homeCard.style.transform = `translateY(${rate}px)`;
    });
});
