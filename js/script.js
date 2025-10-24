/* ========================================
   MAIN JAVASCRIPT - GLOBAL FUNCTIONALITY
   ======================================== */

'use strict';

/* ========================================
   DOM ELEMENTS CACHE
   ======================================== */

const DOM = {
    // Navigation
    navIcons: null,
    navItems: null,
    scrollTopBtn: null,
    
    // Mobile Menu
    burgerBtn: null,
    mobileMenu: null,
    closeMenuBtn: null,
    mobileMenuItems: null,
    
    // Sections
    sections: null,
    homeSection: null,
    
    // Social
    socialColumns: null,
    
    // Preloader
    preloader: null
};

/* ========================================
   STATE MANAGEMENT
   ======================================== */

const State = {
    currentSection: 'home',
    isScrolling: false,
    isMobileMenuOpen: false,
    isHomeSectionVisible: true
};

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initialized');
    
    // Cache DOM elements
    cacheDOMElements();
    
    // Initialize components
    initNavigation();
    initMobileMenu();
    initScrollToTop();
    initSmoothScroll();
    initScrollObserver();
    initRippleEffect();
    
    // Show content after initialization
    setTimeout(() => {
        if (DOM.navIcons) DOM.navIcons.classList.add('show');
        if (DOM.socialColumns) {
            DOM.socialColumns.forEach(col => col.classList.add('show'));
        }
    }, 2500);
});

/* ========================================
   CACHE DOM ELEMENTS
   ======================================== */

function cacheDOMElements() {
    // Navigation
    DOM.navIcons = document.getElementById('navIcons');
    DOM.navItems = document.querySelectorAll('.nav-item');
    DOM.scrollTopBtn = document.getElementById('scrollTopBtn');
    
    // Mobile Menu
    DOM.burgerBtn = document.getElementById('burgerBtn');
    DOM.mobileMenu = document.getElementById('mobileMenu');
    DOM.closeMenuBtn = document.getElementById('closeMenuBtn');
    DOM.mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    
    // Sections
    DOM.sections = document.querySelectorAll('.section');
    DOM.homeSection = document.getElementById('home');
    
    // Social
    DOM.socialColumns = document.querySelectorAll('.social-column');
    
    // Preloader
    DOM.preloader = document.getElementById('preloader');
}

/* ========================================
   NAVIGATION SYSTEM
   ======================================== */

function initNavigation() {
    if (!DOM.navItems) return;
    
    DOM.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetSection = item.getAttribute('data-section');
            navigateToSection(targetSection);
        });
    });
}

function navigateToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        State.currentSection = sectionId;
        
        // Close mobile menu if open
        if (State.isMobileMenuOpen) {
            closeMobileMenu();
        }
    }
}

/* ========================================
   MOBILE MENU
   ======================================== */

function initMobileMenu() {
    if (!DOM.burgerBtn || !DOM.mobileMenu) return;
    
    // Open menu
    DOM.burgerBtn.addEventListener('click', openMobileMenu);
    
    // Close menu
    DOM.closeMenuBtn?.addEventListener('click', closeMobileMenu);
    
    // Close on outside click
    DOM.mobileMenu.addEventListener('click', (e) => {
        if (e.target === DOM.mobileMenu) {
            closeMobileMenu();
        }
    });
    
    // Menu item clicks
    DOM.mobileMenuItems?.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            navigateToSection(targetSection);
        });
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && State.isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    DOM.mobileMenu?.classList.add('active');
    DOM.burgerBtn?.classList.add('active');
    document.body.classList.add('no-scroll');
    State.isMobileMenuOpen = true;
    
    console.log('📱 Mobile menu opened');
}

function closeMobileMenu() {
    DOM.mobileMenu?.classList.remove('active');
    DOM.burgerBtn?.classList.remove('active');
    document.body.classList.remove('no-scroll');
    State.isMobileMenuOpen = false;
    
    console.log('📱 Mobile menu closed');
}

