// Services Section Specific JavaScript
class ServicesSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupServicesAnimations();
    }

    setupServicesAnimations() {
        // Services-specific animations and functionality
        console.log('Services section initialized');
    }
}

// Initialize services section when it becomes active
document.addEventListener('DOMContentLoaded', () => {
    // Observer to initialize section when it becomes active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'services' && target.classList.contains('active')) {
                    new ServicesSection();
                }
            }
        });
    });

    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        observer.observe(servicesSection, { attributes: true });
    }
});
