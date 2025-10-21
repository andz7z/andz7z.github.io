// ===== JAVASCRIPT SPECIFIC PENTRU SECȚIUNEA CONTACT =====

document.addEventListener('DOMContentLoaded', function() {
    initContactAnimations();
    initContactForm();
    initContactInteractions();
});

// Animații specifice pentru secțiunea Contact
function initContactAnimations() {
    const contactItems = document.querySelectorAll('.contact-item');
    const formGroups = document.querySelectorAll('.form-group');
    
    // Setează delay-uri pentru animații
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${0.3 + index * 0.1}s`;
    });
    
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${0.5 + index * 0.1}s`;
    });
    
    // Intersection Observer pentru trigger la scroll
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateContactElements();
                contactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactObserver.observe(contactSection);
    }
}

// Animație pentru elementele de contact
function animateContactElements() {
    const contactIcons = document.querySelectorAll('.contact-item i');
    
    contactIcons.forEach(icon => {
        icon.style.animation = 'iconBounce 0.6s ease forwards';
    });
}

// Inițializare formular de contact
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validează formularul
            if (validateForm(this)) {
                // Simulează trimiterea formularului
                simulateFormSubmission(this);
            }
        });
        
        // Validare în timp real
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Validare formular
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validare câmp individual
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Verificări specifice în funcție de tipul câmpului
    switch (field.type) {
        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Te rog introdu o adresă de email validă.';
            }
            break;
        case 'text':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Acest câmp trebuie să conțină cel puțin 2 caractere.';
            }
            break;
        default:
            if (!value) {
                isValid = false;
                errorMessage = 'Acest câmp este obligatoriu.';
            }
    }
    
    // Afișează sau elimină mesajul de eroare
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
        showFieldSuccess(field);
    }
    
    return isValid;
}

// Verifică dacă email-ul este valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Afișează eroare pentru câmp
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#FF0000';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = '#FF0000';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.5rem';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

// Elimină eroarea de la câmp
function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Afișează succes pentru câmp
function showFieldSuccess(field) {
    field.style.borderColor = '#4169E1';
}

// Simulează trimiterea formularului
function simulateFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Schimbă textul butonului
    submitButton.textContent = 'Se trimite...';
    submitButton.disabled = true;
    
    // Simulează o întârziere de rețea
    setTimeout(() => {
        // Afișează mesaj de succes
        showFormSuccessMessage();
        
        // Resetează formularul
        form.reset();
        
        // Resetează butonul
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Afișează mesaj de succes pentru formular
function showFormSuccessMessage() {
    const form = document.querySelector('.contact-form');
    const existingMessage = form.querySelector('.form-success');
    
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.style.background = 'rgba(65, 105, 225, 0.1)';
    successMessage.style.border = '1px solid #4169E1';
    successMessage.style.borderRadius = 'var(--border-radius)';
    successMessage.style.padding = '1rem';
    successMessage.style.marginTop = '1rem';
    successMessage.style.textAlign = 'center';
    successMessage.style.color = '#4169E1';
    successMessage.textContent = 'Mesajul tău a fost trimis cu succes! Vom reveni în cel mai scurt timp.';
    
    form.appendChild(successMessage);
    
    // Elimină mesajul după 5 secunde
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Interacțiuni pentru secțiunea Contact
function initContactInteractions() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        // Copiază informația de contact la click
        item.addEventListener('click', function() {
            const text = this.querySelector('p').textContent;
            copyToClipboard(text);
            showCopyFeedback(this);
        });
    });
}

// Copiază text în clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Text copiat în clipboard:', text);
    }).catch(err => {
        console.error('Eroare la copierea în clipboard:', err);
    });
}

// Afișează feedback pentru copiere
function showCopyFeedback(element) {
    const originalBackground = element.style.background;
    
    element.style.background = 'rgba(65, 105, 225, 0.2)';
    element.style.transition = 'background 0.3s ease';
    
    setTimeout(() => {
        element.style.background = originalBackground;
    }, 1000);
}

// Adaugă animația iconBounce în CSS prin JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes iconBounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style);
