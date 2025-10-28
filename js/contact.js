// ===== CONTACT SECTION INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    initContactAnimations();
    initContactForm();
});

function initContactAnimations() {
    const contactSection = document.getElementById('contact');
    const contactContent = document.querySelector('.contact-content');
    
    if (!contactSection || !contactContent) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = contactContent.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 300);
                });
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(contactSection);
    
    // Set initial styles for animation
    const children = contactContent.children;
    Array.from(children).forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(40px)';
        child.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
}

function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showFormMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
    
    // Add input focus effects
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message-${type}`;
    messageElement.textContent = message;
    messageElement.setAttribute('role', 'alert');
    
    // Add styles
    messageElement.style.cssText = `
        padding: var(--space-sm);
        margin-top: var(--space-md);
        border-radius: var(--radius-sm);
        text-align: center;
        font-weight: 500;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
        color: ${type === 'success' ? '#4caf50' : '#f44336'};
        border: 1px solid ${type === 'success' ? '#4caf50' : '#f44336'};
    `;
    
    // Insert into form
    const contactForm = document.querySelector('.contact-form');
    contactForm.appendChild(messageElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}
