/* ========================================
   ANDZ WEBSITE - HOME PAGE JAVASCRIPT
   Apple x Cyberpunk Monochrome Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- HOME PAGE SPECIFIC FUNCTIONALITY ---
    const homeSection = document.getElementById('home');
    const backgroundVideo = document.getElementById('background-video');
    const socialLinks = document.querySelectorAll('.social-link');
    const navbarLinks = document.querySelectorAll('.navbar-link');

    // --- ENHANCED HOVER EFFECTS ---
    function initEnhancedHoverEffects() {
        // Social links enhanced hover
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))';
            });
        });

        // Navbar links enhanced hover
        navbarLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // --- VIDEO BACKGROUND OPTIMIZATION ---
    function initVideoOptimization() {
        if (backgroundVideo) {
            // Ensure video plays on mobile
            backgroundVideo.addEventListener('canplay', function() {
                this.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            });

            // Handle video loading states
            backgroundVideo.addEventListener('loadstart', function() {
                console.log('Video loading started');
            });

            backgroundVideo.addEventListener('loadeddata', function() {
                console.log('Video data loaded');
                this.classList.add('loaded');
            });

            // Fallback for video errors
            backgroundVideo.addEventListener('error', function() {
                console.warn('Video failed to load');
            });
        }
    }

    // --- SMOOTH ANIMATIONS ON SCROLL ---
    function initScrollAnimations() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateScrollAnimations() {
            const scrollY = window.scrollY;
            
            // Parallax effect for video overlay
            if (homeSection && scrollY < window.innerHeight) {
                const overlay = homeSection.querySelector('.video-overlay');
                if (overlay) {
                    const opacity = 0.3 + (scrollY / window.innerHeight) * 0.4;
                    overlay.style.opacity = Math.min(opacity, 0.7);
                }
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // --- INTERSECTION OBSERVER FOR HOME ELEMENTS ---
    function initHomeIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered animation delays
                    const elements = entry.target.querySelectorAll('.fade-in');
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        if (homeSection) {
            observer.observe(homeSection);
        }
    }

    // --- TOUCH GESTURES FOR MOBILE ---
    function initTouchGestures() {
        let startY = 0;
        let startX = 0;

        document.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (!startY || !startX) return;
            
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const diffY = startY - endY;
            const diffX = startX - endX;
            
            // Swipe up to go to next section
            if (Math.abs(diffY) > Math.abs(diffX) && diffY > 50) {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Swipe down to go to previous section
            if (Math.abs(diffY) > Math.abs(diffX) && diffY < -50) {
                const homeSection = document.querySelector('#home');
                if (homeSection) {
                    homeSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            startY = 0;
            startX = 0;
        }, { passive: true });
    }

    // --- PERFORMANCE MONITORING ---
    function initPerformanceMonitoring() {
        // Monitor video performance
        if (backgroundVideo) {
            backgroundVideo.addEventListener('waiting', function() {
                console.log('Video buffering...');
            });
            
            backgroundVideo.addEventListener('playing', function() {
                console.log('Video playing');
            });
        }
    }

    // --- INITIALIZE HOME PAGE FUNCTIONALITY ---
    function init() {
        initEnhancedHoverEffects();
        initVideoOptimization();
        initScrollAnimations();
        initHomeIntersectionObserver();
        initTouchGestures();
        initPerformanceMonitoring();
    }

    // Start home page functionality
    init();
});