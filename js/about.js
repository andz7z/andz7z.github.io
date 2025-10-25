// About Section JavaScript
class AboutSection {
    constructor() {
        this.init();
    }

    init() {
        this.initParticles();
        this.initScrollAnimations();
        this.initCounters();
        this.initSkillBars();
        this.initCardEffects();
        this.initScrollProgress();
        this.initMouseEffects();
    }

    // Particles.js Initialization
    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#ffffff" },
                    shape: { type: "circle" },
                    opacity: { value: 0.1, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#ffffff",
                        opacity: 0.1,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "repulse" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Staggered animations for child elements
                    if (entry.target.classList.contains('specialties-grid')) {
                        this.animateStaggered(entry.target.children, 0.2);
                    }
                    
                    if (entry.target.classList.contains('stats-container')) {
                        this.animateStaggered(entry.target.children, 0.3);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        animatedElements.forEach(el => observer.observe(el));

        // Add animation classes dynamically
        this.addAnimationClasses();
    }

    addAnimationClasses() {
        // Header animations
        document.querySelector('.header-section').classList.add('fade-in');
        
        // Profile section animations
        document.querySelector('.profile-card').classList.add('scale-in');
        document.querySelector('.stats-container').classList.add('slide-in-right');
        
        // Description section animations
        document.querySelector('.bio-card').classList.add('slide-in-left');
        document.querySelector('.tech-stack').classList.add('fade-in');
        document.querySelector('.specialties-grid').classList.add('fade-in');
        
        // CTA animations
        document.querySelector('.cta-section').classList.add('fade-in');
    }

    animateStaggered(elements, delay) {
        Array.from(elements).forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * delay * 1000);
        });
    }

    // Counter Animation
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.parentElement.getAttribute('data-count'));
                    this.animateCounter(target, 0, finalValue, speed);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element, start, end, duration) {
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

    // Skill Bars Animation
    initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const width = skillBar.getAttribute('data-width') + '%';
                    setTimeout(() => {
                        skillBar.style.width = width;
                    }, 300);
                    observer.unobserve(skillBar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // Card Effects
    initCardEffects() {
        const cards = document.querySelectorAll('.stat-card, .specialty-item');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.handleCardTilt(e, card);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    handleCardTilt(e, card) {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const rotateX = (mouseY / cardRect.height) * -10;
        const rotateY = (mouseX / cardRect.width) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    // Scroll Progress
    initScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-progress');
        
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // Mouse Effects
    initMouseEffects() {
        const section = document.querySelector('.about-section');
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        section.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
                mix-blend-mode: difference;
            }
        `;
        document.head.appendChild(style);
    }

    // Parallax Effect
    initParallax() {
        const shapes = document.querySelectorAll('.floating-shape');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            shapes.forEach((shape, index) => {
                const speed = 0.3 + (index * 0.1);
                shape.style.transform = `translateY(${rate * speed}px)`;
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutSection();
});

// Additional utility functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutSection;
}
