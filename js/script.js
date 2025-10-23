// Așteaptă ca întregul document HTML să fie încărcat
document.addEventListener("DOMContentLoaded", () => {

    const mainHeader = document.getElementById("mainHeader");
    const goTopBtn = document.getElementById("goTopBtn");
    const progressBar = document.getElementById("progressBar");
    const homeSection = document.getElementById("home");

    // --- 1. Logica pentru Progress Bar și Ascunderea Navigației ---
    window.addEventListener("scroll", () => {
        
        // --- Progress Bar ---
        const scrollTop = window.scrollY; // Cât de mult s-a derulat de sus
        const docHeight = document.documentElement.scrollHeight; // Înălțimea totală a documentului
        const winHeight = window.innerHeight; // Înălțimea ferestrei vizibile
        
        // Calculează procentajul de scroll
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        // Aplică procentajul la lățimea barei de progres
        progressBar.style.width = scrollPercent + "%";

        
        // --- Ascundere Navigație și Afișare Buton "Go Top" ---
        
        // Obține înălțimea secțiunii "home"
        const homeHeight = homeSection.offsetHeight;

        // Verifică dacă am trecut de secțiunea "home"
        if (scrollTop > homeHeight * 0.9) { 
            // Am trecut de "home"
            mainHeader.classList.add("hidden"); // Ascunde navigația principală
            goTopBtn.classList.add("visible"); // Afișează butonul "Go Top"
        } else {
            // Suntem încă în "home"
            mainHeader.classList.remove("hidden"); // Arată navigația principală
            goTopBtn.classList.remove("visible"); // Ascunde butonul "Go Top"
        }
    });

    // --- 2. Logica pentru Smooth Scroll la click pe link-urile de navigație ---
    const navLinks = document.querySelectorAll('a[href^="#"]'); // Selectează toate link-urile care încep cu #

    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); // Oprește comportamentul default (saltul brusc)

            const targetId = this.getAttribute("href"); // Ia ID-ul țintei (ex: "#about")
            const targetElement = document.querySelector(targetId); // Găsește elementul

            if (targetElement) {
                // Derulează automat și lin până la element
                targetElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 3. Logica pentru Fade-In la Scroll (Intersection Observer) ---
    const fadeElements = document.querySelectorAll(".fade-in");

    // Verifică dacă browser-ul suportă IntersectionObserver
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Dacă elementul este în viewport (vizibil)
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    // Oprește observarea elementului odată ce a apărut
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.1 // Elementul e considerat vizibil când 10% din el apare
        });

        // Aplică observer-ul pe fiecare element cu clasa ".fade-in"
        fadeElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback pentru browsere vechi (pur și simplu le arată pe toate)
        fadeElements.forEach(el => {
            el.classList.add("is-visible");
        });
    }

});
