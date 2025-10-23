document.addEventListener('DOMContentLoaded', () => {

    // --- "LET'S START" SCROLL BUTTON ---
    const scrollDownButton = document.querySelector('.scroll-down');
    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', () => {
            // Smoothly scroll to the #about section
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // --- EVAPORATING TEXT ANIMATION ---
    const letters = document.querySelectorAll('.letter');

    letters.forEach(letter => {
        letter.addEventListener('click', function() {
            // Prevent re-clicking while animating
            if (this.classList.contains('evaporating') || this.classList.contains('reappearing')) {
                return;
            }

            // 1. Add evaporate class
            this.classList.add('evaporating');
            this.classList.remove('reappearing'); // Clean up

            // 2. Set timeout for 3.5 seconds (3500ms)
            setTimeout(() => {
                // 3. Add reappear class
                this.classList.remove('evaporating');
                this.classList.add('reappearing');

                // 4. Remove reappear class after its animation finishes
                this.addEventListener('animationend', () => {
                    this.classList.remove('reappearing');
                }, { once: true }); // 'once: true' automatically removes the listener

            }, 3500); // 3-4 second delay + animation time
        });
    });

});
