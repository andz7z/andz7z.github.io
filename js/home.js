// Home section specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initHomeInteractions();
});

function initHomeInteractions() {
    const mainText = document.getElementById('main-text');
    const scrollDown = document.getElementById('scroll-down');
    
    // Main text click - evaporation effect
    if (mainText) {
        mainText.addEventListener('click', function() {
            // Add evaporating class
            this.classList.add('evaporating');
            
            // Remove evaporating class and add reappearing after animation completes
            setTimeout(() => {
                this.classList.remove('evaporating');
                this.classList.add('reappearing');
                
                // Remove reappearing class after animation completes
                setTimeout(() => {
                    this.classList.remove('reappearing');
                }, 1000);
            }, 1000);
        });
    }
    
    // Scroll down arrow click - scroll to about section
    if (scrollDown) {
        scrollDown.addEventListener('click', function() {
            smoothScrollTo(document.getElementById('about'));
        });
    }
}

// Reuse smoothScrollTo from main script or define if needed
function smoothScrollTo(element) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}
