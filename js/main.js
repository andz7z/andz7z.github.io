// Meniu Burger Functionality
document.addEventListener('DOMContentLoaded', function() {
    const burgerIcon = document.querySelector('.burger-icon');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle meniu burger
    burgerIcon.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Inchide meniul la click pe link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerIcon.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Inchide meniul la click in afara
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnBurger = burgerIcon.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnBurger && navMenu.classList.contains('active')) {
            burgerIcon.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});
