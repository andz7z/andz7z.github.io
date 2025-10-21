// ===== MODUL SERVICES - JAVASCRIPT SPECIFIC PENTRU SECȚIUNEA SERVICES =====

function initializeServicesModule() {
    console.log('Services module initialized');
    
    // Inițializează interacțiunile pentru cards
    setupServiceCards();
}

function animateServicesSection() {
    const servicesGrid = document.querySelector('.services-grid');
    
    if (servicesGrid && !servicesGrid.classList.contains('animated')) {
        servicesGrid.classList.add('animated');
        
        // Pregătește cards pentru animație
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.animationDelay = `${0.3 + index * 0.2}s`;
        });
    }
}

function setupServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Efect de hover detaliat
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Interacțiune la click pentru detalii
        card.addEventListener('click', function() {
            // Aici poți adăuga logica pentru afișarea detaliilor serviciului
            console.log('Service card clicked:', this.querySelector('h3').textContent);
        });
    });
}

// Efect de paralaxă pentru background (opțional)
function initServicesParallax() {
    const servicesSection = document.getElementById('services');
    
    window.addEventListener('scroll', function() {
        if (servicesSection) {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            servicesSection.style.backgroundPositionY = `${-(scrolled * parallaxSpeed)}px`;
        }
    });
}

window.animateServicesSection = animateServicesSection;
