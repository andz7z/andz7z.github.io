// Home section specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initHomeVideo();
    initHomeAnimations();
});

function initHomeVideo() {
    const video = document.getElementById('bg-video');
    
    // Ensure video plays correctly
    video.addEventListener('loadeddata', function() {
        console.log('Home video loaded successfully');
    });
    
    video.addEventListener('error', function() {
        console.error('Error loading home video');
        // Fallback background if video fails to load
        document.querySelector('.home-section').style.background = 'var(--color-black)';
    });
}

function initHomeAnimations() {
    // Additional home section animations can be added here
    const homeContent = document.querySelector('.home-content');
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX / window.innerWidth) * 20 - 10;
        const moveY = (e.clientY / window.innerHeight) * 20 - 10;
        
        homeContent.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });
}
