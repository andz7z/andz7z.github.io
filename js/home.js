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
// Scroll animations and 3D interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D card interactions
    init3DCard();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize skill bars
    initSkillBars();
});

function init3DCard() {
    const card3d = document.querySelector('.card-3d');
    if (!card3d) return;

    let isHovering = false;
    let mouseX = 0;
    let mouseY = 0;
    let rotateY = 0;
    let rotateX = 0;

    // Mouse move interaction
    card3d.addEventListener('mousemove', (e) => {
        if (!isHovering) isHovering = true;
        
        const cardRect = card3d.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        
        mouseX = e.clientX - centerX;
        mouseY = e.clientY - centerY;
        
        // Calculate rotation based on mouse position
        rotateY = (mouseX / cardRect.width) * 20;
        rotateX = -(mouseY / cardRect.height) * 20;
        
        // Apply transformation with smooth transition
        card3d.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`;
        
        // Parallax effect for inner elements
        const front = card3d.querySelector('.card-front');
        const back = card3d.querySelector('.card-back');
        
        if (front) {
            front.style.transform = `translateX(${rotateY * 0.5}px) translateY(${rotateX * 0.5}px)`;
        }
        if (back) {
            back.style.transform = `translateX(${rotateY * 0.3}px) translateY(${rotateX * 0.3}px) rotateY(180deg)`;
        }
    });

    // Mouse leave - reset to original state
    card3d.addEventListener('mouseleave', () => {
        isHovering = false;
        
        card3d.style.transform = 'rotateY(0) rotateX(0) scale(1)';
        card3d.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        
        const front = card3d.querySelector('.card-front');
        const back = card3d.querySelector('.card-back');
        
        if (front) front.style.transform = 'translateX(0) translateY(0)';
        if (back) back.style.transform = 'rotateY(180deg)';
        
        setTimeout(() => {
            card3d.style.transition = '';
        }, 800);
    });

    // Click to flip card
    card3d.addEventListener('click', () => {
        const isFlipped = card3d.classList.contains('flipped');
        
        if (isFlipped) {
            card3d.classList.remove('flipped');
            card3d.style.transform = 'rotateY(0) rotateX(0)';
        } else {
            card3d.classList.add('flipped');
            card3d.style.transform = 'rotateY(180deg)';
        }
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate timeline items sequentially
                if (entry.target.classList.contains('timeline-section')) {
                    animateTimelineItems();
                }
                
                // Animate skill bars when skills section is visible
                if (entry.target.classList.contains('skills-section')) {
                    setTimeout(() => {
                        animateSkillBars();
                    }, 300);
                }
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sectionsToAnimate = document.querySelectorAll('.profile-section, .timeline-section, .skills-section');
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });
}

function animateTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 300);
    });
}

function initSkillBars() {
    // Initial setup - bars at 0%
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        
        setTimeout(() => {
            bar.style.width = width + '%';
            bar.style.transition = 'width 1.5s cubic-bezier(0.22, 0.61, 0.36, 1)';
        }, index * 200);
    });
}

// Add CSS for flipped state
const style = document.createElement('style');
style.textContent = `
    .card-3d.flipped {
        transform: rotateY(180deg) !important;
    }
    
    .card-3d.flipped .card-front {
        opacity: 0;
    }
    
    .card-3d.flipped .card-back {
        opacity: 1;
    }
`;
document.head.appendChild(style);
