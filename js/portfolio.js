// Portfolio section specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const portfolioSection = document.getElementById('portfolio');
    
    // Asigurăm că secțiunea portfolio are înălțimea de 100vh
    portfolioSection.style.height = '100vh';
    
    // Adăugăm un efect de fade-in la încărcare
    portfolioSection.style.opacity = '0';
    setTimeout(() => {
        portfolioSection.style.transition = 'opacity 1s ease';
        portfolioSection.style.opacity = '1';
    }, 300);
});
