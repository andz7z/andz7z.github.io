// Main JavaScript file - handles global functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initScrollNavigation();
    initSectionTransitions();
    initNavigation();
    initResponsiveBehavior();
});

// Scroll Navigation
function initScrollNavigation() {
    const scrollNav = document.getElementById('scroll-nav');
    const scrollArrow = document.getElementById('scroll-arrow');
    const currentSection = document.getElementById('current-section');
    const mainNav = document.getElementById('main-nav');
    
    // Show scroll navigation when scrolling past homepage
    window.addEventListener('scroll', function() {
        const homeSection = document.getElementById('home');
        const homeBottom = homeSection.offsetTop + homeSection.offsetHeight;
        
        if (window.scrollY > homeBottom - 100) {
            scrollNav.style.display = 'flex';
            mainNav.style.opacity = '0.3';
        } else {
            scrollNav.style.display = 'none';
            mainNav.style.opacity = '1';
        }
        
        // Update current section indicator
        updateCurrentSectionIndicator();
    });
    
    // Scroll to top when arrow is clicked
    scrollArrow.addEventListener('click', function() {
        smoothScrollTo(document.getElementById('home'));
    });
    
    // Update current section based on scroll position
    function updateCurrentSectionIndicator() {
        const sections = document.querySelectorAll('.section');
        let currentSectionName = 'HOME';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSectionName = section.id.toUpperCase();
            }
        });
        
        currentSection.textContent = currentSectionName;
    }
}

// Section Transitions
function initSectionTransitions() {
    // Add intersection observer for section transitions
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Hide background video if not on homepage
                const bgVideoContainer = document.getElementById('bg-video-container');
                if (entry.target.id !== 'home') {
                    bgVideoContainer.style.opacity = '0';
                } else {
                    bgVideoContainer.style.opacity = '1';
                }
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Navigation
function initNavigation() {
    // Navigation icons click handlers
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            smoothScrollTo(document.getElementById(targetSection));
        });
    });
}

// Smooth scroll function
function smoothScrollTo(element) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000; // ms
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
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
}

// Responsive behavior
function initResponsiveBehavior() {
    // Handle window resize
    window.addEventListener('resize', function() {
        // Adjust layout for mobile if needed
        if (window.innerWidth < 768) {
            // Mobile-specific adjustments
        }
    });
}
