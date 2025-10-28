// About section specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const aboutTitle = document.querySelector('#about .title');
    
    // Add metallic effect to about title
    aboutTitle.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(45deg, #8B7500, #FFD700, #D4AF37, #8B7500)';
        this.style.backgroundSize = '400% 400%';
        this.style.webkitBackgroundClip = 'text';
        this.style.webkitTextFillColor = 'transparent';
        this.style.animation = 'metallicShine 2s ease infinite';
    });
    
    aboutTitle.addEventListener('mouseleave', function() {
        this.style.background = '';
        this.style.webkitTextFillColor = '';
        this.style.animation = '';
    });
});

// Add metallic shine animation
const style = document.createElement('style');
style.textContent = `
    @keyframes metallicShine {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(style);
