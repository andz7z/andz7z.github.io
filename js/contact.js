// Contact Section Specific JavaScript
class ContactSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactAnimations();
    }

    setupContactAnimations() {
        // Contact-specific animations and functionality
        console.log('Contact section initialized');
    }
}

// Initialize contact section when it becomes active
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'contact' && target.classList.contains('active')) {
                    new ContactSection();
                }
            }
        });
    });

    const contactSection = document.getElementById('contact');
    if (contactSection) {
        observer.observe(contactSection, { attributes: true });
    }
});
