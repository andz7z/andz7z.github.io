// ===== HOME SECTION JAVASCRIPT =====
// Handles any home section specific interactions

document.addEventListener('DOMContentLoaded', function() {
    const homeSection = document.querySelector('.home-section');
    const glassCard = document.querySelector('.glass-card');
    
    // Add parallax effect to glass card on scroll
    function handleHomeScroll() {
        const scrollPosition = window.scrollY;
        const homeHeight = homeSection.offsetHeight;
        
        // Only apply effects while in home section
        if (scrollPosition < homeHeight) {
            // Parallax effect - card moves slower than scroll
            const parallaxValue = scrollPosition * 0.5;
            glassCard.style.transform = `translateY(${parallaxValue}px) rotate(${scrollPosition * 0.01}deg)`;
            
            // Adjust opacity based on scroll position
            const opacity = 1 - (scrollPosition / homeHeight);
            glassCard.style.opacity = Math.max(opacity, 0.3);
        }
    }
    
    // Event listener for scroll
    window.addEventListener('scroll', handleHomeScroll);
});
