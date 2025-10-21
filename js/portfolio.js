// js/portfolio.js
/*
HOW TO EDIT PORTFOLIO SECTION JAVASCRIPT:
- Portfolio items: Add click handlers for project details
- Filtering: Implement category filtering if needed
- Modal: Setup project detail modals
*/

class PortfolioSection {
    constructor() {
        this.section = document.getElementById('portfolio');
        this.portfolioItems = this.section?.querySelectorAll('.portfolio-item');
        this.init();
    }
    
    init() {
        this.setupAnimations();
        this.setupItemInteractions();
    }
    
    setupAnimations() {
        if (!this.section) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateItems();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(this.section);
    }
    
    animateItems() {
        if (!this.portfolioItems) return;
        
        this.portfolioItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8) rotateY(10deg)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1) rotateY(0)';
            }, index * 200);
        });
    }
    
    setupItemInteractions() {
        if (!this.portfolioItems) return;
        
        this.portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openProjectDetails(item);
            });
            
            // Keyboard navigation
            item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.openProjectDetails(item);
                }
            });
            
            // Add focus styles
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'View project details');
        });
    }
    
    openProjectDetails(item) {
        // This would typically open a modal with project details
        // For now, we'll just add a visual feedback
        item.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            item.style.transform = '';
        }, 150);
        
        console.log('Opening project details for:', item);
        // Implement modal opening logic here
    }
}

// Initialize portfolio section
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PortfolioSection();
    });
} else {
    new PortfolioSection();
}

export default PortfolioSection;
