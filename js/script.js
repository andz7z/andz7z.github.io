/**
 * MAIN SCRIPT FILE - Portfolio Website
 * Handles core functionality, navigation, and animations
 */

// Configuration object for easy customization
const CONFIG = {
    scrollThreshold: 100, // Pixels to scroll before navbar transforms
    scrollDebounceDelay: 10, // Delay for scroll event debouncing
    magneticStrength: 0.3, // Strength of magnetic effect on hover
    sectionTransitionDelay: 300 // Delay between section transitions
};

// Global state
const state = {
    currentSection: 'home',
    isScrolling: false,
    scrollTimeout: null,
    lastScrollY: 0
};

// DOM Elements
const elements = {
    navbar: null,
    scrolledNav: null,
    progressBar: null,
    mobileToggle: null,
    sections: null,
    navIcons: null,
    currentSectionElement: null
};

/**
 * Initialize the application
 */
function init() {
    cacheDOM();
    setupEventListeners();
    setupScrollHandler();
    setupIntersectionObserver();
    
    // Set initial active section
    updateActiveSection();
    
    console.log('Portfolio website initialized successfully');
}

/**
 * Cache frequently used DOM elements
 */
function cacheDOM() {
    elements.navbar = document.getElementById('navbar');
    elements.scrolledNav = document.getElementById('scrolledNav');
    elements.progressBar = document.getElementById('progressBar');
    elements.mobileToggle = document.getElementById('mobileToggle');
    elements.sections = document.querySelectorAll('.section');
    elements.navIcons = document.querySelectorAll('.nav-icon');
    elements.currentSectionElement = document.getElementById('currentSection');
}

/**
 * Set up all event listeners with debouncing where appropriate
 */
function setupEventListeners() {
    // Navigation click events
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.addEventListener('click', handleNavClick);
        icon.addEventListener('mouseenter', handleMagneticHover);
        icon.addEventListener('mouseleave', handleMagneticLeave);
    });
    
    // Mobile menu toggle
    if (elements.mobileToggle) {
        elements.mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Back button in scrolled nav
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection('home');
        });
    }
    
    // Window resize with debounce
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNav);
}

/**
 * Set up scroll handler with performance optimizations
 */
function setupScrollHandler() {
    // Use passive event listener for better performance
    window.addEventListener('scroll', debounce(handleScroll, CONFIG.scrollDebounceDelay), { passive: true });
}

/**
 * Set up Intersection Observer for section detection
 */
function setupIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNav(sectionId);
                updateCurrentSectionText(sectionId);
                state.currentSection = sectionId;
            }
        });
    }, options);
    
    // Observe all sections
    elements.sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Handle navigation clicks with smooth scrolling
 */
function handleNavClick(e) {
    e.preventDefault();
    const targetSection = this.getAttribute('href').substring(1);
    scrollToSection(targetSection);
    closeMobileMenu();
}

/**
 * Smooth scroll to target section
 */
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        state.isScrolling = true;
        
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Reset scrolling flag after transition
        setTimeout(() => {
            state.isScrolling = false;
        }, CONFIG.sectionTransitionDelay);
    }
}

/**
 * Handle scroll events with performance optimizations
 */
function handleScroll() {
    if (state.isScrolling) return;
    
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollY / scrollHeight) * 100;
    
    // Update progress bar
    updateProgressBar(scrollProgress);
    
    // Handle navbar transformation
    handleNavbarTransform(scrollY);
    
    state.lastScrollY = scrollY;
}

/**
 * Update progress bar width based on scroll position
 */
function updateProgressBar(progress) {
    if (elements.progressBar) {
        elements.progressBar.style.width = `${progress}%`;
    }
}

/**
 * Handle navbar transformation on scroll
 */
function handleNavbarTransform(scrollY) {
    if (scrollY > CONFIG.scrollThreshold) {
        elements.navbar.classList.add('scrolled');
        elements.scrolledNav.classList.add('visible');
    } else {
        elements.navbar.classList.remove('scrolled');
        elements.scrolledNav.classList.remove('visible');
    }
}

/**
 * Magnetic hover effect for navigation icons
 */
function handleMagneticHover(e) {
    const icon = this;
    const rect = icon.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from cursor to center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Apply magnetic effect
    const moveX = distanceX * CONFIG.magneticStrength;
    const moveY = distanceY * CONFIG.magneticStrength;
    
    icon.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

/**
 * Reset magnetic effect when mouse leaves
 */
function handleMagneticLeave() {
    this.style.transform = 'translate(0, 0)';
}

/**
 * Update active navigation based on current section
 */
function updateActiveNav(sectionId) {
    elements.navIcons.forEach(icon => {
        icon.classList.remove('active');
        if (icon.getAttribute('href') === `#${sectionId}`) {
            icon.classList.add('active');
        }
    });
}

/**
 * Update current section text in scrolled navigation
 */
function updateCurrentSectionText(sectionId) {
    if (elements.currentSectionElement) {
        const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        elements.currentSectionElement.textContent = `Currently on: ${sectionName}`;
    }
}

/**
 * Update active section based on scroll position
 */
function updateActiveSection() {
    const scrollPosition = window.scrollY + 100;
    
    elements.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const sectionId = section.id;
            updateActiveNav(sectionId);
            updateCurrentSectionText(sectionId);
            state.currentSection = sectionId;
        }
    });
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    elements.mobileToggle.classList.toggle('active');
    
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    } else {
        createMobileMenu();
    }
}

/**
 * Create mobile menu dynamically
 */
function createMobileMenu() {
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    const menuItems = [
        { icon: 'fas fa-home', text: 'Home', section: 'home' },
        { icon: 'fas fa-user', text: 'About', section: 'about' },
        { icon: 'fas fa-cogs', text: 'Services', section: 'services' },
        { icon: 'fas fa-briefcase', text: 'Portfolio', section: 'portfolio' },
        { icon: 'fas fa-star', text: 'Reviews', section: 'reviews' },
        { icon: 'fas fa-envelope', text: 'Contact', section: 'contact' }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('a');
        menuItem.href = `#${item.section}`;
        menuItem.className = 'mobile-nav-icon';
        menuItem.innerHTML = `
            <i class="${item.icon}"></i>
            <span>${item.text}</span>
        `;
        
        menuItem.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection(item.section);
            closeMobileMenu();
        });
        
        mobileMenu.appendChild(menuItem);
    });
    
    document.body.appendChild(mobileMenu);
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    elements.mobileToggle.classList.remove('active');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

/**
 * Handle window resize
 */
function handleResize() {
    // Close mobile menu on resize to larger screens
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNav(e) {
    // Only handle keyboard nav if user is not typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            navigateSections(-1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            navigateSections(1);
            break;
        case 'Home':
            e.preventDefault();
            scrollToSection('home');
            break;
        case 'End':
            e.preventDefault();
            scrollToSection('contact');
            break;
    }
}

/**
 * Navigate between sections using keyboard
 */
function navigateSections(direction) {
    const sections = ['home', 'about', 'services', 'portfolio', 'reviews', 'contact'];
    const currentIndex = sections.indexOf(state.currentSection);
    let nextIndex = currentIndex + direction;
    
    // Boundary check
    if (nextIndex >= 0 && nextIndex < sections.length) {
        scrollToSection(sections[nextIndex]);
    }
}

/**
 * Debounce function for performance optimization
 * Limits how often a function can be called
 */
function debounce(func, wait) {
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

/**
 * Utility function for detecting reduced motion preference
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { init, CON
