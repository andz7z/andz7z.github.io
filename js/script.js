/* ========================================
   ANDZ WEBSITE - SPECTACULAR JAVASCRIPT
   Apple x Cyberpunk x Spectacular Effects
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- SPECTACULAR GLOBAL VARIABLES ---
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
    const movingDot = document.getElementById('moving-dot');
    
    // --- SPECTACULAR SCROLL PROGRESS BAR ---
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0;
        
        if (scrollProgress) {
            scrollProgress.style.width = Math.min(progress, 100) + '%';
            
            // Add spectacular glow effect based on progress
            if (progress > 50) {
                scrollProgress.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
            } else {
                scrollProgress.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
            }
        }
    }

    // --- SPECTACULAR SMOOTH SCROLLING ---
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
        link.addEventListener('click', function(e) {
                e.preventDefault();
                
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                    const offsetTop = targetElement.offsetTop;
                    
                    // Add spectacular scroll effect
                    window.scrollTo({
                        top: offsetTop,
                    behavior: 'smooth'
                });
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                    
                    // Add spectacular ripple effect
                    createRippleEffect(this);
                }
            });
        });
    }

    // --- SPECTACULAR RIPPLE EFFECT ---
    function createRippleEffect(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${rect.left + rect.width / 2 - size / 2}px;
            top: ${rect.top + rect.height / 2 - size / 2}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // --- SPECTACULAR INTERSECTION OBSERVER ---
    function initSectionVisibility() {
        const sections = document.querySelectorAll('.fullscreen-section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    if (sectionId === 'home') {
                        // Show home elements with spectacular animation
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

    // --- SPECTACULAR SHOW/HIDE HOME ELEMENTS ---
    function showHomeElements() {
        // Show home-specific elements with spectacular animations
        const elements = [floatingNavbar, logoContainer, socialLeft, socialRight, scrollArrow];
        
        elements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.classList.remove('hidden');
                    element.classList.add('visible');
                    
                    // Add spectacular entrance animation
                    element.style.animation = `spectacularFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                }, index * 100);
            }
        });
        
        // Hide back to home button
        if (backToHome) {
            backToHome.classList.remove('visible');
            backToHome.classList.add('hidden');
        }
    }

    function hideHomeElements() {
        // Hide home-specific elements with spectacular animations
        const elements = [floatingNavbar, logoContainer, socialLeft, socialRight, scrollArrow];
        
        elements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.classList.remove('visible');
                    element.classList.add('hidden');
                }, index * 50);
            }
        });
        
        // Show back to home button with spectacular animation
        if (backToHome) {
            setTimeout(() => {
                backToHome.classList.remove('hidden');
                backToHome.classList.add('visible');
                backToHome.style.animation = 'spectacularBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
            }, 300);
        }
    }

    // --- SPECTACULAR BACK TO HOME FUNCTIONALITY ---
    function initBackToHome() {
        if (backToHome) {
            backToHome.addEventListener('click', function() {
                const homeSection = document.querySelector('#home');
                if (homeSection) {
                    // Add spectacular scroll effect
                    homeSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Add spectacular click effect
                    this.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        }
    }

    // --- SPECTACULAR INTERSECTION OBSERVER FOR FADE IN EFFECTS ---
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
                    
                    // Add spectacular staggered animation
                    const elements = entry.target.querySelectorAll('.fade-in');
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.animation = `spectacularSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                        }, index * 150);
                    });
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in, .section-title, .glass-card');
        fadeElements.forEach(el => observer.observe(el));
    }

    // --- SPECTACULAR MOBILE MENU FUNCTIONALITY ---
    function initMobileMenu() {
        if (mobileMenuToggle && mobileSideMenu && mobileMenuOverlay) {
            mobileMenuToggle.addEventListener('click', function() {
                toggleMobileMenu();
                createRippleEffect(this);
            });
            
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
            
            // Add spectacular menu animation
            if (mobileSideMenu.classList.contains('active')) {
                mobileSideMenu.style.animation = 'spectacularSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            }
        }
    }

    function closeMobileMenu() {
        if (mobileSideMenu && mobileMenuToggle) {
            mobileSideMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    // --- SPECTACULAR VIDEO LOADING ---
    function initVideoLoading() {
        if (backgroundVideo) {
            backgroundVideo.addEventListener('loadeddata', function() {
                this.classList.add('loaded');
                console.log('Spectacular video loaded successfully');
            });

            backgroundVideo.addEventListener('error', function() {
                console.warn('Video failed to load, using fallback');
            });
        }
    }

    // --- SPECTACULAR SCROLL ARROW FUNCTIONALITY ---
    function initScrollArrow() {
        if (scrollArrow) {
            scrollArrow.addEventListener('click', function() {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Add spectacular click effect
                    createRippleEffect(this);
                }
            });
        }
    }

    // --- SPECTACULAR PERFORMANCE OPTIMIZATION ---
    function initPerformanceOptimizations() {
        // Throttle scroll events for spectacular performance
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
            'assets/photos/website.gif'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // --- SPECTACULAR KEYBOARD NAVIGATION ---
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Arrow keys for spectacular navigation
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

    // --- SPECTACULAR PARALLAX EFFECTS ---
    function initParallaxEffects() {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        function requestParallaxTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestParallaxTick, { passive: true });
    }

    // --- SPECTACULAR CURSOR EFFECTS ---
    function initCursorEffects() {
        const cursor = document.createElement('div');
        cursor.className = 'spectacular-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
    }

    // --- SPECTACULAR INITIALIZATION ---
    function init() {
        initSmoothScroll();
        initSectionVisibility();
        initBackToHome();
        initFadeInEffects();
        initMobileMenu();
        initVideoLoading();
        initScrollArrow();
        initPerformanceOptimizations();
        initKeyboardNavigation();
        initParallaxEffects();
        initCursorEffects();
        
        // Initial scroll progress update
        updateScrollProgress();
        
        // Add spectacular loaded class to body
        document.body.classList.add('loaded');
        
        // Add spectacular entrance animation
        document.body.style.animation = 'spectacularFadeIn 1s ease-out forwards';
    }

    // Start the spectacular application
    init();

    // --- SPECTACULAR CSS ANIMATIONS ---
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spectacularFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes spectacularSlideIn {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes spectacularBounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3) translateY(-50px);
            }
            50% {
                opacity: 1;
                transform: scale(1.1) translateY(0);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // --- EXPORT SPECTACULAR FUNCTIONS ---
    window.ANDZ = {
        closeMobileMenu,
        updateScrollProgress,
        showHomeElements,
        hideHomeElements,
        createRippleEffect
    };
});