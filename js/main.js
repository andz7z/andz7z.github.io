// js/main.js
/*
HOW TO EDIT MAIN JAVASCRIPT:
- Section management: Update section IDs and navigation mapping
- Scroll behavior: Adjust snap thresholds and timing
- Performance: Modify debounce timing and will-change usage
*/

// Performance optimization: Use passive event listeners
const passiveOptions = { passive: true };

// Global state
const state = {
    currentSection: 'home',
    previousSection: 'home',
    isScrolling: false,
    scrollTimeout: null,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    scrollDirection: 'down',
    isManualScroll: false,
    lastScrollTime: 0
};

// DOM Elements
const elements = {
    mainNav: document.getElementById('main-nav'),
    navBrand: document.getElementById('nav-brand'),
    navFull: document.getElementById('nav-full'),
    navMinimal: document.getElementById('nav-minimal'),
    goBackBtn: document.getElementById('go-back-btn'),
    currentSectionName: document.getElementById('current-section-name'),
    mainContent: document.getElementById('main-content'),
    loader: document.getElementById('loader'),
    scrollProgress: document.querySelector('.scroll-progress'),
    scrollProgressBar: document.querySelector('.scroll-progress-bar'),
    reducedMotionOverlay: document.getElementById('reduced-motion-overlay'),
    modalBackdrop: document.getElementById('modal-backdrop'),
    modalClose: document.getElementById('modal-close'),
    privacyBtn: document.getElementById('privacy-btn'),
    tosBtn: document.getElementById('tos-btn')
};

// Section configuration
const sections = {
    home: { element: document.getElementById('home'), threshold: 0.5 },
    about: { element: document.getElementById('about'), threshold: 0.6 },
    services: { element: document.getElementById('services'), threshold: 0.3 },
    portfolio: { element: document.getElementById('portfolio'), threshold: 0.6 },
    reviews: { element: document.getElementById('reviews'), threshold: 0.6 },
    contact: { element: document.getElementById('contact'), threshold: 0.6 }
};

// Initialize the application
function init() {
    setupEventListeners();
    setupIntersectionObserver();
    startLoaderAnimation();
    setupModalSystem();
    
    // Set initial state
    updateNavigationState();
    updateScrollProgress();
    updateBrandVisibility();
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.addEventListener('click', handleNavClick);
    });
    
    elements.goBackBtn.addEventListener('click', scrollToHome);
    
    // Scroll events with debouncing
    window.addEventListener('scroll', debounce(handleScroll, 16), passiveOptions);
    window.addEventListener('wheel', handleWheel, { passive: true }); // Changed to passive: true
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    
    // Touch events for mobile
    window.addEventListener('touchstart', handleTouchStart, passiveOptions);
    window.addEventListener('touchmove', handleTouchMove, passiveOptions);
    
    // Reduced motion support
    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionMedia.addEventListener('change', e => {
        state.reducedMotion = e.matches;
        if (state.reducedMotion) {
            elements.reducedMotionOverlay.style.opacity = '1';
        } else {
            elements.reducedMotionOverlay.style.opacity = '0';
        }
    });
}

let touchStartY = 0;

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (state.reducedMotion) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;
    
    // Only handle large swipe gestures
    if (Math.abs(deltaY) > 50) {
        handleSwipe(deltaY);
        touchStartY = touchY;
    }
}

function handleSwipe(deltaY) {
    if (state.isScrolling) return;
    
    const currentIndex = Object.keys(sections).indexOf(state.currentSection);
    let targetIndex = currentIndex;
    
    if (deltaY > 0 && currentIndex < Object.keys(sections).length - 1) {
        targetIndex = currentIndex + 1;
    } else if (deltaY < 0 && currentIndex > 0) {
        targetIndex = currentIndex - 1;
    }
    
    if (targetIndex !== currentIndex) {
        const targetSection = Object.keys(sections)[targetIndex];
        scrollToSection(targetSection);
    }
}

// Intersection Observer for section detection
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.1, 0.3, 0.5, 0.9, 1]
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                const section = entry.target.id;
                if (section !== state.currentSection) {
                    state.previousSection = state.currentSection;
                    state.currentSection = section;
                    
                    // Only add scroll effects if not manually scrolling
                    if (!state.isManualScroll) {
                        addScrollEffects(state.previousSection, section);
                    }
                    
                    updateActiveNav();
                    updateNavigationState();
                    updateCurrentSectionName();
                    updateBrandVisibility();
                    
                    // Trigger section-specific animations
                    triggerSectionAnimations(section);
                }
            }
            
            // Always trigger animations when section is visible
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                const section = entry.target.id;
                triggerSectionAnimations(section);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    Object.values(sections).forEach(({ element }) => {
        observer.observe(element);
    });
}

