// ===== JAVASCRIPT SPECIFIC PENTRU SECȚIUNEA ABOUT =====

document.addEventListener('DOMContentLoaded', function() {
    initAboutAnimations();
    initAboutInteractions();
});

// Animații specifice pentru secțiunea About
function initAboutAnimations() {
    const aboutStats = document.querySelectorAll('.stat');
    
    // Animație pentru statistici
    aboutStats.forEach((stat, index) => {
        stat.style.animationDelay = `${0.5 + index * 0.2}s`;
    });
    
    // Intersection Observer pentru trigger la scroll
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
}

// Animație pentru numerele din statistici
function animateStats() {
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + '+';
        }, stepTime);
    });
}

// Interacțiuni pentru secțiunea About
function initAboutInteractions() {
    const aboutText = document.querySelector('.about-text');
    
    // Efect de highlight la hover pe paragrafe
    const paragraphs = aboutText.querySelectorAll('p');
    
    paragraphs.forEach(paragraph => {
        paragraph.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        paragraph.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}
