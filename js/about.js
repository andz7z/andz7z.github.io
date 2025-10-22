/* ANDZ — Lehadus Andrei */

// About Section - Animații și efecte
document.addEventListener('DOMContentLoaded', function() {
    initAboutAnimations();
    initStatsCounter();
});

// Animații pentru secțiunea About
function initAboutAnimations() {
    const aboutSection = document.getElementById('about');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger animations when section comes into view
                animateAboutElements();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (aboutSection) {
        observer.observe(aboutSection);
    }
}

// Animație pentru elementele din About
function animateAboutElements() {
    const stats = document.querySelectorAll('.stat');
    
    stats.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.transform = 'translateY(0)';
            stat.style.opacity = '1';
        }, index * 200);
    });
}

// Counter pentru statistici
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const aboutSection = document.getElementById('about');
    
    let hasAnimated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.5 });
    
    if (aboutSection) {
        observer.observe(aboutSection);
    }
    
    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + '+';
            }, 16);
        });
    }
}
