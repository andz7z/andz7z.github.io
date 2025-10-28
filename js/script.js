// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Burger menu functionality
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const burgerLines = document.querySelectorAll('.burger-line');
    const sections = document.querySelectorAll('.section');
    
    // Toggle menu
    burgerMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate burger to X
        burgerLines[0].classList.toggle('rotate-down');
        burgerLines[1].classList.toggle('fade-out');
        burgerLines[2].classList.toggle('rotate-up');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            burgerLines[0].classList.remove('rotate-down');
            burgerLines[1].classList.remove('fade-out');
            burgerLines[2].classList.remove('rotate-up');
        });
    });
    
    // Update burger color based on section background
    function updateBurgerColor() {
        const currentSection = getCurrentSection();
        const sectionBg = getSectionBackgroundColor(currentSection);
        
        // Determine if background is dark or light
        const isDark = isDarkBackground(sectionBg);
        
        // Update burger color
        burgerLines.forEach(line => {
            line.style.backgroundColor = isDark ? 'white' : 'black';
        });
    }
    
    function getCurrentSection() {
        let currentSection = sections[0];
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                currentSection = section;
            }
        });
        
        return currentSection;
    }
    
    function getSectionBackgroundColor(section) {
        const styles = window.getComputedStyle(section);
        return styles.backgroundColor;
    }
    
    function isDarkBackground(rgb) {
        // Convert rgb to values
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues) return true;
        
        const r = parseInt(rgbValues[0]);
        const g = parseInt(rgbValues[1]);
        const b = parseInt(rgbValues[2]);
        
        // Calculate brightness (perceived luminance)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        return brightness < 128; // Dark if brightness less than 128
    }
    
    // Update burger color on scroll
    window.addEventListener('scroll', updateBurgerColor);
    
    // Initial update
    updateBurgerColor();
});
