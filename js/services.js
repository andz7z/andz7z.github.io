// ===== SERVICES SECTION INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    initServicesAnimations();
    initServiceHoverEffects();
});

function initServicesAnimations() {
    const servicesSection = document.getElementById('services');
    const serviceItems = document.querySelectorAll('.service-item');
    
    if (!servicesSection || !serviceItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                serviceItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(servicesSection);
    
    // Set initial styles for animation
    serviceItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) scale(0.9)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

function initServiceHoverEffects() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        const icon = item.querySelector('.service-icon');
        
        item.addEventListener('mouseenter', function() {
            if (icon) {
                icon.style.transform = 'rotate(12deg) scale(1.15)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1)';
            }
        });
    });
}
