// Portfolio Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio section loaded');
    
    // Add any portfolio-specific functionality here
    const portfolioSection = document.getElementById('portfolio');
    
    // Example: Future portfolio item interactions
    const portfolioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Portfolio section is now visible');
                // Future portfolio grid animations
            }
        });
    });
    
    if (portfolioSection) {
        portfolioObserver.observe(portfolioSection);
    }
});
