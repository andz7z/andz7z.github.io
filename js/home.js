document.addEventListener("DOMContentLoaded", function() {

    const heroTextH1 = document.getElementById('hero-text-h1');
    if (!heroTextH1) return;

    let isAnimating = false;
    const originalHTML = heroTextH1.innerHTML; // Salveaza HTML-ul original (cu <br>)

    // Functie pentru a imparti textul in litere (span-uri)
    function wrapLetters() {
        // Inlocuieste <br> cu un placeholder temporar
        const textWithPlaceholder = originalHTML.replace(/<br\s*\/?>/gi, '||BR||');
        
        const letters = textWithPlaceholder.split('');
        
        heroTextH1.innerHTML = letters.map(letter => {
            if (letter === ' ') {
                // Pastreaza spatiile ca spatii
                return '<span class="letter">&nbsp;</span>';
            }
            if (letter === '|' && letters.slice(letters.indexOf(letter), letters.indexOf(letter) + 6).join('') === '||BR||') {
                // A gasit placeholder-ul, inlocuieste-l cu <br>
                // Acest 'if' va fi adevarat de 6 ori, il vrem doar o data
                if (letters[letters.indexOf(letter) + 1] === '|') {
                     // Hacky: consuma placeholder-ul
                     letters.splice(letters.indexOf(letter), 6);
                     return '<br>';
                }
               return ''; // Ignora restul placeholder-ului
            }
             if (letter === '|') {
                 return ''; // A ajuns aici dintr-un 'slice' anterior
             }
            
            return `<span class="letter">${letter}</span>`;
        }).join('');
    }

    // Functie pentru a aplica animatia
    function animateLetters(animationClass, delayBetweenLetters = 30) {
        const letters = heroTextH1.querySelectorAll('span.letter');
        if (letters.length === 0) return;

        heroTextH1.classList.add('animating');
        
        letters.forEach((letter, index) => {
            letter.style.animationDelay = `${index * delayBetweenLetters}ms`;
            letter.classList.add(animationClass);
            letter.classList.remove(animationClass === 'evaporate' ? 'fade-in' : 'evaporate');
        });

        // Calculeaza durata totala a animatiei
        const totalDuration = (letters.length * delayBetweenLetters) + 1000; // 1000ms = durata animatiei (aprox)
        return totalDuration;
    }

    // --- MAIN EXECUTION ---

    // 1. Imparte textul in litere la incarcarea paginii
    wrapLetters();

    // 2. Adauga event listener pentru click
    heroTextH1.addEventListener('click', () => {
        if (isAnimating) return; // Nu face nimic daca animatia ruleaza
        isAnimating = true;

        // Porneste animatia de "evaporare"
        const evaporationDuration = animateLetters('evaporate', 20);

        // Seteaza un timeout pentru a astepta 3-4 secunde DUPA ce animatia s-a terminat
        setTimeout(() => {
            // Porneste animatia de "fade-in"
            animateLetters('fade-in', 30);
            
            // Seteaza un timeout pentru a reseta starea dupa ce fade-in s-a terminat
            const fadeInDuration = (heroTextH1.querySelectorAll('span.letter').length * 30) + 600;
            
            setTimeout(() => {
                isAnimating = false;
                heroTextH1.classList.remove('animating');
                // Optional: curata clasele de animatie
                 heroTextH1.querySelectorAll('span.letter').forEach(l => {
                     l.classList.remove('fade-in', 'evaporate');
                     l.style.animationDelay = '';
                 });
            }, fadeInDuration);

        }, evaporationDuration + 2500); // Asteapta terminarea evaporarii + 2.5 secunde
    });

    // 3. Adauga efectul de hover per litera (folosind CSS)
    // Pentru a face tranzitia de hover mai "organica", adaugam un delay si la hover
    const lettersForHover = heroTextH1.querySelectorAll('span.letter');
    lettersForHover.forEach((letter, index) => {
        letter.style.transitionDelay = `${index * 10}ms`;
    });

    // La mouse out, reseteaza delay-ul invers
    heroTextH1.addEventListener('mouseleave', () => {
         lettersForHover.forEach((letter, index) => {
            letter.style.transitionDelay = `${(lettersForHover.length - index) * 10}ms`;
        });
    });
     heroTextH1.addEventListener('mouseenter', () => {
         lettersForHover.forEach((letter, index) => {
            letter.style.transitionDelay = `${index * 10}ms`;
        });
    });
});
