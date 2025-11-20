// Main JavaScript for burger system and animations
document.addEventListener('DOMContentLoaded', function() {
    // Burger System Variables - Original
    var bars = document.getElementById("nav-action");
    var nav = document.getElementById("nav");

    // Setting up the listener
    bars.addEventListener("click", barClicked, false);

    // Setting up the clicked Effect
    function barClicked() {
        bars.classList.toggle('active');
        nav.classList.toggle('visible');
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('#nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close navigation after clicking
                bars.classList.remove('active');
                nav.classList.remove('visible');
            }
        });
    });

    // Close navigation when clicking outside
    document.addEventListener('click', function(e) {
        if (!bars.contains(e.target) && !nav.contains(e.target)) {
            bars.classList.remove('active');
            nav.classList.remove('visible');
        }
    });

    // Add scroll effect to sections
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    });
});