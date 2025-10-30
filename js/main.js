// Așteaptă ca tot conținutul paginii să fie încărcat
document.addEventListener("DOMContentLoaded", function() {

    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const topNav = document.getElementById('top-nav');
    const burgerBtn = document.getElementById('burger-menu-btn');
    const sideNav = document.getElementById('side-nav');

    // --- 4. Funcția pentru Progress Bar ---
    function updateScrollProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgressBar.style.width = scrollPercent + '%';
    }

    // --- 6. Funcția pentru Navigație (Swap la scroll) ---
    function handleNavScroll() {
        // Schimbă navigația după un scroll de 100px
        if (window.scrollY > 100) {
            topNav.classList.add('hidden');
            burgerBtn.classList.add('visible');
        } else {
            topNav.classList.remove('hidden');
            burgerBtn.classList.remove('visible');
            // Ascunde side-nav dacă utilizatorul dă scroll înapoi sus
            sideNav.classList.remove('active');
        }
    }

    // --- 6. Funcționalitate Meniu Burger ---
    burgerBtn.addEventListener('click', function() {
        sideNav.classList.toggle('active');
        // Adaugă o clasă pentru a anima iconița burger (ex: transformare în X)
        burgerBtn.classList.toggle('active'); 
    });

    // --- Atașare Evenimente ---
    window.addEventListener('scroll', function() {
        updateScrollProgress();
        handleNavScroll();
    });

});
