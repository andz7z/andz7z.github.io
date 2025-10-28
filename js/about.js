// ===== ABOUT SECTION INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    initAboutAnimations();
});

function initAboutAnimations() {
    const aboutSection = document.getElementById('about');
    const aboutContent = document.querySelector('.about-content');
    
    if (!aboutSection || !aboutContent) return;
    
    // Create intersection observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered animation to children
                const children = aboutContent.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(aboutSection);
    
    // Set initial styles for animation
    const children = aboutContent.children;
    Array.from(children).forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
        child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}
