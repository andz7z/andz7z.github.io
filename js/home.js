// Home section specific JavaScript
class HomeSection {
    constructor() {
        this.heroCard = document.querySelector('.hero-card');
        this.aboutSection = document.querySelector('#about');
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupAnimations();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.target.id === 'about') {
                        if (entry.isIntersecting) {
                            this.heroCard.classList.add('active');
                        } else {
                            // Only remove active class when scrolling back up past about section
                            if (entry.boundingClientRect.top > 0) {
                                this.heroCard.classList.remove('active');
                            }
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-10% 0px -10% 0px'
            }
        );

        if (this.aboutSection) {
            observer.observe(this.aboutSection);
        }
    }

    setupAnimations() {
        // Additional home section animations can be added here
    }
}

// Initialize home section
document.addEventListener('DOMContentLoaded', () => {
    new HomeSection();
});
