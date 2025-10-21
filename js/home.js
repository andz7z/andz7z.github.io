/* js/home.js */

/**
 * Efect Magnetic pentru Navigare (Req 2)
 * -------------------------------------
 * Aplică un efect de "atracție" link-urilor din bara de navigare
 * atunci când mouse-ul se apropie de ele.
 * * Cum funcționează:
 * 1. Adăugăm un listener 'mousemove' pe fiecare element magnetic.
 * 2. Calculăm poziția cursorului relativ la centrul elementului.
 * 3. Aplicăm un 'transform: translate(x, y)' pentru a muta elementul
 * spre cursor, cu o forță redusă (ex: 30% din distanță).
 * 4. La 'mouseleave', resetăm transformarea.
 */
document.addEventListener('DOMContentLoaded', () => {
    const magneticLinks = document.querySelectorAll('.nav-link-magnetic');
    
    // Factorul de "putere" a magnetului (0.3 = 30%)
    const magneticStrength = 0.3;

    magneticLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            
            // Calculează centrul elementului
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculează distanța de la cursor la centru
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            // Aplică transformarea (mișcă 30% din distanță)
            // Se folosește 'transform' pentru performanță (accelerare GPU)
            link.style.transform = `translate(${deltaX * magneticStrength}px, ${deltaY * magneticStrength}px)`;
        });

        link.addEventListener('mouseleave', () => {
            // Resetează poziția la părăsirea mouse-ului
            link.style.transform = 'translate(0, 0)';
        });
    });
});
