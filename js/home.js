// Functionalitate specifica sectiunii Home
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('bg-video');
    
    // Asigura-te ca videoclipul se incarca corect
    video.addEventListener('loadeddata', function() {
        console.log('Videoclipul s-a incarcat cu succes');
    });
    
    video.addEventListener('error', function() {
        console.error('Eroare la incarcarea videoclipului');
    });
});
