// ===== PORTFOLIO SECTION INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    initPortfolioAnimations();
    initPortfolioHoverEffects();
});

function initPortfolioAnimations() {
    const portfolioSection = document.getElementById('portfolio');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!portfolioSection || !portfolioItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                portfolioItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(portfolioSection);
    
    // Set initial styles for animation
    portfolioItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

function initPortfolioHoverEffects() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const image = this.querySelector('.portfolio-image');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const image = this.querySelector('.portfolio-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}
