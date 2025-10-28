// Reviews section specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const reviewsTitle = document.querySelector('#reviews .title');
    
    // Add liquid metal effect to reviews title
    reviewsTitle.addEventListener('mouseenter', function() {
        this.style.color = 'transparent';
        this.style.background = 'linear-gradient(45deg, #b8b8b8, #e8e8e8, #a0a0a0, #c8c8c8)';
        this.style.backgroundSize = '400% 400%';
        this.style.webkitBackgroundClip = 'text';
        this.style.animation = 'liquidMetal 3s ease infinite';
    });
    
    reviewsTitle.addEventListener('mouseleave', function() {
        this.style.color = '';
        this.style.background = '';
        this.style.webkitBackgroundClip = '';
        this.style.animation = '';
    });
});

// Add liquid metal animation
const style = document.createElement('style');
style.textContent = `
    @keyframes liquidMetal {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(style);
