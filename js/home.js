// Home section specific functionality

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('backgroundVideo');
    
    // Ensure video plays correctly
    if (video) {
        video.play().catch(error => {
            console.log('Video autoplay prevented:', error);
        });
    }
    
    // Fade in navbar elements
    const navElements = document.querySelectorAll('.nav-link, .nav-logo');
    navElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 1s ease, transform 1s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 500 + (index * 100));
    });
});
