// Asteptam ca tot continutul paginii sa fie incarcat
document.addEventListener('DOMContentLoaded', () => {

    // Selectam elementele cheie
    const video = document.querySelector('.home-video');
    const topNav = document.querySelector('.top-nav');
    const card = document.querySelector('.home-card');
    const progressBar = document.querySelector('.progress-bar');
    const burgerIcon = document.querySelector('.burger-menu-icon');
    const minimalistMenu = document.querySelector('.minimalist-menu');

    // REQ 9 & 11: Animatiile de intrare (Fade In)
    // Adaugam clasele 'visible' pentru a declansa tranzitiile CSS
    // Ordinea este gestionata de transition-delay in CSS.
    if (video) video.classList.add('visible');
    if (topNav) topNav.classList.add('visible');
    if (card) card.classList.add('visible');
    
    // Logica pentru scroll
    window.addEventListener('scroll', () => {
        
        // REQ 4: Logica Progress Bar
        const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolledPercentage = (window.scrollY / totalScrollableHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrolledPercentage + '%';
        }

        // REQ 6: Tranzitia Nav -> Burger Menu
        if (window.scrollY > 50) {
            // Daca am dat scroll mai mult de 50px
            if (topNav) topNav.classList.add('hidden');
            if (burgerIcon) burgerIcon.classList.add('visible');
        } else {
            // Daca suntem inapoi sus
            if (topNav) topNav.classList.remove('hidden');
            if (burgerIcon) burgerIcon.classList.remove('visible');
            // Ascundem si meniul minimalist daca era deschis
            if (minimalistMenu) minimalistMenu.classList.remove('visible');
        }
    });

    // REQ 6: Logica deschidere/inchidere Burger Menu
    if (burgerIcon && minimalistMenu) {
        burgerIcon.addEventListener('click', () => {
            // Comutam (toggle) clasa 'visible' pentru meniu
            minimalistMenu.classList.toggle('visible');
            // (Optional: adaugam o clasa 'active' pe burger pt animatia 'X')
            burgerIcon.classList.toggle('active');
        });
    }

});

// (Celelalte fisiere JS - home.js, services.js etc. - sunt momentan goale,
// dar sunt gata sa primeasca logica specifica fiecarei sectiuni cand va fi cazul)
