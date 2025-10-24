/* ========================================
   HOME SECTION - INTERACTIVE EFFECTS
   ======================================== */

'use strict';

/* ========================================
   HOME DOM ELEMENTS
   ======================================== */

const HomeDOM = {
    preloader: null,
    homeSection: null,
    parallaxLayer: null,
    scrollIndicator: null,
    homeContent: null,
    navIcons: null
};

/* ========================================
   HOME STATE
   ======================================== */

const HomeState = {
    isLoaded: false,
    mouseX: 0,
    mouseY: 0,
    parallaxEnabled: true
};

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 Home module initializing...');
    
    // Cache DOM elements
    cacheHomeElements();
    
    // Initialize features
    initPreloader();
    initParallaxEffect();
    initScrollIndicator();
    initMouseGlow();
    
    console.log('✅ Home module loaded');
});

/* ========================================
   CACHE HOME ELEMENTS
   ======================================== */

function cacheHomeElements() {
    HomeDOM.preloader = document.getElementById('preloader');
    HomeDOM.homeSection = document.getElementById('home');
    HomeDOM.parallaxLayer = document.querySelector('.parallax-layer');
    HomeDOM.scrollIndicator = document.querySelector('.scroll-indicator');
    HomeDOM.homeContent = document.querySelector('.home-content');
    HomeDOM.navIcons = document.getElementById('navIcons');
}

/* ========================================
   PRELOADER
   ======================================== */

function initPreloader() {
    if (!HomeDOM.preloader) return;
    
    // Simulate minimum loading time for aesthetic
    const minLoadTime = 1500;
    const startTime = Date.now();
    
    // Wait for all images to load
    const images = Array.from(document.images);
    const backgroundImage = new Image();
    backgroundImage.src = 'assets/wallpaper/andz.png';
    images.push(backgroundImage);
    
    Promise.all(
        images.map(img => {
            if (img.complete) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if image fails
            });
        })
    ).then(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(() => {
            hidePreloader();
        }, remainingTime);
    }).catch(err => {
        console.warn('⚠️ Some resources failed to load:', err);
        setTimeout(hidePreloader, minLoadTime);
    });
    
    console.log('⏳ Preloader active');
}

function hidePreloader() {
    if (!HomeDOM.preloader) return;
    
    HomeDOM.preloader.classList.add('hide');
    HomeState.isLoaded = true;
    
    // Remove from DOM after animation
    setTimeout(() => {
        HomeDOM.preloader?.remove();
    }, 900);
    
    console.log('✨ Preloader hidden - Site ready');
}

/* ========================================
   PARALLAX EFFECT
   ======================================== */

function initParallaxEffect() {
    if (!HomeDOM.parallaxLayer || !HomeDOM.homeSection) return;
    
    // Only enable parallax on desktop
    if (window.innerWidth <= 768) {
        HomeState.parallaxEnabled = false;
        return;
    }
    
    HomeDOM.homeSection.addEventListener('mousemove', handleParallaxMove);
    HomeDOM.homeSection.addEventListener('mouseleave', resetParallax);
    
    console.log('🎨 Parallax effect enabled');
}

