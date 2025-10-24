// About Section - FINAL BOSS JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FINAL BOSS About Section Initialized');
    
    // Initialize Cyber Environment
    initCyberEnvironment();
    
    // Create Holographic Particles
    createHoloParticles();
    
    // Create Neural Network
    createNeuralNetwork();
    
    // Initialize Quantum Profile
    initQuantumProfile();
    
    // Initialize Tech Sphere
    initTechSphere();
    
    // Initialize Timeline Portal
    initTimelinePortal();
    
    // Initialize Cyber Interactions
    initCyberInteractions();
    
    // Initialize Scroll Animations
    initCyberScrollAnimations();
});

// Initialize Cyber Environment
function initCyberEnvironment() {
    // Add cyber noise effect
    const style = document.createElement('style');
    style.textContent = `
        .cyber-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(90deg, 
                    rgba(255, 255, 255, 0.03) 50%, 
                    transparent 50%),
                linear-gradient(
                    rgba(255, 255, 255, 0.02) 50%, 
                    transparent 50%);
            background-size: 100px 100px;
            animation: cyberNoise 0.2s infinite;
            pointer-events: none;
            z-index: -1;
        }
        
        @keyframes cyberNoise {
            0% { transform: translate(0, 0); }
            100% { transform: translate(100px, 100px); }
        }
    `;
    document.head.appendChild(style);
}

// Create Holographic Particles
function createHoloParticles() {
    const container = document.querySelector('.holo-particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'holo-particle';
        
        // Random position with bias towards center
        const left = 25 + Math.random() * 50;
        const top = 25 + Math.random() * 50;
        const delay = Math.random() * 8;
        const duration = 6 + Math.random() * 4;
        
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.animationDelay = `-${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        container.appendChild(particle);
    }
}

// Create Neural Network
function createNeuralNetwork() {
    const container = document.querySelector('.neural-network');
    if (!container) return;
    
    const lineCount = 15;
    
    for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div');
        line.className = 'neural-line';
        
        // Random properties
        const width = 100 + Math.random() * 300;
        const height = 2 + Math.random() * 3;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const rotation = Math.random() * 360;
        const delay = Math.random() * 3;
        const duration = 2 + Math.random() * 2;
        
        line.style.width = `${width}px`;
        line.style.height = `${height}px`;
        line.style.left = `${left}%`;
        line.style.top = `${top}%`;
        line.style.transform = `rotate(${rotation}deg)`;
        line.style.animationDelay = `-${delay}s`;
        line.style.animationDuration = `${duration}s`;
        
        container.appendChild(line);
    }
}

// Initialize Quantum Profile
function initQuantumProfile() {
    const quantumCard = document.querySelector('.quantum-card');
    if (!quantumCard) return;
    
    let isFlipped = false;
    
    // Auto quantum flip
    setInterval(() => {
        isFlipped = !isFlipped;
        quantumCard.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
    }, 6000);
    
    // Mouse interaction
    document.addEventListener('mousemove', (e) => {
        if (!quantumCard) return;
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        if (isFlipped) {
            quantumCard.style.transform = `rotateY(180deg) rotateX(${yAxis}deg) rotateY(${xAxis}deg)`;
        } else {
            quantumCard.style.transform = `rotateX(${yAxis}deg) rotateY(${xAxis}deg)`;
        }
    });
    
    // Click to flip
    quantumCard.addEventListener('click', () => {
        isFlipped = !isFlipped;
        quantumCard.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
    });
}

// Initialize Tech Sphere
function initTechSphere() {
    const techSphere = document.querySelector('.tech-sphere');
    if (!techSphere) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let sphereX = 0;
    let sphereY = 0;
    
    // Mouse move interaction
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 100;
        mouseY = (e.clientY - window.innerHeight / 2) / 100;
    });
    
    // Smooth sphere rotation
    function animateSphere() {
        sphereX += (mouseX - sphereX) * 0.1;
        sphereY += (mouseY - sphereY) * 0.1;
        
        techSphere.style.transform = `rotateY(${sphereX}deg) rotateX(${sphereY}deg)`;
        
        requestAnimationFrame(animateSphere);
    }
    
    animateSphere();
    
    // Tech node interactions
    const techNodes = document.querySelectorAll('.tech-node');
    techNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.style.animation = 'nodePulse 0.5s ease-in-out';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
}

// Initialize Timeline Portal
function initTimelinePortal() {
    const timelinePortal = document.querySelector('.timeline-portal');
    if (!timelinePortal) return;
    
    let portalX = 0;
    let portalY = 0;
    
    // Mouse parallax effect
    document.addEventListener('mousemove', (e) => {
        portalX = (e.clientX - window.innerWidth / 2) / 50;
        portalY = (e.clientY - window.innerHeight / 2) / 50;
        
        timelinePortal.style.transform = `perspective(2000px) rotateY(${portalX}deg) rotateX(${-portalY}deg)`;
    });
    
    // Event hover effects
    const portalEvents = document.querySelectorAll('.portal-event');
    portalEvents.forEach(event => {
        event.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
            this.style.animation = 'eventGlow 1s ease-in-out infinite alternate';
        });
        
        event.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
            this.style.animation = '';
        });
    });
}

// Initialize Cyber Interactions
function initCyberInteractions() {
    // Cyber button effects
    const cyberButtons = document.querySelectorAll('.btn-cyber, .cta-button-ultimate');
    
    cyberButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create cyber ripple
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.background = 'radial-gradient(circle, rgba(0,255,255,0.4) 0%, rgba(255,0,255,0.2) 50%, transparent 70%)';
            ripple.style.borderRadius = '50%';
            ripple.style.position = 'absolute';
            ripple.style.animation = 'cyberRipple 0.8s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Add cyber ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes cyberRipple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes nodePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
        
        @keyframes eventGlow {
            from {
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            }
            to {
                box-shadow: 0 0 60px rgba(255, 0, 255, 0.8);
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Initialize Cyber Scroll Animations
function initCyberScrollAnimations() {
    // Add cyber scroll animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cyberFadeInUp {
            from {
                opacity: 0;
                transform: translateY(50px) scale(0.8);
                filter: blur(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
            }
        }
        
        @keyframes cyberFadeIn {
            from {
                opacity: 0;
                transform: scale(0.5) rotate(-10deg);
            }
            to {
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }
        }
        
        .cyber-title, .cyber-subtitle, .quantum-card, .hero-content > * {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Observe elements for scroll animations
    const cyberElements = document.querySelectorAll('.cyber-title, .cyber-subtitle, .quantum-card, .hero-content > *, .tech-sphere-container, .timeline-portal, .cta-portal');
    
    const cyberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('tech-sphere-container') || 
                    entry.target.classList.contains('timeline-portal')) {
                    entry.target.style.animation = 'cyberFadeIn 1.5s ease forwards';
                } else {
                    entry.target.style.animation = 'cyberFadeInUp 1s ease forwards';
                }
                cyberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    cyberElements.forEach(el => {
        if (el.classList.contains('tech-sphere-container') || 
            el.classList.contains('timeline-portal')) {
            el.style.opacity = '0';
            el.style.transform = 'scale(0.5) rotate(-10deg)';
        } else {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px) scale(0.8)';
            el.style.filter = 'blur(10px)';
        }
        cyberObserver.observe(el);
    });
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCyberEnvironment,
        createHoloParticles,
        createNeuralNetwork,
        initQuantumProfile,
        initTechSphere,
        initTimelinePortal,
        initCyberInteractions,
        initCyberScrollAnimations
    };
}
