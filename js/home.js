// home.js - Home section specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Ensure video plays correctly
    const video = document.getElementById('bg-video');
    
    if (video) {
        video.play().catch(error => {
            console.log('Video autoplay prevented:', error);
            // Fallback: show play button or handle accordingly
        });
    }
    
    // Add scroll indicator click functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
