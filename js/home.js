// Home Section JavaScript
class HomeModule {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupVideoBackground();
        this.setupMagneticEffects();
        this.setupTypewriterEffect();
    }
    
    setupVideoBackground() {
        const video = document.getElementById('bg-video');
        
        // Fallback if video doesn't load
        video.addEventListener('error', () => {
            console.log('Video failed to load, using fallback image');
            const fallback = video.querySelector('img');
            if (fallback) {
                video.style.display = 'none';
                fallback.style.display = 'block';
            }
        });
        
        // Ensure video plays when user interacts with page
        document.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(e => console.log('Video autoplay prevented:', e));
            }
        });
    }
    
    setupMagneticEffects() {
        const navIcons = document.querySelectorAll('.nav-icon');
        const socialIcons = document.querySelectorAll('.social-icon');
        
        // Combine all interactive elements
        const magneticElements = [...navIcons, ...socialIcons];
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', this.handleMagneticMove.bind(this));
            element.addEventListener('mouseleave', this.handleMagneticLeave.bind(this));
        });
    }
    
    handleMagneticMove(e) {
        const element = e.currentTarget;
        const bounding = element.getBoundingClientRect();
        
        // Calculate mouse position relative to element center
        const x = e.clientX - bounding.left - bounding.width / 2;
        const y = e.clientY - bounding.top - bounding.height / 2;
        
        // Apply transform based on mouse position
        const strength = 15;
        const moveX = (x / bounding.width) * strength;
        const moveY = (y / bounding.height) * strength;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    handleMagneticLeave(e) {
        const element = e.currentTarget;
        element.style.transform = 'translate(0, 0)';
    }
    
    setupTypewriterEffect() {
        const subtitle = document.querySelector('.subtitle');
        const text = '&lt;web dev & creative media/&gt;';
        let index = 0;
        
        // Clear initial text
        subtitle.innerHTML = '';
        
        function typeWriter() {
            if (index < text.length) {
                subtitle.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
        
    }
}
