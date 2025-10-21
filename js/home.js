// js/home.js
/*
HOW TO EDIT HOME SECTION JAVASCRIPT:
- Video handling: Modify video preload and play behavior
- Animations: Update timing and easing functions
- Interactions: Customize CTA button behavior
*/

import { scrollToSection } from './main.js';

// Home section specific functionality
class HomeSection {
    constructor() {
        this.video = document.querySelector('.background-video');
        this.ctaButton = document.querySelector('.cta-button');
        this.init();
    }
    
    init() {
        this.setupVideo();
        this.setupInteractions();
        this.setupPerformance();
    }
    
    setupVideo() {
        if (!this.video) return;
        
        // Video loading handling
        this.video.addEventListener('loadeddata', () => {
            console.log('Home video loaded successfully');
        });
        
        this.video.addEventListener('error', () => {
            console.warn('Home video failed to load, using fallback');
            this.handleVideoError();
        });
        
        // Attempt to play video (required for some browsers)
        this.attemptVideoPlay();
    }
    
    async attemptVideoPlay() {
        try {
            await this.video.play();
        } catch (error) {
            console.log('Autoplay prevented, waiting for user interaction');
            this.setupPlayOnInteraction();
        }
    }
    
    setupPlayOnInteraction() {
        const playVideo = () => {
            this.video.play().catch(console.error);
            document.removeEventListener('click', playVideo);
            document.removeEventListener('scroll', playVideo);
        };
        
        document.addEventListener('click', playVideo, { once: true });
        document.addEventListener('scroll', playVideo, { once: true, passive: true });
    }
    
    handleVideoError() {
        // Could implement fallback to gradient background or image sequence
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.style.background = 'linear-gradient(45deg, var(--color-bg-dark), var(--color-gradient-1))';
        }
    }
    
    setupInteractions() {
        // CTA button click
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', () => {
                this.animateCTAClick();
                scrollToSection('about');
            });
        }
        
        // Scroll indicator click
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                scrollToSection('about');
            });
        }
    }
    
    animateCTAClick() {
        if (!this.ctaButton) return;
        
        this.ctaButton.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.ctaButton.style.transform = '';
        }, 150);
    }
    
    setupPerformance() {
        // Lazy load home section specific resources
        this.observeVisibility();
    }
    
    observeVisibility() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Home section is visible, ensure video is playing
                    this.video.play().catch(console.error);
                } else {
                    // Home section not visible, pause video to save resources
                    this.video.pause();
                }
            });
        });
        
        const homeSection = document.getElementById('home');
        if (homeSection) {
            observer.observe(homeSection);
        }
    }
}

// Initialize home section when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HomeSection();
    });
} else {
    new HomeSection();
}

export default HomeSection;
