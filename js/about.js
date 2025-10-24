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
        const
