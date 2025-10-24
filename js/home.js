/* ========================================
   ANDZ WEBSITE - SPECTACULAR HOME PAGE
   Apple x Cyberpunk x Spectacular Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --- SPECTACULAR HOME PAGE FUNCTIONALITY ---
    const homeSection = document.getElementById('home');
    const backgroundVideo = document.getElementById('background-video');
    const socialLinks = document.querySelectorAll('.social-link');
    const navbarLinks = document.querySelectorAll('.navbar-link');
    const movingDot = document.getElementById('moving-dot');

    // --- SPECTACULAR ENHANCED HOVER EFFECTS ---
    function initSpectacularHoverEffects() {
        // Social links with spectacular hover effects
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2) rotate(5deg)';
                this.style.filter = 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.6))';
                
                // Add spectacular glow trail
                createGlowTrail(this);
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))';
            });
        });

        // Navbar links with spectacular hover effects
        navbarLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) translateY(-2px)';
                this.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) translateY(0)';
                this.style.filter = 'none';
            });
        });
    }

    // --- SPECTACULAR GLOW TRAIL EFFECT ---
    function createGlowTrail(element) {
        const trail = document.createElement('div');
        const rect = element.getBoundingClientRect();
        
        trail.style.cssText = `
            position: fixed;
            width: ${rect.width}px;
            height: ${rect.height}px;
            left: ${rect.left}px;
            top: ${rect.top}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            animation: spectacularGlowTrail 1s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 1000);
    }

    // --- SPECTACULAR VIDEO BACKGROUND OPTIMIZATION ---
    function initSpectacularVideoOptimization() {
        if (backgroundVideo) {
            // Ensure video plays on mobile with spectacular quality
            backgroundVideo.addEventListener('canplay', function() {
                this.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            });

            // Handle video loading states with spectacular feedback
            backgroundVideo.addEventListener('loadstart', function() {
                console.log('Spectacular video loading started');
                this.style.filter = 'blur(10px)';
            });

            backgroundVideo.addEventListener('loadeddata', function() {
                console.log('Spectacular video data loaded');
                this.classList.add('loaded');
                this.style.filter = 'brightness(0.8) contrast(1.1)';
            });

            // Fallback for video errors
            backgroundVideo.addEventListener('error', function() {
                console.warn('Video failed to load');
                this.style.background = 'linear-gradient(135deg, #000000 0%, #404040 50%, #ffffff 100%)';
            });
        }
    }

    // --- SPECTACULAR SCROLL ANIMATIONS ---
    function initSpectacularScrollAnimations() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateSpectacularScrollAnimations() {
            const scrollY = window.scrollY;
            
            // Spectacular parallax effect for video overlay
            if (homeSection && scrollY < window.innerHeight) {
                const overlay = homeSection.querySelector('.video-overlay');
                if (overlay) {
                    const opacity = 0.3 + (scrollY / window.innerHeight) * 0.4;
                    overlay.style.opacity = Math.min(opacity, 0.7);
                    overlay.style.transform = `translateY(${scrollY * 0.1}px)`;
                }
                
                // Spectacular video parallax
                if (backgroundVideo) {
                    backgroundVideo.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.2}px)`;
                }
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }

        function requestSpectacularTick() {
            if (!ticking) {
                requestAnimationFrame(updateSpectacularScrollAnimations);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestSpectacularTick, { passive: true });
    }

    // --- SPECTACULAR INTERSECTION OBSERVER ---
    function initSpectacularIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add spectacular staggered animation
                    const elements = entry.target.querySelectorAll('.fade-in');
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('visible');
                            el.style.animation = `spectacularSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                        }, index * 200);
                    });
                }
            });
        }, observerOptions);

        if (homeSection) {
            observer.observe(homeSection);
        }
    }

    // --- SPECTACULAR TOUCH GESTURES ---
    function initSpectacularTouchGestures() {
        let startY = 0;
        let startX = 0;
        let isScrolling = false;

        document.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
            isScrolling = false;
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (!startY || !startX) return;
            
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const diffY = startY - currentY;
            const diffX = startX - currentX;
            
            if (Math.abs(diffY) > Math.abs(diffX)) {
                isScrolling = true;
            }
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (!startY || !startX || !isScrolling) return;
            
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const diffY = startY - endY;
            const diffX = startX - endX;
            
            // Spectacular swipe up to go to next section
            if (Math.abs(diffY) > Math.abs(diffX) && diffY > 80) {
                const aboutSection = document.querySelector('#about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                    createSpectacularSwipeEffect('up');
                }
            }
            
            // Spectacular swipe down to go to previous section
            if (Math.abs(diffY) > Math.abs(diffX) && diffY < -80) {
                const homeSection = document.querySelector('#home');
                if (homeSection) {
                    homeSection.scrollIntoView({ behavior: 'smooth' });
                    createSpectacularSwipeEffect('down');
                }
            }
            
            startY = 0;
            startX = 0;
            isScrolling = false;
        }, { passive: true });
    }

    // --- SPECTACULAR SWIPE EFFECT ---
    function createSpectacularSwipeEffect(direction) {
        const swipe = document.createElement('div');
        const gradient = direction === 'up' 
            ? 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)'
            : 'linear-gradient(0deg, rgba(255,255,255,0.3) 0%, transparent 100%)';
        
        swipe.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${gradient};
            pointer-events: none;
            z-index: 9998;
            animation: spectacularSwipe 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(swipe);
        
        setTimeout(() => {
            swipe.remove();
        }, 600);
    }

    // --- SPECTACULAR PERFORMANCE MONITORING ---
    function initSpectacularPerformanceMonitoring() {
        // Monitor video performance with spectacular feedback
        if (backgroundVideo) {
            backgroundVideo.addEventListener('waiting', function() {
                console.log('Video buffering...');
                this.style.filter = 'blur(5px)';
            });
            
            backgroundVideo.addEventListener('playing', function() {
                console.log('Video playing spectacularly');
                this.style.filter = 'brightness(0.8) contrast(1.1)';
            });
        }

        // Monitor scroll performance
        let scrollCount = 0;
        const scrollHandler = () => {
            scrollCount++;
            if (scrollCount % 200 === 0) {
                console.log('Spectacular scroll performance check:', scrollCount);
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // --- SPECTACULAR PARTICLE EFFECTS ---
    function initSpectacularParticleEffects() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'spectacular-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        document.body.appendChild(particleContainer);

        function createParticle() {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                animation: spectacularParticleFloat 8s linear infinite;
                left: ${Math.random() * 100}%;
                top: 100%;
            `;
            particleContainer.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 8000);
        }

        // Create particles periodically
        setInterval(createParticle, 2000);
    }

    // --- SPECTACULAR INITIALIZATION ---
    function init() {
        initSpectacularHoverEffects();
        initSpectacularVideoOptimization();
        initSpectacularScrollAnimations();
        initSpectacularIntersectionObserver();
        initSpectacularTouchGestures();
        initSpectacularPerformanceMonitoring();
        initSpectacularParticleEffects();
    }

    // Start spectacular home page functionality
    init();

    // --- SPECTACULAR CSS ANIMATIONS ---
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spectacularGlowTrail {
            0% {
                transform: scale(0.5);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes spectacularSwipe {
            0% {
                opacity: 0;
                transform: translateY(-100%);
            }
            50% {
                opacity: 1;
                transform: translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateY(100%);
            }
        }
        
        @keyframes spectacularParticleFloat {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});