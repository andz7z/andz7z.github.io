// Services Section JavaScript
class ServicesSection {
    constructor() {
        this.cards = document.querySelectorAll('.service-card');
        this.modal = document.getElementById('serviceModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.closeModal = document.querySelector('.modal-close');
        this.ctaButtons = document.querySelectorAll('.service-cta');
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupCardTilt();
        this.setupHoverEffects();
        this.addRippleEffect();
    }
    
    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.querySelector('.services-section').appendChild(particlesContainer);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 6 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 8;
            const duration = Math.random() * 4 + 4;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    setupEventListeners() {
        // Modal functionality
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal(button.dataset.service);
            });
        });
        
        this.closeModal.addEventListener('click', () => {
            this.closeModalHandler();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModalHandler();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModalHandler();
            }
        });
        
        // Card click for mobile (since hover doesn't work well)
        if (window.innerWidth <= 768) {
            this.cards.forEach(card => {
                let isFlipped = false;
                card.addEventListener('click', () => {
                    isFlipped = !isFlipped;
                    card.querySelector('.card-inner').style.transform = isFlipped 
                        ? 'rotateY(180deg)' 
                        : 'rotateY(0deg)';
                });
            });
        }
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 200);
                    });
                }
            });
        }, observerOptions);
        
        const servicesSection = document.querySelector('.services-section');
        observer.observe(servicesSection);
    }
    
    setupCardTilt() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth > 768) {
                    this.tiltCard(e, card);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetCardTilt(card);
            });
        });
    }
    
    tiltCard(e, card) {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        
        const rotateX = (mouseY / (cardRect.height / 2)) * -4;
        const rotateY = (mouseX / (cardRect.width / 2)) * 4;
        
        const glowX = (mouseX / cardRect.width) * 60;
        const glowY = (mouseY / cardRect.height) * 60;
        
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        
        // Dynamic glow effect
        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');
        
        [front, back].forEach(side => {
            if (side) {
                side.style.background = `
                    linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.12) 0%, 
                        rgba(255, 255, 255, 0.08) 100%),
                    radial-gradient(circle at ${50 + glowX}% ${50 + glowY}%, 
                        rgba(255, 255, 255, 0.25) 0%, 
                        transparent 60%)
                `;
            }
        });
    }
    
    resetCardTilt(card) {
        card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        
        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');
        
        [front, back].forEach(side => {
            if (side) {
                side.style.background = '';
            }
        });
    }
    
    setupHoverEffects() {
        this.cards.forEach(card => {
            const inner = card.querySelector('.card-inner');
            const hint = card.querySelector('.card-hint');
            
            card.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    inner.style.transform = 'rotateY(180deg) translateZ(30px)';
                    card.style.zIndex = '10';
                    hint.style.background = 'rgba(255, 255, 255, 0.15)';
                    hint.style.color = '#ffffff';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    inner.style.transform = 'rotateY(0deg) translateZ(0px)';
                    card.style.zIndex = '1';
                    hint.style.background = '';
                    hint.style.color = '';
                }
            });
        });
    }
    
    openModal(serviceType) {
        const serviceData = this.getServiceData(serviceType);
        
        this.modalTitle.textContent = serviceData.title;
        this.modalDescription.textContent = serviceData.description;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 10);
    }
    
    closeModalHandler() {
        this.modal.style.opacity = '0';
        
        setTimeout(() => {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 400);
    }
    
    getServiceData(serviceType) {
        const services = {
            'web-dev': {
                title: 'Web Development',
                description: 'We create stunning, responsive websites that provide exceptional user experiences. Our web development services include modern frontend frameworks, robust backend solutions, and seamless integrations. From single-page applications to complex web platforms, we deliver scalable and maintainable code that drives business growth and ensures optimal performance across all devices.'
            },
            'programming': {
                title: 'Programming',
                description: 'Our programming expertise covers a wide range of technologies and platforms. We develop custom software solutions, optimize existing systems, and provide technical consulting. Whether you need desktop applications, mobile apps, or complex system architecture, we deliver clean, efficient code that meets your specific requirements and scales with your business needs.'
            },
            'video-editing': {
                title: 'Video Editing',
                description: 'Transform your raw footage into compelling visual stories. Our video editing services include professional color grading, motion graphics, visual effects, and audio enhancement. We work with various formats and deliver polished videos that captivate your audience and communicate your message effectively across all platforms and devices.'
            }
        };
        
        return services[serviceType] || {
            title: 'Service Details',
            description: 'Detailed information about this service will be provided soon.'
        };
    }
    
    addRippleEffect() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('service-cta') || 
                e.target.closest('.service-cta')) {
                const button = e.target.classList.contains('service-cta') 
                    ? e.target 
                    : e.target.closest('.service-cta');
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.classList.add('ripple');
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    }
}

// Initialize the services section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ServicesSection();
});

// Parallax effect for background
window.addEventListener('scroll', () => {
    const servicesSection = document.querySelector('.services-section');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    servicesSection.style.backgroundPosition = `center ${rate}px`;
});

// Resize handler to adjust effects for mobile
window.addEventListener('resize', () => {
    const cards = document.querySelectorAll('.service-card');
    
    if (window.innerWidth <= 768) {
        cards.forEach(card => {
            card.style.transform = 'none';
        });
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    // Trigger scroll animations on load
    setTimeout(() => {
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }, 500);
});

// Enhanced cursor effects
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.service-card');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(mouseX - cardX, 2) + Math.pow(mouseY - cardY, 2)
        );
        
        if (distance < 300) {
            const intensity = 1 - (distance / 300);
            card.style.setProperty('--hover-intensity', intensity);
        } else {
            card.style.setProperty('--hover-intensity', 0);
        }
    });
});

// Add CSS variables for dynamic effects
const dynamicStyles = `
    .service-card {
        --hover-intensity: 0;
    }
    
    .service-card:hover .card-icon::before {
        animation-duration: calc(3s / (1 + var(--hover-intensity)));
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);
