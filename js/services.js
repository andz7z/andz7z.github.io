// Services Section JavaScript
class ServicesModule {
    constructor() {
        this.serviceCards = document.querySelectorAll('.service-card');
        this.init();
    }
    
    init() {
        this.setup3DEffects();
        this.setupCardAnimations();
        this.setupHoverEffects();
    }
    
    setup3DEffects() {
        this.serviceCards.forEach(card => {
            card.addEventListener('mousemove', this.handleCardMove.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        });
    }
    
    handleCardMove(e) {
        const card = e.currentTarget;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        // Apply 3D rotation based on mouse position
        const rotateY = x * 10; // Max 10 degrees rotation
        const rotateX = y * -10; // Max 10 degrees rotation
        
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateY(-10px)
        `;
        
        // Add lighting effect
        const shadowX = x * 20;
        const shadowY = y * 20;
        card.style.boxShadow = `
            ${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 46, 99, 0.2)
        `;
    }
    
    handleCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        
        // Reset after transition
        setTimeout(() => {
            card.style.boxShadow = '';
        }, 300);
    }
    
    setupCardAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.1 });
        
        this.serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    setupHoverEffects() {
        this.serviceCards.forEach(card => {
            const icon = card.querySelector('.card-icon');
            
            card.addEventListener('mouseenter', () => {
                // Add pulsing effect to icon
                icon.style.animation = 'pulse 2s infinite';
            });
            
            card.addEventListener('mouseleave', () => {
                // Remove pulsing effect
                icon.style.animation = 'none';
            });
        });
    }
}

// Add pulse animation for icons
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 46, 99, 0.4);
        }
        70% {
            box-shadow: 0 0 0 15px rgba(255, 46, 99, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 46, 99, 0);
        }
    }
`;
document.head.appendChild(style);
