// Services Section JavaScript
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

    // Inițializare
    function initServices() {
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
        }, 5000); // Schimbă la 5 secunde
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
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
                    
                    // Activează animațiile pentru slide-ul curent
                    setTimeout(() => {
                        animateProgressBars();
                    }, 800);
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
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.4)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
            });
        });
    }

    // Efect de particule pentru fundal
    function createParticleEffect() {
        const bgElements = document.querySelector('.service-bg-elements');
        
        // Adaugă mai multe elemente de fundal pentru un efect mai bogat
        for (let i = 5; i <= 8; i++) {
            const particle = document.createElement('div');
            particle.className = `bg-element el-${i}`;
            
            // Poziție și dimensiuni aleatorii
            const size = Math.random() * 100 + 50;
            const posX = Math.random() * 80 + 10;
            const posY = Math.random() * 80 + 10;
            const animationDelay = Math.random() * 20;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${animationDelay}s`;
            particle.style.opacity = Math.random() * 0.2 + 0.1;
            
            bgElements.appendChild(particle);
        }
    }

    // Efect de cursor personalizat
    function initCursorEffect() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        // Stiluri pentru cursor
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.2s, height 0.2s, background 0.2s;
            mix-blend-mode: difference;
        `;
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Efect de hover pe butoane
        const interactiveElements = document.querySelectorAll('button, .indicator');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.background = 'rgba(255, 255, 255, 0.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.background = 'rgba(255, 255, 255, 0.3)';
            });
        });
    }

    // Navigare cu taste
    function initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!servicesSection.classList.contains('in-view')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
                case '1':
                    e.preventDefault();
                    goToSlide(0);
                    break;
                case '2':
                    e.preventDefault();
                    goToSlide(1);
                    break;
                case '3':
                    e.preventDefault();
                    goToSlide(2);
                    break;
            }
        });
    }

    // Swipe pentru dispozitive mobile
    function initTouchSwipe() {
        let startX = 0;
        let endX = 0;
        
        servicesSection.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        });
        
        servicesSection.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }
            }
        }
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
        
        // Pause auto-slide on hover
        servicesSection.addEventListener('mouseenter', stopAutoSlide);
        servicesSection.addEventListener('mouseleave', startAutoSlide);
        
        // Efecte de hover
        addButtonHoverEffects();
        
        // Navigare cu taste
        initKeyboardNavigation();
        
        // Swipe pentru mobile
        initTouchSwipe();
    }

    // Efect de tranziție între slide-uri
    function enhanceSlideTransitions() {
        // Adaugă un overlay pentru efecte de tranziție
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
        
        // Modifică funcția goToSlide pentru a include efectul
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
        
        // Actualizează la fiecare schimbare de slide
        const originalGoToSlide = goToSlide;
        goToSlide = function(slideIndex) {
            originalGoToSlide(slideIndex);
            setTimeout(updateSlideGlow, 500);
        };
        
        updateSlideGlow();
    }

    // Inițializează toate funcționalitățile
    initServices();
    createParticleEffect();
    initCursorEffect();
    enhanceSlideTransitions();
    addActiveSlideGlow();

    // Expune funcțiile globale pentru debugging (opțional)
    window.services = {
        nextSlide,
        prevSlide,
        goToSlide,
        currentSlide: () => currentSlide
    };

    console.log('✅ Services section initialized successfully!');
});

// Fallback pentru fonturi
document.addEventListener('DOMContentLoaded', function() {
    // Adaugă fonturile fallback
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: 'Noverich';
            src: local('Arial Black'), local('Impact');
            font-weight: normal;
            font-style: normal;
        }
        
        @font-face {
            font-family: 'Roboto';
            src: local('Arial'), local('Helvetica');
            font-weight: normal;
            font-style: normal;
        }
    `;
    document.head.appendChild(style);
});