// Add scroll in/out effects
function addScrollEffects(previousSection, currentSection) {
    if (state.reducedMotion) return;
    
    const prevElement = sections[previousSection].element;
    const currElement = sections[currentSection].element;
    
    // Determine scroll direction
    const prevIndex = Object.keys(sections).indexOf(previousSection);
    const currIndex = Object.keys(sections).indexOf(currentSection);
    state.scrollDirection = currIndex > prevIndex ? 'down' : 'up';
    
    // Add transition classes
    prevElement.classList.add('scrolling-out');
    currElement.classList.add('scrolling-in', 'active');
    
    // Remove classes after animation
    setTimeout(() => {
        prevElement.classList.remove('scrolling-out', 'active');
        currElement.classList.remove('scrolling-in');
    }, 600);
}

// Handle navigation clicks
function handleNavClick(e) {
    e.preventDefault();
    const targetSection = this.getAttribute('href').substring(1);
    scrollToSection(targetSection);
}

// Scroll to specific section
function scrollToSection(sectionId) {
    if (state.isScrolling || !sections[sectionId]) return;
    
    state.isScrolling = true;
    state.isManualScroll = true;
    
    sections[sectionId].element.scrollIntoView({
        behavior: state.reducedMotion ? 'auto' : 'smooth',
        block: 'start'
    });
    
    // Reset scrolling flags after animation
    setTimeout(() => {
        state.isScrolling = false;
        setTimeout(() => {
            state.isManualScroll = false;
        }, 100);
    }, state.reducedMotion ? 0 : 500);
}

// Scroll to home section
function scrollToHome() {
    scrollToSection('home');
}

// Handle scroll events
function handleScroll() {
    if (state.isScrolling) return;
    
    updateScrollProgress();
    updateNavigationTransform();
    
    // Reset manual scroll flag after user stops scrolling
    state.lastScrollTime = Date.now();
    if (!state.isManualScroll) {
        setTimeout(() => {
            if (Date.now() - state.lastScrollTime > 100) {
                state.isManualScroll = false;
            }
        }, 150);
    }
}

// Handle wheel events - ALLOW NORMAL SCROLLING
function handleWheel(e) {
    if (state.reducedMotion) return;
    
    // Mark as manual scrolling when user uses wheel
    state.isManualScroll = true;
    state.lastScrollTime = Date.now();
    
    // Only auto-snap if it's a large wheel movement (not normal scrolling)
    if (Math.abs(e.deltaY) < 10) return;
    
    clearTimeout(state.scrollTimeout);
    state.scrollTimeout = setTimeout(() => {
        // Check if user is still scrolling manually
        if (Date.now() - state.lastScrollTime > 200) {
            const currentScroll = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Only snap if we're near a section boundary
            Object.values(sections).forEach(({ element }) => {
                const rect = element.getBoundingClientRect();
                if (Math.abs(rect.top) < windowHeight * 0.3) {
                    const targetSection = element.id;
                    if (targetSection !== state.currentSection) {
                        scrollToSection(targetSection);
                    }
                }
            });
            
            state.isManualScroll = false;
        }
    }, 100);
}

// Handle keyboard navigation
function handleKeydown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = Object.keys(sections).indexOf(state.currentSection);
        if (currentIndex < Object.keys(sections).length - 1) {
            scrollToSection(Object.keys(sections)[currentIndex + 1]);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentIndex = Object.keys(sections).indexOf(state.currentSection);
        if (currentIndex > 0) {
            scrollToSection(Object.keys(sections)[currentIndex - 1]);
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToHome();
    } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection('contact');
    }
}

// Update active navigation state
function updateActiveNav() {
    // Update nav icons
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.classList.remove('active');
        if (icon.getAttribute('data-section') === state.currentSection) {
            icon.classList.add('active');
        }
    });
}

// Update navigation state (full vs minimal)
function updateNavigationState() {
    const isHome = state.currentSection === 'home';
    
    if (isHome) {
        elements.navFull.style.opacity = '1';
        elements.navFull.style.pointerEvents = 'auto';
        elements.navMinimal.classList.remove('active');
    } else {
        elements.navFull.style.opacity = '0';
        elements.navFull.style.pointerEvents = 'none';
        elements.navMinimal.classList.add('active');
    }
}

