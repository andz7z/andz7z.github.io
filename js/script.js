// script.js - Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initScrollProgress();
    initBurgerMenu();
    initSectionObserver();
    initDynamicMenuColor();
});

// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = `${scrollPercent}%`;
    });
}

// Burger Menu
function initBurgerMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerIcon = document.querySelector('.burger-icon');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    // Toggle menu on burger click
    burgerIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        burgerMenu.classList.toggle('active');
        document.body.style.overflow = burgerMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    menuLinks.forEach(link => {
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
    const sectionTitles = document.querySelectorAll('.section-title');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.section-title')?.classList.add('visible');
                
                // Add shimmer effect to title
                if (entry.target.querySelector('.section-title')) {
                    setTimeout(() => {
                        addShimmerEffect(entry.target.querySelector('.section-title'));
                    }, 500);
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Add shimmer effect to section titles
function addShimmerEffect(element) {
    element.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)';
    element.style.backgroundSize = '200% 100%';
    element.style.backgroundClip = 'text';
    element.style.webkitBackgroundClip = 'text';
    element.style.webkitTextFillColor = 'transparent';
    
    // Animate the shimmer
    let position = -100;
    const animateShimmer = () => {
        position += 2;
        element.style.backgroundPosition = `${position}% 0`;
        
        if (position < 100) {
            requestAnimationFrame(animateShimmer);
        } else {
            // Reset after animation completes
            setTimeout(() => {
                element.style.background = '';
                element.style.backgroundClip = '';
                element.style.webkitBackgroundClip = '';
                element.style.webkitTextFillColor = '';
            }, 1000);
        }
    };
    
    animateShimmer();
}

// Dynamic menu color based on background
function initDynamicMenuColor() {
    const burgerSpans = document.querySelectorAll('.burger-icon span');
    const menuLinks = document.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const isLightSection = 
                    entry.target.classList.contains('reviews-section') || 
                    entry.target.classList.contains('contact-section');
                
                // Update burger menu color
                const newColor = isLightSection ? 'var(--color-black)' : 'var(--color-white)';
                burgerSpans.forEach(span => {
                    span.style.backgroundColor = newColor;
                });
                
                // Update menu links color
                menuLinks.forEach(link => {
                    link.style.color = newColor;
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}
