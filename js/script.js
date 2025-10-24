/* ========================================
   ANDZ WEBSITE - MAIN JAVASCRIPT
   Core functionality for smooth scrolling, progress bar, and interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- GLOBAL VARIABLES ---
    const scrollProgress = document.getElementById('scroll-progress');
    const floatingNavbar = document.getElementById('floating-navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileSideMenu = document.getElementById('mobile-side-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const backgroundVideo = document.getElementById('background-video');
    const logo = document.getElementById('logo');
    const logoFallback = document.getElementById('logo-fallback');
    const scrollArrow = document.getElementById('scroll-arrow');
    
    // --- SCROLL PROGRESS BAR ---
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = progress + '%';
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
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }

    // --- INTERSECTION OBSERVER FOR FADE IN EFFECTS ---
    function initIntersectionObserver() {
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
        const fadeElements = document.querySelectorAll('.fade-in, .section-title, .glass-card');
        fadeElements.forEach(el => observer.observe(el));
    }

    // --- NAVBAR VISIBILITY CONTROL ---
    function initNavbarVisibility() {
        const sections = document.querySelectorAll('.fullscreen-section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    if (sectionId === 'home') {
                        // Show navbar on home page
                        if (floatingNavbar) {
                            floatingNavbar.classList.remove('hidden');
                        }
                    } else {
                        // Hide navbar on other pages
                        if (floatingNavbar) {
                            floatingNavbar.classList.add('hidden');
                        }
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // --- MOBILE MENU FUNCTIONALITY ---
    function initMobileMenu() {
        if (mobileMenuToggle && mobileSideMenu && mobileMenuOverlay) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
            
            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileSideMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }
    }

    function toggleMobileMenu() {
        if (mobileSideMenu && mobileMenuToggle) {
            mobileSideMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        }
    }

    function closeMobileMenu() {
        if (mobileSideMenu && mobileMenuToggle) {
            mobileSideMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    // --- VIDEO LOADING ---
    function initVideoLoading() {
        if (backgroundVideo) {
            backgroundVideo.addEventListener('loadeddata', function() {
                this.classList.add('loaded');
            });

            backgroundVideo.addEventListener('error', function() {
                console.warn('Video failed to load, using fallback');
                // Video will not be visible, but page will still work
            });
        }
    }

    // --- LOGO FALLBACK ---
    function initLogoFallback() {
        if (logo && logoFallback) {
            logo.addEventListener('error', function() {
                this.style.display = 'none';
                logoFallback.style.display = 'block';
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
        
        // Preload critical resources
        const criticalImages = [
            'assets/photos/icon.gif'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // --- INITIALIZE ALL FUNCTIONALITY ---
    function init() {
        initSmoothScroll();
        initIntersectionObserver();
        initNavbarVisibility();
        initMobileMenu();
        initVideoLoading();
        initLogoFallback();
        initScrollArrow();
        initPerformanceOptimizations();
        
        // Initial scroll progress update
        updateScrollProgress();
        
        // Add loaded class to body for CSS animations
        document.body.classList.add('loaded');
    }

    // Start the application
    init();

    // --- EXPORT FUNCTIONS FOR OTHER MODULES ---
    window.ANDZ = {
        closeMobileMenu,
        updateScrollProgress
    };
});