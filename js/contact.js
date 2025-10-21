// js/contact.js
/*
HOW TO EDIT CONTACT SECTION JS:
- Form handling: Connect to your backend/email service
- Validation: Add custom validation rules
- Success/error: Add form submission feedback
*/

// Contact section specific functionality
function initContact() {
    setupContactForm();
}

// Setup contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    showFormMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
    e.target.reset();
    
    // In a real implementation, you would send the data to your server here
    console.log('Form submission:', data);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form message
function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        padding: var(--space-md);
        margin: var(--space-md) 0;
        border-radius: var(--border-radius);
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
        border: 1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
        color: var(--color-text);
    `;
    
    const contactForm = document.getElementById('contact-form');
    contactForm.appendChild(messageElement);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Initialize contact section when DOM is ready
document.addEventListener('DOMContentLoaded', initContact);

// Export for module usage
export { initContact, handleFormSubmit };
