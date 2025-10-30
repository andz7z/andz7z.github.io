// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const progressBar = document.getElementById('progressBar');
    const navToggle = document.getElementById('navToggle');
    const burgerMenu = document.getElementById('burgerMenu');
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');
    
    // Variables
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Progress Bar
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    }
    
    // Navigation Scroll Effect
    function handleNavScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            // Hide main navigation, show burger toggle
            navbar.classList.add('hidden');
            navToggle.style.display = 'flex';
        } else {
            // Show main navigation, hide burger toggle
            navbar.classList.remove('hidden');
            navToggle.style.display = 'none';
            burgerMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    // Request Animation Frame for scroll
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateProgressBar();
                handleNavScroll();
            });
            ticking = true;
        }
    }
    
    // Toggle Burger Menu
    function toggleBurgerMenu() {
        burgerMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }
    
    // Close burger menu when clicking on a link
    function closeBurgerMenu() {
        burgerMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Event Listeners
    window.addEventListener('scroll', onScroll);
    
    navToggle.addEventListener('click', toggleBurgerMenu);
    
    // Close menu when clicking on burger links
    const burgerLinks = document.querySelectorAll('.burger-link');
    burgerLinks.forEach(link => {
        link.addEventListener('click', closeBurgerMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.burger-menu') && 
            !event.target.closest('.nav-toggle') &&
            burgerMenu.classList.contains('active')) {
            closeBurgerMenu();
        }
    });
    
    // Initialize
    updateProgressBar();
    handleNavScroll();
    
    // Hide burger toggle initially
    navToggle.style.display = 'none';
});
