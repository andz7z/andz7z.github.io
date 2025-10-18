document.addEventListener('DOMContentLoaded', () => {
    const aura = document.getElementById('mouseAura');
    const cards = document.querySelectorAll('.card.depth-effect');

    // 1. Efectul Aura/Gradient care urmează mouse-ul
    if (aura) {
        document.addEventListener('mousemove', (e) => {
            // Obținem poziția mouse-ului
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Folosim un requestAnimationFrame pentru animații mai fluide
            requestAnimationFrame(() => {
                // Mută aura la poziția mouse-ului
                aura.style.left = `${mouseX}px`;
                aura.style.top = `${mouseY}px`;
            });
        });
    }

    // 2. Efectul "Depth In" (Parallax subtil pe carduri)
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Calculăm poziția mouse-ului relativă la card (de la -50 la 50)
            const x = e.clientX - rect.left; // Coordonata X în card
            const y = e.clientY - rect.top; // Coordonata Y în card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Diferența față de centru (de la -centerX la +centerX)
            const deltaX = x - centerX;
            const deltaY = y - centerY;

            // Calculăm rotația/translația (valori mici pentru efect subtil)
            const rotateY = (deltaX / centerX) * -5; // Rotire Y
            const rotateX = (deltaY / centerY) * 5;  // Rotire X

            // Aplicăm transformarea 3D
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.03) /* Mărire subtilă la hover */
            `;
        });

        card.addEventListener('mouseleave', () => {
            // Reset la ieșirea mouse-ului
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
});
