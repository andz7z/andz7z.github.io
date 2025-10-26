// Services Section JavaScript - Improved Version
document.addEventListener('DOMContentLoaded', function() {
    // Elemente principale
    const servicesSection = document.querySelector('.services-section');
    const slides = document.querySelectorAll('.service-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const featureBars = document.querySelectorAll('.feature-progress');
    
    let currentSlide = 0;
    let autoSlideInterval;
    let isAnimating = false;
    let slideDuration = 8000; // 8 secunde între slide-uri (mai lent)
    let timerInterval;

    // Inițializare
    function initServices() {
        // Creează timer-ul vizual
        createTimer();
        
        // Setează progresul pentru barele de features
        setFeatureProgress();
        
        // Pornește slide-ul automat
        startAutoSlide();
        
        // Activează animațiile la scroll
        initScrollAnimations();
        
        // Adaugă event listeners
        addEventListeners();
        
        // Activează primul slide
        activateSlide(currentSlide);
    }

    // Creează timer-ul vizual
    function createTimer() {
        const timerHTML = `
            <div class="slider-timer">
                <div class="timer-progress"></div>
            </div>
        `;
        document.querySelector('.services-slider').insertAdjacentHTML('afterbegin', timerHTML);
    }

    // Start timer animation
    function startTimer() {
        const timerProgress = document.querySelector('.timer-progress');
        if (!timerProgress) return;
        
        // Resetează timer-ul
        timerProgress.style.transition = 'none';
        timerProgress.style.width = '0%';
        
        // Force reflow
        timerProgress.offsetHeight;
        
        // Start animația
        timerProgress.style.transition = `width ${slideDuration}ms linear`;
        timerProgress.style.width = '100%';
    }

    // Stop timer animation
    function stopTimer() {
        const timerProgress = document.querySelector('.timer-progress');
        if (timerProgress) {
            timerProgress.style.transition = 'none';
            timerProgress.style.width = '0%';
        }
    }

    // Setează progresul pentru barele de features
    function setFeatureProgress() {
        featureBars.forEach(bar => {
            const progressValue = bar.getAttribute('data-value');
            bar.style.setProperty('--progress-width', `${progressValue}%`);
        });
    }

    // Navigare la slide-ul specificat
    function goToSlide(slideIndex) {
        if (isAnimating || slideIndex === currentSlide) return;
        
        isAnimating = true;
        stopTimer(); // Oprește timer-ul curent
        
        // Dezactivează slide-ul curent
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('prev');
        
        // Actualizează indicatorii
        indicators[currentSlide].classList.remove('active');
        
        // Actualizează indexul curent
        currentSlide = slideIndex;
        
        // Activează noul slide
        setTimeout(() => {
            slides.forEach(slide => slide.classList.remove('prev'));
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            
            // Resetează și reanimează barele de progres
            resetAndAnimateProgressBars();
            
            isAnimating = false;
            
            // Restartează timer-ul pentru noul slide
            startTimer();
        }, 400);
        
        // Reîncepe auto-slide
        restartAutoSlide();
    }

    // Slide următor
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }

    // Slide anterior
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }

    // Activează un slide specific
    function activateSlide(index) {
        slides.forEach(slide => slide.classList.remove('active', 'prev'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
        
        // Pornește timer-ul
        startTimer();
        
        // Animează barele de progres
        setTimeout(() => {
            animateProgressBars();
        }, 500);
    }

    // Resetează și reanimează barele de progres
    function resetAndAnimateProgressBars() {
        const activeSlide = slides[currentSlide];
        const progressBars = activeSlide.querySelectorAll('.feature-progress');
        
        // Resetează lățimea
        progressBars.forEach(bar => {
            bar.style.width = '0';
        });
        
        // Animează după o scurtă întârziere
        setTimeout(() => {
            animateProgressBars();
        }, 300);
    }

    // Animează barele de progres
    function animateProgressBars() {
        const activeSlide = slides[currentSlide];
        const progressBars = activeSlide.querySelectorAll('.feature-progress');
        
        progressBars.forEach((bar, index) => {
            const progressValue = bar.getAttribute('data-value');
            setTimeout(() => {
                bar.style.width = `${progressValue}%`;
                bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Adaugă efect de "bounce" la final
                setTimeout(() => {
                    bar.style.transform = 'scaleX(1.02)';
                    setTimeout(() => {
                        bar.style.transform = 'scaleX(1)';
                    }, 150);
                }, 1200);
            }, index * 200);
        });
    }

    // Slide automat
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
            }
        }, slideDuration);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        stopTimer();
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Animații la scroll
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Restartează auto-slide când secțiunea devine vizibilă
                    restartAutoSlide();
                    
                    // Activează animațiile pentru slide-ul curent
                    setTimeout(() => {
                        animateProgressBars();
                    }, 800);
                } else {
                    // Oprește auto-slide când secțiunea nu este vizibilă
                    stopAutoSlide();
                }
            });
        }, observerOptions);

        sectionObserver.observe(servicesSection);
    }

    // Efecte de hover pentru butoane
    function addButtonHoverEffects() {
        const buttons = document.querySelectorAll('.nav-btn, .indicator');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                if (window.matchMedia("(hover: hover)").matches) {
                    this.style.transform = 'scale(1.1)';
                    this.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.4)';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                if (window.matchMedia("(hover: hover)").matches) {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
                }
            });
        });
    }
    // Adaugă toate event listener-ele
    function addEventListeners() {
        // Butoane de navigare
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Indicatori
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
        
        // Pause auto-slide on hover/interaction
        servicesSection.addEventListener('mouseenter', stopAutoSlide);
        servicesSection.addEventListener('mouseleave', () => {
            if (servicesSection.classList.contains('in-view')) {
                startAutoSlide();
            }
        });
        
        // Pause on touch
        servicesSection.addEventListener('touchstart', stopAutoSlide);
        servicesSection.addEventListener('touchend', () => {
            if (servicesSection.classList.contains('in-view')) {
                setTimeout(() => startAutoSlide(), 3000); // Restartează după 3 secunde
            }
        });
        
        // Efecte de hover
        addButtonHoverEffects();
    }

    // Efect de tranziție între slide-uri
    function enhanceSlideTransitions() {
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'slide-transition-overlay';
        transitionOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(0,0,0,0.8) 0%, transparent 50%, rgba(0,0,0,0.8) 100%);
            opacity: 0;
            pointer-events: none;
            z-index: 10;
            transition: opacity 0.3s ease;
        `;
        servicesSection.querySelector('.services-slider').appendChild(transitionOverlay);
        
        const originalGoToSlide = goToSlide;
        goToSlide = function(slideIndex) {
            if (isAnimating || slideIndex === currentSlide) return;
            
            // Show transition overlay
            transitionOverlay.style.opacity = '1';
            
            setTimeout(() => {
                originalGoToSlide(slideIndex);
                
                // Hide transition overlay
                setTimeout(() => {
                    transitionOverlay.style.opacity = '0';
                }, 400);
            }, 150);
        };
    }

    // Efect de lumină pentru slide-ul activ
    function addActiveSlideGlow() {
        const updateSlideGlow = () => {
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.15)';
                    slide.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                } else {
                    slide.style.boxShadow = 'none';
                    slide.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
        };
        
        const originalGoToSlide = goToSlide;
        goToSlide = function(slideIndex) {
            originalGoToSlide(slideIndex);
            setTimeout(updateSlideGlow, 500);
        };
        
        updateSlideGlow();
    }

    // Detectează dispozitivul și ajustează setările
    function detectDeviceAndAdjust() {
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            // Dispozitiv touch
            slideDuration = 10000; // 10 secunde pentru dispozitive mobile
        } else {
            // Desktop
            slideDuration = 8000; // 8 secunde pentru desktop
        }
    }

    // Inițializează toate funcționalitățile
    detectDeviceAndAdjust();
    initServices();
    enhanceSlideTransitions();
    addActiveSlideGlow();

    // Expune funcțiile globale pentru debugging (opțional)
    window.services = {
        nextSlide,
        prevSlide,
        goToSlide,
        currentSlide: () => currentSlide,
        stopAutoSlide,
        startAutoSlide
    };

    console.log('✅ Services section initialized successfully!');
});
