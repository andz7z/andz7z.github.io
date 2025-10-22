/* ANDZ — Lehadus Andrei */
'use strict';

// Aici se poate adăuga logica de validare a formularului de contact
// și trimiterea datelor (ex: folosind Fetch API către un serviciu
// ca Formspree, Netlify Forms sau un endpoint propriu).

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // TODO: Adaugă logica de validare
        
        // Simulare trimitere
        console.log('Formularul se trimite...');
        
        // Exemplu de colectare date
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        console.log('Date:', data);
        
        // TODO: Trimite 'data' către un endpoint
        
        // Feedback către utilizator
        alert('Mesajul tău a fost trimis! (Simulare)');
        contactForm.reset();
    });
});
