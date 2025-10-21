// js/script.js

// Main JavaScript file that initializes and coordinates all functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollProgress();
    initSectionTransitions();
    initMagneticEffects();
    
    // Initialize section-specific scripts
    if (document.getElementById('home')) initHome();
    if (document.getElementById('about')) initAbout();
    if (document.getElementById('services')) initServices();
    if (document.getElementById('portfolio')) initPortfolio();
    if (document.getElementById('reviews')) initReviews();
    if (document.getElementById('contact')) initContact();
    
    // Set up responsive behavior
    initResponsive();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navIcons = document.querySelectorAll('.nav-icon');
    const navMinimized = document.querySelector('.nav-minimized');
    const currentSectionText = document.querySelector('.current-section');
    const backBtn = document.querySelector('.back-btn');
    const hamburger = document.querySelector('.hamburger');
    const navIconsContainer = document.querySelector('.nav-icons');
    
    let lastScrollY = window.scrollY;
    let isNavMinimized = false;
    
    // Update active nav icon based on current section
    function updateActiveNav() {
        const sections = document.querySelectorAll('.section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY + 100;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Update nav icons
        navIcons.forEach(icon => {
            icon.classList.remove('active');
            if (icon.getAttribute('href') === `#${currentSection}`) {
                icon.classList.add('active');
            }
        });
        
        // Update minimized nav text
        if (currentSectionText) {
            const sectionNames = {
                'home': 'Home',
                'about': 'About',
                'services': 'Services',
                'portfolio': 'Portfolio',
                'reviews': 'Reviews',
                'contact': 'Contact'
            };
            
            currentSectionText.textContent = `Currently on: ${sectionNames[currentSection] || 'Home'}`;
        }
        
        return currentSection;
    }
    
    // Handle scroll behavior for navbar
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class based on scroll position
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Show/hide minimized navbar based on scroll direction
        if (scrollY > 300 && scrollY > lastScrollY && !isNavMinimized) {
            // Scrolling down - show minimized nav
            navMinimized.classList.add('active');
            isNavMinimized = true;
        } else if (scrollY < lastScrollY && isNavMinimized) {
            // Scrolling up - hide minimized nav
            navMinimized.classList.remove('active');
            isNavMinimized = false;
        }
        
        lastScrollY = scrollY;
        updateActiveNav();
    }
    
    // Back button functionality
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Hamburger menu for mobile
    if (hamburger && navIconsContainer) {
        hamburger.addEventListener('click', function() {
            navIconsContainer.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Debounced scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = requestAnimationFrame(handleScroll);
    });
    
    // Initial call to set active nav
    updateActiveNav();
}

// Scroll progress bar
function initScrollProgress() {
    const progressBar = document.querySelector('.progress-bar');
    
    if (!progressBar) return;
    
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = `${progress}%`;
    }
    
    // Debounced scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = requestAnimationFrame(updateProgressBar);
    });
}

// Section transitions
function initSectionTransitions() {
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Magnetic effect for interactive elements
function initMagneticEffects() {
    const magneticElements = document.querySelectorAll('.nav-icon, .social-icon, .discover-btn, .service-card, .portfolio-btn');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            // Apply transform based on cursor position
            this.style.transform = `translate(${deltaX * 5}px, ${deltaY * 5}px)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// Responsive behavior
function initResponsive() {
    function handleResize() {
        const navIconsContainer = document.querySelector('.nav-icons');
        const hamburger = document.querySelector('.hamburger');
        
        if (window.innerWidth <= 768) {
            // Mobile behavior
            if (navIconsContainer && hamburger) {
                navIconsContainer.classList.remove('active');
                hamburger.classList.remove('active');
            }
        } else {
            // Desktop behavior - ensure nav icons are visible
            if (navIconsContainer) {
                navIconsContainer.style.display = 'flex';
            }
        }
    }
    
    // Debounced resize event
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Initial call
    handleResize();
}
