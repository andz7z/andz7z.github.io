// Home Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Button to scroll to about section
    const aboutBtn = document.getElementById('aboutBtn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', function() {
            document.getElementById('about').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
    // Video fallback
    const video = document.getElementById('backgroundVideo');
    if (video) {
        video.addEventListener('error', function() {
            console.log('Video failed to load, using fallback background');
            document.querySelector('.home-section').style.background = 'linear-gradient(45deg, #000, #333)';
        });
    }
});
