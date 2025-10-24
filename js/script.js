// ===== MAIN SCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
    // Inițializare aplicație
    initApp();
});

function initApp() {
    // Inițializare progres scroll
    initScrollProgress();
    
    // Inițializare navigare între secțiuni
    initNavigation();
    
    // Inițializare meniu mobil
    initMobileMenu();
    
    // Inițializare animații la scroll
    initScrollAnimations();
    
    // Inițializare hover effects
    initHoverEffects();
}

// ===== PROGRESS BAR =====
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const navIcons = document.querySelectorAll('.nav-icon');
    const sections = document.querySelectorAll('.section');
    
    // Navigare la click pe iconițe
    navIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href');
            navigateToSection(targetSection);
        });
    });
    
    // Navigare la click pe săgeată
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

function navigateToSection(sectionId) {
    const targetSection = document.querySelector(sectionId);
    if (!targetSection) return;
    
    // Ascunde toate secțiunile
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afișează secțiunea țintă
    targetSection.classList.add('active');
    
    // Scroll la secțiune
    targetSection.scrollIntoView({ behavior: 'smooth' });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            
            // Animație pentru item-uri
            mobileMenuItems.forEach((item, index) => {
                item.style.animationDelay = (index * 0.1) + 's';
                item.classList.add('fade-in');
            });
        });
        
        // Închide meniul la click pe item
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                const targetSection = this.getAttribute('href');
                navigateToSection(targetSection);
            });
        });
        
        // Închide meniul la click în afara lui
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animație specială pentru bara de skills
                if (entry.target.classList.contains('skill-progress')) {
                    const width = entry.target.getAttribute('data-width');
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 200);
                }
            }
        });
    }, observerOptions);
    
    // Observă elementele care trebuie animate
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .review-card, .skill-progress');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== HOVER EFFECTS =====
function initHoverEffects() {
    // Efecte hover pentru carduri
    const interactiveElements = document.querySelectorAll('.service-card, .portfolio-item, .review-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Efecte hover pentru iconițe sociale
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}
