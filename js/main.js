// Așteaptă ca întregul document să fie încărcat
document.addEventListener("DOMContentLoaded", function() {

    const progressBar = document.getElementById("progressBar");
    const topNav = document.getElementById("topNav");
    const burgerMenuContainer = document.getElementById("burgerMenuContainer");
    const burgerIcon = document.getElementById("burgerIcon");
    const burgerNav = document.getElementById("burgerNav");

    // Funcție pentru actualizarea barei de progres (Cerința 4)
    function updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + "%";
    }

    // Funcție pentru gestionarea navigației la scroll (Cerința 6)
    function handleNavScroll() {
        // Adăugăm clasa 'scrolled' pe body dacă am derulat mai mult de 50px
        if (window.scrollY > 50) {
            document.body.classList.add("scrolled");
        } else {
            document.body.classList.remove("scrolled");
        }
    }

    // Toggle pentru meniul burger (Cerința 6)
    burgerIcon.addEventListener("click", function() {
        burgerIcon.classList.toggle("active");
        burgerNav.classList.toggle("active");
    });
    
    // Închide meniul dacă se dă clic pe un link din el
    burgerNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            burgerIcon.classList.remove("active");
            burgerNav.classList.remove("active");
        });
    });


    // Adaugă event listenere
    window.addEventListener("scroll", function() {
        updateProgressBar();
        handleNavScroll();
    });
    
});
