// JavaScript specific pentru secțiunea Reviews.

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.reviews-slider');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    if (!slider || !dots.length) return;

    slider.addEventListener('scroll', () => {
        // Calculează indexul slide-ului curent (cel mai apropiat de centru)
        const slideWidth = slider.querySelector('.review-slide').offsetWidth;
        const scrollLeft = slider.scrollLeft;
        const sliderWidth = slider.offsetWidth;
        
        // Găsim centrul viewport-ului slider-ului
        const sliderCenter = scrollLeft + sliderWidth / 2;
        
        // Găsim slide-ul cel mai apropiat de centru
        let activeIndex = 0;
        let minDistance = Infinity;

        slider.querySelectorAll('.review-slide').forEach((slide, index) => {
            const slideCenter = slide.offsetLeft + slideWidth / 2;
            const distance = Math.abs(sliderCenter - slideCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }
        });

        // Actualizează punctele
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    });

    // Bonus: Click pe puncte pentru a naviga
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const slide = slider.querySelectorAll('.review-slide')[index];
            if (slide) {
                // Calculăm poziția pentru a centra slide-ul
                const slideWidth = slide.offsetWidth;
                const sliderWidth = slider.offsetWidth;
                const targetScroll = slide.offsetLeft - (sliderWidth / 2) + (slideWidth / 2);

                slider.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            }
        });
    });
});
