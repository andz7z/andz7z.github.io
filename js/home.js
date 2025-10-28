// Home section specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Add any home section specific functionality here
    console.log('Home section loaded');
    
    // Example: Add a subtle pulse animation to the home title
    const homeTitle = document.querySelector('.home-section .title');
    if (homeTitle) {
        homeTitle.style.animation = 'contentFadeIn 1s ease forwards, pulse 3s infinite 2s';
        
        // Add the pulse animation to CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
});
