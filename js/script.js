// Main JavaScript file

// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const burger = document.getElementById('burger');
const progressBar = document.getElementById('progressBar');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const sectionTitles = document.querySelectorAll('.section-title');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
    initializeScrollProgress();
    initializeSectionAnimations();
});

// Navbar functionality
function initializeNavbar() {
    // Toggle burger menu
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            burger.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll progress bar
function initializeScrollProgress() {
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Section animations on scroll
function initializeSectionAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target.querySelector('.section-title');
                if (title) {
                    title.classList.add('visible');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}
