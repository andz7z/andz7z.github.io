// Main JavaScript File
class WebsiteManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupProgressBar();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupBurgerMenu();
    }

    setupProgressBar() {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.querySelector('.progress-bar').style.width = scrolled + '%';
        });
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('mouseenter', this.handleNavHover);
            item.addEventListener('mouseleave', this.handleNavLeave);
        });
    }

    handleNavHover(e) {
        const item = e.target;
        item.style.transform = 'scale(1.1)';
    }

    handleNavLeave(e) {
        const item = e.target;
        item.style.transform = 'scale(1)';
    }

    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Show/hide burger menu based on scroll
            if (currentScrollY > 100) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupBurgerMenu() {
        const burgerIcon = document.querySelector('.burger-icon');
        const burgerContent = document.querySelector('.burger-content');

        burgerIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = burgerContent.style.display === 'flex';
            burgerContent.style.display = isVisible ? 'none' : 'flex';
            
            // Animate burger icon
            burgerIcon.classList.toggle('active');
        });

        // Close burger menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.burger-menu')) {
                burgerContent.style.display = 'none';
                burgerIcon.classList.remove('active');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteManager();
});
