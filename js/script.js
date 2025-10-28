// Main JavaScript file - handles common functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initScrollProgress();
    initBurgerMenu();
    initSectionObserver();
    initSmoothScroll();
});

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Burger Menu Functionality
function initBurgerMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerIcon = document.querySelector('.burger-icon');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu on burger click
    burgerIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        burgerMenu.classList.toggle('active');
        document.body.style.overflow = burgerMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!burgerMenu.contains(e.target) && burgerMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Section Observer for animations
function initSectionObserver() {
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Smooth Scroll for Navigation
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Dynamic color adaptation for burger menu
function updateBurgerColor() {
    const burgerSpans = document.querySelectorAll('.burger-icon span');
    const sections = document.querySelectorAll('.section');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    let currentSection = null;
    
    // Find the current section based on scroll position
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            currentSection = section;
        }
    });
    
    // Determine if we should use light or dark color
    if (currentSection) {
        const isLightSection = currentSection.classList.contains('services-section') || 
                              currentSection.classList.contains('reviews-section') || 
                              currentSection.classList.contains('contact-section');
        
        const color = isLightSection ? 'var(--color-black)' : 'var(--color-white)';
        
        burgerSpans.forEach(span => {
            span.style.background = color;
        });
    }
}

// Update burger color on scroll
window.addEventListener('scroll', updateBurgerColor);
window.addEventListener('load', updateBurgerColor);
