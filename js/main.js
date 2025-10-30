// Progress Scroll Bar Functionality
window.onscroll = function() {
    updateProgressBar();
    handleNavVisibility();
};

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
}

// Navigation visibility on scroll
function handleNavVisibility() {
    const mainNav = document.getElementById('mainNav');
    const burgerMenu = document.getElementById('burgerMenu');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        mainNav.style.opacity = '0';
        mainNav.style.transform = 'translateY(-20px)';
        burgerMenu.style.opacity = '1';
        burgerMenu.style.visibility = 'visible';
    } else {
        mainNav.style.opacity = '1';
        mainNav.style.transform = 'translateY(0)';
        burgerMenu.style.opacity = '0';
        burgerMenu.style.visibility = 'hidden';
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        document.getElementById('mobileMenu').classList.remove('active');
        document.getElementById('burgerMenu').classList.remove('active');
    });
});

// Burger menu functionality
const burgerMenu = document.getElementById('burgerMenu');
const mobileMenu = document.getElementById('mobileMenu');

burgerMenu.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) {
        this.classList.remove('active');
        burgerMenu.classList.remove('active');
    }
});
