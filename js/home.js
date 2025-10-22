// Home section specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initHomeAnimations();
    initScrollIndicator();
});

// Initialize home section animations
function initHomeAnimations() {
    // Add parallax effect to video background
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const video = document.getElementById('bgVideo');
        
        if (video) {
            video.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    });
}

// Initialize scroll indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    });
    
    // Click to scroll down
    scrollIndicator.addEventListener('click', function() {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}
