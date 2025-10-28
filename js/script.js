// Funcționalitatea pentru burger menu și navigare
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Deschide/închide meniul burger
    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Închide meniul când se face clic pe un link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obține secțiunea țintă
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Ascunde toate secțiunile
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Arată secțiunea țintă
            targetSection.classList.add('active');
            
            // Actualizează link-ul activ
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Închide meniul burger
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Scroll la secțiunea respectivă
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });
    
    // Detectează secțiunea curentă la scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Închide meniul când se face clic în afara lui
    document.addEventListener('click', function(e) {
        if (!burgerMenu.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});
