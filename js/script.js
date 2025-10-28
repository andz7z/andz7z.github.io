// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initProgressBar();
    initBurgerMenu();
    initScrollAnimations();
    initColorAdaptation();
});

// Progress Bar
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// Burger Menu
function initBurgerMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const navMenu = document.getElementById('navMenu');
    const burgerIcon = document.querySelector('.burger-icon');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Toggle menu on burger click
    burgerMenu.addEventListener('click', function() {
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        
        // Animate menu items with staggered delay
        if (navMenu.classList.contains('active')) {
            navLinks.forEach((link, index) => {
                link.style.transitionDelay = (index * 0.1) + 's';
            });
        } else {
            navLinks.forEach(link => {
                link.style.transitionDelay = '0s';
            });
        }
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Hover effect for burger icon
    burgerIcon.addEventListener('mouseenter', function() {
        burgerIcon.style.transform = 'scale(1.1)';
    });
    
    burgerIcon.addEventListener('mouseleave', function() {
        burgerIcon.style.transform = 'scale(1)';
    });
}

// Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const options = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, options);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Color Adaptation for Burger Menu
function initColorAdaptation() {
    const burgerMenu = document.getElementById('burgerMenu');
    const burgerSpans = document.querySelectorAll('.burger-icon span');
    const sections = document.querySelectorAll('.section');
    
    function updateBurgerColor() {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Determine which section is currently in view
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - windowHeight / 2 && 
                scrollPosition < sectionTop + sectionHeight - windowHeight / 2) {
                currentSection = section;
            }
        });
        
        // Update burger color based on section background
        if (currentSection) {
            const sectionId = currentSection.id;
            
            // Define which sections should have white burger and which black
            const whiteBurgerSections = ['home', 'about', 'portfolio'];
            const shouldBeWhite = whiteBurgerSections.includes(sectionId);
            
            burgerSpans.forEach(span => {
                span.style.background = shouldBeWhite ? 'var(--color-secondary)' : 'var(--color-primary)';
                span.style.boxShadow = shouldBeWhite ? '0 0 5px rgba(0, 0, 0, 0.5)' : '0 0 5px rgba(255, 255, 255, 0.5)';
            });
        }
    }
    
    // Update on scroll and resize
    window.addEventListener('scroll', updateBurgerColor);
    window.addEventListener('resize', updateBurgerColor);
    
    // Initial call
    updateBurgerColor();
}
