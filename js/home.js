// js/home.js

// Home section specific functionality

function initHome() {
    const discoverBtn = document.querySelector('.discover-btn');
    
    // Add click event to discover button
    if (discoverBtn) {
        discoverBtn.addEventListener('click', function() {
            // Scroll to about section
            document.getElementById('about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Add typing effect to main text (optional enhancement)
    initTypingEffect();
}

// Optional: Typing effect for the main text
function initTypingEffect() {
    const designText = document.querySelector('.design');
    const developText = document.querySelector('.develop');
    
    if (designText && developText) {
        // Reset text for animation
        const designOriginal = designText.textContent;
        const developOriginal = developText.textContent;
        
        designText.textContent = '';
        developText.textContent = '';
        
        // Type design text
        typeText(designText, designOriginal, 0, function() {
            // When design is done, type develop text
            typeText(developText, developOriginal, 0);
        });
    }
}

// Helper function for typing effect
function typeText(element, text, index, callback) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(function() {
            typeText(element, text, index + 1, callback);
        }, 100);
    } else if (callback) {
        callback();
    }
}
