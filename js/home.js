// ===== HOME SECTION INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    initHeroVideo();
    initLetterInteractions();
    initScrollButton();
});

// Hero video setup
function initHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Ensure video plays correctly
        heroVideo.play().catch(e => {
            console.log('Hero video autoplay prevented:', e);
            // Fallback: Show poster image or try to play on user interaction
            document.addEventListener('click', function playVideoOnce() {
                heroVideo.play().catch(console.error);
                document.removeEventListener('click', playVideoOnce);
            });
        });
        
        // Optimize video loading
        heroVideo.setAttribute('preload', 'metadata');
        heroVideo.setAttribute('playsinline', '');
    }
}

// Letter interactions
function initLetterInteractions() {
    const letters = document.querySelectorAll('.letter:not([aria-label="space"])');
    const HIDE_DURATION = 3500; // 3.5 seconds
    
    letters.forEach(letter => {
        // Click/tap interaction
        letter.addEventListener('click', function() {
            hideLetter(this, HIDE_DURATION);
        });
        
        // Keyboard interaction
        letter.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hideLetter(this, HIDE_DURATION);
            }
        });
        
        // Enhanced hover effect
        letter.addEventListener('mouseenter', function() {
            if (!this.classList.contains('hidden')) {
                this.style.transform = 'scale(1.15)';
                this.style.filter = 'blur(1.5px) brightness(1.2)';
            }
        });
        
        letter.addEventListener('mouseleave', function() {
            if (!this.classList.contains('hidden')) {
                this.style.transform = 'scale(1)';
                this.style.filter = 'blur(0px) brightness(1)';
            }
        });
    });
}

function hideLetter(letter, duration) {
    if (letter.classList.contains('hidden')) return;
    
    // Hide the letter
    letter.classList.add('hidden');
    letter.setAttribute('aria-hidden', 'true');
    
    // Reappear after specified duration
    setTimeout(() => {
        letter.classList.remove('hidden');
        letter.setAttribute('aria-hidden', 'false');
        
        // Add entrance animation
        letter.style.animation = 'letterEntrance 0.6s ease';
        setTimeout(() => {
            letter.style.animation = '';
        }, 600);
    }, duration);
}

// Scroll button functionality
function initScrollButton() {
    const scrollButton = document.querySelector('.scroll-button');
    
    if (scrollButton) {
        scrollButton.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL
                history.pushState(null, null, '#about');
                
                // Focus for accessibility
                aboutSection.setAttribute('tabindex', '-1');
                aboutSection.focus();
            }
        });
        
        // Keyboard support
        scrollButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

// CSS for letter entrance animation
const style = document.createElement('style');
style.textContent = `
    @keyframes letterEntrance {
        0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
        }
        60% {
            opacity: 1;
            transform: scale(1.05) translateY(-5px);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        @keyframes letterEntrance {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    }
`;
document.head.appendChild(style);
