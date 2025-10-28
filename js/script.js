// ===== MAIN SCRIPT - Shared functionality =====

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initLoader();
    initNavigation();
    initScrollProgress();
    initSmoothScrolling();
    initSectionReveal();
    
    // Set up reduced motion preferences
    setupReducedMotion();
    
    console.log('ANDZ Website initialized successfully');
});

// ===== LOADER FUNCTIONALITY =====
function initLoader() {
    const loader = document.getElementById('loader');
    const loaderVideo = document.querySelector('.loader-video');
    const LOADER_DURATION = 3000; // 3 seconds
    
    // Ensure video autoplay works
    if (loaderVideo) {
        loaderVideo.play().catch(e => {
            console.log('Autoplay prevented, using fallback:', e);
            // Show fallback content if autoplay fails
            const fallback = document.querySelector('.loader-fallback');
            if (fallback) fallback.style.display = 'flex';
        });
        
        // Set video playback to 0 in case it was cached and already playing
        loaderVideo.currentTime = 0;
    }
    
    // Hide loader after specified duration
    setTimeout(() => {
        if (loader) {
            // Add blur effect
            loader.style.backdropFilter = 'blur(20px)';
            loader.style.opacity = '0';
            
            // Remove from DOM after transition
            setTimeout(() => {
                loader.style.display = 'none';
                loader.setAttribute('aria-hidden', 'true');
                
                // Enable scrolling
                document.body.style.overflow = 'auto';
                
                // Set focus to main content for accessibility
                const main = document.querySelector('main');
                if (main) main.setAttribute('tabindex', '-1');
            }, 400);
        }
    }, LOADER_DURATION);
}

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const burger = document.querySelector('.burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-icon, .mobile-nav-link');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Scroll behavior for navbar
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - hide navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show navbar
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    // Burger menu functionality
    if (burger && mobileMenu) {
        burger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
            
            // Toggle burger animation
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                burger.classList.remove('active');
            });
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // On desktop, ensure mobile menu is closed
            if (burger && mobileMenu) {
                burger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                burger.classList.remove('active');
            }
        }
    });
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    
    // Initial call
    updateProgress();
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.offsetTop;
                const duration = 1000;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                let startTime = null;
                
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }
                
                // Easing function
                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }
                
                requestAnimationFrame(animation);
                
                // Update URL without scrolling
                history.pushState(null, null, targetId);
                
                // Focus target for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });
}

// ===== SECTION REVEAL ANIMATIONS =====
function initSectionReveal() {
    const sections = document.querySelectorAll('section:not(#loader)');
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, options);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ===== REDUCED MOTION SUPPORT =====
function setupReducedMotion() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleMotionPreference(e) {
        if (e.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01s');
            document.documentElement.style.setProperty('--transition-medium', '0.01s');
            document.documentElement.style.setProperty('--transition-slow', '0.01s');
        }
    }
    
    // Initial check
    handleMotionPreference(reducedMotion);
    
    // Listen for changes
    reducedMotion.addEventListener('change', handleMotionPreference);
}

// ===== UTILITY FUNCTIONS =====
// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
