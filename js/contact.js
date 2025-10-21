// ===== MODUL CONTACT - JAVASCRIPT SPECIFIC PENTRU SECȚIUNEA CONTACT =====

function initializeContactModule() {
    console.log('Contact module initialized');
    
    // Inițializează formularul de contact
    setupContactForm();
    setupContactItems();
}

function animateContactSection() {
    const contactContent = document.querySelector('.contact-content');
    
    if (contactContent && !contactContent.classList.contains('animated')) {
        contactContent.classList.add('animated');
    }
}

function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
        
        // Validare în timp real
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function setupContactItems() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        // Efect de hover pentru item-uri de contact
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
        
        // Copiere la click pe informații de contact
        item.addEventListener('click', function() {
            const text = this.querySelector('p').textContent;
            copyToClipboard(text);
            
            // Feedback vizual
            const originalBackground = this.style.background;
            this.style.background = 'var(--gradient-primary)';
            
            setTimeout(() => {
                this.style.background = originalBackground;
            }, 500);
        });
    });
}

function handleFormSubmit(form) {
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData);
    
    // Validare finală
    if (validateForm(form)) {
        // Simulare trimitere formular (înlocuiește cu API call real)
        showFormFeedback('success', 'Mesajul a fost trimis cu succes!');
        form.reset();
        
        // Aici poți adăuga logica pentru trimiterea datelor la server
        console.log('Form data:', formObject);
    } else {
        showFormFeedback('error', 'Te rugăm să completezi corect toate câmpurile.');
    }
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField.bind(input)()) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField() {
    const field = this;
    let isValid = true;
    
    // Resetează starea anterioară
    field.classList.remove('error', 'valid');
    
    // Validare email
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.add('valid');
        }
    }
    
    // Validare câmpuri obligatorii
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        field.classList.add('error');
    } else if (field.value.trim()) {
        field.classList.add('valid');
    }
    
    return isValid;
}

function clearFieldError() {
    this.classList.remove('error');
}

function showFormFeedback(type, message) {
    // Creează elementul de feedback
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--gradient-primary)' : 'linear-gradient(90deg, #FF0000, #FF6B6B)'};
        color: white;
        border-radius: var(--border-radius);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // Șterge feedback-ul după 5 secunde
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 5000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Feedback pentru copiere reușită
        showFormFeedback('success', 'Copiat în clipboard!');
    }).catch(err => {
        console.error('Eroare la copiere:', err);
    });
}

// Animații CSS pentru feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    input.error, textarea.error {
        border-color: #FF0000 !important;
    }
    
    input.valid, textarea.valid {
        border-color: #4169E1 !important;
    }
`;
document.head.appendChild(style);

window.animateContactSection = animateContactSection;
