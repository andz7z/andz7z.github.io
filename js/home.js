// Home section specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('backgroundVideo');
    
    // Ensure video plays correctly
    video.addEventListener('loadeddata', function() {
        console.log('Video loaded successfully');
    });
    
    video.addEventListener('error', function() {
        console.error('Error loading video');
    });
    
    // Add liquid effect to home title
    const homeTitle = document.querySelector('#home .title');
    
    homeTitle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
    
    homeTitle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});
