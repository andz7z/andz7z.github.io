document.addEventListener("DOMContentLoaded", function() {

    const heroText = document.querySelector('.hero-text h1');

    if (heroText) {
        heroText.addEventListener('click', () => {
            // Only apply if not already evaporating
            if (!heroText.classList.contains('evaporate')) {
                
                heroText.classList.add('evaporate');

                // Set timeout to remove the class after animation + delay
                // Animation is 1s, reappear after 3-4s (total 4-5s)
                setTimeout(() => {
                    heroText.classList.remove('evaporate');
                }, 4000); // 1s animation + 3s wait = 4000ms
            }
        });
    }

});
