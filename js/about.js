// About section specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initSkillAnimations();
});

// Initialize skill bar animations
function initSkillAnimations() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    // Create intersection observer for skill bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 300);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe each skill progress bar
    skillProgressBars.forEach(bar => {
        observer.observe(bar);
    });
}
