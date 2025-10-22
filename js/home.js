// Home section specific functionality

class HomeSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupLetterEffects();
        this.setupSocialIcons();
    }

    setupLetterEffects() {
        const letters = document.querySelectorAll('.letter');
        
        letters.forEach(letter => {
            // Click effect
            letter.addEventListener('click', (e) => {
                e.target.classList.add('clicked');
                
                // Reset after 5 seconds
                setTimeout(() => {
                    e.target.classList.remove('clicked');
                }, 5000);
            });
        });
    }

    setupSocialIcons() {
        const socialIcons = document.querySelectorAll('.social-icon');
        
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.currentTarget);
            });
        });
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(138,43,226,0.3) 0%, transparent 70%)';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.opacity = '1';
        ripple.style.transition = 'all 0.6s ease';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        // Animate ripple
        setTimeout(() => {
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.opacity = '0';
        }, 10);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode === element) {
                element.removeChild(ripple);
            }
        }, 600);
    }
}

// Initialize home section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomeSection();
});
