// Main script file - handles global functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initProgressBar();
    initNavigation();
    initBackButton();
    initTOSModal();
    initScrollNavigation();
    
    // Set initial active section
    setActiveSection('home');
});

// Progress Bar
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

// Navigation
function initNavigation() {
    const navIcons = document.querySelectorAll('.nav-icon');
    const mainNav = document.querySelector('.main-nav');
    
    // Handle nav icon clicks
    navIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            setActiveSection(targetSection);
            
            // Scroll to section
            document.getElementById(targetSection).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Hide/show nav on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide navbar when not on home section
        if (scrollTop > window.innerHeight * 0.8) {
            mainNav.classList.add('hidden');
        } else {
            mainNav.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Back Button
function initBackButton() {
    const backNav = document.querySelector('.back-nav');
    const currentSectionText = document.querySelector('.current-section');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > window.innerHeight * 0.5) {
            backNav.classList.add('visible');
            
            // Update current section text
            const sections = document.querySelectorAll('.section');
            let currentSection = 'Home';
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentSection = section.id.charAt(0).toUpperCase() + section.id.slice(1);
                }
            });
            
            currentSectionText.textContent = `Currently on: ${currentSection}`;
        } else {
            backNav.classList.remove('visible');
        }
    });
}

// TOS Modal
function initTOSModal() {
    const tosBtn = document.getElementById('tosBtn');
    const tosModal = document.getElementById('tosModal');
    const closeModal = document.getElementById('closeModal');
    
    tosBtn.addEventListener('click', function() {
        tosModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', function() {
        tosModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    tosModal.addEventListener('click', function(e) {
        if (e.target === tosModal) {
            tosModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Scroll Navigation
function initScrollNavigation() {
    const sections = document.querySelectorAll('.section');
    
    // Update active section on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });
        
        setActiveSection(current);
    });
}

// Set Active Section
function setActiveSection(sectionId) {
    // Update nav icons
    const navIcons = document.querySelectorAll('.nav-icon');
    navIcons.forEach(icon => {
        icon.classList.remove('active');
        if (icon.getAttribute('href') === `#${sectionId}`) {
            icon.classList.add('active');
        }
    });
}

// Magnetic Scrolling Effect
document.addEventListener('mousemove', function(e) {
    const magneticElements = document.querySelectorAll('.nav-icon, .social-icons a, .portfolio-btn, .submit-btn');
    
    magneticElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
            const moveX = x * 0.2;
            const moveY = y * 0.2;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            element.style.transform = 'translate(0, 0)';
        }
    });
});
