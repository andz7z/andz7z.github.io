// Home Section Specific JavaScript
class HomeSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupHomeAnimations();
    }

    setupHomeAnimations() {
        // Additional home-specific animations can be added here
        console.log('Home section initialized');
    }
}

// Initialize home section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const homeSection = document.getElementById('home');
    if (homeSection && homeSection.classList.contains('active')) {
        new HomeSection();
    }
});
// Scroll animations for About Me section
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skill bars
    initSkillBars();
    
    // Scroll animations
    initScrollAnimations();
});

function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        
        // Animate after a delay
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 500);
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars when skills section is visible
                if (entry.target.classList.contains('skills-section')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sectionsToAnimate = document.querySelectorAll('.about-container, .skills-section, .timeline-section');
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 300);
    });
}

// 3D card interaction
document.addEventListener('DOMContentLoaded', function() {
    const card3d = document.querySelector('.card-3d');
    
    if (card3d) {
        card3d.addEventListener('mousemove', (e) => {
            const cardRect = card3d.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            const rotateY = (mouseX / cardRect.width) * 20;
            const rotateX = -(mouseY / cardRect.height) * 20;
            
            card3d.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });
        
        card3d.addEventListener('mouseleave', () => {
            card3d.style.transform = 'rotateY(0) rotateX(0)';
        });
    }
});
