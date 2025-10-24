// About Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize About Section
    initAboutSection();
    
    // Initialize Skill Bars Animation
    initSkillBars();
    
    // Initialize Stats Counter
    initStatsCounter();
    
    // Initialize Team Cards Animation
    initTeamCards();
    
    // Initialize Floating Cube
    initFloatingCube();
    
    // Initialize Scroll Animations
    initScrollAnimations();
});

// Initialize About Section
function initAboutSection() {
    console.log('About Section Initialized');
    
    // Add intersection observer for about section
    const aboutSection = document.querySelector('.about-section');
    const aboutTitle = document.querySelector('.about-title');
    const aboutDescription = document.querySelector('.about-description');
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutTitle.style.animation = 'fadeInUp 1s ease forwards';
                aboutDescription.style.animation = 'fadeInUp 1s ease 0.3s forwards';
                
                // Start cube animation
                const cube = document.querySelector('.floating-cube');
                if (cube) {
                    cube.style.animationPlayState = 'running';
                }
            }
        });
    }, { threshold: 0.3 });
    
    aboutObserver.observe(aboutSection);
}

// Initialize Skill Bars Animation
function initSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target.querySelector('.skill-bar');
                const percentage = skillBar.getAttribute('data-percentage');
                
                // Animate skill bar after a short delay
                setTimeout(() => {
                    skillBar.style.width = percentage + '%';
                }, 300);
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillCards.forEach(card => {
        skillObserver.observe(card);
    });
}

// Initialize Stats Counter
function initStatsCounter() {
    const statCards = document.querySelectorAll('.stat-card');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const targetNumber = parseInt(statNumber.getAttribute('data-target'));
                
                animateCounter(statNumber, 0, targetNumber, 2000);
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => {
        statsObserver.observe(card);
    });
}

// Animate Counter
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const value = Math.floor(easeOutQuart * (end - start) + start);
        
        // Format number with commas
        element.textContent = value.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize Team Cards Animation
function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                teamObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    teamCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.animationDelay = (index * 0.1) + 's';
        teamObserver.observe(card);
    });
}

// Initialize Floating Cube
function initFloatingCube() {
    const cube = document.querySelector('.floating-cube');
    
    if (!cube) return;
    
    // Pause animation initially
    cube.style.animationPlayState = 'paused';
    
    // Add mousemove effect
    document.addEventListener('mousemove', (e) => {
        if (!cube) return;
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        cube.style.transform = `rotateX(${-yAxis}deg) rotateY(${xAxis}deg)`;
    });
    
    // Add mouse leave effect
    document.addEventListener('mouseleave', () => {
        if (!cube) return;
        
        cube.style.transform = 'rotateX(-15deg) rotateY(15deg)';
    });
}

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
        
        .about-title, .about-description {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.about-subtitle, .about-paragraph, .skills-title, .team-title, .stats-title, .cta-title, .cta-description');
    
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

// Add parallax effect to about section background
function initParallaxEffect() {
    const aboutSection = document.querySelector('.about-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        aboutSection.style.backgroundPosition = `0px ${rate}px`;
    });
}

// Initialize interactive elements
function initInteractiveElements() {
    // Add click effect to skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Add hover effect to team cards
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAboutSection,
        initSkillBars,
        initStatsCounter,
        initTeamCards,
        initFloatingCube,
        initScrollAnimations,
        initParallaxEffect,
        initInteractiveElements
    };
}
