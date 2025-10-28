// About Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('About section loaded');
    
    // Add any about-specific functionality here
    const aboutSection = document.getElementById('about');
    
    // Example: Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('About section is now visible');
                // Trigger animations or other effects here
            }
        });
    });
    
    if (aboutSection) {
        observer.observe(aboutSection);
    }
});
