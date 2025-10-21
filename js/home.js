// js/home.js
/*
HOW TO EDIT HOME SECTION JS:
- Video handling: Adjust autoplay and fallback behavior
- Animations: Modify timing and effects
- Content: Update text content dynamically if needed
*/

import { elements } from './main.js';

// Home section specific functionality
function initHome() {
    setupVideo();
    setupCTAButton();
}

// Setup video background
function setupVideo() {
    const video = document.getElementById('bg-video');
    if (!video) return;
    
    // Video event listeners
    video.addEventListener('loadeddata', () => {
        console.log('Home video loaded successfully');
    });
    
    video.addEventListener('error', () => {
        console.warn('Video failed to load, using fallback background');
        // Fallback background style could be applied here
    });
    
    // Attempt to play video (required for some browsers)
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn('Video autoplay failed:', error);
            // Fallback to poster image or static background
        });
    }
}

// Setup CTA button functionality
function setupCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (!ctaButton) return;
    
    ctaButton.addEventListener('click', () => {
        // Scroll to about section
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Home section specific cleanup (if needed)
function cleanupHome() {
    // Cleanup any home-specific event listeners or intervals
}

// Initialize home section when DOM is ready
document.addEventListener('DOMContentLoaded', initHome);

// Export for module usage
export { initHome, cleanupHome };
