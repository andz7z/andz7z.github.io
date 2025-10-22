document.addEventListener("DOMContentLoaded", function() {

    const words = document.querySelectorAll('.home-text .word');

    // 1. Fragmentarea textului în litere (span-uri)
    words.forEach(word => {
        const text = word.textContent;
        word.innerHTML = text.split('').map(char => {
            // Verificăm dacă e spațiu sau literă
            return char === ' ' ? ' ' : `<span class="char">${char}</span>`;
        }).join('');
    });

    // 2. Adăugarea event listener-ului pentru efectul de click
    const chars = document.querySelectorAll('.home-text .char');

    chars.forEach(char => {
        char.addEventListener('click', () => {
            // Previne dublu-click în timpul animației
            if (char.classList.contains('smoked')) {
                return;
            }

            // Adaugă clasa care declanșează animația de dispariție
            char.classList.add('smoked');

            // Setează revenirea după 3-4 secunde
            setTimeout(() => {
                char.classList.remove('smoked');
            }, 3500); // 3.5 secunde
        });
    });

});
