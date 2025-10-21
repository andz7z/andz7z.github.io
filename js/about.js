// js/about.js
/*
HOW TO EDIT ABOUT SECTION JAVASCRIPT:
- Animations: Modify entrance effects for content
- Interactions: Add custom hover effects or click handlers
- Content: Dynamic content loading can be added here
*/

class AboutSection {
    constructor() {
        this.section = document.getElementById('about');
        this.init();
    }
    
    init() {
        this.setupAnimations();
        this.setupInteractions();
    }
    
    setupAnimations() {
        // Add entrance animations for about section elements
        if (!this.section) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateContent();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(this.section);
    }
    
    animateContent() {
        const contentElements = this.section.querySelectorAll('.content-text, .visual-placeholder');
        
        contentElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    setupInteractions() {
        // Add any about section specific interactions here
    }
}

// Initialize about section
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AboutSection();
    });
} else {
    new AboutSection();
}

export default AboutSection;
