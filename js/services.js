// js/services.js
/*
HOW TO EDIT SERVICES SECTION JS:
- Animation timing: Adjust delays and durations
- Image handling: Update image sources and alt texts
- Mobile behavior: Modify breakpoints and layouts
*/

import { debounce } from './main.js';

// Services section specific functionality
function initServices() {
    setupArchSection();
    setupImageReveal();
}

// Setup the architecture section
function setupArchSection() {
    const archInfos = document.querySelectorAll('.arch__info');
    const imgWrappers = document.querySelectorAll('.arch__right .img-wrapper');
    
    // Set z-index for images
    imgWrappers.forEach((element) => {
        const order = element.getAttribute('data-index');
        if (order !== null) {
            element.style.zIndex = order;
        }
    });
    
    // Handle mobile layout
    handleMobileLayout();
    
    // Setup scroll animations for desktop
    if (window.matchMedia('(min-width: 769px)').matches) {
        setupDesktopAnimations();
    } else {
        setupMobileAnimations();
    }
    
    // Handle resize events
    window.addEventListener('resize', debounce(handleResize, 150));
}

// Handle mobile layout
function handleMobileLayout() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const leftItems = document.querySelectorAll('.arch__left .arch__info');
    const rightItems = document.querySelectorAll('.arch__right .img-wrapper');
    
    if (isMobile) {
        // Interleave items using order
        leftItems.forEach((item, i) => {
            item.style.order = i * 2;
        });
        rightItems.forEach((item, i) => {
            item.style.order = i * 2 + 1;
        });
    } else {
        // Clear order for desktop
        leftItems.forEach((item) => {
            item.style.order = '';
        });
        rightItems.forEach((item) => {
            item.style.order = '';
        });
    }
}

// Setup desktop animations
function setupDesktopAnimations() {
    const archInfos = document.querySelectorAll('.arch__info');
    const imgWrappers = document.querySelectorAll('.img-wrapper');
    
    // Create Intersection Observer for arch items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const archInfo = entry.target;
                const index = Array.from(archInfos).indexOf(archInfo);
                const correspondingImage = imgWrappers[imgWrappers.length - 1 - index];
                
                // Show current arch info
                archInfo.classList.add('visible');
                
                // Show corresponding image
                imgWrappers.forEach(img => img.classList.remove('active'));
                if (correspondingImage) {
                    correspondingImage.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    // Observe all arch info elements
    archInfos.forEach(archInfo => {
        observer.observe(archInfo);
    });
}

// Setup mobile animations
function setupMobileAnimations() {
    const imgWrappers = document.querySelectorAll('.img-wrapper');
    
    // Create Intersection Observer for mobile images
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imgWrapper = entry.target;
                imgWrapper.classList.add('active');
                
                // Find corresponding arch info and show it
                const index = Array.from(imgWrappers).indexOf(imgWrapper);
                const archInfos = document.querySelectorAll('.arch__info');
                const correspondingArch = archInfos[archInfos.length - 1 - index];
                
                if (correspondingArch) {
                    correspondingArch.classList.add('visible');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px'
    });
    
    // Observe all image wrappers
    imgWrappers.forEach(imgWrapper => {
        observer.observe(imgWrapper);
    });
}

// Handle resize events
function handleResize() {
    handleMobileLayout();
    
    // Re-initialize animations based on screen size
    if (window.matchMedia('(min-width: 769px)').matches) {
        setupDesktopAnimations();
    } else {
        setupMobileAnimations();
    }
}

// Setup image reveal on scroll
function setupImageReveal() {
    const images = document.querySelectorAll('.arch__right img');
    
    images.forEach((img, index) => {
        // Preload images
        img.setAttribute('loading', 'lazy');
        
        // Add fade-in effect when image loads
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    });
}

// Reset animations when section becomes active again
function resetAnimations() {
    const archInfos = document.querySelectorAll('.arch__info');
    const imgWrappers = document.querySelectorAll('.img-wrapper');
    
    archInfos.forEach(info => info.classList.remove('visible'));
    imgWrappers.forEach(wrapper => wrapper.classList.remove('active'));
    
    // Re-initialize after a short delay
    setTimeout(() => {
        if (window.matchMedia('(min-width: 769px)').matches) {
            setupDesktopAnimations();
        } else {
            setupMobileAnimations();
        }
    }, 100);
}

// Initialize services section when DOM is ready
document.addEventListener('DOMContentLoaded', initServices);

// Export for module usage
export { initServices, resetAnimations };
