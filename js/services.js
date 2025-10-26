// Services Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elemente principale
    const servicesSection = document.querySelector('.services-section');
    const categories = document.querySelectorAll('.category');
    const slides = document.querySelectorAll('.service-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Starea curentă
    let currentSlide = 0;
    let autoSlideInterval;
    const slideDuration = 6000; // 6 secunde între slide-uri
    
    // Inițializare
    function initServices() {
        // Activează primul slide
        activateSlide(currentSlide);
        
        // Pornește auto-slide
        startAutoSlide();
        
        // Inițializează observer pentru animații la scroll
        initScrollAnimations();
        
        // Adaugă event listeners
        setupEventListeners();
        
        // Inițializează progress bars
        initProgressBars();
    }
    
    // Setează event listeners
    function setupEventListeners() {
        // Navigare prin categorii
        categories.forEach((category, index) => {
            category.addEventListener('click', () => {
                navigateToSlide(index);
            });
        });
        
        // Butoane prev/next
        prevBtn.addEventListener('click', showPrevSlide);
        nextBtn.addEventListener('click', showNextSlide);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Pause auto-slide on hover
        servicesSection.addEventListener('mouseenter', pauseAutoSlide);
        servicesSection.addEventListener('mouseleave', startAutoSlide);
        
        // Touch events pentru mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        servicesSection.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        servicesSection.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    // Navigare la slide-ul specificat
    function navigateToSlide(slideIndex) {
        // Actualizează slide-ul curent
        currentSlide = slideIndex;
        
        // Activează noul slide
        activateSlide(currentSlide);
        
        // Resetează auto-slide
        resetAutoSlide();
    }
    
    // Activează un slide specific
    function activateSlide(slideIndex) {
        // Dezactivează toate slide-urile și categoriile
        slides.forEach(slide => slide.classList.remove('active'));
        categories.forEach(category => category.classList.remove('active'));
        
        // Activează slide-ul și categoria corespunzătoare
        slides[slideIndex].classList.add('active');
        categories[slideIndex].classList.add('active');
        
        // Animează progress bars
        animateProgressBars();
        
        // Trigger custom event
        const event = new CustomEvent('serviceChange', {
            detail: { 
                service: categories[slideIndex].dataset.category,
                index: slideIndex
            }
        });
        servicesSection.dispatchEvent(event);
    }
    
    // Arată slide-ul anterior
    function showPrevSlide() {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
        activateSlide(currentSlide);
        resetAutoSlide();
    }
    
    // Arată slide-ul următor
    function showNextSlide() {
        currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
        activateSlide(currentSlide);
        resetAutoSlide();
    }
    
    // Navigare prin tastatură
    function handleKeyboardNavigation(e) {
        if (e.key === 'ArrowLeft') {
            showPrevSlide();
        } else if (e.key === 'ArrowRight') {
            showNextSlide();
        }
    }
    
    // Gesturi touch pentru mobile
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                showNextSlide();
            } else {
                // Swipe right - prev slide
                showPrevSlide();
            }
        }
    }
    
    // Auto-slide functionality
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showNextSlide();
        }, slideDuration);
    }
    
    function pauseAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    function resetAutoSlide() {
        pauseAutoSlide();
        startAutoSlide();
    }
    
    // Animații pentru progress bars
    function initProgressBars() {
        // Setează width-ul inițial la 0
        const progressBars = document.querySelectorAll('.feature-progress');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });
    }
    
    function animateProgressBars() {
        const activeSlide = document.querySelector('.service-slide.active');
        const progressBars = activeSlide.querySelectorAll('.feature-progress');
        
        progressBars.forEach((bar, index) => {
            // Reset la 0%
            bar.style.width = '0%';
            
            // Animează la width-ul final după o scurtă întârziere
            setTimeout(() => {
                const value = bar.getAttribute('data-value');
                bar.style.width = value + '%';
            }, 300 + (index * 150));
        });
    }
    
    // Animații la scroll
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Animează progress bars când secțiunea devine vizibilă
                    if (entry.target.classList.contains('services-section')) {
                        setTimeout(animateProgressBars, 500);
                    }
                }
            });
        }, observerOptions);
        
        // Observează secțiunea services și card-urile
        observer.observe(servicesSection);
        document.querySelectorAll('.service-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    // Efecte speciale și particule
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        servicesSection.appendChild(particlesContainer);
        
        // Creează particule
        for (let i = 0; i < 15; i++) {
            createParticle(particlesContainer);
        }
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float 6s infinite linear;
        `;
        
        // Poziție random
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(particle);
    }
    
    // Adaugă CSS pentru animația de particule
    const particleStyles = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) translateX(20px);
                opacity: 0;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = particleStyles;
    document.head.appendChild(styleSheet);
    
    // Efect de focus pentru slide-ul activ
    function addFocusEffect() {
        servicesSection.addEventListener('serviceChange', (e) => {
            const serviceType = e.detail.service;
            
            // Adaugă o clasă în funcție de serviciul activ
            servicesSection.className = 'services-section';
            servicesSection.classList.add(`service-${serviceType}`);
            
            // Efect de lumină
            const activeCard = document.querySelector('.service-card');
            activeCard.style.transform = 'scale(1.02)';
            setTimeout(() => {
                activeCard.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // Performance optimization - debounce pentru resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reinițializează progres bars la resize
            animateProgressBars();
        }, 250);
    });
    
    // Inițializează tot
    initServices();
    createParticles();
    addFocusEffect();
    
    // Debug info (poate fi eliminat în producție)
    console.log('Services section initialized with:', {
        totalSlides: slides.length,
        autoSlideDuration: slideDuration,
        currentSlide: currentSlide
    });
});

// Fallback pentru browsere vechi
if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported, scroll animations disabled');
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.add('in-view');
    });
}
