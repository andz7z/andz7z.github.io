// Funcționalitatea pentru burger menu și navigare
document.addEventListener('DOMContentLoaded', function() {
    const bars = document.getElementById("nav-action");
    const nav = document.getElementById("nav");
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Fade in la încărcarea paginii
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = "opacity 2s ease";
        document.body.style.opacity = "1";
    }, 100);
    
    // Deschide/închide meniul burger
    bars.addEventListener("click", barClicked, false);
    
    function barClicked() {
        bars.classList.toggle('active');
        nav.classList.toggle('visible');
    }
    
    // Schimbă culoarea burger-ului în funcție de secțiune
    function updateBurgerColor() {
        const currentSection = getCurrentSection();
        const barsElement = document.querySelector('.bars');
        const barElements = document.querySelectorAll('.bar, .bar::before, .bar::after');
        
        if (currentSection === 'contact') {
            // Pe secțiunea contact (albă), burger-ul trebuie să fie negru
            barElements.forEach(bar => {
                bar.style.backgroundColor = '#000';
            });
            barsElement.style.color = '#000';
        } else {
            // Pe celelalte secțiuni (închise), burger-ul trebuie să fie alb
            barElements.forEach(bar => {
                bar.style.backgroundColor = '#fff';
            });
            barsElement.style.color = '#fff';
        }
    }
    
    // Obține secțiunea curentă
    function getCurrentSection() {
        let currentSection = 'home';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = section.id;
            }
        });
        
        return currentSection;
    }
    
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
            bars.classList.remove('active');
            nav.classList.remove('visible');
            
            // Scroll la secțiunea respectivă
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
            
            // Actualizează culoarea burger-ului
            setTimeout(updateBurgerColor, 500);
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
        
        // Actualizează culoarea burger-ului la scroll
        updateBurgerColor();
    });
    
    // Închide meniul când se face clic în afara lui
    document.addEventListener('click', function(e) {
        if (!bars.contains(e.target) && !nav.contains(e.target) && nav.classList.contains('visible')) {
            bars.classList.remove('active');
            nav.classList.remove('visible');
        }
    });
    
    // Inițializează culoarea burger-ului
    updateBurgerColor();
});