function handleParallaxMove(e) {
    if (!HomeState.parallaxEnabled || !HomeDOM.parallaxLayer) return;
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate mouse position as percentage
    const xPercent = (clientX / innerWidth - 0.5) * 2; // Range: -1 to 1
    const yPercent = (clientY / innerHeight - 0.5) * 2; // Range: -1 to 1
    
    // Apply parallax transform
    const depth = 0.2; // Parallax depth factor
    const moveX = xPercent * 20 * depth;
    const moveY = yPercent * 20 * depth;
    
    requestAnimationFrame(() => {
        HomeDOM.parallaxLayer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    // Update mouse position for glow effect
    HomeState.mouseX = clientX;
    HomeState.mouseY = clientY;
}

function resetParallax() {
    if (!HomeDOM.parallaxLayer) return;
    
    HomeDOM.parallaxLayer.style.transform = 'translate(0, 0)';
}

/* ========================================
   SCROLL INDICATOR
   ======================================== */

function initScrollIndicator() {
    if (!HomeDOM.scrollIndicator) return;
    
    HomeDOM.scrollIndicator.addEventListener('click', () => {
        const nextSection = HomeDOM.homeSection?.nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
    
    // Hide indicator when scrolling down
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100 && HomeDOM.scrollIndicator) {
            HomeDOM.scrollIndicator.style.opacity = '0';
            HomeDOM.scrollIndicator.style.pointerEvents = 'none';
        } else if (HomeDOM.scrollIndicator) {
            HomeDOM.scrollIndicator.style.opacity = '1';
            HomeDOM.scrollIndicator.style.pointerEvents = 'auto';
        }
        
        lastScrollY = currentScrollY;
    });
}

/* ========================================
   MOUSE GLOW EFFECT (Custom Cursor)
   ======================================== */

function initMouseGlow() {
    if (!HomeDOM.homeSection) return;
    
    // Only enable on desktop
    if (window.innerWidth <= 768) return;
    
    // Create glow element
    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);
    
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    // Track mouse position
    HomeDOM.homeSection.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth follow animation
    function animateGlow() {
        // Smooth lerp (linear interpolation)
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        
        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
    
    // Show/hide based on section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                glow.style.opacity = '1';
            } else {
                glow.style.opacity = '0';
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(HomeDOM.homeSection);
    
    console.log('✨ Mouse glow effect active');
}

/* ========================================
   TITLE TYPING EFFECT (Optional Enhancement)
   ======================================== */

function initTypingEffect() {
    const titleLines = document.querySelectorAll('.title-line');
    if (!titleLines.length) return;
    
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '1';
        
        let charIndex = 0;
        
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    line.textContent += text.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 80);
        }, 1000 + (index * 500));
    });
}

/* ========================================
   INTERACTIVE BACKGROUND PARTICLES (Advanced)
   ======================================== */

function initBackgroundParticles() {
    if (!HomeDOM.homeSection || window.innerWidth <= 768) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
    `;
    
    HomeDOM.homeSection.insertBefore(particlesContainer, HomeDOM.homeSection.firstChild);
    
    // Create particles
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
    
    console.log('✨ Background particles created');
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        left: ${startX}%;
        top: ${startY}%;
        animation: float ${duration}s ${delay}s infinite ease-in-out;
        filter: blur(1px);
    `;
    
    container.appendChild(particle);
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
        }
        10% {
            opacity: 0.4;
        }
        50% {
            transform: translate(50px, -100px);
            opacity: 0.6;
        }
        90% {
            opacity: 0.2;
        }
    }
`;
document.head.appendChild(particleStyle);

/* ========================================
   WINDOW RESIZE HANDLER
   ======================================== */

let resizeTimeout;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(() => {
        // Disable parallax on mobile
        if (window.innerWidth <= 768) {
            HomeState.parallaxEnabled = false;
            resetParallax();
        } else {
            HomeState.parallaxEnabled = true;
        }
        
        console.log('📱 Window resized - Parallax:', HomeState.parallaxEnabled);
    }, 250);
});

/* ========================================
   SCROLL VELOCITY DETECTION
   ======================================== */

let lastScrollTime = Date.now();
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const currentTime = Date.now();
    const currentScrollTop = window.scrollY;
    
    const timeDiff = currentTime - lastScrollTime;
    const scrollDiff = Math.abs(currentScrollTop - lastScrollTop);
    
    const velocity = scrollDiff / timeDiff;
    
    // Apply blur effect based on scroll velocity
    if (velocity > 2 && HomeDOM.homeContent) {
        HomeDOM.homeContent.style.filter = `blur(${Math.min(velocity * 0.5, 5)}px)`;
    } else if (HomeDOM.homeContent) {
        HomeDOM.homeContent.style.filter = 'blur(0)';
    }
    
    lastScrollTime = currentTime;
    lastScrollTop = currentScrollTop;
}, { passive: true });

/* ========================================
   EASTER EGG - KONAMI CODE
   ======================================== */

const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    console.log('🎉 KONAMI CODE ACTIVATED!');
    
    // Create rainbow effect
    document.body.style.animation = 'rainbow 5s linear infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    // Reset after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
        rainbowStyle.remove();
    }, 5000);
}

/* ========================================
   EXPORT HOME MODULE
   ======================================== */

window.HomeModule = {
    HomeState,
    HomeDOM,
    resetParallax
};

console.log('✅ Home.js loaded successfully');
