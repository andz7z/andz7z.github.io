/* ========================================
   ANDZ WEBSITE - MAIN JAVASCRIPT
   Minimalist Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- GLOBAL VARIABLES ---
    const scrollProgress = document.getElementById('scroll-progress');
    const backToHome = document.getElementById('back-to-home');
    const navbar = document.getElementById('navbar');
    const socialLeft = document.getElementById('social-left');
    const socialRight = document.getElementById('social-right');
    const scrollArrow = document.getElementById('scroll-arrow');
    const backgroundVideo = document.getElementById('background-video');
    const discoverBtn = document.getElementById('discover-btn');

    // --- SCROLL PROGRESS BAR ---
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0;
        
        if (scrollProgress) {
            scrollProgress.style.width = Math.min(progress, 100) + '%';
        }
    }

    // --- SMOOTH SCROLLING ---
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // --- INTERSECTION OBSERVER FOR SECTION VISIBILITY ---
    function initSectionVisibility() {
        const sections = document.querySelectorAll('.fullscreen-section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    if (sectionId === 'home') {
                        // Show home elements
                        showHomeElements();
                    } else {
                        // Hide home elements, show back to home
                        hideHomeElements();
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.6
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // --- SHOW/HIDE HOME ELEMENTS ---
    function showHomeElements() {
        // Show home-specific elements
        if (navbar) {
            navbar.classList.remove('hidden');
            navbar.classList.add('visible');
        }
        
        if (socialLeft) {
            socialLeft.classList.remove('hidden');
            socialLeft.classList.add('visible');
        }
        
        if (socialRight) {
            socialRight.classList.remove('hidden');
            socialRight.classList.add('visible');
        }
        
        if (scrollArrow) {
            scrollArrow.classList.remove('hidden');
            scrollArrow.classList.add('visible');
        }
        
        // Hide back to home button
        if (backToHome) {
            backToHome.classList.remove('visible');
            backToHome.classList.add('hidden');
        }
    }

    function hideHomeElements() {
        // Hide home-specific elements
        if (navbar) {
            navbar.classList.remove('visible');
            navbar.classList.add('hidden');
        }
        
        if (socialLeft) {
            socialLeft.classList.remove('visible');
            socialLeft.classList.add('hidden');
        }
        
        if (socialRight) {
            socialRight.classList.remove('visible');
            socialRight.classList.add('hidden');
        }
        
        if (scrollArrow) {
            scrollArrow.classList.remove('visible');
            scrollArrow.classList.add('hidden');
        }
        
        // Show back to home button
        if (backToHome) {
            backToHome.classList.remove('hidden');
            backToHome.classList.add('visible');
        }
    }

    // --- BACK TO HOME FUNCTIONALITY ---
    function initBackToHome() {
        if (backToHome) {
            backToHome.addEventListener('click', function() {
                const homeSection = document.querySelector('#home');
                if (homeSection) {
                    homeSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    // --- INTERSECTION OBSERVER FOR FADE IN EFFECTS ---
    function initFadeInEffects() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in, .section-title');
        fadeElements.forEach(el => observer.observe(el));
    }

    // --- VIDEO LOADING ---
    function initVideoLoading() {
        if (backgroundVideo) {
            backgroundVideo.addEventListener('loadeddata', function() {
                this.classList.add('loaded');
            });

            backgroundVideo.addEventListener('error', function() {
                console.warn('Video failed to load');
            });
        }
    }

    // --- DISCOVER BUTTON FUNCTIONALITY ---
    function initDiscoverButton() {
        if (discoverBtn) {
            discoverBtn.addEventListener('click', function() {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    // --- SCROLL ARROW FUNCTIONALITY ---
    function initScrollArrow() {
        if (scrollArrow) {
            scrollArrow.addEventListener('click', function() {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    // --- PERFORMANCE OPTIMIZATION ---
    function initPerformanceOptimizations() {
        // Throttle scroll events
        let ticking = false;
        
        function updateOnScroll() {
            updateScrollProgress();
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // --- KEYBOARD NAVIGATION ---
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Arrow keys for navigation
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                const homeSection = document.querySelector('#home');
                if (homeSection) {
                    homeSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // --- INITIALIZE ALL FUNCTIONALITY ---
    function init() {
        initSmoothScroll();
        initSectionVisibility();
        initBackToHome();
        initFadeInEffects();
        initVideoLoading();
        initDiscoverButton();
        initScrollArrow();
        initPerformanceOptimizations();
        initKeyboardNavigation();
        
        // Initial scroll progress update
        updateScrollProgress();
        
        // Add loaded class to body
        document.body.classList.add('loaded');
    }

    // Start the application
    init();

    // --- EXPORT FUNCTIONS ---
    window.ANDZ = {
        showHomeElements,
        hideHomeElements,
        updateScrollProgress
    };
});