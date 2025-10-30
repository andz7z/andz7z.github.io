// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Progress Bar
    const progressBar = document.getElementById('progressBar');
    
    // Navigation Elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.querySelector('.navbar');
    
    // Scroll Progress
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    }
    
    // Navigation Scroll Effect
    function handleNavScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Toggle Mobile Menu
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
    
    // Close mobile menu when clicking on a link
    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Event Listeners
    window.addEventListener('scroll', function() {
        updateProgressBar();
        handleNavScroll();
    });
    
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Initialize
    updateProgressBar();
    handleNavScroll();
});
