/* ANDZ — Lehadus Andrei */

// Contact Section - Formular și animații
document.addEventListener('DOMContentLoaded', function() {
    initContactAnimations();
    initContactForm();
    initContactItemsInteractivity();
});

// Animații pentru secțiunea Contact
function initContactAnimations() {
    const contactSection = document.getElementById('contact');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateContactElements();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (contactSection) {
        observer.observe(contactSection);
    }
}

// Animație pentru elementele de contact
function animateContactElements() {
    const items = document.querySelectorAll('.contact-item');
    const form = document.querySelector('.contact-form');
    
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateX(0)';
            item.style.opacity = '1';
        }, index * 200);
    });
    
    if (form) {
        setTimeout(() => {
            form.style.transform = 'translateX(0)';
            form.style.opacity = '1';
        }, 600);
    }
}

// Management formular de contact
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (shouldReduceMotion()) {
            // Submit simplu fără animații
            this.submit();
            return;
        }
        
        // Animare buton submit
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Se trimite...';
        submitBtn.disabled = true;
        
        // Simulare trimitere (înlocuiește cu logica reală)
        setTimeout(() => {
            showFormSuccess();
            
            // Reset buton
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });
    
    // Validare în timp real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Validare câmp formular
function validateField(field) {
    const value = field.value.trim();
    const isValid = field.checkValidity();
    
    if (value === '') {
        field.style.borderColor = 'var(--glass-border)';
        return;
    }
    
    if (isValid) {
        field.style.borderColor = 'rgba(34, 197, 94, 0.5)';
    } else {
        field.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    }
}

// Afișare succes trimitere formular
function showFormSuccess() {
    const form = document.querySelector('.contact-form');
    const successMessage = document.createElement('div');
    
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div style="
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: var(--border-radius);
            padding: 1rem;
            text-align: center;
            margin-top: 1rem;
            color: #22c55e;
        ">
            ✓ Mesajul a fost trimis cu succes! Vă vom contacta în curând.
        </div>
    `;
    
    form.appendChild(successMessage);
    
    // Elimină mesajul după 5 secunde
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Interactivitate pentru elementele de contact
function initContactItemsInteractivity() {
    const items = document.querySelectorAll('.contact-item');
    
    items.forEach(item => {
        // Efect de hover cu animație iconiță
        item.addEventListener('mouseenter', () => {
            if (shouldReduceMotion()) return;
            
            const icon = item.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
        
        // Click pentru a copia informația (doar pentru email/telefon)
        item.addEventListener('click', function() {
            const text = this.querySelector('.contact-text').textContent;
            
            if (text.includes('@') || text.includes('+')) {
                copyToClipboard(text);
                showCopyFeedback(this);
            }
        });
    });
}

// Utilitate pentru copiere în clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Text copiat: ', text);
    }).catch(err => {
        console.error('Eroare la copiere: ', err);
    });
}

// Feedback vizual pentru copiere
function showCopyFeedback(element) {
    const originalBackground = element.style.background;
    
    element.style.background = 'rgba(34, 197, 94, 0.2)';
    element.style.borderColor = 'rgba(34, 197, 94, 0.5)';
    
    setTimeout(() => {
        element.style.background = originalBackground;
        element.style.borderColor = '';
    }, 1000);
}
