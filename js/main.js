// Asteptam ca tot continutul paginii sa fie incarcat
document.addEventListener('DOMContentLoaded', () => {

    const nav = document.querySelector('nav');
    const progressBar = document.getElementById('scroll-progress-bar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    // Functie pentru a gestiona tot ce tine de scroll
    function handleScroll() {
        // --- 4. Logic Progress Bar (Cerinta #4) ---
        
        // Inaltimea totala care poate fi derulata
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Cat de mult am derulat de sus
        const scrollTop = window.scrollY;
        
        // Calculam procentajul
        const progress = (scrollTop / scrollableHeight) * 100;
        
        // Aplicam procentajul la latimea barei
        progressBar.style.width = progress + '%';


        // --- 6. Logica Navigatie la Scroll (Cerinta #6) ---
        
        // Daca am dat scroll mai mult de 50px de sus...
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled'); // ...adaugam clasa
        } else {
            nav.classList.remove('nav-scrolled'); // ...o scoatem
        }
    }

    // Adaugam listener-ul pentru evenimentul 'scroll'
    window.addEventListener('scroll', handleScroll);


    // --- 6. Logica Active Section "Glow" (Cerinta #6) ---
    // Vom folosi un IntersectionObserver pentru a detecta
    // ce sectiune este vizibila pe ecran
    
    const observerOptions = {
        root: null, // foloseste viewport-ul
        rootMargin: '0px',
        threshold: 0.5 // 50% din sectiune trebuie sa fie vizibila
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Daca sectiunea intra in viewport
            if (entry.isIntersecting) {
                const id = entry.target.id; // Luam ID-ul sectiunii (ex: "home")
                
                // Scoatem clasa 'active' de la toate link-urile
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Adaugam clasa 'active' doar link-ului care corespunde sectiunii
                // Folosim querySelector pentru a gasi link-ul dupa atributul href
                const activeLink = document.querySelector(`nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Punem observer-ul sa urmareasca fiecare sectiune
    sections.forEach(section => {
        observer.observe(section);
    });

});
