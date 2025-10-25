// Loading Screen Functionality
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingVideo = document.getElementById('loadingVideo');
    const body = document.body;

    // If elements don't exist, exit
    if (!loadingScreen || !loadingVideo) {
        console.log('Loading screen elements not found');
        body.classList.remove('content-hidden');
        return;
    }

    console.log('Loading screen initialized');

    function removeLoadingScreen() {
        console.log('Removing loading screen');
        
        if (!loadingScreen.classList.contains('fade-out')) {
            loadingScreen.classList.add('fade-out');
            
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                    console.log('Loading screen removed from DOM');
                }
                body.classList.remove('content-hidden');
                body.classList.add('content-visible');
                console.log('Main content revealed');
            }, 800);
        }
    }

    // Event listener for video end
    loadingVideo.addEventListener('ended', removeLoadingScreen);

    // Event listener for video error
    loadingVideo.addEventListener('error', () => {
        console.log('Video error occurred');
        removeLoadingScreen();
    });

    // Event listener for when video can play
    loadingVideo.addEventListener('canplay', () => {
        console.log('Video can play');
        loadingVideo.play().catch(error => {
            console.log('Video play failed:', error);
        });
    });

    // Fallback timeout after 3 seconds
    setTimeout(removeLoadingScreen, 3000);

    // Additional backup when page is fully loaded
    window.addEventListener('load', () => {
        console.log('Page fully loaded');
        setTimeout(removeLoadingScreen, 2000);
    });

    // Emergency backup - remove after 5 seconds no matter what
    setTimeout(removeLoadingScreen, 5000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingScreen);
} else {
    initLoadingScreen();
}
