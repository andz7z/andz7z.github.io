// Home section functionality
document.addEventListener('DOMContentLoaded', function() {
    initDesignText();
    initExploreButton();
});

// Design text interaction
function initDesignText() {
    const designText = document.getElementById('designText');
    const letters = designText.querySelectorAll('span');
    
    letters.forEach(letter => {
        // Hover effect
        letter.addEventListener('mouseenter', function() {
            this.style.filter = 'blur(2px)';
            this.style.transform = 'scale(1.1)';
        });
        
        letter.addEventListener('mouseleave', function() {
            this.style.filter = 'blur(0)';
            this.style.transform = 'scale(1)';
        });
        
        // Click effect
        letter.addEventListener('click', function() {
            this.classList.add('fade-out');
            
            setTimeout(() => {
                this.classList.remove('fade-out');
            }, 3000);
        });
    });
}

// Explore button functionality
function initExploreButton() {
    const exploreButton = document.getElementById('exploreButton');
    
    exploreButton.addEventListener('click', function() {
        // Scroll to about section
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const offsetTop = aboutSection.offsetTop;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}
