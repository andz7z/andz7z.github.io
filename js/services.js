// services.js - VARIANTA CORECTATA

document.addEventListener('DOMContentLoaded', function() {
    initSuperServices();
});

function initSuperServices() {
    const servicesSection = document.querySelector('.services-section');
    const serviceCards = document.querySelectorAll('.service-card');
    const sectionTitle = document.querySelector('.section-title');
    const sectionDescription = document.querySelector('.section-description');
    
    // Create floating particles
    createFloatingParticles(servicesSection);
    
    // Create selection indicator
    createSelectionIndicator(serviceCards);
    
    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    [sectionTitle, sectionDescription, ...serviceCards].forEach(el => observer.observe(el));
    
    // SUPER INTERACTIVE CARD SYSTEM - CORECTAT
    let activeCard = null;
    
    serviceCards.forEach((card, index) => {
        // Mouse 3D effects - DOAR pentru carduri neactive
        card.addEventListener('mousemove', (e) => {
            if (activeCard === card) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            if (activeCard !== card) {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            }
        });
        
        // Click to activate - CORECTAT
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (activeCard === card) {
                // Deactivate current card
                deactivateCard(card);
                activeCard = null;
            } else {
                // Deactivate previous active card
                if (activeCard) {
                    deactivateCard(activeCard);
                }
                
                // Activate new card
                activateCard(card);
                activeCard = card;
                
                // Update selection indicator
                updateSelectionIndicator(index);
                
                // Create activation effect
                createActivationEffect(card);
            }
        });
        
        // Add close button to back side
        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-card';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deactivateCard(card);
            if (activeCard === card) activeCard = null;
            updateSelectionIndicator(-1);
        });
        
        card.querySelector('.card-back').appendChild(closeBtn);
    });
    
    // Close card when clicking outside - CORECTAT
    document.addEventListener('click', (e) => {
        if (activeCard && !activeCard.contains(e.target) && !e.target.classList.contains('indicator-dot')) {
            deactivateCard(activeCard);
            activeCard = null;
            updateSelectionIndicator(-1);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!activeCard) return;
        
        if (e.key === 'Escape') {
            deactivateCard(activeCard);
            activeCard = null;
            updateSelectionIndicator(-1);
        }
    });
    
    // Button interactions
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            createRippleEffect(e.target);
            
            const card = e.target.closest('.service-card');
            const service = card.dataset.service;
            
            // Simulate service selection
            simulateServiceSelection(service);
        });
    });
}

function createFloatingParticles(container) {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 4 + 4;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                opacity: ${Math.random() * 0.3 + 0.1};
            `;
            
            container.appendChild(particle);
        }, i * 500);
    }
}

function createSelectionIndicator(cards) {
    const indicator = document.createElement('div');
    indicator.className = 'selection-indicator';
    
    cards.forEach((card, index) => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        dot.dataset.service = card.dataset.service;
        
        dot.addEventListener('click', () => {
            card.click();
        });
        
        indicator.appendChild(dot);
    });
    
    document.body.appendChild(indicator);
}

function updateSelectionIndicator(activeIndex) {
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

function activateCard(card) {
    card.classList.add('active');
    card.style.transform = 'perspective(1000px) rotateY(180deg) translateZ(100px)';
    card.style.zIndex = '1000';
    
    // Add backdrop dimming - CORECTAT
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    document.body.appendChild(overlay);
}

function deactivateCard(card) {
    card.classList.remove('active');
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    card.style.zIndex = '';
    
    // Remove overlay
    const overlay = document.querySelector('.card-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function createActivationEffect(card) {
    // Create ripple effect from card center
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        width: 100px;
        height: 100px;
        border: 2px solid rgba(255,255,255,0.5);
        border-radius: 50%;
        left: ${centerX - 50}px;
        top: ${centerY - 50}px;
        pointer-events: none;
        z-index: 1001;
        animation: activateRipple 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    // Add keyframe if not exists
    if (!document.querySelector('#ripple-animations')) {
        const style = document.createElement('style');
        style.id = 'ripple-animations';
        style.textContent = `
            @keyframes activateRipple {
                0% {
                    transform: scale(0.5);
                    opacity: 1;
                }
                100% {
                    transform: scale(3);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 800);
}

function createRippleEffect(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: buttonRipple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

function simulateServiceSelection(service) {
    // Create selection confirmation effect
    const message = document.createElement('div');
    message.textContent = `Starting ${service.replace('-', ' ')} service...`;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(10px);
        z-index: 1002;
        font-family: 'Roboto', sans-serif;
        animation: messageAppear 0.5s ease, messageDisappear 0.5s ease 1.5s forwards;
    `;
    
    document.body.appendChild(message);
    
    // Add message animations
    if (!document.querySelector('#message-animations')) {
        const style = document.createElement('style');
        style.id = 'message-animations';
        style.textContent = `
            @keyframes messageAppear {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            @keyframes messageDisappear {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -40%);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 2000);
}

// Add the button ripple animation
const buttonRippleStyle = document.createElement('style');
buttonRippleStyle.textContent = `
    @keyframes buttonRipple {
        to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(buttonRippleStyle);
