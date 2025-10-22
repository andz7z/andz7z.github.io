// Home Section Script
document.addEventListener('DOMContentLoaded', () => {
    // Discover button scroll to about section
    const discoverBtn = document.getElementById('discoverBtn');
    
    discoverBtn.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        
        window.scrollTo({
            top: aboutSection.offsetTop,
            behavior: 'smooth'
        });
    });
    
    // Letter hover effect
    const sloganWords = document.querySelectorAll('.slogan-word');
    
    sloganWords.forEach(word => {
        const letters = word.textContent.split('');
        word.innerHTML = '';
        
        letters.forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.transition = 'all 0.3s ease';
            span.style.display = 'inline-block';
            
            span.addEventListener('mouseover', () => {
                span.style.textShadow = '0 0 15px var(--glow-color)';
                span.style.filter = 'blur(2px)';
                span.style.transform = 'scale(1.2)';
            });
            
            span.addEventListener('mouseout', () => {
                span.style.textShadow = 'none';
                span.style.filter = 'blur(0)';
                span.style.transform = 'scale(1)';
            });
            
            word.appendChild(span);
        });
    });
});
