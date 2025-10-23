// Home section specific functionality
class HomeSection {
    constructor() {
        this.init();
    }

    init() {
        this.addParticles();
    }

    addParticles() {
        // Simple particle effect for background
        const homeSection = document.getElementById('home');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--primary-color);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float 6s ease-in-out infinite;
                animation-delay: ${Math.random() * 6}s;
                opacity: ${Math.random() * 0.5 + 0.2};
            `;
            homeSection.appendChild(particle);
        }

        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(10px, 10px) rotate(90deg); }
                50% { transform: translate(0, 20px) rotate(180deg); }
                75% { transform: translate(-10px, 10px) rotate(270deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize home section
document.addEventListener('DOMContentLoaded', () => {
    new HomeSection();
});
