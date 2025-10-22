/* ANDZ — Lehadus Andrei */

class AboutSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimation();
        this.setupVisualEffects();
    }

    setupScrollAnimation() {
        // Use Intersection Observer to trigger animations
        const aboutSection = document.querySelector('.about-section');
        const aboutElements = document.querySelectorAll('.about-text, .about-visual, .detail-item');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            }, {
                threshold: 0.3
            });

            aboutElements.forEach(element => {
                observer.observe(element);
            });
        }
    }

    setupVisualEffects() {
        const visualElement = document.querySelector('.visual-element');
        if (!visualElement) return;

        // Add interactive rotation on hover
        visualElement.addEventListener('mouseenter', () => {
            visualElement.style.animationDuration = '5s';
        });

        visualElement.addEventListener('mouseleave', () => {
            visualElement.style.animationDuration = '20s';
        });
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutSection();
});
