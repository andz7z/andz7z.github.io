/* ANDZ — Lehadus Andrei */

// Home Section - Efecte speciale și animații
document.addEventListener('DOMContentLoaded', function() {
    initTitleEffects();
    initSmokeEffect();
    initLogoHover();
});

// Efecte pentru titlul principal
function initTitleEffects() {
    const titleWords = document.querySelectorAll('.title-word');
    
    titleWords.forEach(word => {
        // Efect hover - fum subtil
        word.addEventListener('mouseenter', (e) => {
            if (shouldReduceMotion()) return;
            
            const rect = word.getBoundingClientRect();
            createSmokeEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
        
        // Efect click - literă dispare și reapare
        word.addEventListener('click', (e) => {
            if (shouldReduceMotion()) return;
            
            const text = word.textContent;
            const letters = text.split('');
            
            // Ascunde temporar cuvântul
            word.style.opacity = '0';
            
            // Creează efect pentru fiecare literă
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    createLetterParticle(e.clientX, e.clientY, letter);
                }, index * 100);
            });
            
            // Reapar după 3 secunde
            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    word.style.transform = 'scale(1)';
                }, 300);
            }, 3000);
        });
        
        // Efect de glow la hover
        word.addEventListener('mousemove', (e) => {
            if (shouldReduceMotion()) return;
            
            const rect = word.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            word.style.background = `radial-gradient(circle at ${x}px ${y}px, 
                rgba(139, 92, 246, 0.3) 0%, 
                rgba(239, 68, 68, 0.2) 30%, 
                rgba(59, 130, 246, 0.1) 60%, 
                transparent 100%)`;
        });
        
        word.addEventListener('mouseleave', () => {
            word.style.background = 'var(--gradient-metal)';
            word.style.backgroundClip = 'text';
            word.style.webkitBackgroundClip = 'text';
        });
    });
}

// Efect de fum folosind Canvas
function initSmokeEffect() {
    const canvas = document.getElementById('smokeCanvas');
    const ctx = canvas.getContext('2d');
    
    // Setează dimensiunile canvas
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Particule pentru efectul de fum
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 15 + 5;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            this.life = 1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size *= 0.95;
            this.life *= 0.95;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    function animate() {
        if (!shouldReduceMotion()) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Actualizează și desenează particulele
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Elimină particulele care au dispărut
                if (particles[i].life < 0.01) {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Expune funcția pentru a fi folosită global
    window.createSmokeEffect = function(x, y) {
        if (shouldReduceMotion()) return;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y));
        }
    };
}

// Efect pentru logo
function initLogoHover() {
    const logo = document.querySelector('.logo-link');
    
    logo.addEventListener('mouseenter', () => {
        if (shouldReduceMotion()) return;
        
        logo.style.transform = 'scale(1.05)';
        logo.style.filter = 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))';
    });
    
    logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'scale(1)';
        logo.style.filter = 'none';
    });
    
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        if (shouldReduceMotion()) return;
        
        logo.style.transform = 'scale(0.95)';
        setTimeout(() => {
            logo.style.transform = 'scale(1)';
        }, 150);
        
        // Scroll la home
        document.getElementById('home').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
}

// Creează efect de particulă pentru litere
function createLetterParticle(x, y, letter) {
    const particle = document.createElement('div');
    particle.className = 'letter-particle';
    particle.textContent = letter;
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        color: white;
        font-size: 2rem;
        font-weight: bold;
        pointer-events: none;
        z-index: 1000;
        transition: all 2s cubic-bezier(0.2, 0.8, 0.2, 1);
        opacity: 1;
        transform: translate(0, 0) scale(1);
    `;
    
    document.body.appendChild(particle);
    
    // Animație pentru particulă
    requestAnimationFrame(() => {
        particle.style.transform = `translate(${Math.random() * 100 - 50}px, -100px) scale(0.5)`;
        particle.style.opacity = '0';
    });
    
    // Elimină particula după animație
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 2000);
}
