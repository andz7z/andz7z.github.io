// Home section specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('backgroundVideo');
    const homeContent = document.querySelector('.home-content');
    
    // Fade in video and content
    if (video) {
        video.style.opacity = '0';
        
        video.addEventListener('loadeddata', function() {
            setTimeout(function() {
                video.style.transition = 'opacity 1.5s ease';
                video.style.opacity = '1';
            }, 300);
        });
    }
    
    // Fade in navbar links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-10px)';
        
        setTimeout(function() {
            link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 800 + (index * 100));
    });
});
