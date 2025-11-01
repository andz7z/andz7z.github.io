//burger
document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('burger-menu-container');
    const burgerIcon = document.getElementById('burger-icon');
    const mainNav = document.getElementById('main-nav');
    const openMenu = () => {
        mainNav.classList.add('active');
    };
    const closeMenu = () => {
        mainNav.classList.remove('active');
    };
    burgerIcon.addEventListener('mouseenter', (e) => {
        e.stopPropagation(); 
        openMenu();
    });
    menuContainer.addEventListener('mouseleave', () => {
        closeMenu();
    });
    document.addEventListener('click', (e) => {
        if (!menuContainer.contains(e.target)) {
            closeMenu();
        }
    });

});