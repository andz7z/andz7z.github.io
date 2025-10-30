// Home Section Specific JavaScript
class HomeManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupVideoLoading();
        this.setupCardAnimations();
    }

    setupVideoLoading() {
        const video = document.querySelector('.background-video');
        
        video.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
        });

        video.addEventListener('error', () => {
            console.error('Error loading video');
        });
    }

    setupCardAnimations() {
        // Additional card animations can be added here
        const card = document.querySelector('.glass-card');
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translate(-50%, -50%) scale(1.02)';
            card.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
}

// Initialize Home Manager
document.addEventListener('DOMContentLoaded', () => {
    new HomeManager();
});