/* ========================================
   SCROLL TO TOP BUTTON
   ======================================== */

function initScrollToTop() {
    if (!DOM.scrollTopBtn) return;
    
    DOM.scrollTopBtn.addEventListener('click', () => {
        navigateToSection('home');
    });
    
    // Show/hide based on scroll
    window.addEventListener('scroll', handleScrollTopButton);
}

function handleScrollTopButton() {
    if (!DOM.scrollTopBtn || !DOM.homeSection) return;
    
    const homeRect = DOM.homeSection.getBoundingClientRect();
    const isHomeVisible = homeRect.bottom > 100;
    
    if (isHomeVisible && State.isHomeSectionVisible) {
        // In Home section - hide button, show nav
        DOM.scrollTopBtn.classList.remove('show');
        DOM.navIcons?.classList.add('show');
        DOM.navIcons?.classList.remove('hide');
    } else {
        // Not in Home section - show button, hide nav
        DOM.scrollTopBtn.classList.add('show');
        DOM.navIcons?.classList.remove('show');
        DOM.navIcons?.classList.add('hide');
    }
    
    State.isHomeSectionVisible = isHomeVisible;
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */

function initSmoothScroll() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ========================================
   SCROLL OBSERVER (AOS - Animate On Scroll)
   ======================================== */

function initScrollObserver() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Also animate children with data-aos attribute
                const children = entry.target.querySelectorAll('[data-aos]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('aos-animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe section titles and elements with data-aos
    const elementsToObserve = document.querySelectorAll('.section-title, [data-aos]');
    elementsToObserve.forEach(el => observer.observe(el));
    
    console.log(`👁️ Observing ${elementsToObserve.length} elements for scroll animations`);
}

/* ========================================
   RIPPLE EFFECT ON CLICK
   ======================================== */

function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.nav-item, .social-icon, .mobile-menu-item');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', createRipple);
    });
}

function createRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const ripple = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${e.clientX - rect.left - radius}px`;
    ripple.style.top = `${e.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple-effect');
    
    // Remove existing ripples
    const existingRipple = button.querySelector('.ripple-effect');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add CSS for ripple effect dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .nav-item,
    .social-icon,
    .mobile-menu-item,
    .scroll-top-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

/* ========================================
   SCROLL DEBOUNCE
   ======================================== */

function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(handleScrollTopButton, 10);
window.addEventListener('scroll', debouncedScrollHandler);

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Log current section on scroll
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Detect scroll direction
    if (currentScrollY > lastScrollY) {
        // Scrolling down
        State.scrollDirection = 'down';
    } else {
        // Scrolling up
        State.scrollDirection = 'up';
    }
    
    lastScrollY = currentScrollY;
});

/* ========================================
   KEYBOARD NAVIGATION
   ======================================== */

document.addEventListener('keydown', (e) => {
    // Navigate sections with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        const sectionsArray = Array.from(DOM.sections);
        const currentIndex = sectionsArray.findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= -100 && rect.top <= 100;
        });
        
        if (currentIndex !== -1) {
            let targetIndex;
            
            if (e.key === 'ArrowDown') {
                targetIndex = Math.min(currentIndex + 1, sectionsArray.length - 1);
            } else {
                targetIndex = Math.max(currentIndex - 1, 0);
            }
            
            sectionsArray[targetIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Home key - go to home
    if (e.key === 'Home') {
        e.preventDefault();
        navigateToSection('home');
    }
    
    // End key - go to last section
    if (e.key === 'End') {
        e.preventDefault();
        const lastSection = DOM.sections[DOM.sections.length - 1];
        if (lastSection) {
            lastSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

/* ========================================
   PERFORMANCE MONITORING
   ======================================== */

// Log performance metrics
window.addEventListener('load', () => {
    setTimeout(() => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    }, 0);
});

/* ========================================
   EXPORT FOR OTHER MODULES
   ======================================== */

window.PortfolioCore = {
    navigateToSection,
    State,
    DOM
};

console.log('✅ Script.js loaded successfully');
