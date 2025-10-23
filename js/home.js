/*
 * HOME.JS
 * * Logică specifică secțiunii #home:
 * - Efect de Parallax la mișcarea mouse-ului
 * - Efecte de Click (Pulse/Ripple) pe iconițe
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const homeSection = document.querySelector('#home');
    const homeBackground = document.querySelector('.home-background');
    const navIcons = document.querySelectorAll('.nav-icon');
    const socialIcons = document.querySelectorAll('.socials-container a');

    // 1. ======== MOUSE PARALLAX EFFECT ========
    if (homeBackground) {
        homeSection.addEventListener('mousemove', (e) => {
            // Verificăm dacă nu suntem pe mobil (unde mousemove poate fi problematic)
            if (window.innerWidth > 1024) {
                const { clientX, clientY } = e;
                const { offsetWidth, offsetHeight } = homeSection;
                
                // Calculăm poziția mouse-ului față de centrul ecranului (-1 to 1)
                const x = (clientX / offsetWidth - 0.5) * 2; // -1 (stânga) la 1 (dreapta)
                const y = (clientY / offsetHeight - 0.5) * 2; // -1 (sus) la 1 (jos)

                // Definim intensitatea mișcării (foarte subtil)
                const moveIntensity = 1.5; // în procente

                // Aplicăm transformarea pe fundal
                // (Fundalul e deja la -5% top/left și 110% width/height)
                const newX = -5 - (x * moveIntensity);
                const newY = -5 - (y * moveIntensity);
                
                homeBackground.style.transform = `translate(${newX}%, ${newY}%)`;
            }
        });
    }


    // 2. ======== CLICK PULSE EFFECT (Nav Icons) ========
    navIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // Adăugăm clasa 'pulse'
            icon.classList.add('pulse');
            
            // Eliminăm clasa după terminarea animației
            setTimeout(() => {
                icon.classList.remove('pulse');
            }, 600); // Durata animației 'pulse-white-icon'
        });
    });

    // 3. ======== CLICK PULSE EFFECT (Social Icons) ========
    socialIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            icon.classList.add('pulse');
            setTimeout(() => {
                icon.classList.remove('pulse');
            }, 500); // Durata animației 'pulse-white'
        });
    });

});
