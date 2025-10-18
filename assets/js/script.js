document.addEventListener('DOMContentLoaded', () => {
    const aura = document.getElementById('mouseAura');
    const cards = document.querySelectorAll('.card.depth-effect');
    const particleContainer = document.getElementById('particlesContainer');

    // --- 1. Aura Reactivă la Mouse (Fluiditate cu GSAP) ---
    if (aura) {
        // Obiect proxy pentru a stoca poziția curentă a mouse-ului (pentru GSAP)
        const mouse = { x: 0, y: 0 };
        const pos = { x: 0, y: 0 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Loop-ul de animație al GSAP - asigură cea mai fluidă mișcare
        gsap.to(pos, {
            duration: 0.5, // Timpul de întârziere pentru fluiditate
            x: mouse.x,
            y: mouse.y,
            repeat: -1,
            onRepeat: () => {
                // Actualizează poziția aura la fiecare cadru
                pos.x += (mouse.x - pos.x) * 0.1; 
                pos.y += (mouse.y - pos.y) * 0.1;
                gsap.set(aura, {
                    x: pos.x,
                    y: pos.y,
                    // Deplasare cu -50% pentru a centra elementul
                    xPercent: -50,
                    yPercent: -50
                });
            }
        });
    }


    // --- 2. Efectul "Depth In" (Parallax 3D pe Carduri) ---
    cards.forEach(card => {
        const depth = parseFloat(card.getAttribute('data-depth')); // Factor de adâncime
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Poziția mouse-ului în card (de la 0 la Lățime/Înălțime)
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top; 
            
            // Calculăm deviația față de centru (-1 la 1)
            const devX = (x / rect.width) * 2 - 1; 
            const devY = (y / rect.height) * 2 - 1;  
            
            // Rotirea este invers proporțională cu deviația (pentru efectul "înăuntru")
            const rotateY = devX * -15 * depth; // Rotire Y
            const rotateX = devY * 15 * depth;  // Rotire X

            gsap.to(card, {
                duration: 0.5,
                ease: "power2.out",
                rotationX: rotateX,
                rotationY: rotateY,
                transformOrigin: "center center",
                // Aplicăm o mișcare subtilă de translație pe Z pentru profunzime
                z: 20 * depth, 
                scale: 1.05
            });
        });

        card.addEventListener('mouseleave', () => {
            // Reset la ieșirea mouse-ului, cu animație fluidă
            gsap.to(card, {
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                rotationX: 0,
                rotationY: 0,
                z: 0,
                scale: 1
            });
        });
    });


    // --- 3. Generarea Particulelor Subtile (Simple JS) ---
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Dimensiune mică, aleatorie
        const size = Math.random() * 2 + 1; // 1px la 3px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Poziție inițială aleatorie
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;

        particleContainer.appendChild(particle);

        // Animație GSAP: Mișcare lentă și buclă de fade
        gsap.to(particle, {
            x: (Math.random() - 0.5) * 50, // Mișcare laterală mică
            y: (Math.random() - 0.5) * 50, // Mișcare verticală mică
            opacity: Math.random() * 0.5 + 0.1,
            duration: Math.random() * 15 + 10, // Durată lungă pentru mișcare lentă
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true // Întoarcere în buclă (înainte-înapoi)
        });

        // Efect subtil de glow
        particle.style.boxShadow = `0 0 ${size * 5}px var(--color-accent-neon)`;
    }

    // Generează un număr mic de particule pentru a fi subtil
    for (let i = 0; i < 50; i++) {
        createParticle();
    }
});
