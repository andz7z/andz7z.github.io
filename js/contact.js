/* ANDZ — Lehadus Andrei */

class ContactSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormInteractions();
        this.setupContactAnimations();
    }

    setupFormValidation() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
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
            case 'text':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'textarea':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff6b6b;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#ff6b6b';
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea');
        let allValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            return;
        }

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateApiCall(formData);
            
            // Show success message
            this.showFormMessage('Message sent successfully!', 'success');
            form.reset();
            
        } catch (error) {
            // Show error message
            this.showFormMessage('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateApiCall(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                Math.random() > 0.2 ? resolve() : reject();
            }, 2000);
        });
    }

    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            text-align: center;
            font-weight: 500;
            animation: fadeIn 0.3s ease;
            background: ${type === 'success' ? 'rgba(81, 207, 102, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
            color: ${type === 'success' ? '#51cf66' : '#ff6b6b'};
            border: 1px solid ${type === 'success' ? 'rgba(81, 207, 102, 0.3)' : 'rgba(255, 107, 107, 0.3)'};
        `;

        const form = document.querySelector('.contact-form');
        form.parentNode.insertBefore(messageElement, form);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    setupFormInteractions() {
        const formGroups = document.querySelectorAll('.form-group');

        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');

            if (input && label) {
                input.addEventListener('focus', () => {
                    label.style.color = 'var(--color-accent)';
                });

                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.style.color = 'var(--color-text-secondary)';
                    }
                });
            }
        });
    }

    setupContactAnimations() {
        // Use Intersection Observer to trigger animations
        const contactElements = document.querySelectorAll('.contact-info, .contact-form, .contact-item');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                    }
                });
            }, {
                threshold: 0.3
            });

            contactElements.forEach(element => {
                observer.observe(element);
            });
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactSection();
});
