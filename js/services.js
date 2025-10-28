// Services Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Services section loaded');
    
    // Add any services-specific functionality here
    const servicesSection = document.getElementById('services');
    
    // Example: Future services interactions
    const servicesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Services section is now visible');
                // Future services animations
            }
        });
    });
    
    if (servicesSection) {
        servicesObserver.observe(servicesSection);
    }
});
