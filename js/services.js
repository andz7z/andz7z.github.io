// Așteptăm ca tot conținutul paginii să fie încărcat
document.addEventListener('DOMContentLoaded', () => {

    // Selectăm elementele DOAR din interiorul secțiunii #services
    const servicesSection = document.getElementById('services');
    
    // Verificăm dacă secțiunea există, ca să nu ruleze scriptul degeaba
    if (servicesSection) {

        // --- 1. Logica Slider-ului ---
        const sliderWrapper = servicesSection.querySelector('.services-slider-wrapper');
        const slider = servicesSection.querySelector('.services-slider');
        const slides = servicesSection.querySelectorAll('.service-slide');
        const prevBtn = servicesSection.querySelector('.prev-slide');
        const nextBtn = servicesSection.querySelector('.next-slide');
        const dots = servicesSection.querySelectorAll('.dot');
        const timerProgress = servicesSection.querySelector('.timer-progress');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoSlideInterval;
        let timerAnimation;

        // Funcția principală care mișcă slider-ul
        function goToSlide(slideIndex) {
            // Validare index
            if (slideIndex < 0) {
                slideIndex = totalSlides - 1;
            } else if (slideIndex >= totalSlides) {
                slideIndex = 0;
            }

            // Mișcarea slider-ului
            slider.style.transform = `translateX(-${slideIndex * (100 / totalSlides)}%)`;
            currentSlide = slideIndex;

            // Actualizarea punctelor (dots)
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            // Resetăm și repornim timer-ul
            resetTimer();
        }

        // Funcții pentru butoane
        function slideNext() {
            goToSlide(currentSlide + 1);
        }

        function slidePrev() {
            goToSlide(currentSlide - 1);
        }

        // Funcție pentru controlul timer-ului
        function startTimer() {
            // Resetăm progresul anterior
            timerProgress.style.width = '0%';
            timerProgress.style.transition = 'none';
            
            // Forțăm un reflow
            void timerProgress.offsetWidth;
            
            // Pornim animația cu tranziție - CORECTAT AICI
            timerProgress.style.transition = 'width var(--slider-duration) linear';
            timerProgress.style.width = '100%';
            
            // Adăugăm clasa pentru autoplay activ
            sliderWrapper.classList.add('autoplay-active');
        }

        function resetTimer() {
            // Oprim orice animație în curs
            if (timerAnimation) {
                clearTimeout(timerAnimation);
            }
            
            // Resetăm timer-ul vizual
            timerProgress.style.transition = 'none';
            timerProgress.style.width = '0%';
            
            // Forțăm un reflow
            void timerProgress.offsetWidth;
            
            // Repornim timer-ul după un delay scurt
            timerAnimation = setTimeout(() => {
                startTimer();
            }, 100);
        }

        function stopTimer() {
            if (timerAnimation) {
                clearTimeout(timerAnimation);
            }
            timerProgress.style.transition = 'none';
            timerProgress.style.width = '0%';
            sliderWrapper.classList.remove('autoplay-active');
        }

        // Evenimente pentru butoane
        nextBtn.addEventListener('click', () => {
            slideNext();
            resetAutoSlide(); // Resetăm timer-ul la click manual
        });

        prevBtn.addEventListener('click', () => {
            slidePrev();
            resetAutoSlide();
        });

        // Evenimente pentru puncte
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
        });

        // Funcție pentru auto-play
        function startAutoSlide() {
            autoSlideInterval = setInterval(slideNext, 8000); // Schimbă slide-ul la fiecare 8 secunde
            startTimer(); // Pornim timer-ul vizual
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            resetTimer();
            startAutoSlide();
        }

        // Oprim auto-play-ul la hover pe slider
        sliderWrapper.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
            stopTimer();
        });

        // Repornim auto-play-ul la ieșirea mouse-ului
        sliderWrapper.addEventListener('mouseleave', () => {
            startAutoSlide();
        });

        // Pornim auto-play-ul inițial
        startAutoSlide();
        goToSlide(0); // Setăm starea inițială

        // --- 2. Logica Animației la Scroll (Intersection Observer) ---
        const elementsToAnimate = servicesSection.querySelectorAll('.animate-on-scroll');

        const observerOptions = {
            root: null, // Folosește viewport-ul
            rootMargin: '0px',
            threshold: 0.1 // Activează când 10% din element e vizibil
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adăugăm clasa 'visible'
                    entry.target.classList.add('visible');
                    
                    // Aplicăm delay-ul dacă există
                    const delay = entry.target.getAttribute('data-delay');
                    if (delay) {
                        entry.target.style.transitionDelay = `${delay * 0.15}s`;
                    }
                    
                    // Oprim observarea elementului după ce a fost animat
                    observer.unobserve(entry.target);
                }
            });
        };

        // Creăm și pornim observer-ul
        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        elementsToAnimate.forEach(el => {
            scrollObserver.observe(el);
        });
    }
});
