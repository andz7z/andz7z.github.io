// js/home.js
function initHome() {
    console.log('Home section initialized');
    
    const homeSection = document.getElementById('home');
    const navItems = document.querySelectorAll('.nav-item');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const navIcons = document.querySelector('.nav-icons');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Navigation item click handlers
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const target = this.getAttribute('data-target');
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.querySelector('.nav-icon').appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Scroll to target section
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Scroll indicator click handler
    scrollIndicator.addEventListener('click', function() {
        const aboutSection = document.getElementById('about');
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Handle scroll to show/hide navigation and scroll to top button
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const homeHeight = homeSection.offsetHeight;
        
        if (scrollPosition > homeHeight * 0.2) {
            navIcons.style.opacity = '0';
            navIcons.style.pointerEvents = 'none';
        } else {
            navIcons.style.opacity = '1';
            navIcons.style.pointerEvents = 'auto';
        }
        
        if (scrollPosition > homeHeight) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });
    
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const background = document.querySelector('.background-image');
        const rate = scrolled * -0.5;
        background.style.transform = `translateY(${rate}px)`;
    });
    
    // Mouse move effect for depth
    homeSection.addEventListener('mousemove', function(e) {
        const { left, top, width, height } = this.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        const navIcons = document.querySelector('.nav-icons');
        navIcons.style.transform = `translate(-50%, -50%) translate(${x * 10}px, ${y * 10}px)`;
        
        const socialLeft = document.querySelector('.social-icons.left');
        const socialRight = document.querySelector('.social-icons.right');
        socialLeft.style.transform = `translateY(-50%) translate(${x * 5}px, ${y * 5}px)`;
        socialRight.style.transform = `translateY(-50%) translate(${x * 5}px, ${y * 5}px)`;
    });
}
