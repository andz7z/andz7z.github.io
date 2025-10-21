// js/portfolio.js

// Portfolio section specific functionality

function initPortfolio() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioButtons = document.querySelectorAll('.portfolio-btn');
    
    // Add click events to portfolio buttons
    portfolioButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real implementation, this would open a modal or navigate to project details
            const portfolioItem = this.closest('.portfolio-item');
            const projectTitle = portfolioItem.querySelector('h3').textContent;
            
            alert(`Viewing details for: ${projectTitle}`);
        });
    });
    
    // Add intersection observer for fade-in animation
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial state and observe each portfolio item
    portfolioItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}
