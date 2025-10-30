// Home Section Specific JavaScript
class HomeSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupHomeAnimations();
    }

    setupHomeAnimations() {
        // Additional home-specific animations can be added here
        console.log('Home section initialized');
    }
}

// Initialize home section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const homeSection = document.getElementById('home');
    if (homeSection && homeSection.classList.contains('active')) {
        new HomeSection();
    }
});
