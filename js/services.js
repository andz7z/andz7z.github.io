// Services section specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const servicesTitle = document.querySelector('#services .title');
    
    // Add glass effect to services title
    servicesTitle.style.position = 'relative';
    servicesTitle.style.overflow = 'hidden';
    
    servicesTitle.addEventListener('mouseenter', function() {
        const glassOverlay = document.createElement('div');
        glassOverlay.style.position = 'absolute';
        glassOverlay.style.top = '0';
        glassOverlay.style.left = '-100%';
        glassOverlay.style.width = '100%';
        glassOverlay.style.height = '100%';
        glassOverlay.style.background = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)';
        glassOverlay.style.transform = 'skewX(-15deg)';
        glassOverlay.style.transition = 'left 0.5s ease';
        glassOverlay.classList.add('glass-overlay');
        
        this.appendChild(glassOverlay);
        
        setTimeout(() => {
            glassOverlay.style.left = '100%';
        }, 10);
    });
    
    servicesTitle.addEventListener('mouseleave', function() {
        const glassOverlay = this.querySelector('.glass-overlay');
        if (glassOverlay) {
            glassOverlay.remove();
        }
    });
});
