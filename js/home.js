document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerIcon = document.querySelector('.burger-icon');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    // Funcție pentru deschiderea/închiderea meniului
    burgerIcon.addEventListener('click', function() {
        burgerMenu.classList.toggle('active');
        
        // Animație suplimentară pentru iconiță
        if (burgerMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Închidere meniu la click pe link
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animație de închidere
            burgerMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Navigare către secțiune
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculăm poziția țintei
                let targetPosition;
                if (targetId === '#home') {
                    targetPosition = 0;
                } else {
                    targetPosition = targetSection.offsetTop;
                }
                
                // Scroll animat
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Închidere meniu la click în afara lui
    document.addEventListener('click', function(e) {
        if (!burgerMenu.contains(e.target) && burgerMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Efect de paralaxă pentru titlu
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const homeSection = document.querySelector('.home-section');
        const title = document.querySelector('.futuristic-title');
        
        if (title && homeSection) {
            const rate = scrolled * -0.5;
            title.style.transform = `translateY(${rate}px)`;
        }
    });
});
