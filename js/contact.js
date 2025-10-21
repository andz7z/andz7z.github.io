// js/contact.js
/*
HOW TO EDIT CONTACT SECTION JAVASCRIPT:
- Form handling: Implement form submission logic
- Validation: Add form validation rules
- API integration: Connect to your backend service
*/

class ContactSection {
    constructor() {
        this.section = document.getElementById('contact');
        this.form = this.section?.querySelector('.contact-form');
        this.init();
    }
    
    init() {
        this.setupAnimations();
        this.setupFormHandling();
    }
    
    setupAnimations() {
        if (!this.section) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateForm();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(this.section);
    }
    
    animateForm() {
        if (!this.form) return;
        
        const formElements = this.form.querySelectorAll('input, textarea, button');
        
        formElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    setupFormHandling() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFormSubmit();
        });
        
        // Add input validation
        this.setupValidation();
    }
    
    setupValidation() {
        const inputs = this.form?.querySelectorAll('input, textarea');
        
        inputs?.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'text':
                isValid = value.length >= 2;
                errorMessage = 'Please enter at least 2 characters';
                break;
            default:
                isValid = value.length > 0;
                errorMessage = 'This field is required';
        }
        
        if (!isValid && value) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    async handleFormSubmit() {
        if (!this.form) return;
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });
        
        if (!allValid) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Here you would typically send to your backend
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showMessage('Message sent successfully!', 'success');
            this.form.reset();
            
        } catch (error) {
            this.showMessage('Failed to send message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.form?.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.style.cssText = `
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
            background: ${type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
            color: ${type === 'success' ? '#22c55e' : '#ef4444'};
            border: 1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
        `;
        messageElement.textContent = message;
        
        this.form?.appendChild(messageElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

// Initialize contact section
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ContactSection();
    });
} else {
    new ContactSection();
}

export default ContactSection;
