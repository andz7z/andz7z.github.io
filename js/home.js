// Home section specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add any home section specific functionality here
    console.log('Home section loaded');
    
    // Example: Parallax effect for home section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const homeSection = document.querySelector('.home-section');
        const parallaxSpeed = 0.5;
        
        homeSection.style.backgroundPositionY = -(scrolled * parallaxSpeed) + 'px';
    });
});
