// Funcții specifice pentru sectiunea Home
document.addEventListener('DOMContentLoaded', function() {
    // Încărcare video
    const video = document.getElementById('bg-video');
    video.addEventListener('loadeddata', function() {
        video.classList.add('loaded');
    });

    // Animație conținut home
    const homeContent = document.querySelector('.home-content');
    setTimeout(() => {
        homeContent.classList.add('visible');
    }, 500);
});
