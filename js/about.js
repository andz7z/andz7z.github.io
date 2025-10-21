// ===== MODUL ABOUT - JAVASCRIPT SPECIFIC PENTRU SECȚIUNEA ABOUT =====

function initializeAboutModule() {
    console.log('About module initialized');
    
    // Inițializează animațiile și interacțiunile specifice secțiunii About
    setupSkillItems();
}

function animateAboutSection() {
    const aboutContent = document.querySelector('.about-content');
    
    if (aboutContent && !aboutContent.classList.contains('animated')) {
        aboutContent.classList.add('animated');
        
        // Animație pentru fiecare skill item
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            item.style.animationDelay = `${0.5 + index * 0.1}s`;
        });
    }
}

function setupSkillItems() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        // Efect de hover îmbunătățit
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Animație la click
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Export funcții pentru utilizare globală (dacă este necesar)
window.animateAboutSection = animateAboutSection;
