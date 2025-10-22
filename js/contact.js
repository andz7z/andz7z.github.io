// contact.js
function initContact() {
    initContactForm();
}

// Validare și trimitere formular de contact
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aici s-ar putea adăuga logica de trimitere a formularului
            // De exemplu, folosind Fetch API sau trimiterea la un serviciu
            
            // Simulăm trimiterea cu succes
            alert('Mesajul a fost trimis cu succes! Vă vom contacta în curând.');
            contactForm.reset();
        });
    }
}
