// Typing effect pentru home section
document.addEventListener('DOMContentLoaded', function() {
    const professions = ['frontend developer', 'designer', 'creator'];
    const typingElement = document.getElementById('typing-text');
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentProfession = professions[professionIndex];
        
        if (isDeleting) {
            // Șterge caractere
            typingElement.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Scrie caractere
            typingElement.textContent = currentProfession.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Dacă am terminat de scris un cuvânt
        if (!isDeleting && charIndex === currentProfession.length) {
            // Așteaptă înainte de a șterge
            typingSpeed = 1500;
            isDeleting = true;
        } 
        // Dacă am terminat de șters un cuvânt
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Trecem la următorul cuvânt
            professionIndex = (professionIndex + 1) % professions.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Pornim efectul de scriere
    type();
    
    // Adăugăm efect de scroll la săgeată
    const scrollArrow = document.querySelector('.scroll-down');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
});