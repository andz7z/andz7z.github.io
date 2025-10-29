// Home section specific functionality
class HomeSection {
    constructor() {
        this.init();
    }
    
    init() {
        this.createCardContent();
        this.addScrollEffects();
    }
    
    createCardContent() {
        const glassCard = document.querySelector('.glass-card');
        if (glassCard) {
            // This is where About Me content will be added later
            glassCard.innerHTML = `
                <div class="card-content">
                    <!-- About Me content will go here -->
                </div>
            `;
        }
    }
    
    addScrollEffects() {
        // Add subtle parallax and effects for the home section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const homeSection = document.querySelector('.home-section');
            
            if (homeSection && scrolled < homeSection.offsetHeight) {
                const opacity = 1 - (scrolled / (homeSection.offsetHeight * 0.5));
                homeSection.style.opacity = Math.max(opacity, 0.7);
            }
        });
    }
}

// Initialize home section
document.addEventListener('DOMContentLoaded', () => {
    new HomeSection();
});
