// Letter interaction
document.querySelectorAll('.letter').forEach(letter => {
    letter.addEventListener('click', function() {
        this.style.opacity = '0';
        this.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            this.style.opacity = '1';
        }, 3000);
    });
});

// Button functionality
const button = document.querySelector('.button');
button.addEventListener('click', function() {
    this.classList.toggle('active');
});
