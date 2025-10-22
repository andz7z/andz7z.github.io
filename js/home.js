document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Animație home text secvențială
    const homeWords = document.querySelectorAll('.home-text .word');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    homeWords.forEach((word, index) => {
                        setTimeout(() => {
                            word.classList.add('visible');
                        }, index * 300); // 300ms între cuvinte
                    });
                }, 500);
            }
        });
    }, { threshold: 0.3 });
    
    textObserver.observe(document.querySelector('.home-text'));
    
    // 2. Fragmentarea textului în litere
    homeWords.forEach(word => {
        const text = word.textContent;
        word.innerHTML = text.split('').map(char => {
            return char === ' ' ? ' ' : `<span class="char">${char}</span>`;
        }).join('');
    });
    
    // 3. Efect de click pe litere
    const chars = document.querySelectorAll('.home-text .char');
    
    chars.forEach(char => {
        char.addEventListener('click', (e) => {
            if (char.classList.contains('smoked')) return;
            
            char.classList.add('smoked');
            
            setTimeout(() => {
                char.classList.remove('smoked');
            }, 3500);
        });
    });
    
    // 4. Animații pentru logo și navigație (se activează imediat)
    setTimeout(() => {
        const logo = document.querySelector('.logo');
        const nav = document.querySelector('.main-nav');
        
        if (logo) logo.classList.add('visible');
        if (nav) nav.classList.add('visible');
        
        // Scroll indicator după ce textul apare
        setTimeout(() => {
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) scrollIndicator.classList.add('visible');
        }, 2000);
    }, 100);
});
