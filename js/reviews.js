/* ANDZ — Lehadus Andrei */

// Reviews Section - Slider și animații
document.addEventListener('DOMContentLoaded', function() {
    initReviewsAnimations();
    initReviewsSlider();
    initReviewCardsInteractivity();
});

// Animații pentru secțiunea Reviews
function initReviewsAnimations() {
    const reviewsSection = document.getElementById('reviews');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateReviewCards();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (reviewsSection) {
        observer.observe(reviewsSection);
    }
}

// Animație pentru cardurile de review
function animateReviewCards() {
    const cards = document.querySelectorAll('.review-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateX(0)';
            card.style.opacity = '1';
        }, index * 300);
    });
}

// Slider pentru recenzii
function initReviewsSlider() {
    const slider = document.querySelector('.reviews-slider');
    if (!slider) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
        if (shouldReduceMotion()) return;
        
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown || shouldReduceMotion()) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events pentru dispozitive mobile
    slider.addEventListener('touchstart', (e) => {
        if (shouldReduceMotion()) return;
        
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('touchend', () => {
        isDown = false;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDown || shouldReduceMotion()) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

// Interactivitate pentru cardurile de review
function initReviewCardsInteractivity() {
    const cards = document.querySelectorAll('.review-card');
    
    cards.forEach(card => {
        // Efect de hover cu scalare subtilă
        card.addEventListener('mouseenter', () => {
            if (shouldReduceMotion()) return;
            
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            if (shouldReduceMotion()) return;
            
            card.style.transform = 'translateY(0) scale(1)';
            card.style.zIndex = '1';
        });
        
        // Efect de lumină la hover
        card.addEventListener('mousemove', (e) => {
            if (shouldReduceMotion()) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const glowX = (x - centerX) / centerX;
            const glowY = (y - centerY) / centerY;
            
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, 
                rgba(139, 92, 246, 0.1) 0%, 
                rgba(59, 130, 246, 0.05) 50%, 
                transparent 100%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.background = 'var(--glass-bg)';
        });
        
        // Click pentru a evidenția review-ul
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}
