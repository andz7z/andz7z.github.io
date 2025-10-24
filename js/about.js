// ===== ABOUT SCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
    initAbout();
});

function initAbout() {
    // Animație pentru barele de skills
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 300);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(bar);
    });
}
