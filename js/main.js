document.addEventListener('DOMContentLoaded', () => {

    const nav = document.querySelector('nav');
    const progressBar = document.getElementById('scroll-progress-bar');
    const sections = document.querySelectorAll('section');
    
    // MODIFICARE (Cerinta #2): Elemente noi
    const burgerIcon = document.getElementById('burger-icon');
    const burgerMenuContainer = document.getElementById('burger-menu-container');
    
    // MODIFICARE (Cerinta #2): Selectam link-urile din AMBELE meniuri
    const navLinks = document.querySelectorAll('nav a, #burger-menu-container a');

    // Functie pentru a gestiona tot ce tine de scroll
    function handleScroll() {
        // --- 4. Logic Progress Bar (Neschimbat) ---
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / scrollableHeight) * 100;
        progressBar.style.width = progress + '%';

        // --- MODIFICARE (Cerinta #2): Logica Navigatie la Scroll ---
        
        if (window.scrollY > 50) {
            // Ascundem nav-ul de sus
            nav.classList.add('nav-hidden');
            // Afisam iconita burger
            burgerIcon.classList.add('visible');
        } else {
            // Afisam nav-ul de sus
            nav.classList.remove('nav-hidden');
            // Ascundem iconita burger
            burgerIcon.classList.remove('visible');
            
            // Inchidem automat meniul burger daca user-ul da scroll sus
            burgerIcon.classList.remove('open');
            burgerMenuContainer.classList.remove('open');
        }
    }

    // Adaugam listener-ul pentru evenimentul 'scroll'
    window.addEventListener('scroll', handleScroll);

    // --- MODIFICARE (Cerinta #2): Logica Click Burger Menu ---
    burgerIcon.addEventListener('click', () => {
        // Animam iconita (devine X)
        burgerIcon.classList.toggle('open');
        // Deschidem/inchidem meniul lateral
        burgerMenuContainer.classList.toggle('open');
    });

    // Bonus: Inchidem meniul daca se da click pe un link (util pt mobile)
    const burgerLinks = document.querySelectorAll('#burger-menu-container a');
    burgerLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerIcon.classList.remove('open');
            burgerMenuContainer.classList.remove('open');
        });
    });


    // --- 6. Logica Active Section (ACTUALIZATA) ---
    // Functioneaza la fel, dar acum tinteste ambele seturi de link-uri
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                
                // Scoatem clasa 'active' de la TOATE link-urile
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Adaugam clasa 'active' la link-urile corespondente
                // (va gasi link-ul si in nav-ul de sus, si in cel burger)
                const activeLinks = document.querySelectorAll(`nav a[href="#${id}"], #burger-menu-container a[href="#${id}"]`);
                activeLinks.forEach(link => {
                    link.classList.add('active');
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

});
