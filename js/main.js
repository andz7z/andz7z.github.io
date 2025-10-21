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
    sectionObservers: new Map()
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
    services: { element: document.getElementById('services'), threshold: 0.6 },
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
    window.addEventListener('scroll', debounce(handleScroll, 16), passiveOptions); // ~60fps
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    
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

// Intersection Observer for section detection
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.1, 0.5, 0.9, 1]
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const section = entry.target.id;
                if (section !== state.currentSection) {
                    state.previousSection = state.currentSection;
                    state.currentSection = section;
                    
                    // Add scroll effects
                    addScrollEffects(state.previousSection, section);
                    
                    updateActiveNav();
                    updateNavigationState();
                    updateCurrentSectionName();
                    updateBrandVisibility();
                    
                    // Trigger section-specific animations
                    triggerSectionAnimations(section);
                }
            }
            
            // Always trigger animations when section is visible
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
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
    sections[sectionId].element.scrollIntoView({
        behavior: state.reducedMotion ? 'auto' : 'smooth',
        block: 'start'
    });
    
    // Reset scrolling flag after animation
    setTimeout(() => {
        state.isScrolling = false;
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
}

// Handle wheel events for section snapping
function handleWheel(e) {
    if (state.isScrolling || state.reducedMotion) return;
    
    e.preventDefault();
    
    clearTimeout(state.scrollTimeout);
    state.scrollTimeout = setTimeout(() => {
        const currentIndex = Object.keys(sections).indexOf(state.currentSection);
        let targetIndex = currentIndex;
        
        if (e.deltaY > 0 && currentIndex < Object.keys(sections).length - 1) {
            targetIndex = currentIndex + 1;
        } else if (e.deltaY < 0 && currentIndex > 0) {
            targetIndex = currentIndex - 1;
        }
        
        if (targetIndex !== currentIndex) {
            const targetSection = Object.keys(sections)[targetIndex];
            scrollToSection(targetSection);
        }
    }, 150);
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
       
