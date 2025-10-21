// About Section JavaScript
class AboutModule {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }
    
    init() {
        this.setupSkillAnimations();
        this.setupImageHoverEffects();
        this.setupScrollAnimations();
    }
    
    setupSkillAnimations() {
        // Create Intersection Observer for skill bars
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        // Observe each skill bar
        this.skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    animateSkillBar(skillBar) {
        const targetWidth = skillBar.getAttribute('data-width') + '%';
        
        // Animate the width
        skillBar.style.width = targetWidth;
        
        // Add completion class for additional effects
        setTimeout(() => {
            skillBar.classList.add('completed');
        }, 1500);
    }
    
    setupImageHoverEffects() {
        const imageContainer = document.querySelector('.image-container');
        
        imageContainer.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = imageContainer.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            // Apply subtle 3D tilt effect
            imageContainer.style.transform = `
                perspective(1000px) 
                rotateY(${x * 5}deg) 
                rotateX(${y * -5}deg)
                scale3d(1.02, 1.02, 1.02)
            `;
        });
        
        imageContainer.addEventListener('mouseleave', () => {
            imageContainer.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
        });
    }
    
    setupScrollAnimations() {
        // Animate tools section on scroll
        const toolsSection = document.querySelector('.tools-section');
        const toolTags = document.querySelectorAll('.tool-tag');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    toolTags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.style.opacity = '1';
                            tag.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(toolsSection);
        
        // Set initial state for animation
        toolTags.forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(20px)';
            tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }
}
