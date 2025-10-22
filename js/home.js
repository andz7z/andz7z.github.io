// home.js
function initHome() {
    initLiquidMetalBackground();
    initTextFragmentation();
    initTextEffects();
}

// Background cu efect de metal lichid
function initLiquidMetalBackground() {
    const homeSection = document.getElementById('home');
    let mouseX = 0;
    let mouseY = 0;
    
    // Adăugăm un canvas pentru efectele interactive
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    homeSection.appendChild(canvas);
    
    // Setăm dimensiunile canvas-ului
    function setCanvasSize() {
        canvas.width = homeSection.offsetWidth;
        canvas.height = homeSection.offsetHeight;
    }
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Track mouse position
    homeSection.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        drawLiquidMetal();
    });
    
    // Funcția de desenare a efectului de metal lichid
    function drawLiquidMetal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Creăm un gradient radial care urmărește mouse-ul
        const gradient = ctx.createRadialGradient(
            mouseX, mouseY, 0,
            mouseX, mouseY, 300
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Adăugăm niște "undele" de metal lichid
        for (let i = 0; i < 5; i++) {
            const waveX = mouseX + Math.sin(Date.now() / 1000 + i) * 50;
            const waveY = mouseY + Math.cos(Date.now() / 1000 + i) * 50;
            
            const waveGradient = ctx.createRadialGradient(
                waveX, waveY, 0,
                waveX, waveY, 150
            );
            
            waveGradient.addColorStop(0, 'rgba(180, 180, 180, 0.05)');
            waveGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = waveGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    // Animație continuă
    function animate() {
        drawLiquidMetal();
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Fragmentarea textului pentru efecte
function initTextFragmentation() {
    const taglineTexts = document.querySelectorAll('.tagline-text');
    
    taglineTexts.forEach(textElement => {
        const text = textElement.textContent;
        const letters = text.split('');
        
        // Înlăturăm conținutul original
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

// Efecte de text (fum și dispersie)
function initTextEffects() {
    const taglineTexts = document.querySelectorAll('.tagline-text');
    
    taglineTexts.forEach(textElement => {
        // Efect de fum la hover
        textElement.addEventListener('mouseenter', function() {
            this.classList.add('smoke-effect');
        });
        
        textElement.addEventListener('mouseleave', function() {
            this.classList.remove('smoke-effect');
        });
        
        // Efect de dispersie la click pe litere
        const letters = textElement.querySelectorAll('.letter');
        letters.forEach(letter => {
            letter.addEventListener('click', function() {
                // Animație de dispersie
                this.style.opacity = '0';
                this.style.transform = 'translateY(-50px) rotate(15deg)';
                
                // Revenire după 3-4 secunde
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.transform = 'none';
                }, 3000 + Math.random() * 1000);
            });
        });
    });
}
