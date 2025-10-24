// Funcții generale pentru site
document.addEventListener('DOMContentLoaded', function() {
    // Ascultători pentru scroll
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Inițializare la încărcare

    // Ascultători pentru butoane
    document.getElementById('go-back').addEventListener('click', function() {
        scrollToSection('home');
    });

    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            scrollToSection(section);
        });
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');

    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            scrollToSection(section);
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
});

// Funcție pentru scroll la o secțiune
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Funcție pentru gestionarea scroll-ului
function handleScroll() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Actualizare progress bar
    const progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    // Ascundere/afișare elemente
    const navbar = document.getElementById('navbar');
    const socialIcons = document.querySelectorAll('.social-icons');
    const goBack = document.getElementById('go-back');
    
    if (scrollPosition > windowHeight * 0.5) {
        navbar.classList.add('hidden');
        socialIcons.forEach(icon => icon.classList.add('hidden'));
        goBack.classList.add('visible');
    } else {
        navbar.classList.remove('hidden');
        socialIcons.forEach(icon => icon.classList.remove('hidden'));
        goBack.classList.remove('visible');
    }
}
