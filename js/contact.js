// contact.js
document.addEventListener('DOMContentLoaded', function() {
    // Funcționalități specifice pentru secțiunea Contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aici poți adăuga logica pentru trimiterea formularului
            alert('Mesajul a fost trimis! (Aceasta este o demonstrație)');
            contactForm.reset();
        });
    }
});
