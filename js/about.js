// About Section - BEYOND ULTIMATE
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BEYOND ULTIMATE Initialized');
    
    initNeuralInterface();
    initQuantumField();
    initHyperPortrait();
    initDimensionReveal();
    initMatrixSkills();
    initQuantumNavigator();
    initHyperInteractions();
    initQuantumPhysics();
    initTemporalEffects();
    initPerformanceBeyond();
});

// Neural Interface System
function initNeuralInterface() {
    const container = document.querySelector('.neural-interface');
    if (!container) return;
    
    function createNeuralPath() {
        const path = document.createElement('div');
        path.className = 'neural-path';
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const endX = Math.random() * 100;
        const endY = Math.random() * 100;
        
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        
        path.style.left = startX + '%';
        path.style.top = startY + '%';
        path.style.width = length + 'vw';
        path.style.transform = `rotate(${angle}deg)`;
        path.style.animationDelay = Math.random() * 4 + 's';
        path.style.animationDuration = (2 + Math.random() * 3) + 's';
        
        container.appendChild(path);
        
        setTimeout(() => {
            path.remove();
        }, 7000);
    }
    
    // Create initial paths
    for (let i = 0; i < 15; i++) {
        setTimeout(createNeuralPath, i * 300);
    }
    
    // Continuous path generation
    setInterval(createNeuralPath, 500);
}

// Quantum Field System
function initQuantumField() {
    const container = document.querySelector('.quantum-field');
    if (!container) return;
    
    for (let i = 0; i < 150; i++) {
        const string = document.createElement('div');
        string.className = 'quantum-string';
        
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = 2 + Math.random() * 2;
        
        string.style.left = left + '%';
        string.style.top = top + '%';
        string.style.animationDelay = -delay + 's';
        string.style.animationDuration = duration + 's';
        
        container.appendChild(string);
    }
}

// Hyper Portrait with Quantum Physics
function initHyperPortrait() {
    const portrait = document.querySelector('.portrait-hyper');
    if (!portrait) return;
    
    let mouseX = 0, mouseY = 0;
    let portraitX = 0, portraitY = 0;
    let velocityX = 0, velocityY = 0;
    
    // Quantum physics parameters
    const stiffness = 0.1;
    const damping = 0.8;
    const mass = 1;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    function quantumPhysicsUpdate() {
        // Calculate forces
        const forceX = (mouseX - portraitX) * stiffness;
        const forceY = (mouseY - portraitY) * stiffness;
        
        // Update velocity (F = ma => a = F/m)
        velocityX += forceX / mass;
        velocityY += forceY / mass;
        
        // Apply damping
        velocityX *= damping;
        velocityY *= damping;
        
        // Update position
        portraitX += velocityX;
        portraitY += velocityY;
        
        // Apply transformations
        const rotateY = portraitX * 15;
        const rotateX = -portraitY * 15;
        const translateZ = Math.abs(portraitX) * 30 + Math.abs(portraitY) * 30;
        
        portrait.style.transform = `
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            translateZ(${translateZ}px)
        `;
        
        // Animate dimensions with phase shifts
        const dimensions = portrait.querySelectorAll('.portrait-dimension');
        dimensions.forEach((dimension, index) => {
            const phase = (index + 1) * 0.3;
            const dimX = portraitX * (20 + index * 15) * Math.cos(phase);
            const dimY = portraitY * (20 + index * 15) * Math.sin(phase);
            const dimZ = (index + 1) * 30;
            
            dimension.style.transform = `
                translateX(${dimX}px)
                translateY(${dimY}px)
                translateZ(${dimZ}px)
            `;
        });
        
        requestAnimationFrame(quantumPhysicsUpdate);
    }
    
    quantumPhysicsUpdate();
    
    // Click quantum effect
    portrait.addEventListener('click', (e) => {
        createQuantumRipple(e);
        velocityX = (Math.random() - 0.5) * 2;
        velocityY = (Math.random() - 0.5) * 2;
    });
}

