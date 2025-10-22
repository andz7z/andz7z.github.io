// Logica JavaScript specifică pentru secțiunea #about
// about.js
function initAbout() {
    // Animație pentru barele de competențe
    animateSkillBars();
}

function animateSkillBars() {
    const skillProgresses = document.querySelectorAll('.skill-progress');
    
    // Folosim IntersectionObserver pentru a anima barele când devin vizibile
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                // Animăm bara la lățimea specificată
                setTimeout(() => {
                    progressBar.style.width = `${width}%`;
                }, 300);
                
                // Oprim observarea după ce am animat
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillProgresses.forEach(progress => {
        observer.observe(progress);
    });
}
