// js/script.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website initialized');
    
    // Initialize all modules
    if (typeof initHome === 'function') initHome();
    if (typeof initAbout === 'function') initAbout();
    if (typeof initServices === 'function') initServices();
    if (typeof initPortfolio === 'function') initPortfolio();
    if (typeof initReviews === 'function') initReviews();
    if (typeof initContact === 'function') initContact();
    
    // Preloader
    window.addEventListener('load', function() {
        setTimeout(function() {
            const preloader = document.getElementById('preloader');
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });
    
    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    mobileMenuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close mobile menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Section activation on scroll
    const sections = document.querySelectorAll('.section');
    
    function checkSectionInView() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // If section is in viewport
            if (sectionBottom >= windowTop && sectionTop <= windowBottom) {
                section.classList.add('active');
                
                // Update URL hash without scrolling
                if (sectionId !== 'home') {
                    history.replaceState(null, null, `#${sectionId}`);
                } else {
                    history.replaceState(null, null, ' ');
                }
            }
        });
    }
    
    // Initial check
    checkSectionInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkSectionInView);
});
