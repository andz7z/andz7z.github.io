/* ANDZ — Lehadus Andrei */

// Portfolio Section - Animații 3D și efecte
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioAnimations();
    initPortfolioCards3D();
    initPortfolioFilter();
});

// Animații pentru secțiunea Portfolio
function initPortfolioAnimations() {
    const portfolioSection = document.getElementById('portfolio');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animatePortfolioCards();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (portfolioSection) {
        observer.observe(portfolioSection);
    }
}

// Animație pentru cardurile portofoliu
function animatePortfolioCards() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0) rotateX(0)';
            card.style.opacity = '1';
        }, index * 300);
    });
}

// Efecte 3D pentru carduri
function initPortfolioCards3D() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        // Efect de tilt 3D
        card.addEventListener('mousemove', (e) => {
            if (shouldReduceMotion()) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 20;
            const rotateX = (centerY - y) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            if (shouldReduceMotion()) return;
            
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
        
        // Click pentru a flip cardul manual
        card.addEventListener('click', (e) => {
            if (shouldReduceMotion()) return;
            
            const inner = card.querySelector('.card-inner');
            const isFlipped = inner.style.transform === 'rotateY(180deg)';
            
            inner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
        });
        
        // Efect de lumină la hover
        card.addEventListener('mouseenter', () => {
            if (shouldReduceMotion()) return;
            
            const front = card.querySelector('.card-front');
            if (front) {
                front.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const front = card.querySelector('.card-front');
            if (front) {
                front.style.boxShadow = 'none';
            }
        });
    });
}

// Filtrare portofoliu (pentru viitor)
function initPortfolioFilter() {
    // Această funcție poate fi extinsă pentru a adăuga filtre
    console.log('Portfolio filter initialized - ready for future implementation');
    
    // Exemplu de structură pentru filtre:
    const filters = {
        all: 'Toate proiectele',
        web: 'Dezvoltare Web',
        design: 'UI/UX Design',
        branding: 'Branding'
    };
    
    // Poți adăuga butoane de filtru în HTML și să le conectezi aici
}
