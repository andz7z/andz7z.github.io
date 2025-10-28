// Contact Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact section loaded');
    
    // Add any contact-specific functionality here
    const contactSection = document.getElementById('contact');
    
    // Example: Future contact form functionality
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Contact section is now visible');
                // Future contact form animations
            }
        });
    });
    
    if (contactSection) {
        contactObserver.observe(contactSection);
    }
});
