// Portfolio Section Specific JavaScript
class PortfolioSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupPortfolioAnimations();
    }

    setupPortfolioAnimations() {
        // Portfolio-specific animations and functionality
        console.log('Portfolio section initialized');
    }
}

// Initialize portfolio section when it becomes active
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'portfolio' && target.classList.contains('active')) {
                    new PortfolioSection();
                }
            }
        });
    });

    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        observer.observe(portfolioSection, { attributes: true });
    }
});
