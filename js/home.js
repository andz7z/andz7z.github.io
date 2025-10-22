// home.js
function initHome() {
    // Fragmentarea textului în litere individuale
    fragmentText();
    
    // Efectul de fum la hover
    initSmokeEffect();
    
    // Efectul de dispersie la click pe litere
    initLetterDispersion();
}

function fragmentText() {
    const taglineTexts = document.querySelectorAll('.tagline-text');
    
    taglineTexts.forEach(textElement => {
        const text = textElement.textContent;
        const letters = text.split('');
        
        // Ștergem conținutul original
        textElement.textContent = '';
        
        // Adăugăm fiecare literă ca element span separat
        letters.forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.classList.add('letter');
            textElement.appendChild(span);
        });
    });
}

function initSmokeEffect() {
    const taglineRows = document.querySelectorAll('.tagline-row');
    const smokeEffect = document.createElement('div');
    smokeEffect.classList.add('smoke-effect');
    document.querySelector('.tagline').appendChild(smokeEffect);
    
    taglineRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            smokeEffect.classList.add('active');
            createSmokeParticles();
        });
        
        row.addEventListener('mouseleave', function() {
            smokeEffect.classList.remove('active');
        });
    });
}

function createSmokeParticles() {
    const smokeEffect = document.querySelector('.smoke-effect');
    const particlesCount = 15;
    
    // Ștergem particulele existente
    smokeEffect.innerHTML = '';
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('smoke-particle');
        
        // Poziție aleatorie
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Dimensiune aleatorie
        const size = 50 + Math.random() * 100;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Animare cu întârziere aleatorie
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;
        
        smokeEffect.appendChild(particle);
    }
}

function initLetterDispersion() {
    const letters = document.querySelectorAll('.letter');
    
    letters.forEach(letter => {
        letter.addEventListener('click', function() {
            // Animăm litera pentru dispersie
            this.style.opacity = '0';
            this.style.transform = 'translateY(-50px) rotate(15deg)';
            
            // Resetăm după 3-4 secunde
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.transform = 'none';
            }, 3000 + Math.random() * 1000);
        });
    });
}
