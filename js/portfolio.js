// Portfolio section specific functionality

class PortfolioSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupPortfolioItems();
    }

    setupPortfolioItems() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.animatePortfolioItem(item, true);
            });
            
            item.addEventListener('mouseleave', () => {
                this.animatePortfolioItem(item, false);
            });
        });
    }

    animatePortfolioItem(item, isHovering) {
        const overlay = item.querySelector('.portfolio-overlay');
        const image = item.querySelector('.portfolio-image');
        
        if (isHovering) {
            item.style.transform = 'translateY(-10px)';
            overlay.style.opacity = '1';
            image.style.transform = 'scale(1.1)';
        } else {
            item.style.transform = 'translateY(0)';
            overlay.style.opacity = '0';
            image.style.transform = 'scale(1)';
        }
    }
}

// Initialize portfolio section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSection();
});
