// Home section specific functionality

function initHome() {
    console.log('Home section initialized');
    
    initNavIcons();
    initSocialIcons();
    initMouseEffects();
}

// Navigation Icons
function initNavIcons() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        // Ripple effect
        item.addEventListener('click', function(e) {
            createRipple(e, this);
            
            // Pulse effect
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 500);
            
            // Navigate to section
            const target = this.getAttribute('data-target');
            const targetSection = document.getElementById(target);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Social Icons
function initSocialIcons() {
    const socialItems = document.querySelectorAll('.social-item');
    
    socialItems.forEach(item => {
        item.addEventListener('click', function(e) {
            createRipple(e, this);
            
            // Pulse effect
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 500);
        });
    });
}

// Ripple Effect Creator
function createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    const rect = element.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    
    // Remove existing ripples
    const ripple = element.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    element.appendChild(circle);
    
    // Remove ripple after animation
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Mouse Effects
function initMouseEffects() {
    const homeSection = document.getElementById('home');
    
    homeSection.addEventListener('mousemove', function(e) {
        const { clientX, clientY } = e;
        const { width, height } = homeSection.getBoundingClientRect();
        
        const xPos = (clientX / width - 0.5) * 10;
        const yPos = (clientY / height - 0.5) * 10;
        
        // Subtle parallax effect on background
        const bgImage = document.querySelector('.background-image');
        bgImage.style.transform = `translate(${xPos * 0.5}px, ${yPos * 0.5}px)`;
        
        // Subtle movement on navigation icons
        const navIcons = document.querySelector('.nav-icons');
        navIcons.style.transform = `translate(calc(-50% + ${xPos * 0.2}px), calc(-50% + ${yPos * 0.2}px))`;
    });
}

// Export for global access
window.initHome = initHome;
