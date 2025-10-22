/* ANDZ — Lehadus Andrei */

class HomeSection {
    constructor() {
        this.words = [];
        this.letters = [];
        this.init();
    }

    init() {
        this.setupHeroText();
        this.setupLogoEffect();
        this.setupNavEffects();
        this.setupSocialLinks();
    }

    setupHeroText() {
        const heroWords = document.querySelectorAll('.word');
        
        heroWords.forEach((word, index) => {
            this.words.push(word);
            
            // Split words into letters for smoke effect
            const text = word.textContent;
            word.textContent = '';
            
            for (let i = 0; i < text.length; i++) {
                const letter = document.createElement('span');
                letter.textContent = text[i];
                letter.className = 'letter';
                letter.style.animationDelay = `${index * 0.1 + i * 0.05}s`;
                word.appendChild(letter);
                this.letters.push(letter);
            }

            // Add smoke effect on hover
            word.addEventListener('mouseenter', this.handleWordHover.bind(this));
            
            // Add click effect for letters
            word.addEventListener('click', this.handleWordClick.bind(this));
        });

        // Animate letters on load
        this.animateLetters();
    }

    animateLetters() {
        this.letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.animation = 'letterFadeIn 0.5s ease-out forwards';
            }, index * 50);
        });
    }

    handleWordHover(e) {
        const word = e.currentTarget;
        
        // Add subtle smoke effect
        word.classList.add('smoke-active');
        
        setTimeout(() => {
            word.classList.remove('smoke-active');
        }, 2000);
    }

    handleWordClick(e) {
        if (e.target.classList.contains('letter')) {
            const letter = e.target;
            this.animateLetter(letter);
        }
    }

    animateLetter(letter) {
        // Don't animate if already animating
        if (letter.classList.contains('fade-up') || letter.classList.contains('fade-in')) {
            return;
        }

        // Fade out animation
        letter.classList.add('fade-up');
        
        // Wait for fade out to complete, then fade in
        setTimeout(() => {
            letter.classList.remove('fade-up');
            letter.classList.add('fade-in');
            
            setTimeout(() => {
                letter.classList.remove('fade-in');
            }, 500);
        }, 3000); // 3 seconds before reappearing
    }

    setupLogoEffect() {
        const logo = document.querySelector('.logo-link');
        if (!logo) return;

        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.1)';
        });

        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1)';
        });
    }

    setupNavEffects() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const link = e.currentTarget;
                link.style.transform = 'translateY(-2px)';
            });

            link.addEventListener('mouseleave', (e) => {
                const link = e.currentTarget;
                link.style.transform = 'translateY(0)';
            });

            link.addEventListener('click', (e) => {
                e.preventDefault();
                const link = e.currentTarget;
                
                // Add click feedback
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = '';
                }, 150);
            });
        });
    }

    setupSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px) scale(1.1)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomeSection();
});
