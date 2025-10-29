// Meniu burger functionality
document.addEventListener('DOMContentLoaded', function() {
    const burgerIcon = document.querySelector('.burger-icon');
    const menuContent = document.querySelector('.menu-content');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    // Toggle meniu burger
    burgerIcon.addEventListener('click', function() {
        this.classList.toggle('active');
        menuContent.classList.toggle('active');
    });
    
    // Închide meniul la click pe link
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerIcon.classList.remove('active');
            menuContent.classList.remove('active');
        });
    });
    
    // Smooth scroll pentru link-uri
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
