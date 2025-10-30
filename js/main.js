// js/main.js

window.addEventListener('scroll', function() {
    // --- Logica Progress Bar (Req 4) ---
    const progressBar = document.getElementById('scroll-progress-bar');
    
    // Totalul paginii scrollabile
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Cât de mult s-a scrollat (în procent)
    const scrollProgress = (window.pageYOffset / totalHeight) * 100;
    
    progressBar.style.width = scrollProgress + '%';

    
    // --- Logica Navigație la Scroll (Req 6) ---
    const mainNav = document.getElementById('main-nav');
    const burgerToggle = document.getElementById('burger-menu-toggle');
    
    // Când dăm scroll mai mult de, să zicem, 100px în jos
    if (window.scrollY > 100) {
        mainNav.classList.add('hidden');
        burgerToggle.classList.add('visible');
    } else {
        mainNav.classList.remove('hidden');
        burgerToggle.classList.remove('visible');
    }
});

// --- Logica Meniu Burger (Req 6) ---
const burgerToggle = document.getElementById('burger-menu-toggle');
const burgerNavLinks = document.getElementById('burger-nav-links');

burgerToggle.addEventListener('click', function() {
    // Adaugă/scoate clasa 'open' pe ambele elemente
    burgerToggle.classList.toggle('open');
    burgerNavLinks.classList.toggle('open');
});

// Ascunde meniul burger dacă se dă click pe un link (pentru single-page app)
document.querySelectorAll('#burger-nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        burgerToggle.classList.remove('open');
        burgerNavLinks.classList.remove('open');
    });
});
