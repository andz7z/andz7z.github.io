// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Progress Bar
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
        
        // Navigation transition
        const nav = document.querySelector('.main-nav');
        if (window.scrollY > 100) {
            nav.style.transform = 'translateY(-100%)';
            document.querySelector('.burger-menu').style.display = 'flex';
        } else {
            nav.style.transform = 'translateY(0)';
            document.querySelector('.burger-menu').style.display = 'none';
        }
    });
    
    // Burger Menu
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    burgerMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            burgerMenu.classList.remove('active');
        });
    });
    
    // Section title animations
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionTitle = entry.target.querySelector('.section-content h2');
                if (sectionTitle) {
                    sectionTitle.style.animation = 'fadeIn 1s ease forwards';
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        if (section.id !== 'home') {
            observer.observe(section);
        }
    });
});
