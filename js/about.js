// About Section - Next Level JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize About Section
    initAboutSection();
    
    // Create Floating Particles
    createParticles();
    
    // Initialize 3D Profile Card
    init3DProfileCard();
    
    // Initialize Skill Bars
    initSkillBars();
    
    // Initialize Timeline Animation
    initTimelineAnimation();
    
    // Initialize Tech Stack Animation
    initTechStackAnimation();
    
    // Initialize Scroll Animations
    initScrollAnimations();
    
    // Initialize Interactive Elements
    initInteractiveElements();
});

// Initialize About Section
function initAboutSection() {
    console.log('🚀 Next Level About Section Initialized');
    
    // Add parallax effect to grid background
    const gridBg = document.querySelector('.about-grid-bg');
    window.addEventListener('scroll', () => {
        if (gridBg) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            gridBg.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Create Floating Particles
function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 6;
        
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.animationDelay = `-${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize 3D Profile Card
function init3DProfileCard() {
    const profileCard = document.querySelector('.profile-card-3d');
    if (!profileCard) return;
    
    let isFlipped = false;
    
    // Auto-flip every 8 seconds
    setInterval(() => {
        isFlipped = !isFlipped;
        profileCard.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
    }, 8000);
    
    // Click to flip
    profileCard.addEventListener('click', () => {
        isFlipped = !isFlipped;
        profileCard.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
    });
    
    // Mouse move effect
    document.addEventListener('mousemove', (e) => {
        if (!isFlipped) return;
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        profileCard.style.transform = `rotateY(180deg) rotateX(${yAxis}deg) rotateY(${xAxis}deg)`;
    });
}

// Initialize Skill Bars
function initSkillBars() {
    const matrixItems = document.querySelectorAll('.matrix-item');
    
    const matrixObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.matrix-progress');
                const percentage = progressBar.getAttribute('data-percentage');
                
                // Animate progress bar
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                }, 300);
                
                matrixObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    matrixItems.forEach(item => {
        matrixObserver.observe(item);
    });
}

// Initialize Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.animationDelay = (index * 0.2) + 's';
        timelineObserver.observe(item);
    });
}

// Initialize Stats Counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const progressCircles = document.querySelectorAll('.progress-ring-circle');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate numbers
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateNumber(stat, 0, target, 2000);
                });
                
                // Animate progress circles
                progressCircles.forEach(circle => {
                    const progressContainer = circle.closest('.circle-progress');
                    const percentage = parseInt(progressContainer.getAttribute('data-percentage'));
                    animateProgressCircle(circle, percentage);
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// Animate number counter
function animateNumber(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate progress circle
function animateProgressCircle(circle, percentage) {
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
        circle.style.strokeDashoffset = offset;
    }, 300);
}

// Add to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // Initialize Stats Counter
    initStatsCounter();
});

// Initialize Scroll Animations
function initScrollAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            50% {
                opacity: 1;
                transform: scale(1.05);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .about-title, .about-description, .hero-badge, .hero-title, .hero-description, .cta-buttons, .section-title {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.about-title, .about-description, .hero-badge, .hero-title, .hero-description, .cta-buttons, .section-title, .cta-title, .cta-description');
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                elementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        elementObserver.observe(el);
    });
}

// Initialize Interactive Elements
function initInteractiveElements() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-3d, .cta-button-large');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.className = 'ripple';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAboutSection,
        createParticles,
        init3DProfileCard,
        initSkillBars,
        initTimelineAnimation,
        initTechStackAnimation,
        initScrollAnimations,
        initInteractiveElements
    };
}
