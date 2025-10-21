// Home section specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initHomeAnimations();
    initVideoBackground();
});

function initHomeAnimations() {
    // Text animation for home section
    const animatedText = document.querySelector('.animated-text');
    const letters = animatedText.textContent.split('');
    
    // Clear the text
    animatedText.textContent = '';
    
    // Add each letter with individual animation
    letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.animationDelay = `${index * 0.05}s`;
        animatedText.appendChild(span);
    });
    
    // Add hover effect for smoke/blur
    const textSpans = document.querySelectorAll('.animated-text span');
    
    textSpans.forEach(span => {
        span.addEventListener('mouseenter', function() {
            this.style.filter = 'blur(2px) brightness(1.5)';
            this.style.textShadow = '0 0 15px rgba(255, 255, 255, 0.8)';
            this.style.transition = 'all 0.3s ease';
        });
        
        span.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
            this.style.textShadow = 'none';
        });
    });
}

function initVideoBackground() {
    const video = document.getElementById('bgVideo');
    
    // Ensure video plays and loops correctly
    video.addEventListener('loadeddata', function() {
        video.play();
    });
    
    // Fallback if video doesn't load
    video.addEventListener('error', function() {
        console.log('Video failed to load, using fallback background');
        document.querySelector('.video-background').style.background = 'linear-gradient(135deg, #0a0a0a, #1a1a1a)';
    });
}
