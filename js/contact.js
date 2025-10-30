// Contact section specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactSection = document.getElementById('contact');
    
    // Asigurăm că secțiunea contact are înălțimea de 100vh
    contactSection.style.height = '100vh';
    
    // Adăugăm un efect de fade-in la încărcare
    contactSection.style.opacity = '0';
    setTimeout(() => {
        contactSection.style.transition = 'opacity 1s ease';
        contactSection.style.opacity = '1';
    }, 700);
});
