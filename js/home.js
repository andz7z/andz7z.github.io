// Home section specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const homeSection = document.getElementById('home');
    
    // Setăm înălțimea exactă pentru secțiunea home
    homeSection.style.height = '300px';
    
    // Adăugăm un efect de fade-in la încărcare
    homeSection.style.opacity = '0';
    setTimeout(() => {
        homeSection.style.transition = 'opacity 1s ease';
        homeSection.style.opacity = '1';
    }, 100);
});
