/* ========================================
   ANDZ WEBSITE - MAIN JAVASCRIPT
   Apple x Cyberpunk Monochrome Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- GLOBAL VARIABLES ---
    const scrollProgress = document.getElementById('scroll-progress');
    const backToHome = document.getElementById('back-to-home');
    const floatingNavbar = document.getElementById('floating-navbar');
    const logoContainer = document.getElementById('logo-container');
    const socialLeft = document.getElementById('social-left');
    const socialRight = document.getElementById('social-right');
    const scrollArrow = document.getElementById('scroll-arrow');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileSideMenu = document.getElementById('mobile-side-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const backgroundVideo = document.getElementById('background-video');
    
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
                    
                    // Close mobile menu if open
                    closeMobileMenu();
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
        if (floatingNavbar) {
            floatingNavbar.classList.remove('hidden');
            floatingNavbar.classList.add('visible');
        }
        
        if (logoContainer) {
            logoContainer.classList.remove('hidden');
            logoContainer.classList.add('visible');
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
        if (floatingNavbar) {
            floatingNavbar.classList.remove('visible');
            floatingNavbar.classList.add('hidden');
        }
        
        if (logoContainer) {
            logoContainer.classList.remove('visible');
            logoContainer.classList.add('hidden');
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
        const fadeElements = document.querySelectorAll('.fade-in, .section-title, .glass-card');
        fadeElements.forEach(el => observer.observe(el));
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
            });
        }
    }

    // --- LOGO FALLBACK (No longer needed with animated button) ---
    function initLogoFallback() {
        // Logo fallback functionality removed - using animated button instead
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
            
            // Escape key to close mobile menu
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    // --- INITIALIZE ALL FUNCTIONALITY ---
    function init() {
        initSmoothScroll();
        initSectionVisibility();
        initBackToHome();
        initFadeInEffects();
        initMobileMenu();
        initVideoLoading();
        initLogoFallback();
        initScrollArrow();
        initPerformanceOptimizations();
        initKeyboardNavigation();
        
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
        updateScrollProgress,
        showHomeElements,
        hideHomeElements
    };
});