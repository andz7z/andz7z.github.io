// Main initialization script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initSmoothScrolling();
    initSectionTransitions();
    initTOSModal();
    
    // Initialize section-specific scripts
    if (typeof initHome === 'function') initHome();
    if (typeof initAbout === 'function') initAbout();
    if (typeof initServices === 'function') initServices();
    if (typeof initPortfolio === 'function') initPortfolio();
    if (typeof initReviews === 'function') initReviews();
    if (typeof initContact === 'function') initContact();
});

// Navigation functionality
function initNavigation() {
    const navIcons = document.querySelectorAll('.nav-icon');
    const sections = document.querySelectorAll('.section');
    
    navIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Update active navigation icon
            navIcons.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            showSection(targetSection);
        });
    });
}

// Smooth scrolling between sections
function initSmoothScrolling() {
    const scrollIndicator = document.querySelector('.pulsing-arrow');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Section transition management
function initSectionTransitions() {
    // Show home section by default
    showSection('home');
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const targetSection = document.getElementById(sectionId);
    
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Trigger animations for specific sections
        if (sectionId === 'about' && typeof animateSkillBars === 'function') {
            setTimeout(animateSkillBars, 300);
        }
    }
}

// TOS Modal functionality
function initTOSModal() {
    const tosBtn = document.getElementById('tosBtn');
    const tosModal = document.getElementById('tosModal');
    const closeModal = document.getElementById('closeModal');
    
    if (tosBtn && tosModal && closeModal) {
        tosBtn.addEventListener('click', function() {
            tosModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeModal.addEventListener('click', function() {
            tosModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close modal when clicking outside
        tosModal.addEventListener('click', function(e) {
            if (e.target === tosModal) {
                tosModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Magnetic scrolling effect
document.addEventListener('mousemove', function(e) {
    const magneticElements = document.querySelectorAll('.nav-icon, .social-icon, .btn');
    
    magneticElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
            const translateX = x * 0.2;
            const translateY = y * 0.2;
            
            element.style.transform = `translate(${translateX}px, ${translateY}px)`;
        } else {
            element.style.transform = 'translate(0, 0)';
        }
    });
});
