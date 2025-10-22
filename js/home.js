/* ANDZ — Lehadus Andrei */
'use strict';

// Funcția de inițializare va fi apelată din script.js
function initHomeAnimations() {
    
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle) return; // Verificare de siguranță

    const titleText = "DESIGN.DEVELOP.DELIVER.";
    
    // 1. Injectează literele în <span>-uri
    heroTitle.innerHTML = titleText
        .split('')
        .map(char => {
            // Înlocuim spațiul (dacă ar fi) cu un non-breaking space
            if (char === ' ') return ' '; 
            // Folosim <br> dacă vrem linii noi (aici . e separatorul vizual)
            if (char === '.') return '<br>';
            return `<span class="char" aria-hidden="true">${char}</span>`;
        })
        .join('');

    // 2. Adaugă event listeners pentru litere
    const chars = heroTitle.querySelectorAll('.char');
    const REAPPEAR_DELAY = 3500; // 3.5 secunde

    chars.forEach(char => {
        char.addEventListener('click', () => {
            handleCharClick(char);
        });

        // Adăugăm și un mic delay la hover pentru a nu fi prea deranjant
        let hoverTimeout;
        char.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                 // Poți adăuga o clasă specifică de hover aici dacă dorești
                 // De ex: char.classList.add('smoke-hover');
            }, 100);
        });
        char.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            // char.classList.remove('smoke-hover');
        });
    });

    function handleCharClick(char) {
        // Previne re-click-ul cât timp animația rulează
        if (char.classList.contains('is-smoking') || char.classList.contains('is-reappearing')) {
            return;
        }

        // 1. Adaugă clasa pentru animația "smokeUp"
        char.classList.add('is-smoking');

        // 2. Setează reapariția
        setTimeout(() => {
            // Elimină clasa de dispariție
            char.classList.remove('is-smoking');
            
            // Adaugă clasa pentru animația "reappear"
            char.classList.add('is-reappearing');

            // 3. Curăță clasa de reapariție după ce animația s-a terminat
            char.addEventListener('animationend', () => {
                char.classList.remove('is-reappearing');
            }, { once: true }); // Listener-ul se auto-elimină

        }, REAPPEAR_DELAY);
    }

    // 3. Animația "dramatică" de fade-in pentru elementele de pe Home
    // Spre deosebire de observer, aceasta rulează la încărcarea paginii
    
    const homeElements = [
        document.querySelector('.logo-link'),
        document.getElementById('main-nav'),
        document.getElementById('social-links'),
        heroTitle,
        document.getElementById('hero-subtitle'),
        document.getElementById('cta-scroll')
    ];

    // Adăugăm clasa 'is-visible' manual pentru secțiunea home
    // (Observer-ul ar putea să nu se declanșeze corect la 0 scroll)
    setTimeout(() => {
        document.getElementById('home').classList.add('is-visible');
        
        // Aplicăm animațiile de intrare (definite în home.css)
        // Nu mai este necesar dacă folosim animații keyframe cu delay în CSS
        // Am lăsat animațiile în home.css (fadeInDown, fadeInUp, fadeInRight)
        
    }, 100); // Mic delay pentru a asigura randarea

}
