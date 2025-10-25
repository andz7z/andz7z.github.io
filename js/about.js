// Initializare la încărcarea paginii
document.addEventListener('DOMContentLoaded', function() {
    initScrollEffects();
    initSkillBars();
    initStatsCounter();
    initSkillCloud();
    initCardAnimations();
    initFloatingShapes();
});

// Efecte de scroll
function initScrollEffects() {
    const aboutSection = document.querySelector('.about-section');
    const elementsToAnimate = document.querySelectorAll('.card-3d, .timeline-item, .stat-item, .interactive-title, .skill-word');
    
    // Observer pentru animații la scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Efect de paralax pentru elementele de fundal
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Animații pentru barele de skill
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const barObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = `${width}%`;
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        barObserver.observe(bar);
    });
}

// Contor pentru statistici
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, 0, target, 2000);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(number => {
        counterObserver.observe(number);
    });
    
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// Inițializare nor de skill-uri
function initSkillCloud() {
    const skillWords = document.querySelectorAll('.skill-word');
    let delay = 3.6;
    
    skillWords.forEach((word, index) => {
        word.style.animationDelay = `${delay}s`;
        delay += 0.1;
        
        // Efect la hover
        word.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.1)';
            this.style.boxShadow = '0 15px 25px rgba(0, 0, 0, 0.4)';
        });
        
        word.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        // Efect la click
        word.addEventListener('click', function() {
            // Creează un efect de undă
            createRippleEffect(this);
            
            // Highlight temporar
            this.style.background = 'linear-gradient(145deg, var(--gray-600), var(--gray-700))';
            this.style.color = 'var(--white)';
            
            setTimeout(() => {
                this.style.background = 'linear-gradient(145deg, var(--gray-800), var(--gray-900))';
                this.style.color = 'var(--gray-200)';
            }, 1000);
        });
    });
}

// Efect de undă la click pe elemente
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Animații suplimentare pentru carduri
function initCardAnimations() {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const cardInner = this.querySelector('.card-inner');
            const cardRect = cardInner.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            cardInner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            const cardInner = this.querySelector('.card-inner');
            cardInner.style.transform = 'rotateY(0) rotateX(0)';
        });
    });
}

// Animații pentru formele plutitoare
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.floating-shape');
    
    shapes.forEach(shape => {
        // Adaugă o animație aleatorie pentru fiecare formă
        const randomDelay = Math.random() * 5;
        const randomDuration = 20 + Math.random() * 20;
        
        shape.style.animationDelay = `${randomDelay}s`;
        shape.style.animationDuration = `${randomDuration}s`;
        
        // Efect de interacțiune cu mouse-ul
        shape.addEventListener('mouseenter', function() {
            this.style.opacity = '0.2';
            this.style.transform = 'scale(1.2)';
        });
        
        shape.addEventListener('mouseleave', function() {
            this.style.opacity = '0.1';
            this.style.transform = 'scale(1)';
        });
    });
}

// Efect de tipărire pentru descriere
function initTypewriterEffect() {
    const descriptionElement = document.querySelector('.section-description');
    const text = descriptionElement.textContent;
    descriptionElement.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            descriptionElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Pornește efectul când elementul devine vizibil
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(descriptionElement);
}

// Inițializează efectul de tipărire
setTimeout(initTypewriterEffect, 1000);

// Efect de lumină care urmărește mouse-ul
document.addEventListener('mousemove', function(e) {
    const light = document.querySelector('.mouse-light');
    if (!light) {
        const newLight = document.createElement('div');
        newLight.classList.add('mouse-light');
        document.body.appendChild(newLight);
    }
    
    const lightElement = document.querySelector('.mouse-light');
    lightElement.style.left = `${e.clientX}px`;
    lightElement.style.top = `${e.clientY}px`;
});

// Adaugă stilul pentru efectul de lumină
const style = document.createElement('style');
style.textContent = `
    .mouse-light {
        position: fixed;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Efect de snow (fulgi de zăpadă monocromi)
function createSnowEffect() {
    const snowContainer = document.createElement('div');
    snowContainer.classList.add('snow-container');
    document.querySelector('.about-section').appendChild(snowContainer);
    
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Dimensiuni și opacitate aleatoare
        const size = Math.random() * 5 + 2;
        const opacity = Math.random() * 0.5 + 0.3;
        
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.opacity = opacity;
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 10 + 5}s`;
        snowflake.style.animationDelay = `${Math.random() * 5}s`;
        
        snowContainer.appendChild(snowflake);
    }
}

// Adaugă stilurile pentru fulgii de zăpadă
const snowStyle = document.createElement('style');
snowStyle.textContent = `
    .snow-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }
    
    .snowflake {
        position: absolute;
        background-color: white;
        border-radius: 50%;
        animation: fall linear infinite;
    }
    
    @keyframes fall {
        0% {
            transform: translateY(-100px) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(snowStyle);

// Pornește efectul de zăpadă
setTimeout(createSnowEffect, 2000);
