/* FILE: js/contact.js */
document.addEventListener('DOMContentLoaded', () => {
    // Aici se poate adăuga JS specific secțiunii "Contact"
    // De exemplu, validarea formularului.

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Logica de trimitere a formularului (de ex. fetch, AJAX)
            // Aici doar simulăm o trimitere reușită
            
            const name = document.getElementById('name').value;
            console.log(`Mulțumim pentru mesaj, ${name}!`);
            
            // Resetarea formularului (opțional)
            contactForm.reset();
            
            // Arată un mesaj de succes (opțional)
            alert('Mesajul tău a fost trimis!');
        });
    }
});
