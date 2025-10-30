// ===== MAIN JAVASCRIPT FILE =====
// Handles scroll progress, navigation transformation, and burger menu

document.addEventListener('DOMContentLoaded', function() {
    // Scroll Progress Bar
    const progressBar = document.querySelector('.progress-bar');
    
    // Navigation Elements
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Scroll Progress Function
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }
    
    // Navigation Transformation on Scroll
    function handleNavbarTransform() {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 100) {
            // Transform to burger menu style
            navbar.style.padding = '0.5rem 1rem';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.background = 'rgba(0, 0, 0, 0.7)';
            
            // Hide desktop menu, show burger on mobile
            if (window.innerWidth <= 768) {
                navMenu.style.display = 'none';
            }
        } else {
            // Return to original style
            navbar.style.padding = '1.5rem 2rem';
            navbar.style.backdropFilter = 'blur(0px)';
            navbar.style.background = 'transparent';
            
            // Show desktop menu on larger screens
            if (window.innerWidth > 768) {
                navMenu.style.display = 'flex';
            }
        }
    }
    
    // Burger Menu Toggle
    function toggleMobileMenu() {
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : 'auto';
    }
    
    // Close mobile menu when link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Event Listeners
    window.addEventListener('scroll', function() {
        updateProgressBar();
        handleNavbarTransform();
    });
    
    burgerMenu.addEventListener('click', toggleMobileMenu);
    
    // Initial calls
    updateProgressBar();
    handleNavbarTransform();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        handleNavbarTransform();
        
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768) {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