function createQuantumRipple(e) {
    const ripple = document.createElement('div');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
        animation: quantumExplosion 1.5s ease-out forwards;
    `;
    
    e.currentTarget.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1500);
}

// Dimension Reveal System
function initDimensionReveal() {
    const dimensions = document.querySelectorAll('.content-dimension');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Quantum cascade effect
                const children = entry.target.querySelectorAll('.skill-matrix, .timeline-event, .project-hyper');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0) scale(1)';
                        createRevealParticles(child);
                    }, index * 120);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '-100px'
    });
    
    dimensions.forEach(dimension => {
        const children = dimension.querySelectorAll('.skill-matrix, .timeline-event, .project-hyper');
        children.forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px) scale(0.95)';
            child.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        observer.observe(dimension);
    });
}

function createRevealParticles(element) {
    const rect = element.getBoundingClientRect();
    const particles = 8;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(255,255,255,0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            animation: revealParticle 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Matrix Skills System
function initMatrixSkills() {
    const skillBars = document.querySelectorAll('.matrix-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const percentage = skillBar.closest('.skill-matrix').querySelector('.matrix-percentage').textContent;
                const numericValue = parseInt(percentage);
                
                setTimeout(() => {
                    skillBar.style.width = numericValue + '%';
                    animateSkillActivation(skillBar);
                }, 400);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

function animateSkillActivation(skillBar) {
    const matrix = skillBar.closest('.skill-matrix');
    matrix.style.background = 'rgba(255,255,255,0.02)';
    
    setTimeout(() => {
        matrix.style.background = 'rgba(255,255,255,0.01)';
    }, 800);
}

// Quantum Navigator
function initQuantumNavigator() {
    const dots = document.querySelectorAll('.navigator-dot');
    const dimensions = document.querySelectorAll('.content-dimension');
    
    // Click to navigate
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (dimensions[index]) {
                dimensions[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active dot with quantum prediction
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(dimensions).indexOf(entry.target);
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[index]) {
                    dots[index].classList.add('active');
                    animateDotActivation(dots[index]);
                }
            }
        });
    }, { threshold: 0.3 });
    
    dimensions.forEach(dimension => observer.observe(dimension));
}

function animateDotActivation(dot) {
    dot.style.transform = 'scale(1.3)';
    setTimeout(() => {
        dot.style.transform = 'scale(1)';
    }, 300);
}

// Hyper Interactions
function initHyperInteractions() {
    // Quantum ripple system
    const interactiveElements = document.querySelectorAll('.skill-matrix, .timeline-event, .project-hyper, .btn-hyper');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', function(e) {
            createHyperRipple(this, e);
        });
        
        // Quantum hover effects
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            createHoverParticles(this);
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.6s ease';
        });
    });
}

function createHyperRipple(element, e) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
        border-radius: 50%;
        animation: hyperRipple 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 800);
}

function createHoverParticles(element) {
    const rect = element.getBoundingClientRect();
    const particles = 3;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 5;
            left: ${Math.random() * rect.width}px;
            top: ${Math.random() * rect.height}px;
            animation: hoverParticle 0.6s ease-out forwards;
        `;
        
        element.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
}

// Quantum Physics System
function initQuantumPhysics() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes quantumExplosion {
            0% {
                transform: scale(1);
                opacity: 1;
                box-shadow: 0 0 0 0 rgba(255,255,255,0.8);
            }
            100% {
                transform: scale(30);
                opacity: 0;
                box-shadow: 0 0 0 10px rgba(255,255,255,0);
            }
        }
        
        @keyframes revealParticle {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
                opacity: 0;
            }
        }
        
        @keyframes hyperRipple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes hoverParticle {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Temporal Effects
function initTemporalEffects() {
    // Time-based animations
    let startTime = Date.now();
    
    function updateTemporalEffects() {
        const currentTime = Date.now();
        const elapsed = (currentTime - startTime) / 1000;
        
        // Pulsating elements based on time
        const pulsatingElements = document.querySelectorAll('.quantum-status, .navigator-dot.active');
        pulsatingElements.forEach(element => {
            const pulse = Math.sin(elapsed * 2) * 0.1 + 1;
            element.style.transform = `scale(${pulse})`;
        });
        
        requestAnimationFrame(updateTemporalEffects);
    }
    
    updateTemporalEffects();
}

// Performance Beyond
function initPerformanceBeyond() {
    // Quantum throttling
    let animationFrameId;
    
    window.addEventListener('scroll', () => {
        if (animationFrameId) return;
        
        animationFrameId = requestAnimationFrame(() => {
            // Performance-critical updates
            animationFrameId = null;
        });
    });
    
    // Memory management
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Clean up any associated data
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Utility Functions
function quantumRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function quantumLerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNeuralInterface,
        initQuantumField,
        initHyperPortrait,
        initDimensionReveal,
        initMatrixSkills,
        initQuantumNavigator,
        initHyperInteractions,
        initQuantumPhysics,
        initTemporalEffects,
        initPerformanceBeyond
    };
}
