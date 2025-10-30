// Main JavaScript file - Navigation and progress bar functionality

document.addEventListener('DOMContentLoaded', function() {
    // Progress Bar
    const progressBar = document.querySelector('.progress-bar');
    
    // Navigation Elements
    const navbar = document.querySelector('.navbar');
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav a');
    
    // Progress Bar Update
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    }
    
    // Navbar Scroll Behavior
    function handleScroll() {
        const scrolled = window.pageYOffset > 100;
        
        if (scrolled) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateProgressBar();
    }
    
    // Burger Menu Toggle
    function toggleMobileMenu() {
        burgerMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Animate burger lines
        const lines = document.querySelectorAll('.burger-line');
        if (burgerMenu.classList.contains('active')) {
            lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    }
    
    // Close mobile menu when clicking on links
    function closeMobileMenu() {
        burgerMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
        
        const lines = document.querySelectorAll('.burger-line');
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    }
    
    // Event Listeners
    window.addEventListener('scroll', handleScroll);
    burgerMenu.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navbar.contains(event.target) && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Initialize progress bar
    updateProgressBar();
});
