// Home section specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const homeSection = document.getElementById('home');
    
    // Setăm înălțimea exactă pentru secțiunea home
    homeSection.style.height = '300vh';
    
    // Adăugăm un efect de fade-in la încărcare
    homeSection.style.opacity = '0';
    setTimeout(() => {
        homeSection.style.transition = 'opacity 1.5s ease';
        homeSection.style.opacity = '1';
    }, 100);
    
    // Glass card animation on load
    const glassCard = document.getElementById('glassCard');
    glassCard.style.opacity = '0';
    glassCard.style.transform = 'translate(-50%, -40%) scale(0.9)';
    
    setTimeout(() => {
        glassCard.style.transition = 'opacity 1s ease, transform 1s ease';
        glassCard.style.opacity = '1';
        glassCard.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 500);
});
