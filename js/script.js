// Loader
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    
    // Ascunde loader-ul după 3 secunde
    setTimeout(function() {
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
        }, 500);
    }, 3000);
});

// Navbar
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelector('.nav-links');
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Ascunde navbar-ul la scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll în jos - ascunde navbar-ul
            navbar.classList.add('navbar-minimized');
            navLinks.style.opacity = '0';
        } else {
            // Scroll în sus - arată navbar-ul
            navbar.classList.remove('navbar-minimized');
            navLinks.style.opacity = '1';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Burger menu toggle
    burgerMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('mobile-menu-open');
        
        // Animație burger
        const burgerLines = document.querySelectorAll('.burger-line');
        if (mobileMenu.classList.contains('mobile-menu-open')) {
            burgerLines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            burgerLines[1].style.opacity = '0';
            burgerLines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            burgerLines[0].style.transform = 'none';
            burgerLines[1].style.opacity = '1';
            burgerLines[2].style.transform = 'none';
        }
    });
    
    // Navigare smooth
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
                
                // Închide meniul mobil dacă este deschis
                mobileMenu.classList.remove('mobile-menu-open');
                const burgerLines = document.querySelectorAll('.burger-line');
                burgerLines[0].style.transform = 'none';
                burgerLines[1].style.opacity = '1';
                burgerLines[2].style.transform = 'none';
            }
        });
    });
});
