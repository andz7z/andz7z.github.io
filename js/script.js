// ========== Smooth Scroll ==========
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== Navbar "magnetic" effect ==========
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== Detectează secțiunile vizibile ==========
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (id === 'about') initAboutSection?.();
                if (id === 'services') initServicesSection?.();
                if (id === 'reviews') initReviewsSection?.();
                if (id === 'contact') initContactSection?.();
            }
        });
    },
    { threshold: 0.4 }
);

document.querySelectorAll('section').forEach((sec) => observer.observe(sec));
