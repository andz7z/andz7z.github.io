/*
 * SCRIPT.JS
 * Main application logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Element Selection ---
    const burgerMenu = document.getElementById('burgerMenu');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('progressBar');
    const sections = document.querySelectorAll('.section'); // All content sections
    const sectionTitles = document.querySelectorAll('.section-title');
    const mainContent = document.getElementById('main-content');
    
    // Define which sections are "light"
    const lightSections = ['services', 'reviews', 'contact'];

    // --- 2. Burger Menu Logic ---
    burgerMenu.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    function toggleMenu() {
        const isActive = burgerMenu.classList.toggle('is-active');
        mainNav.classList.toggle('is-active');
        document.body.classList.toggle('no-scroll', isActive);

        // Staggered list item animation ("Surprise Me")
        if (isActive) {
            const navItems = mainNav.querySelectorAll('li');
            navItems.forEach((item, index) => {
                item.style.setProperty('--i', index);
            });
        }
    }

    function closeMenu() {
        burgerMenu.classList.remove('is-active');
        mainNav.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
    }

    // --- 3. Scroll Event Handler ---
    // We use one 'scroll' listener for performance
    window.addEventListener('scroll', () => {
        handleScrollProgress();
        handleBurgerColor();
        handleParallaxTitles(); // "Surprise Me"
    });

    // --- 4. Scroll Progress Bar ---
    function handleScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }

    // --- 5. Dynamic Burger Color ---
    function handleBurgerColor() {
        // Get the burger's vertical position (it's fixed)
        const burgerRect = burgerMenu.getBoundingClientRect();
        const burgerCenterY = burgerRect.top + burgerRect.height / 2;

        let isOverLight = false;

        // Check which section the burger is currently over
        sections.forEach(section => {
            const sectionRect = section.getBoundingClientRect();
            // Check if burger's Y position is within the section's top and bottom
            if (burgerCenterY >= sectionRect.top && burgerCenterY <= sectionRect.bottom) {
                if (lightSections.includes(section.id)) {
                    isOverLight = true;
                }
            }
        });

        // Also check #home section separately (it's not in .section array)
        const homeSection = document.getElementById('home');
        if (homeSection) {
            const homeRect = homeSection.getBoundingClientRect();
            if (burgerCenterY >= homeRect.top && burgerCenterY <= homeRect.bottom) {
                 isOverLight = false; // Home is dark
            }
        }

        // Apply class for smooth CSS transition
        if (isOverLight) {
            burgerMenu.classList.add('is-light');
        } else {
            burgerMenu.classList.remove('is-light');
        }
    }

    // --- 6. Section Title Fade-in on Scroll ---
    const observerOptions = {
        root: null,
        threshold: 0.3, // 30% visible
        rootMargin: "0px"
    };

    const titleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Optional: remove class to re-animate on scroll up
                // entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    sectionTitles.forEach(title => {
        titleObserver.observe(title);
    });

    // --- 7. "Surprise Me": 3D Parallax Titles on Scroll ---
    function handleParallaxTitles() {
        const winHeight = window.innerHeight;
        
        sectionTitles.forEach(title => {
            const rect = title.parentElement.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const screenCenter = winHeight / 2;

            // Calculate percentage from center ( -1 to 1 )
            const percent = (sectionCenter - screenCenter) / screenCenter;
            
            // Apply a subtle 3D rotation based on its position
            const rotateX = percent * -15; // Max 15deg tilt
            
            // Only apply if the section is somewhat in view
            if (rect.top < winHeight && rect.bottom > 0) {
                 title.style.transform = `translateY(0) rotateX(${rotateX}deg)`;
            }
        });
    }

    // Initial check on load
    handleBurgerColor();
});
