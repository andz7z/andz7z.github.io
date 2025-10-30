// Asteptam ca tot continutul paginii sa fie incarcat
window.addEventListener('DOMContentLoaded', () => {

    const progressBar = document.getElementById('progressBar');
    const mainNav = document.getElementById('mainNav');
    const burgerBtn = document.getElementById('burgerBtn');
    const burgerNav = document.getElementById('burgerNav');
    const burgerLinks = document.querySelectorAll('.burger-link');

    // ----------------------------------
    // 4. Functie Progress Bar
    // ----------------------------------
    function updateProgressBar() {
        // (Inaltimea totala a documentului - inaltimea ferestrei vizibile)
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Pozitia curenta a scroll-ului
        const scrollTop = window.scrollY;
        
        // Calculam procentajul
        const scrollPercent = (scrollTop / scrollableHeight) * 100;

        progressBar.style.width = scrollPercent + '%';
    }

    // ----------------------------------
    // 6. Functie Navigatie la Scroll
    // ----------------------------------
    function toggleNavOnScroll() {
        // Daca am dat scroll mai mult de 100px
        if (window.scrollY > 100) {
            mainNav.classList.add('hidden'); // Ascundem navigatia principala
            burgerBtn.classList.add('visible'); // Afisam butonul burger
        } else {
            mainNav.classList.remove('hidden'); // Afisam navigatia principala
            burgerBtn.classList.remove('visible'); // Ascundem butonul burger
        }
    }

    // ----------------------------------
    // 6. Functie Toggle Burger Menu
    // ----------------------------------
    function toggleBurgerMenu() {
        burgerBtn.classList.toggle('active'); // Activeaza animatia 'X'
        burgerNav.classList.toggle('active'); // Afiseaza/ascunde meniul
    }

    // Adaugam event listenerii
    window.addEventListener('scroll', () => {
        updateProgressBar();
        toggleNavOnScroll();
    });

    // Event listener pentru butonul burger
    burgerBtn.addEventListener('click', toggleBurgerMenu);

    // Inchide meniul burger cand se da click pe un link
    burgerLinks.forEach(link => {
        link.addEventListener('click', toggleBurgerMenu);
    });

});
