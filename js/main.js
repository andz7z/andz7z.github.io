document.addEventListener('DOMContentLoaded', () => {
    
    // Selectăm elementele de care avem nevoie
    const menuContainer = document.getElementById('burger-menu-container');
    const burgerIcon = document.getElementById('burger-icon');
    const mainNav = document.getElementById('main-nav');

    // Funcție pentru a deschide meniul
    const openMenu = () => {
        mainNav.classList.add('active');
    };

    // Funcție pentru a închide meniul
    const closeMenu = () => {
        mainNav.classList.remove('active');
    };

    // MODIFICAT: Deschidem meniul la 'mouseenter' (hover)
    // în loc de 'click'
    burgerIcon.addEventListener('mouseenter', (e) => {
        // Oprim propagarea evenimentului
        e.stopPropagation(); 
        // Deschidem meniul
        openMenu();
    });

    // Când mouse-ul părăsește *întregul container* (icon + nav),
    // închidem meniul.
    menuContainer.addEventListener('mouseleave', () => {
        closeMenu();
    });

    // O măsură de siguranță: dacă dăm click oriunde în pagină
    // în afara containerului de meniu, îl închidem.
    document.addEventListener('click', (e) => {
        if (!menuContainer.contains(e.target)) {
            closeMenu();
        }
    });

});