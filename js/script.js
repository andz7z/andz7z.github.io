document.addEventListener("DOMContentLoaded", function() {

    const homeSection = document.querySelector('#home');
    const body = document.body;

    // Setează clasa inițială
    body.classList.add('is-homepage');

    // Opțiuni pentru Observer
    const options = {
        root: null, // Viewport
        threshold: 0.3, // Se activează când 30% din secțiune mai e vizibilă
        rootMargin: "0px"
    };

    // Crearea Observer-ului
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Utilizatorul este în secțiunea Home
                body.classList.add('is-homepage');
            } else {
                // Utilizatorul a părăsit secțiunea Home
                body.classList.remove('is-homepage');
            }
        });
    }, options);

    // Începe observarea secțiunii Home
    if (homeSection) {
        observer.observe(homeSection);
    }

    // --- Smooth Scroll pentru link-urile ancore ---
    // (Deși html { scroll-behavior: smooth; } face asta, 
    // acest JS oferă compatibilitate mai bună și control)
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
