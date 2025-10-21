/**
 * HOME SECTION SCRIPT
 * Handles home section specific functionality
 */

class HomeSection {
    constructor() {
        this.video = document.getElementById('bgVideo');
        this.discoverBtn = document.getElementById('discoverBtn');
        this.socialIcons = document.querySelectorAll('.social-icon');
        
        this.init();
    }
    
    init() {
        this.setupVideo();
        this.setupDiscoverButton();
        this.setupSocialIcons();
        this.setupTextAnimations();
        
        console.log('Home section initialized');
    }
    
    /**
     * Setup background video with fallback
     */
    setupVideo() {
        if (!this.video) return;
        
        // Check if video can play
        this.video.addEventListener('canplay', () => {
            console.log('Background video loaded successfully');
        });
        
        // Handle video errors
        this.video.addEventListener('error', () => {
            console.error('Error loading background video');
            this.useFallbackBackground();
        });
        
        // Attempt to play video (required for autoplay in some browsers)
        this.video.play().catch(error => {
            console.warn('Autoplay prevented:', error);
            // Show play button or use fallback
        });
    }
    
    /**
     * Use fallback background if video fails
     */
    useFallbackBackground() {
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)';
            videoContainer.innerHTML = ''; // Remove video element
        }
    }
    
    /**
     * Setup discover button interactions
     */
    setupDiscoverButton() {
        if (!this.discoverBtn) return;
        
        this.discoverBtn.addEventListener('click', () => {
            this.animateButtonClick();
            this.scrollToAbout();
        });
        
        // Add hover effects
        this.discoverBtn.addEventListener('mouseenter', this.addButtonGlow);
        this.discoverBtn.addEventListener('mouseleave', this.removeButtonGlow);
    }
    
    /**
     * Animate button on click
     */
    animateButtonClick() {
        this.discoverBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.discoverBtn.style.transform = '';
        }, 150);
    }
    
    /**
     * Add glow effect to button
     */
    addButtonGlow() {
        this.style.boxShadow = '0 0 30px rgba(255, 46, 99, 0.8), 0 0 60px rgba(67, 97, 238, 0.6)';
    }
    
    /**
     * Remove glow effect from button
     */
    removeButtonGlow() {
        this.style.boxShadow = '';
    }
    
    /**
     * Scroll to about section
     */
    scrollToAbout() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    /**
     * Setup social icons interactions
     */
    setupSocialIcons() {
        this.socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', this.animateSocialIcon);
            icon.addEventListener('mouseleave', this.resetSocialIcon);
            
            // Add click handlers for actual social links
            this.setupSocialLinks(icon);
        });
    }
    
    /**
     * Animate social icon on hover
     */
    animateSocialIcon() {
        this.style.transform = 'translateY(-8px) scale(1.1)';
        this.style.boxShadow = '0 10px 25px rgba(255, 46, 99, 0.4)';
    }
    
    /**
     * Reset social icon after hover
     */
    resetSocialIcon() {
        this.style.transform = '';
        this.style.boxShadow = '';
    }
    
    /**
     * Setup actual social media links
     */
    setupSocialLinks(icon) {
        // This would be replaced with actual social media URLs
        const socialLinks = {
            'fa-github': 'https://github.com/yourusername',
            'fa-linkedin-in': 'https://linkedin.com/in/yourprofile',
            'fa-whatsapp': 'https://wa.me/yournumber',
            'fa-discord': 'https://discord.gg/yourinvite'
        };
        
        const iconClass = Array.from(icon.querySelector('i').classList)
            .find(cls => cls.startsWith('fa-'));
        
        if (iconClass && socialLinks[iconClass]) {
            icon.href = socialLinks[iconClass];
            icon.target = '_blank';
            icon.rel = 'noopener noreferrer';
        }
    }
    
    /**
     * Setup text animations
     */
    setupTextAnimations() {
        const titleLines = document.querySelectorAll('.title-line');
        
        // Stagger animation for title lines
        titleLines.forEach((line, index) => {
            line.style.animationDelay = `${index * 0.2}s`;
        });
        
        // Subtle floating animation for main title
        this.addFloatingAnimation('.main-title');
    }
    
    /**
     * Add floating animation to element
     */
    addFloatingAnimation(selector) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        element.style.animation = 'float 6s ease-in-out infinite';
        
        // Add keyframes if not already present
        if (!document.querySelector('#float-animation')) {
            const style = document.createElement('style');
            style.id = 'float-animation';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize home section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomeSection();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeSection;
}
