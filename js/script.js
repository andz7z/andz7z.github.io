// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Setăm anul curent în footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Inițializăm componentele
    initProgressBar();
    initScrollBehavior();
    initTOSModal();
    initNavigation();
    
    // Inițializăm scripturile specifice fiecărei secțiuni
    if (document.getElementById('home')) initHome();
    if (document.getElementById('about')) initAbout();
    if (document.getElementById('services')) initServices();
    if (document.getElementById('portfolio')) initPortfolio();
    if (document.getElementById('reviews')) initReviews();
    if (document.getElementById('contact')) initContact();
});

// Bară de progres
function initProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Comportament la scroll
function initScrollBehavior() {
    const sections = document.querySelectorAll('.section');
    const contextualNav = document.querySelector('.contextual-nav');
    const mainNav = document.querySelector('.main-nav');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const sectionName = document.querySelector('.section-name');
    const goBackBtn = document.querySelector('.go-back-btn');
    
    // Observer pentru a detecta secțiunea activă
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSection = entry.target.id;
                
                // Actualizăm numele secțiunii în navigația contextuală
                sectionName.textContent = capitalizeFirstLetter(currentSection);
                
                // Controlăm afișarea navigației contextuale
                if (currentSection === 'home') {
                    contextualNav.classList.remove('active');
                    mainNav.style.opacity = '1';
                    scrollIndicator.style.opacity = '1';
                } else {
                    contextualNav.classList.add('active');
                    mainNav.style.opacity = '0';
                    scrollIndicator.style.opacity = '0';
                }
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Butonul "Go Back" pentru a reveni la homepage
    goBackBtn.addEventListener('click', function() {
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    });
}

// Modal Terms of Service
function initTOSModal() {
    const tosBtn = document.querySelector('.tos-btn');
    const tosModal = document.querySelector('.tos-modal');
    const closeTos = document.querySelector('.close-tos');
    
    tosBtn.addEventListener('click', function() {
        tosModal.classList.add('active');
    });
    
    closeTos.addEventListener('click', function() {
        tosModal.classList.remove('active');
    });
    
    tosModal.addEventListener('click', function(e) {
        if (e.target === tosModal) {
            tosModal.classList.remove('active');
        }
    });
}

// Navigație
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Funcție utilitară pentru capitalizarea primei litere
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Inițializări pentru secțiuni (vor fi suprascrise de fișierele specifice)
function initHome() {}
function initAbout() {}
function initServices() {}
function initPortfolio() {}
function initReviews() {}
function initContact() {}
