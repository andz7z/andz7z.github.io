// ===== HOME SCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
    initHome();
});

function initHome() {
    // Verifică dacă video-ul se încarcă corect
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
        bgVideo.addEventListener('error', function() {
            console.error('Video-ul de fundal nu s-a putut încărca.');
            // Poți adăuga un fallback aici dacă este necesar
        });
        
        bgVideo.addEventListener('loadeddata', function() {
            console.log('Video-ul de fundal s-a încărcat cu succes.');
        });
    }
    
    // Animație de fade-in pentru elementele homepage-ului
    const homeElements = document.querySelectorAll('.logo, .navbar, .social-icons, .scroll-arrow');
    homeElements.forEach((element, index) => {
        element.style.animationDelay = (index * 0.2) + 's';
        element.classList.add('fade-in');
    });
}
