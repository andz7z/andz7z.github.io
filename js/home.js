// Funcționalități specifice secțiunii Home
document.addEventListener('DOMContentLoaded', function() {
    const glassCard = document.querySelector('.glass-card');
    const cardContent = document.querySelector('.card-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Expand card la scroll
    window.addEventListener('scroll', function() {
        const homeSection = document.getElementById('home');
        const homeHeight = homeSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // Calculăm progresul scroll-ului în secțiunea home (0-1)
        const scrollProgress = Math.min(scrollPosition / (homeHeight - window.innerHeight), 1);
        
        // Aplicăm transformări bazate pe progresul scroll-ului
        if (scrollProgress > 0.2) {
            glassCard.classList.add('expanded');
        } else {
            glassCard.classList.remove('expanded');
        }
        
        // Ascundem indicatorul de scroll după ce am derulat puțin
        if (scrollProgress > 0.1) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    });
    
    // Adăugăm indicatorul de scroll în DOM dacă nu există
    if (!scrollIndicator) {
        const scrollIndicatorHTML = `
            <div class="scroll-indicator">
                <div class="scroll-text">Scroll down</div>
                <div class="mouse">
                    <div class="wheel"></div>
                </div>
            </div>
        `;
        document.getElementById('home').insertAdjacentHTML('beforeend', scrollIndicatorHTML);
    }
});
