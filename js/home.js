function initHome() {
    // Text animation for home section
    animateHomeText();
    
    // Social icons hover effects
    initSocialIcons();
}

function animateHomeText() {
    const line1 = document.querySelector('.line1');
    const line2 = document.querySelector('.line2');
    const line3 = document.querySelector('.line3');
    
    if (line1 && line2 && line3) {
        // Initial state
        gsap.set([line1, line2, line3], { opacity: 0, y: 50 });
        
        // Animate in sequence
        const tl = gsap.timeline();
        tl.to(line1, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
          .to(line2, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5")
          .to(line3, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5");
    }
}

function initSocialIcons() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}
