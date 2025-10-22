// Contact section specific functionality

class ContactSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
    }

    setupFormValidation() {
        const form = document.querySelector('.contact-form');
        const inputs = form.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        
        if (field.type === 'email') {
            if (!this.isValidEmail(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        } else if (field.required && value === '') {
            this.showError(field, 'This field is required');
            return false;
        }
        
        this.clearError(field);
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(field, message) {
        this.clearError(field);
        
        field.style.borderColor = '#ff1493';
        
        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = '#ff1493';
        error.style.fontSize = '0.8rem';
        error.style.marginTop = '5px';
        error.textContent = message;
        
        field.parentNode.appendChild(error);
    }

    clearError(field) {
        field.style.borderColor = '';
        
        const error = field.parentNode.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    setupFormSubmission() {
        const form = document.querySelector('.contact-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('.form-input');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                this.submitForm(form);
            }
        });
    }

    submitForm(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            this.showSuccessMessage(form);
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showSuccessMessage(form) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.style.background = 'rgba(138, 43, 226, 0.2)';
        successMsg.style.color = '#8a2be2';
        successMsg.style.padding = '15px';
        successMsg.style.borderRadius = '10px';
        successMsg.style.marginTop = '20px';
        successMsg.style.textAlign = 'center';
        successMsg.style.border = '1px solid rgba(138, 43, 226, 0.3)';
        successMsg.textContent = 'Thank you! Your message has been sent successfully.';
        
        form.appendChild(successMsg);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
    }
}

// Initialize contact section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactSection();
});
