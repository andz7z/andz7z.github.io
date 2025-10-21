// js/main.js
/*
HOW TO EDIT MAIN JAVASCRIPT:
- Section configuration: Update section IDs and order in sections array
- Scroll behavior: Modify snapThreshold and magnetStrength values
- Performance: Adjust debounce timings and intersection observer thresholds
- Navigation: Update icon mappings and transition effects
*/

// Configuration
const CONFIG = {
    snapThreshold: 0.3, // Percentage of viewport for snap triggering
    magnetStrength: 0.8, // Strength of magnet effect (0-1)
    scrollDebounce: 16, // ms to debounce scroll events
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// State management
let state = {
    currentSection: 'home',
    isScrolling: false,
    scrollTimeout: null,
    mousePosition: { x: 0, y: 0 },
    navIcons: []
};

// DOM Elements
const elements = {
    body: document.body,
    navbar: document.querySelector('.navbar'),
    navIcons: document.querySelectorAll('.nav-icon'),
    navCompact: document.querySelector('.nav-compact'),
    sectionName: document.querySelector('.section-name'),
    sections: document.querySelectorAll('.section'),
    scrollProgress: document.querySelector('.scroll-progress'),
    scrollProgressBar: document.querySelector('.scroll-progress-bar'),
    backHome: document.querySelector('.back-home'),
    modals: document.querySelectorAll('.modal'),
    modalBackdrops: document.querySelectorAll('.modal-backdrop'),
    modalCloses: document.querySelectorAll('.modal-close'),
    footerLinks: document.querySelectorAll('.footer-link')
};

// Section configuration
const sections = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'services', name: 'Services' },
    { id: 'portfolio', name: 'Portfolio' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'contact', name: 'Contact' }
];

// Initialize application
function init() {
    setupEventListeners();
    setupIntersectionObserver();
    setupMagnetEffect();
    setupModals();
    setActiveSection('home');
    
    // Initial animations
    requestAnimationFrame(() => {
        elements.body.classList.add('loaded');
    });
}

// Event listeners setup
function setupEventListeners() {
    // Navigation
    elements.navIcons.forEach(icon => {
        icon.addEventListener('click', handleNavClick);
        icon.addEventListener('mouseenter', handleNavHover);
    });
    
    elements.backHome.addEventListener('click', scrollToHome);
    
    // Scroll events with debouncing
    window.addEventListener('scroll', debounce(handleScroll, CONFIG.scrollDebounce), { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Mouse movement for magnet effect
    document.addEventListener('mousemove', handleMouseMove);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    
    // Footer links
    elements.footerLinks.forEach(link => {
        link.addEventListener('click', handleFooterLinkClick);
    });
}

// Intersection Observer for section detection
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: buildThresholdList()
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    elements.sections.forEach(section => {
        observer.observe(section);
    });
}

// Build threshold list for intersection observer
function buildThresholdList() {
    const thresholds = [];
    const numSteps = 20;
    
    for (let i = 1.0; i <= numSteps; i++) {
        const ratio = i / numSteps;
        thresholds.push(ratio);
    }
    
    return thresholds;
}

// Handle intersection changes
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionId = entry.target.id;
            setActiveSection(sectionId);
        }
    });
}

// Set active section with smooth transitions
function setActiveSection(sectionId) {
    if (state.currentSection === sectionId) return;
    
    state.currentSection = sectionId;
    
    // Update sections
    elements.sections.forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });
    
    // Update navigation
    updateNavigation(sectionId);
    
    // Update compact nav
    const sectionData = sections.find(s => s.id === sectionId);
    if (sectionData && elements.sectionName) {
        elements.sectionName.textContent = sectionData.name;
    }
    
    // Update navbar state
    const isHome = sectionId === 'home';
    elements.navbar.classList.toggle('scrolled', !isHome);
}

// Update navigation active states
function updateNavigation(activeSection) {
    elements.navIcons.forEach(icon => {
        const section = icon.getAttribute('data-section');
        icon.classList.toggle('active', section === activeSection);
    });
}

// Handle navigation clicks
function handleNavClick(event) {
    event.preventDefault();
    const sectionId = event.currentTarget.getAttribute('data-section');
    scrollToSection(sectionId);
}

