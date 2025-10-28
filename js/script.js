// Main JavaScript file with common functionality

// DOM Elements
const burgerMenu = document.querySelector('.burger-menu');
const navOverlay = document.querySelector('.nav-overlay');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const progressBar = document.querySelector('.progress-bar');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set initial burger menu color based on first section
    updateBurgerColor();
    
    // Add event listeners
    setupEventListeners();
    
    // Initialize scroll progress
    setupScrollProgress();
});

// Setup all event listeners
function setupEventListeners() {
    // Burger menu toggle
    burgerMenu.addEventListener('click', toggleBurgerMenu);
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId);
            closeBurgerMenu();
        });
    });
    
    // Close menu when clicking outside
    navOverlay.addEventListener('click', function(e) {
        if (e.target === navOverlay) {
            closeBurgerMenu();
        }
    });
    
    // Update burger color on scroll
    window.addEventListener('scroll', updateBurgerColor);
}

// Toggle burger menu
function toggleBurgerMenu() {
    burgerMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (burgerMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close burger menu
function closeBurgerMenu() {
    burgerMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Navigate to section
function navigateToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Update burger menu color based on current section
function updateBurgerColor() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop - windowHeight / 2 && 
            scrollPosition < sectionTop + sectionHeight - windowHeight / 2) {
            
            // Determine if section has light or dark background
            const computedStyle = window.getComputedStyle(section);
            const bgColor = computedStyle.backgroundColor;
            
            // Simple check for light/dark background
            const rgb = bgColor.match(/\d+/g);
            if (rgb) {
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                const isLight = brightness > 128;
                
                // Update burger color
                const burgerLines = document.querySelectorAll('.burger-line');
                burgerLines.forEach(line => {
                    line.style.backgroundColor = isLight ? 'var(--color-black)' : 'var(--color-white)';
                    line.style.boxShadow = isLight ? 
                        '0 0 5px rgba(255, 255, 255, 0.5)' : 
                        '0 0 5px rgba(0, 0, 0, 0.5)';
                });
            }
        }
    });
}

// Setup scroll progress indicator
function setupScrollProgress() {
    window.addEventListener('scroll', updateScrollProgress);
}

// Update scroll progress bar
function updateScrollProgress() {
    const windowHeight = window.document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
}
