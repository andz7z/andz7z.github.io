// Logica JavaScript specifică pentru secțiunea #contact
// contact.js
function initContact() {
    // Validare formular
    initFormValidation();
}

function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validare simplă
        const inputs = this.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'rgba(255, 0, 0, 0.5)';
            } else {
                input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
        
        if (isValid) {
            // Într-o implementare reală, aici s-ar trimite datele la server
            alert('Mesajul a fost trimis cu succes! Vă vom contacta în curând.');
            this.reset();
        } else {
            alert('Vă rugăm completați toate câmpurile obligatorii.');
        }
    });
}
