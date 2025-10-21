// Contact Section JavaScript
class ContactModule {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.formGroups = document.querySelectorAll('.form-group');
        this.init();
    }
    
    init() {
        this.setupFormValidation();
        this.setupFormAnimations();
        this.setupInteractiveElements();
    }
    
    setupFormValidation() {
        this.contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Real-time validation
        this.formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
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
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        this.clearError(field);
        
        // Validation rules
        switch (fieldName) {
            case 'name':
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
                
            case 'subject':
                if (value.length < 5) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 5 characters long';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        // Create or update error message
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        const formData = {};
        
        this.formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            formData[input.name] = input.value.trim();
            
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showFormMessage('Please fix the errors above', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission
            await this.simulateFormSubmission(formData);
            
            // Show success message
            this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
            this.contactForm.reset();
            
        } catch (error) {
            // Show error message
            this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                Math.random() > 0.2 ? resolve() : reject();
            }, 2000);
        });
    }
    
    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 10px;
            text-align: center;
            font-weight: 600;
            background: ${type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
            border: 1px solid ${type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
            color: ${type === 'success' ? '#4caf50' : '#f44336'};
        `;
        
        this.contactForm.appendChild(messageElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    setupFormAnimations() {
        const formGroups = this.contactForm.querySelectorAll('.form-group');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.3 });
        
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateX(-20px)';
            group.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(group);
        });
    }
    
    setupInteractiveElements() {
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('.contact-icon');
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('.contact-icon');
                icon.style.transform = 'scale(1) rotate(0)';
            });
        });
    }
}
