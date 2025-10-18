// Loading and initial transitions
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const heroSection = document.getElementById('hero');

    setTimeout(() => {
        // Apply blur out effect to loading screen
        loadingScreen.classList.add('blur-out');
        
        setTimeout(() => {
            // Hide loading screen and show main content
            loadingScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            
            // Apply blur in effect to hero section
            setTimeout(() => {
                heroSection.classList.add('blur-in');
                setTimeout(() => {
                    heroSection.classList.add('active');
                }, 500);
            }, 100);
        }, 1000);
    }, 3000);

    // Scroll effects
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.75 && sectionBottom > windowHeight * 0.25) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scrolling for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
});
