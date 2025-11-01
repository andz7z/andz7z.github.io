// typing effect
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
            typingElement.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentProfession.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        if (!isDeleting && charIndex === currentProfession.length) {
            typingSpeed = 1500;
            isDeleting = true;
        } 
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    type();
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