/* js/contact.js */

/**
 * Validare Formular Contact (Req 5)
 * ---------------------------------
 * Oferă feedback în timp real și previne trimiterea
 * unui formular invalid.
 * * Cum funcționează:
 * 1. Adăugăm listener 'submit' pe formular.
 * 2. La trimitere, validăm fiecare câmp.
 * 3. Adăugăm și listener 'blur' (când utilizatorul părăsește câmpul)
 * pentru a oferi feedback instantaneu (adăugând clasa 'touched').
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], textarea[required]');

    // Adaugă clasa 'touched' la părăsirea câmpului
    // Acest lucru este folosit în CSS pentru a afișa erori doar DUPĂ
    // ce utilizatorul a interacționat cu câmpul.
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            input.classList.add('touched');
            validateInput(input); // Validează la blur
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Oprește trimiterea
        
        let isFormValid = true;
        
        // Validează toate câmpurile
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            console.log('Formular valid. Se trimite...');
            // Aici s-ar adăuga logica de trimitere (ex: fetch, AJAX)
            alert('Message sent successfully! (Simulation)');
            form.reset();
            inputs.forEach(input => input.classList.remove('touched'));
        } else {
            console.log('Formular invalid.');
        }
    });

    function validateInput(input) {
        const errorMessage = input.nextElementSibling; // Elementul <span class="error-message">
        if (input.validity.valid) {
            errorMessage.textContent = '';
            return true;
        } else {
            // Oferă mesaje de eroare specifice
            if (input.validity.valueMissing) {
                errorMessage.textContent = 'This field is required.';
            } else if (input.validity.typeMismatch && input.type === 'email') {
                errorMessage.textContent = 'Please enter a valid email address.';
            }
            return false;
        }
    }
});
