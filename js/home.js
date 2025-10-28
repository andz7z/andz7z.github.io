// Home Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Home section loaded');
    
    // Add any home-specific functionality here
    const homeVideo = document.querySelector('#home video');
    
    // Ensure video plays correctly
    if (homeVideo) {
        homeVideo.play().catch(function(error) {
            console.log('Video autoplay failed:', error);
        });
    }
});
