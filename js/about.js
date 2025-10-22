// About section specific functionality

class AboutSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkillsAnimation();
    }

    setupSkillsAnimation() {
        const skills = document.querySelectorAll('.skill-tag');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(document.getElementById('about'));
    }

    animateSkills() {
        const skills = document.querySelectorAll('.skill-tag');
        
        skills.forEach((skill, index) => {
            skill.style.opacity = '0';
            skill.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                skill.style.transition = 'all 0.5s ease';
                skill.style.opacity = '1';
                skill.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Initialize about section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutSection();
});
