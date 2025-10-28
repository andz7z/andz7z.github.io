// Contact section specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contactTitle = document.querySelector('#contact .title');
    
    // Add chrome effect to contact title
    contactTitle.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(45deg, #8e9eab, #eef2f3, #8e9eab)';
        this.style.backgroundSize = '400% 400%';
        this.style.webkitBackgroundClip = 'text';
        this.style.webkitTextFillColor = 'transparent';
        this.style.animation = 'chromeShine 2s ease infinite';
        this.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
    });
    
    contactTitle.addEventListener('mouseleave', function() {
        this.style.background = '';
        this.style.webkitTextFillColor = '';
        this.style.animation = '';
        this.style.textShadow = '';
    });
});

// Add chrome shine animation
const style = document.createElement('style');
style.textContent = `
    @keyframes chromeShine {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(style);
