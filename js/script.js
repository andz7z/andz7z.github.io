// Main JavaScript file for global functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initProgressBar();
    initScrollSnap();
});

// Navigation functionality
function initNavigation() {
    const mainNav = document.querySelector('.main-nav');
    const backNav = document.getElementById('backNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentSectionEl = document.getElementById('currentSection');
    
    // Update navigation on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Show/hide back navigation based on scroll position
        if (scrollPosition > window.innerHeight * 0.5) {
            backNav.classList.add('visible');
            mainNav.style.opacity = '0';
            mainNav.style.pointerEvents = 'none';
            
            // Update current section text
            const sections = document.querySelectorAll('.section');
            let currentSection = 'Home';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                    currentSection = section.id.charAt(0).toUpperCase() + section.id.slice(1);
                }
            });
            
            currentSectionEl.textContent = currentSection;
        } else {
            backNav.classList.remove('visible');
            mainNav.style.opacity = '1';
            mainNav.style.pointerEvents = 'all';
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Update active navigation link
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            
            if (section.offsetTop <= scrollPosition + 100 && 
                section.offsetTop + section.offsetHeight > scrollPosition + 100) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

// Progress bar functionality
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// Scroll snap enhancement
function initScrollSnap() {
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollPosition = window.scrollY;
                const windowHeight = window.innerHeight;
                const sections = document.querySelectorAll('.section');
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    const sectionMid = sectionTop + sectionHeight / 2;
                    
                    if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                        // Section is in view
                        if (Math.abs(scrollPosition + windowHeight/2 - sectionMid) < windowHeight/4) {
                            window.scrollTo({
                                top: sectionTop,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
                
                isScrolling = false;
            });
        }
        
        isScrolling = true;
    });
}