// Update brand visibility
function updateBrandVisibility() {
    const isHome = state.currentSection === 'home';
    if (isHome) {
        elements.navBrand.classList.remove('hidden');
    } else {
        elements.navBrand.classList.add('hidden');
    }
}

// Update current section name in minimal nav
function updateCurrentSectionName() {
    const sectionNames = {
        home: 'Home',
        about: 'About',
        services: 'Services',
        portfolio: 'Portfolio',
        reviews: 'Reviews',
        contact: 'Contact'
    };
    
    elements.currentSectionName.textContent = sectionNames[state.currentSection];
}

// Update navigation transform based on scroll
function updateNavigationTransform() {
    if (!elements.mainNav) return;
    
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Smooth parallax effect using requestAnimationFrame
    requestAnimationFrame(() => {
        const translateY = scrollProgress * 40;
        elements.mainNav.style.transform = `translateY(${translateY}px)`;
    });
}

// Update scroll progress indicator
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Use requestAnimationFrame for smooth progress bar
    requestAnimationFrame(() => {
        if (elements.scrollProgressBar) {
            elements.scrollProgressBar.style.width = `${scrollPercent}%`;
        }
        
        // Show/hide progress bar
        if (elements.scrollProgress) {
            elements.scrollProgress.style.opacity = scrollPercent > 5 ? '1' : '0';
        }
    });
}

// Trigger section-specific animations
function triggerSectionAnimations(section) {
    const sectionElement = sections[section].element;
    const sectionTitle = sectionElement.querySelector('.section-title');
    const animatedElements = sectionElement.querySelectorAll('.about-item, .service-card, .portfolio-item, .review-card, .arch__info');
    
    // Animate section title
    if (sectionTitle && !sectionTitle.classList.contains('revealed')) {
        setTimeout(() => {
            sectionTitle.classList.add('revealed');
        }, 300);
    }
    
    // Animate other elements with staggered delay
    animatedElements.forEach((element, index) => {
        if (!element.classList.contains('visible')) {
            setTimeout(() => {
                element.classList.add('visible');
            }, 500 + (index * 150));
        }
    });
}

// Start loader animation
function startLoaderAnimation() {
    setTimeout(() => {
        elements.loader.style.opacity = '0';
        setTimeout(() => {
            elements.loader.style.display = 'none';
            // Trigger initial animations
            triggerSectionAnimations('home');
        }, 500);
    }, 1500);
}

// Modal system
function setupModalSystem() {
    if (!elements.modalBackdrop) return;
    
    // Privacy Policy
    elements.privacyBtn.addEventListener('click', () => {
        openModal(
            'Privacy Policy',
            `
            <p>Your privacy is important to us. This Privacy Policy explains how ANDZ collects, uses, and protects your personal information.</p>
            
            <h3>Information We Collect</h3>
            <p>We may collect personal information such as your name, email address, and usage data when you interact with our services.</p>
            
            <h3>How We Use Your Information</h3>
            <p>We use your information to provide and improve our services, communicate with you, and ensure the security of our platform.</p>
            
            <h3>Data Protection</h3>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>
            
            <h3>Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
            
            <p><em>This is a placeholder privacy policy. Please consult with legal professionals to create an appropriate policy for your business.</em></p>
            `
        );
    });
    
    // Terms of Service
    elements.tosBtn.addEventListener('click', () => {
        openModal(
            'Terms of Service',
            `
            <p>Welcome to ANDZ. These Terms of Service govern your use of our website and services.</p>
            
            <h3>Acceptance of Terms</h3>
            <p>By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.</p>
            
            <h3>Use of Services</h3>
            <p>You may use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account.</p>
            
            <h3>Intellectual Property</h3>
            <p>All content, features, and functionality on our platform are owned by ANDZ and are protected by intellectual property laws.</p>
            
            <h3>Limitation of Liability</h3>
            <p>ANDZ shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our services.</p>
            
            <h3>Changes to Terms</h3>
            <p>We may modify these Terms at any time. Continued use of our services after changes constitutes acceptance of the new Terms.</p>
            
            <p><em>This is a placeholder terms of service. Please consult with legal professionals to create appropriate terms for your business.</em></p>
            `
        );
    });
    
    // Close modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === elements.modalBackdrop) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.modalBackdrop.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(title, content) {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    
    elements.modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    const focusableElements = elements.modalBackdrop.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function closeModal() {
    elements.modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
}

// Utility function: Debounce
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export for module usage
export { state, elements, sections, scrollToSection, debounce };
