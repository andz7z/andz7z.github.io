// about.js
function initAbout() {
    animateSkillBars();
}

// Animație pentru barele de competențe
function animateSkillBars() {
    const skillProgresses = document.querySelectorAll('.skill-progress');
    
    // Observator pentru a declanșa animația când secțiunea devine vizibilă
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillProgresses.forEach(progress => {
                    const width = progress.getAttribute('data-width');
                    progress.style.width = width;
                });
            }
        });
    }, { threshold: 0.5 });
    
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
}
