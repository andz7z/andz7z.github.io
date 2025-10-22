// Portfolio section specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initPortfolioItems();
});

function initPortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach((item, index) => {
        // Staggered animation
        item.style.animationDelay = `${index * 0.15}s`;
        item.classList.add('fade-in-up');
        
        // Button hover effect
        const button = item.querySelector('.portfolio-btn');
        
        button.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(45deg, var(--chrome), var(--metal-light))';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(45deg, var(--metal-light), var(--chrome))';
        });
    });
}
