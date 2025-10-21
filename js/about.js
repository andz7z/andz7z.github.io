// JavaScript specific pentru secțiunea About.

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ANIMARE SKILL BARS ---
    const aboutSection = document.getElementById('about');
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    
    // Folosim un Intersection Observer *separat* pentru a ști când SĂ ANIMĂM
    // (Cel din script.js doar adaugă .in-view pentru animații CSS)
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Când secțiunea "about" devine vizibilă
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress;
                });
                
                // Oprește observarea după ce animația a rulat o dată
                skillObserver.unobserve(aboutSection);
            }
        });
    }, {
        root: document.getElementById('scroll-container'),
        threshold: 0.5 // Pornește când 50% din secțiune e vizibilă
    });

    skillObserver.observe(aboutSection);
});
