// js/about.js

// About section specific functionality

function initAbout() {
    // Animate skill bars when section comes into view
    const aboutSection = document.getElementById('about');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill bars
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = `${width}%`;
                });
                
                // Unobserve after animation to prevent retriggering
                observer.unobserve(aboutSection);
            }
        });
    }, { threshold: 0.5 });
    
    if (aboutSection) {
        observer.observe(aboutSection);
    }
}
