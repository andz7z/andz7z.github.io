// Initializare efecte și animații pentru sectiunea About Me
document.addEventListener('DOMContentLoaded', function() {
    // Inițializare particule
    initParticles();
    
    // Inițializare animații la scroll
    initScrollAnimations();
    
    // Inițializare bare de progres
    initProgressBars();
    
    // Inițializare efecte hover pentru carduri
    initHoverEffects();
    
    // Inițializare efecte speciale
    initSpecialEffects();
});

// Funcție pentru crearea particulelor animate
function initParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Dimensiuni aleatorii
    const size = Math.random() * 4 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Poziție aleatorie
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Opacitate aleatorie
    const opacity = Math.random() * 0.7 + 0.3;
    particle.style.opacity = opacity;
    
    // Adăugare în container
    container.appendChild(particle);
    
    // Animație particulă
    animateParticle(particle);
}

function animateParticle(particle) {
    // Viteze și direcții aleatorii
    const speedX = (Math.random() - 0.5) * 2;
    const speedY = (Math.random() - 0.5) * 2;
    
    let posX = parseFloat(particle.style.left);
    let posY = parseFloat(particle.style.top);
    
    function moveParticle() {
        posX += speedX;
        posY += speedY;
        
        // Verificare margini
        if (posX < 0 || posX > 100) {
            posX = Math.random() * 100;
        }
        if (posY < 0 || posY > 100) {
            posY = Math.random() * 100;
        }
        
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        requestAnimationFrame(moveParticle);
    }
    
    moveParticle();
}

// Funcție pentru animațiile la scroll
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animare bare de progres pentru elementele skills matrix
                if (entry.target.classList.contains('matrix-progress')) {
                    const percentage = entry.target.getAttribute('data-percentage');
                    setTimeout(() => {
                        entry.target.style.width = `${percentage}%`;
                    }, 300);
                }
            }
        });
    }, observerOptions);
    
    // Observare elemente pentru animații
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .matrix-progress');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// Funcție pentru inițializarea barelor de progres
function initProgressBars() {
    const progressBars = document.querySelectorAll('.matrix-progress');
    
    progressBars.forEach(bar => {
        // Setăm lățimea inițială la 0%
        bar.style.width = '0%';
    });
}

// Funcție pentru efecte hover
function initHoverEffects() {
    // Efect hover pentru cardurile tehnologiilor
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efect hover pentru butoane
    const buttons = document.querySelectorAll('.btn-3d, .cta-button-large');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Efect hover pentru cardul 3D
    const profileCard = document.querySelector('.profile-card-3d');
    
    // Adăugăm un event listener pentru click (pe dispozitive mobile)
    profileCard.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
}

// Funcție pentru efecte speciale
function initSpecialEffects() {
    // Efect de cursor personalizat
    const cursorEffect = document.createElement('div');
    cursorEffect.classList.add('cursor-effect');
    document.body.appendChild(cursorEffect);
    
    document.addEventListener('mousemove', function(e) {
        cursorEffect.style.left = `${e.clientX}px`;
        cursorEffect.style.top = `${e.clientY}px`;
    });
    
    // Adăugare stil pentru efectul cursorului
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .cursor-effect {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        }
        
        .cursor-effect::before {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    `;
    document.head.appendChild(cursorStyle);
    
    // Efect de paralaxă pentru fundal
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.about-grid-bg');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Efect de tipărire pentru titluri
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        typewriterEffect(heroTitle);
    }
}

// Efect de mașină de scris pentru titluri
function typewriterEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 100);
}

// Funcție pentru gestionarea rezize-ului ferestrei
window.addEventListener('resize', function() {
    // Reinițializare particule la redimensionare
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        initParticles();
    }
});

// Funcție pentru afișarea timpului real
function updateRealTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    // Găsim sau creăm elementul pentru afișarea orei
    let timeElement = document.querySelector('.real-time');
    if (!timeElement) {
        timeElement = document.createElement('div');
        timeElement.classList.add('real-time');
        timeElement.style.position = 'fixed';
        timeElement.style.bottom = '20px';
        timeElement.style.right = '20px';
        timeElement.style.color = 'rgba(255, 255, 255, 0.5)';
        timeElement.style.fontSize = '0.8rem';
        timeElement.style.zIndex = '1000';
        document.body.appendChild(timeElement);
    }
    
    timeElement.textContent = timeString;
}

// Actualizare orei la fiecare secundă
setInterval(updateRealTime, 1000);
updateRealTime();

// Efect de lumină care urmărește mouse-ul
document.addEventListener('mousemove', function(e) {
    const light = document.querySelector('.mouse-light');
    if (!light) {
        const newLight = document.createElement('div');
        newLight.classList.add('mouse-light');
        document.body.appendChild(newLight);
        
        const style = document.createElement('style');
        style.textContent = `
            .mouse-light {
                position: fixed;
                width: 200px;
                height: 200px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
                transform: translate(-50%, -50%);
                mix-blend-mode: screen;
            }
        `;
        document.head.appendChild(style);
    } else {
        light.style.left = `${e.clientX}px`;
        light.style.top = `${e.clientY}px`;
    }
});

// Efect de undă la click
document.addEventListener('click', function(e) {
    createRipple(e.clientX, e.clientY);
});

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    document.body.appendChild(ripple);
    
    // Stil pentru efectul de undă
    ripple.style.position = 'fixed';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9998';
    ripple.style.transition = 'all 0.6s ease-out';
    
    // Animație
    setTimeout(() => {
        ripple.style.width = '200px';
        ripple.style.height = '200px';
        ripple.style.opacity = '0';
    }, 10);
    
    // Ștergere după animație
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Efect de particule la hover pe butoane
const buttons = document.querySelectorAll('.btn-3d, .cta-button-large');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        createButtonParticles(e.target);
    });
});

function createButtonParticles(button) {
    const rect = button.getBoundingClientRect();
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.classList.add('button-particle');
            document.body.appendChild(particle);
            
            // Poziționare
            particle.style.position = 'fixed';
            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9997';
            
            // Animație
            const angle = (Math.PI * 2 / particleCount) * i;
            const distance = 30;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${targetX}px, ${targetY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-out'
            });
            
            // Ștergere după animație
            setTimeout(() => {
                particle.remove();
            }, 600);
        }, i * 50);
    }
}
