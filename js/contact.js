// JavaScript specific pentru interacțiuni în secțiunea Contact.

// Notă: Animația "Floating Label" este realizată 99% în CSS
// folosind pseudo-clasele :focus și :not(:placeholder-shown).
// Acest fișier JS nu este necesar pentru funcționalitatea
// curentă a formularului, dar este gata pentru validare.

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Aici ar veni logica de validare și trimitere (ex. Fetch API)
        
        // Simulare trimitere reușită
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Trimitere... <i class="fa-solid fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            submitButton.innerHTML = 'Mesaj Trimis! <i class="fa-solid fa-check"></i>';
            submitButton.style.background = '#28a745'; // Verde
            contactForm.reset(); // Golește formularul
        }, 2000);
    });
});
