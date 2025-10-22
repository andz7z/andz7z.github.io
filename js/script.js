// Global Script - Progress Bar, Navbar, TOS Modal

// Progress Bar
window.addEventListener('scroll', () => {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - winHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    document.querySelector('.progress-bar').style.width = scrolled + '%';
});

// Navbar Active State
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navIcons = document.querySelectorAll('.nav-icon');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navIcons.forEach(icon => {
        icon.classList.remove('active');
        if (icon.getAttribute('data-section') === current) {
            icon.classList.add('active');
        }
    });
});

// TOS Modal
const tosBtn = document.getElementById('tosBtn');
const tosModal = document.getElementById('tosModal');
const closeBtn = document.querySelector('.close');

tosBtn.addEventListener('click', () => {
    tosModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    tosModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === tosModal) {
        tosModal.style.display = 'none';
    }
});

// Scroll to section on nav icon click
document.querySelectorAll('.nav-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = icon.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    });
});

// Magnet Scroll Effect
let isScrolling = false;
let scrollTimeout;

window.addEventListener('scroll', () => {
    isScrolling = true;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        
        // Snap to nearest section when scrolling stops
        if (!isScrolling) {
            const sections = document.querySelectorAll('section');
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            let closestSection = null;
            let closestDistance = Number.MAX_VALUE;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const distance = Math.abs(scrollY - sectionTop);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSection = section;
                }
            });
            
            if (closestSection) {
                window.scrollTo({
                    top: closestSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }, 100);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add visible class to elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements that should appear on scroll
    document.querySelectorAll('.about-content p, .service-item, .portfolio-item, .review-item').forEach(el => {
        observer.observe(el);
    });
});
