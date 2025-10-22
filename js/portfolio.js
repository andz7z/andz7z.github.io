/* ANDZ — Lehadus Andrei */
'use strict';

function initPortfolioAnimations() {
    
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    if (!portfolioCards.length) return;

    // Constante pentru efect
    const MAX_ROTATION = 10; // Grade maxime de rotație

    portfolioCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Verificăm dacă utilizatorul preferă mișcare redusă
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                return;
            }

            const cardRect = card.getBoundingClientRect();
            
            // Calculăm poziția mouse-ului relativ la centrul cardului
            const x = e.clientX - cardRect.left - cardRect.width / 2;
            const y = e.clientY - cardRect.top - cardRect.height / 2;

            // Calculăm rotația
            // Inversăm 'y' pentru rotația X (mouse sus -> card înclinat în jos)
            // 'x' rămâne normal pentru rotația Y (mouse dreapta -> card rotit dreapta)
            const rotateY = (x / (cardRect.width / 2)) * MAX_ROTATION;
            const rotateX = -(y / (cardRect.height / 2)) * MAX_ROTATION;

            // Aplicăm transformarea direct pe element
            // Adăugăm 'scale(1.05)' pentru a accentua efectul 3D
            card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            // Resetăm transformarea la starea inițială (cea din CSS)
            card.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}
