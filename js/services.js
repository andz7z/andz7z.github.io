/* ANDZ — Lehadus Andrei */

// Services Section - Animații și efecte
document.addEventListener('DOMContentLoaded', function() {
    initServicesAnimations();
    initServiceCardsInteractivity();
});

// Animații pentru secțiunea Services
function initServicesAnimations() {
    const servicesSection = document.getElementById('services');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateServiceCards();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (servicesSection) {
        observer.observe(servicesSection);
    }
}

// Animație pentru cardurile de servicii
function animateServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, index * 200);
    });
}

// Interactivitate pentru carduri
function initServiceCardsInteractivity() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        // Efect de tilt la hover
        card.addEventListener('mousemove', (e) => {
            if (shouldReduceMotion()) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            if (shouldReduceMotion()) return;
            
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
            
            // Reset la transformare inițială după un timp scurt
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 150);
        });
        
        // Efect de glow la hover
        card.addEventListener('mouseenter', () => {
            if (shouldReduceMotion()) return;
            
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.filter = 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.filter = 'none';
            }
        });
    });
}
