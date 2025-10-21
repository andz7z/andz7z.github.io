/* js/services.js */

/**
 * Efect 3D pe Cardurile de Servicii (Req 5)
 * -----------------------------------------
 * Rotește cardurile în spațiu 3D în funcție de poziția mouse-ului
 * deasupra lor.
 * * Cum funcționează:
 * 1. Adăugăm un listener 'mousemove' pe fiecare card.
 * 2. Calculăm poziția cursorului relativ la centrul cardului.
 * 3. Normalizăm această poziție într-un unghi de rotație.
 * 4. Aplicăm 'transform: perspective(...) rotateX(...) rotateY(...)'.
 * 5. La 'mouseleave', resetăm rotația.
 */
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');

    // Factorul de rotație (un număr mai mic = rotație mai pronunțată)
    const rotationFactor = 15;

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Poziția mouse-ului relativă la card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Centrul cardului
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculul rotației
            // Rotația Y depinde de poziția X a mouse-ului
            // Rotația X depinde de poziția Y a mouse-ului (și este inversată)
            const rotateY = (x - centerX) / rotationFactor;
            const rotateX = (centerY - y) / rotationFactor; // Inversat

            // Aplică transformarea 3D
            card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            // Resetează transformarea
            card.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
});
