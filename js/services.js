// JavaScript specific pentru secțiunea Services.

document.addEventListener('DOMContentLoaded', () => {
    
    const cards3D = document.querySelectorAll('.card-3d');
    
    cards3D.forEach(card => {
        const cardContent = card.querySelector('.card-3d-content');
        
        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            
            // Poziția mouse-ului relativă la centrul cardului
            const x = e.clientX - (left + width / 2);
            const y = e.clientY - (top + height / 2);
            
            // Calculăm rotația. '20' e factorul de intensitate.
            const rotateY = (x / width) * 20; // Rotație stânga/dreapta
            const rotateX = (-y / height) * 20; // Rotație sus/jos

            // Aplică rotația 3D
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            cardContent.style.transform = `translateZ(40px)`; // Ridică conținutul
            
            // --- Efectul de lumină ---
            // Poziția mouse-ului relativă la colțul cardului (pt CSS variables)
            const mouseX = e.clientX - left;
            const mouseY = e.clientY - top;
            
            cardContent.style.setProperty('--x', `${mouseX}px`);
            cardContent.style.setProperty('--y', `${mouseY}px`);
        });

        card.addEventListener('mouseleave', () => {
            // Resetează transformările
            card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
            cardContent.style.transform = 'translateZ(20px)';
        });
    });
});
