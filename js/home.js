// js/home.js - Home section specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initHomeAnimations();
    initSocialHoverEffects();
});

// Home animations
function initHomeAnimations() {
    // Elements to animate on home page load
    const homeElements = [
        '.logo',
        '.navbar',
        '.social-icons',
        '.scroll-indicator'
    ];
    
    // Apply staggered animations
    homeElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.animationDelay = `${0.5 + (index * 0.2)}s`;
        }
    });
}

// Social hover effects
function initSocialHoverEffects() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        icon.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}
