/* ANDZ — Lehadus Andrei */

// Script global și inițializare
document.addEventListener('DOMContentLoaded', function() {
    // Inițializare smooth scroll
    initSmoothScroll();
    
    // Inițializare progress bar
    initProgressBar();
    
    // Inițializare navigație
    initNavigation();
    
    // Inițializare modal
    initModal();
    
    // Inițializare back to home button
    initBackToHome();
    
    // Inițializare social icons
    initSocialIcons();
    
    // Inițializare scroll indicator
    initScrollIndicator();
});

// Smooth Scroll cu fallback
function initSmoothScroll() {
    // Verifică dacă browser-ul suportă scroll behavior smooth
    if ('scrollBehavior' in document.documentElement.style) {
        // Folosim scroll nativ dacă este suportat
        document.documentElement.style.scrollBehavior = 'smooth';
    } else {
        // Fallback pentru browsere vechi
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }
}

// Progress Bar
function initProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        progressFill.style.width = scrollPercent + '%';
    });
}

// Navigație
function initNavigation() {
    const navIcons = document.querySelector('.nav-icons');
    const backToHomeBtn = document.querySelector('.back-to-home');
    const currentSectionText = document.querySelector('.current-section');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const homeSection = document.getElementById('home');
        const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight;
        
        // Ascunde/arată navigația și butonul back to home
        if (scrollPosition > homeSectionBottom - 100) {
            navIcons.style.opacity = '0';
            navIcons.style.pointerEvents = 'none';
            backToHomeBtn.style.display = 'flex';
            
            // Actualizează textul secțiunii curente
            updateCurrentSection();
        } else {
            navIcons.style.opacity = '1';
            navIcons.style.pointerEvents = 'all';
            backToHomeBtn.style.display = 'none';
        }
    });
    
    // Actualizează secțiunea curentă
    function updateCurrentSection() {
        const sections = document.querySelectorAll('.section');
        let currentSection = 'Home';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id.charAt(0).toUpperCase() + section.id.slice(1);
            }
        });
        
        currentSectionText.textContent = `Currently on: ${currentSection}`;
    }
}

// Modal pentru Termeni și Condiții
function initModal() {
    const modal = document.getElementById('tosModal');
    const tosBtn = document.querySelector('.tos-btn');
    const closeBtn = document.querySelector('.modal-close');
    
    if (tosBtn && modal && closeBtn) {
        tosBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Închide modal cu ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Buton Back to Home
function initBackToHome() {
    const backBtn = document.querySelector('.back-to-home');
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('home').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
}

// Social Icons
function initSocialIcons() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1) translateX(-5px)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) translateX(0)';
        });
    });
}

// Scroll Indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        let scrolled = false;
        
        const hideScrollIndicator = () => {
            if (!scrolled) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
                scrolled = true;
            }
        };
        
        window.addEventListener('scroll', hideScrollIndicator, { once: true });
        
        // Ascunde indicatorul după 5 secunde dacă nu s-a făcut scroll
        setTimeout(hideScrollIndicator, 5000);
    }
}

// Utilitate pentru detectarea preferințelor de reducere a mișcării
function shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Debounce pentru optimizare
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
