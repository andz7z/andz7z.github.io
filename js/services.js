// ===== JAVASCRIPT SPECIFIC PENTRU SECȚIUNEA SERVICES =====

document.addEventListener('DOMContentLoaded', function() {
    initServicesAnimations();
    initServicesInteractions();
});

// Animații specifice pentru secțiunea Services
function initServicesAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Setează delay-uri pentru animații
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${0.3 + index * 0.1}s`;
    });
    
    // Intersection Observer pentru trigger la scroll
    const servicesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateServiceIcons();
                servicesObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesObserver.observe(servicesSection);
    }
}

// Animație pentru iconițele din carduri
function animateServiceIcons() {
    const serviceIcons = document.querySelectorAll('.service-icon');
    
    serviceIcons.forEach(icon => {
        icon.style.animation = 'bounceIn 0.6s ease forwards';
    });
}

// Interacțiuni pentru secțiunea Services
function initServicesInteractions() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Efect de tilt la hover
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleY = (x - centerX) / 25;
            const angleX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
        });
        
        // Click pentru a afișa mai multe detalii
        card.addEventListener('click', function() {
            const serviceTitle = this.querySelector('h3').textContent;
            showServiceDetails(serviceTitle);
        });
    });
}

// Funcție pentru afișarea detaliilor serviciului
function showServiceDetails(serviceName) {
    // Într-o implementare reală, aceasta ar deschide un modal sau ar naviga la o pagină detaliată
    console.log(`Detalii pentru serviciul: ${serviceName}`);
    
    // Efect de feedback vizual
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        if (card.querySelector('h3').textContent === serviceName) {
            card.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        }
    });
}

// Adaugă animația bounceIn în CSS prin JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.4);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(138, 43, 226, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(138, 43, 226, 0);
        }
    }
`;
document.head.appendChild(style);
