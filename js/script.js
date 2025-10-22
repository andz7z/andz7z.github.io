// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Setăm anul curent în footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Inițializăm toate modulele
    initProgressBar();
    initScrollNavigation();
    initModal();
    initContextualNav();
    
    // Inițializăm modulele specifice secțiunilor
    if (document.getElementById('home')) {
        initHome();
    }
    if (document.getElementById('about')) {
        initAbout();
    }
    if (document.getElementById('services')) {
        initServices();
    }
    if (document.getElementById('portfolio')) {
        initPortfolio();
    }
    if (document.getElementById('reviews')) {
        initReviews();
    }
    if (document.getElementById('contact')) {
        initContact();
    }
});

// Bară de progres
function initProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// Navigație prin scroll
function initScrollNavigation() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Observator pentru secțiuni
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Actualizăm navigația
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
                
                // Actualizăm navigația contextuală
                updateContextualNav(sectionId);
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Modal pentru Terms of Service
function initModal() {
    const modal = document.getElementById('tos-modal');
    const openBtn = document.getElementById('tos-btn');
    const closeBtn = document.getElementById('close-modal');
    
    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Închidem modalul dacă se dă click în afara conținutului
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Navigație contextuală
function initContextualNav() {
    const contextualNav = document.querySelector('.contextual-nav');
    const goBackBtn = document.getElementById('go-back');
    const currentSectionEl = document.getElementById('current-section');
    
    if (goBackBtn) {
        goBackBtn.addEventListener('click', function() {
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function updateContextualNav(sectionId) {
    const contextualNav = document.querySelector('.contextual-nav');
    const currentSectionEl = document.getElementById('current-section');
    const navMenu = document.querySelector('.nav-menu');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (sectionId === 'home') {
        // Ascundem navigația contextuală
        contextualNav.classList.remove('active');
        
        // Arătăm navigația normală și indicatorul de scroll
        if (navMenu) navMenu.style.opacity = '1';
        if (scrollIndicator) scrollIndicator.style.opacity = '1';
    } else {
        // Arătăm navigația contextuală
        contextualNav.classList.add('active');
        
        // Actualizăm textul
        if (currentSectionEl) {
            const sectionName = getSectionName(sectionId);
            currentSectionEl.textContent = sectionName;
        }
        
        // Ascundem navigația normală și indicatorul de scroll
        if (navMenu) navMenu.style.opacity = '0';
        if (scrollIndicator) scrollIndicator.style.opacity = '0';
    }
}

function getSectionName(sectionId) {
    const names = {
        'about': 'About',
        'services': 'Services',
        'portfolio': 'Portfolio',
        'reviews': 'Reviews',
        'contact': 'Contact'
    };
    
    return names[sectionId] || sectionId;
}
