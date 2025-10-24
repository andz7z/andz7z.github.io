// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Toggle mobile menu
    if (hamburger && mobileMenuOverlay) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking on links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
            hamburger.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Progress Bar
window.onscroll = function() {
    updateProgressBar();
    toggleNavbarVisibility();
};

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
}

// Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Logo fallback
document.addEventListener('DOMContentLoaded', function() {
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.addEventListener('error', function() {
            this.style.display = 'none';
            const parent = this.parentElement;
            parent.textContent = 'LOGO';
            parent.style.fontFamily = 'Noverich, sans-serif';
        });
    }
});

// Favicon fallback
document.addEventListener('DOMContentLoaded', function() {
    const favicon = document.getElementById('favicon');
    if (favicon) {
        favicon.addEventListener('error', function() {
            // Create a canvas favicon with letter A
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            
            // Background
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, 32, 32);
            
            // Letter A
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('A', 16, 16);
            
            // Replace favicon
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = canvas.toDataURL('image/png');
            document.head.appendChild(link);
        });
    }
});

// Navbar visibility and back to home arrow
function toggleNavbarVisibility() {
    const navbar = document.getElementById('navbar');
    const backToHome = document.getElementById('backToHome');
    const homeSection = document.getElementById('home');
    
    if (navbar && backToHome && homeSection) {
        const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollPosition > homeSectionBottom - 100) {
            navbar.classList.add('hidden');
            backToHome.classList.add('visible');
        } else {
            navbar.classList.remove('hidden');
            backToHome.classList.remove('visible');
        }
    }
}

// Back to home functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToHome = document.getElementById('backToHome');
    if (backToHome) {
        backToHome.addEventListener('click', function() {
            document.getElementById('home').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
});
