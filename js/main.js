// Script principal pentru funcționalități generale

document.addEventListener('DOMContentLoaded', function() {
    // Adăugăm un efect de lumină intermitentă pentru titlu
    const title = document.querySelector('.futuristic-title');
    
    if (title) {
        setInterval(() => {
            title.style.textShadow = `0 0 ${10 + Math.random() * 20}px rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`;
        }, 1000);
    }
    
    // Efect de hover pentru toate linkurile
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});
