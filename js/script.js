// ===== SCRIPT PRINCIPAL - COORDONARE GENERALĂ =====

// Starea aplicației
const AppState = {
    currentSection: 'home',
    isModalOpen: false,
    isScrolling: false
};

// Inițializare aplicație
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Elimină clasa de preload după încărcarea completă a paginii
    window.addEventListener('load', function() {
        document.body.classList.remove('preload');
        
        // Adaugă clase de animație pentru elementele din prima secțiune
        animateHomeSection();
    });

    // Inițializează funcționalitățile
    initNavigation();
    initScrollSnapping();
    initModal();
    initIntersectionObserver();
    
    // Inițializează modulele specifice
    initializeAboutModule();
    initializeServicesModule();
    initializeReviewsModule();
    initializeContactModule();
}

// ===== NAVIGAȚIE ȘI SCROLL =====

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Scroll smooth către secțiunea țintă
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Actualizează navigația activă
                updateActiveNavLink(targetId);
            }
        });
    });
}

function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    AppState.currentSection = sectionId;
}

// ===== OBSERVER PENTRU SECȚIUNI VIZIBILE =====

function initIntersectionObserver() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const options = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Actualizează navigația
                updateActiveNavLink(sectionId);
                
                // Declanșează animațiile specifice secțiunii
                triggerSectionAnimations(sectionId);
            }
        });
    }, options);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function triggerSectionAnimations(sectionId) {
    const section = document.getElementById(sectionId);
    
    switch(sectionId) {
        case 'about':
            animateAboutSection();
            break;
        case 'services':
            animateServicesSection();
            break;
        case 'reviews':
            animateReviewsSection();
            break;
        case 'contact':
            animateContactSection();
            break;
    }
}

// ===== SCROLL SNAPPING ÎMBUNĂTĂȚIT =====

function initScrollSnapping() {
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                handleScrollSnap();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });
}

function handleScrollSnap() {
    const sections = document.querySelectorAll('section');
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Verifică dacă secțiunea este în centrul viewport-ului
        if (scrollY >= sectionTop - windowHeight / 3 && 
            scrollY < sectionTop + sectionHeight - windowHeight / 3) {
            
            // Forțează scroll snapping dacă este aproape de centru
            if (Math.abs(scrollY + windowHeight / 2 - (sectionTop + sectionHeight / 2)) < 100) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// ===== MODAL PENTRU POLITICI =====

function initModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const policyLinks = document.querySelectorAll('.policy-link');
    
    // Handler pentru deschidere modal
    policyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const policyType = this.getAttribute('data-policy');
            openModal(policyType);
        });
    });
    
    // Handler pentru închidere modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Închidere cu tasta ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && AppState.isModalOpen) {
            closeModal();
        }
    });
}

function openModal(policyType) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const privacyContent = document.getElementById('privacyContent');
    const termsContent = document.getElementById('termsContent');
    
    // Setează conținutul în funcție de tipul de politică
    if (policyType === 'privacy') {
        modalTitle.textContent = 'Privacy Policy';
        privacyContent.classList.remove('hidden');
        termsContent.classList.add('hidden');
    } else if (policyType === 'terms') {
        modalTitle.textContent = 'Terms of Service';
        termsContent.classList.remove('hidden');
        privacyContent.classList.add('hidden');
    }
    
    // Afișează modalul
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    AppState.isModalOpen = true;
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    AppState.isModalOpen = false;
}

// ===== ANIMAȚII GENERALE =====

function animateHomeSection() {
    // Animațiile pentru home sunt deja definite în CSS cu delay-uri
    // Aici putem adăuga logici suplimentare dacă este necesar
    console.log('Home section animations initialized');
}

// Funcții pentru animațiile altor secțiuni vor fi completate în modulele specifice

// ===== UTILITARE =====

// Debounce pentru performanță
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Detectare suport pentru backdrop-filter
function supportsBackdropFilter() {
    return CSS.supports('backdrop-filter', 'blur(10px)') || 
           CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
}

// Fallback pentru browsere vechi
if (!supportsBackdropFilter()) {
    document.body.classList.add('no-backdrop-filter');
}
