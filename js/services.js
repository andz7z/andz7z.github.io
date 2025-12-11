// services.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded');
        return;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
        console.error('ScrollTrigger not loaded');
        return;
    }
    
    if (typeof SplitText === 'undefined') {
        console.error('SplitText not loaded');
        return;
    }
    
    // Register plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);
    
    // Wait a bit for everything to load
    setTimeout(() => {
        initServicesAnimation();
    }, 500);
    
    function initServicesAnimation() {
        const servicesSection = document.getElementById('services');
        if (!servicesSection) {
            console.error('Services section not found');
            return;
        }
        
        const mainText = document.querySelector('.services-text-animation__text');
        const secondText = document.querySelector('.services-final__bottom-text');
        
        if (!mainText || !secondText) {
            console.error('Text elements not found');
            return;
        }
        
        // Create SplitText instances
        const mainSplit = new SplitText(mainText, {
            type: "words, chars",
            charsClass: "services-char"
        });
        
        const secondSplit = new SplitText(secondText, {
            type: "words, chars",
            charsClass: "services-final-char"
        });
        
        const words = [...document.querySelectorAll('.services-text-animation__word')];
        
        // Main Text Animation - Color change
        gsap.fromTo(mainSplit.chars,
            { 
                color: "#ffffff",
                opacity: 1
            },
            {
                color: "#06ffff",
                opacity: 1,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: ".services-text-animation",
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1.5,
                    markers: false, // Set to true for debugging
                    invalidateOnRefresh: true
                }
            }
        );
        
        // Image Animation
        words.forEach((word, index) => {
            const wrapper = word.querySelector('.services-text-animation__image-wrapper');
            const revealLeft = wrapper?.querySelector('.services-text-animation__reveal.left');
            const revealRight = wrapper?.querySelector('.services-text-animation__reveal.right');
            
            if (!wrapper || !revealLeft || !revealRight) {
                console.warn('Image wrapper or reveals not found for word', index);
                return;
            }
            
            // Set initial state
            gsap.set(wrapper, { 
                width: 0,
                opacity: 1
            });
            gsap.set([revealLeft, revealRight], { 
                xPercent: 0,
                opacity: 1
            });
            
            // Create scroll trigger for each word
            ScrollTrigger.create({
                trigger: word,
                start: "top 85%",
                end: "bottom 15%",
                markers: false, // Set to true for debugging
                onEnter: () => animateImageIn(wrapper, revealLeft, revealRight),
                onLeaveBack: () => animateImageOut(wrapper, revealLeft, revealRight),
                onEnterBack: () => animateImageIn(wrapper, revealLeft, revealRight),
                onLeave: () => animateImageOut(wrapper, revealLeft, revealRight)
            });
        });
        
        // Second Text Animation
        gsap.fromTo(secondSplit.chars,
            { 
                color: "#999999",
                opacity: 1
            },
            {
                color: "#ffffff",
                opacity: 1,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: ".services-final",
                    start: "top bottom-=20%",
                    end: "bottom bottom",
                    scrub: 1.5,
                    markers: false,
                    invalidateOnRefresh: true
                }
            }
        );
        
        // Animation functions
        function animateImageIn(wrapper, revealLeft, revealRight) {
            gsap.to(wrapper, {
                width: "14vw",
                duration: 0.8,
                ease: "power2.out",
                overwrite: true
            });
            
            gsap.to(revealLeft, {
                xPercent: -100,
                duration: 0.8,
                ease: "power2.out",
                overwrite: true
            });
            
            gsap.to(revealRight, {
                xPercent: 100,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.1,
                overwrite: true
            });
        }
        
        function animateImageOut(wrapper, revealLeft, revealRight) {
            gsap.to(wrapper, {
                width: 0,
                duration: 0.6,
                ease: "power2.inOut",
                overwrite: true
            });
            
            gsap.to(revealLeft, {
                xPercent: 0,
                duration: 0.6,
                ease: "power2.inOut",
                overwrite: true
            });
            
            gsap.to(revealRight, {
                xPercent: 0,
                duration: 0.6,
                ease: "power2.inOut",
                delay: 0.05,
                overwrite: true
            });
        }
        
        // Refresh ScrollTrigger on resize
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });
        
        // Cleanup function
        window.servicesCleanup = function() {
            if (mainSplit) mainSplit.revert();
            if (secondSplit) secondSplit.revert();
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && trigger.trigger.closest('#services')) {
                    trigger.kill();
                }
            });
        };
    }
    
    // Navigation integration
    const servicesMenuItem = document.querySelector('.menu-item[data-target="services"]');
    const servicesPreviewCard = document.getElementById('preview-services');
    
    if (servicesMenuItem && servicesPreviewCard) {
        servicesMenuItem.addEventListener('mouseenter', () => {
            document.querySelectorAll('.menu-item.active').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.nav-preview-card.active').forEach(card => card.classList.remove('active'));
            
            servicesMenuItem.classList.add('active');
            servicesPreviewCard.classList.add('active');
        });
        
        servicesMenuItem.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                document.querySelectorAll('.menu-item.active').forEach(item => item.classList.remove('active'));
                document.querySelectorAll('.nav-preview-card.active').forEach(card => card.classList.remove('active'));
                
                servicesMenuItem.classList.add('active');
                servicesPreviewCard.classList.add('active');
            }
        });
    }
    
    // Handle menu links
    document.querySelectorAll('.nav-link-action[data-href="#services"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Scroll to services
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu if open
            const navOverlay = document.getElementById('nav-overlay');
            const burgerToggle = document.getElementById('burger-toggle');
            if (navOverlay && navOverlay.classList.contains('active') && burgerToggle) {
                burgerToggle.click();
            }
        });
    });
    
    // Handle preview card click
    if (servicesPreviewCard) {
        servicesPreviewCard.addEventListener('click', () => {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close menu if open
                const navOverlay = document.getElementById('nav-overlay');
                const burgerToggle = document.getElementById('burger-toggle');
                if (navOverlay && navOverlay.classList.contains('active') && burgerToggle) {
                    burgerToggle.click();
                }
            }
        });
    }
});