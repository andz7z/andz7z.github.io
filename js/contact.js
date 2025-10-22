// Contact Section Script
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
        });
        
        if (isValid) {
            // Here you would typically send the form data to a server
            alert('Message sent successfully!');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
});
