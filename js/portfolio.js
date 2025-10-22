/* ANDZ — Lehadus Andrei */

class PortfolioSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupPortfolioAnimations();
        this.setupTiltEffects();
        this.setupHoverReveal();
    }

    setupPortfolioAnimations() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.2
            });

            portfolioItems.forEach(item => {
                observer.observe(item);
            });
        } else {
            // Fallback: show all items
            portfolioItems.forEach(item => {
                item.classList.add('visible');
            });
        }
    }

    setupTiltEffects() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        portfolioItems.forEach(item => {
            // Tilt effect on mousemove
            item.addEventListener('mousemove', (e) => {
                this.handlePortfolioTilt(e, item);
            });

            // Reset tilt on mouseleave
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(-10px) rotateX(5deg)';
                item.style.transition = 'transform 0.5s ease';
            });
        });
    }

    handlePortfolioTilt(e, item) {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const itemCenterY = itemRect.top + itemRect.height / 2;
        
        const mouseX = e.clientX - itemCenterX;
        const mouseY = e.clientY - itemCenterY;
        
        const rotateX = (mouseY / itemRect.height) * -15;
        const rotateY = (mouseX / itemRect.width) * 15;
        
        item.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        item.style.transition = 'transform 0.1s ease';
    }

    setupHoverReveal() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        portfolioItems.forEach(item => {
            const info = item.querySelector('.portfolio-info');
            
            item.addEventListener('mouseenter', () => {
                if (info) {
                    info.style.opacity = '1';
                    info.style.transform = 'translateY(0)';
                }
            });

            item.addEventListener('mouseleave', () => {
                if (info) {
                    info.style.opacity = '0.8';
                    info.style.transform = 'translateY(10px)';
                }
            });
        });
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioSection();
});