// Handle navigation hover for magnet effect
function handleNavHover(event) {
    if (CONFIG.reducedMotion) return;
    
    const icon = event.currentTarget;
    const rect = icon.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    const iconCenterY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to icon center
    const distance = Math.sqrt(
        Math.pow(state.mousePosition.x - iconCenterX, 2) + 
        Math.pow(state.mousePosition.y - iconCenterY, 2)
    );
    
    // Apply magnet effect based on distance
    const maxDistance = 100;
    const strength = Math.max(0, 1 - distance / maxDistance) * CONFIG.magnetStrength;
    
    if (strength > 0.1) {
        const moveX = (iconCenterX - state.mousePosition.x) * strength * 0.1;
        const moveY = (iconCenterY - state.mousePosition.y) * strength * 0.1;
        const scale = 1 + strength * 0.2;
        
        icon.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
    } else {
        icon.style.transform = '';
    }
}

// Scroll to specific section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    state.isScrolling = true;
    
    section.scrollIntoView({
        behavior: CONFIG.reducedMotion ? 'auto' : 'smooth',
        block: 'start'
    });
    
    // Reset scrolling flag
    setTimeout(() => {
        state.isScrolling = false;
    }, 1000);
}

// Scroll to home section
function scrollToHome() {
    scrollToSection('home');
}

// Handle scroll events
function handleScroll() {
    if (state.isScrolling) return;
    
    updateScrollProgress();
    handleAutoSnap();
}

// Handle wheel events for improved snapping
function handleWheel(event) {
    if (CONFIG.reducedMotion || state.isScrolling) return;
    
    // Prevent default only when we're going to handle the snap
    const currentIndex = sections.findIndex(s => s.id === state.currentSection);
    let targetIndex = currentIndex;
    
    if (event.deltaY > 0 && currentIndex < sections.length - 1) {
        // Scrolling down
        targetIndex = currentIndex + 1;
    } else if (event.deltaY < 0 && currentIndex > 0) {
        // Scrolling up
        targetIndex = currentIndex - 1;
    }
    
    if (targetIndex !== currentIndex) {
        event.preventDefault();
        scrollToSection(sections[targetIndex].id);
    }
}

// Update scroll progress indicator
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (scrollPercent > 0) {
        elements.scrollProgress.classList.add('active');
    } else {
        elements.scrollProgress.classList.remove('active');
    }
    
    elements.scrollProgressBar.style.width = `${scrollPercent}%`;
}

// Auto-snap to sections based on scroll position
function handleAutoSnap() {
    if (CONFIG.reducedMotion || state.isScrolling) return;
    
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight * CONFIG.snapThreshold;
    
    let closestSection = null;
    let minDistance = Infinity;
    
    elements.sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        
        if (distance < threshold && distance < minDistance) {
            minDistance = distance;
            closestSection = section.id;
        }
    });
    
    if (closestSection && closestSection !== state.currentSection) {
        setActiveSection(closestSection);
    }
}

// Mouse movement tracking for magnet effect
function handleMouseMove(event) {
    state.mousePosition.x = event.clientX;
    state.mousePosition.y = event.clientY;
}

// Setup magnet effect for navigation
function setupMagnetEffect() {
    if (CONFIG.reducedMotion) return;
    
    // Store original positions
    elements.navIcons.forEach(icon => {
        state.navIcons.push({
            element: icon,
            originalX: 0,
            originalY: 0
        });
    });
}

// Keyboard navigation
function handleKeydown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        
        const currentIndex = sections.findIndex(s => s.id === state.currentSection);
        let targetIndex = currentIndex;
        
        if (event.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            targetIndex = currentIndex + 1;
        } else if (event.key === 'ArrowUp' && currentIndex > 0) {
            targetIndex = currentIndex - 1;
        }
        
        if (targetIndex !== currentIndex) {
            scrollToSection(sections[targetIndex].id);
        }
    } else if (event.key === 'Home') {
        event.preventDefault();
        scrollToHome();
    } else if (event.key === 'End') {
        event.preventDefault();
        scrollToSection('contact');
    }
}

// Modal handling
function setupModals() {
    elements.footerLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const modalType = event.target.getAttribute('data-modal');
            openModal(`${modalType}-modal`);
        });
    });
    
    elements.modalCloses.forEach(close => {
        close.addEventListener('click', closeAllModals);
    });
    
    elements.modalBackdrops.forEach(backdrop => {
        backdrop.addEventListener('click', closeAllModals);
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        closeAllModals();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

function closeAllModals() {
    elements.modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Utility function for debouncing
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

// Handle footer link clicks
function handleFooterLinkClick(event) {
    event.preventDefault();
    // Handled by modal setup
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for potential module use
export { init, scrollToSection, setActiveSection };
