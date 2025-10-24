// js/script.js - Main functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initProgressBar();
    initNavigation();
    initScrollBehavior();
    initBackToHome();
    initMobileMenu();
    initLogoFallback();
    
    // Set home as active section
    setActiveSection('home');
});

// Progress Bar
function initProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Navigation between sections
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-icon, .side-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            setActiveSection(targetId);
            
            // Close mobile menu if open
            const burgerMenu = document.querySelector('.burger-menu');
            const sideMenu = document.querySelector('.side-menu');
            if (burgerMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                sideMenu.classList.remove('active');
            }
        });
    });
}

// Set active section
function setActiveSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll to top of section
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
        
        // Update back to home button visibility
        updateBackToHomeButton(sectionId);
    }
}

// Scroll behavior
function initScrollBehavior() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        // Detect scroll direction
        if (st > lastScrollTop) {
            // Scrolling down
            document.body.classList.add('scrolling-down');
            document.body.classList.remove('scrolling-up');
        } else {
            // Scrolling up
            document.body.classList.add('scrolling-up');
            document.body.classList.remove('scrolling-down');
        }
        
        lastScrollTop = st <= 0 ? 0 : st;
        
        // Update active section based on scroll position
        updateActiveSectionOnScroll();
    });
}

// Update active section based on scroll position
function updateActiveSectionOnScroll() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + (window.innerHeight / 2);
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const sectionId = section.getAttribute('id');
            setActiveSection(sectionId);
        }
    });
}

// Back to home button
function initBackToHome() {
    const backButton = document.querySelector('.back-to-home');
    
    backButton.addEventListener('click', function(e) {
        e.preventDefault();
        setActiveSection('home');
    });
}

// Update back to home button visibility
function updateBackToHomeButton(currentSection) {
    const backButton = document.querySelector('.back-to-home');
    
    if (currentSection === 'home') {
        backButton.classList.remove('visible');
    } else {
        backButton.classList.add('visible');
    }
}

// Mobile menu
function initMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const sideMenu = document.querySelector('.side-menu');
    
    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        sideMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-menu') && sideMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            sideMenu.classList.remove('active');
        }
    });
}

// Logo fallback
function initLogoFallback() {
    const logoImg = document.querySelector('.logo img');
    
    logoImg.addEventListener('error', function() {
        this.style.display = 'none';
        document.querySelector('.logo').classList.add('fallback');
    });
}
