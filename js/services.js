// Ultimate Services Section - Wow Effects
class UltimateServices {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupMatrixBackground();
        this.setupSphereNavigation();
        this.setupHologramInteractions();
        this.setupLiveMetrics();
        this.setupTerminalDemo();
        this.setupAIAssistant();
        this.setupParallaxEffects();
        this.setupPerformanceOptimizations();
    }
    
    setupMatrixBackground() {
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Matrix characters
        const chars = "01";
        const charArray = chars.split("");
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
        }
        
        function drawMatrix() {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = "#0f0";
            ctx.font = fontSize + "px monospace";
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                // Reset drop to top when it reaches bottom
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i]++;
            }
        }
        
        // Animation loop
        setInterval(drawMatrix, 33);
        
        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    setupSphereNavigation() {
        const sphereItems = document.querySelectorAll('.sphere-item');
        const services = document.querySelectorAll('.hologram-card');
        
        sphereItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                sphereItems.forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                
                const serviceType = item.dataset.service;
                this.filterServices(services, serviceType);
            });
        });
    }
    
    filterServices(services, type) {
        services.forEach(service => {
            if (type === 'all' || service.dataset.service === type) {
                service.style.display = 'block';
                this.animateServiceAppear(service);
            } else {
                this.animateServiceDisappear(service);
            }
        });
    }
    
    animateServiceAppear(service) {
        service.style.opacity = '0';
        service.style.transform = 'translateY(50px) scale(0.8)';
        service.style.display = 'block';
        
        setTimeout(() => {
            service.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            service.style.opacity = '1';
            service.style.transform = 'translateY(0) scale(1)';
        }, 50);
    }
    
    animateServiceDisappear(service) {
        service.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
        service.style.opacity = '0';
        service.style.transform = 'translateY(-50px) scale(0.8)';
        
        setTimeout(() => {
            service.style.display = 'none';
        }, 400);
    }
    
    setupHologramInteractions() {
        const holograms = document.querySelectorAll('.hologram-card');
        
        holograms.forEach(hologram => {
            // Mouse move tilt effect
            hologram.addEventListener('mousemove', (e) => {
                this.tiltHologram(hologram, e);
            });
            
            // Mouse leave reset
            hologram.addEventListener('mouseleave', () => {
                this.resetHologramTilt(hologram);
            });
            
            // Click for details
            hologram.addEventListener('click', (e) => {
                if (!e.target.closest('.hologram-btn')) {
                    this.toggleHologramDetails(hologram);
                }
            });
        });
    }
    
    tiltHologram(hologram, e) {
        const rect = hologram.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 20;
        const rotateX = (centerY - y) / 20;
        
        hologram.style.transform = `
            perspective(2000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            scale3d(1.02, 1.02, 1.02)
        `;
        
        // Update glow position
        const glow = hologram.querySelector('.hologram-glow');
        if (glow) {
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, 
                rgba(255,255,255,0.2) 0%, 
                rgba(255,255,255,0.1) 50%,
                transparent 70%)`;
        }
    }
    
    resetHologramTilt(hologram) {
        hologram.style.transform = 'perspective(2000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
    
    toggleHologramDetails(hologram) {
        const frame = hologram.querySelector('.hologram-frame');
        const isFlipped = frame.style.transform.includes('rotateY(180deg)');
        
        if (isFlipped) {
            frame.style.transform = 'rotateY(0deg)';
        } else {
            frame.style.transform = 'rotateY(180deg)';
        }
    }
    
    setupLiveMetrics() {
        const metrics = document.querySelectorAll('.metric-value');
        
        metrics.forEach(metric => {
            const target = parseFloat(metric.dataset.target);
            this.animateCounter(metric, target, 2000);
        });
        
        // Animate metric bars
        const metricBars = document.querySelectorAll('.metric-fill');
        metricBars.forEach(bar => {
            const speed = parseFloat(bar.dataset.speed);
            bar.style.setProperty('--fill-width', `${speed * 100}%`);
        });
    }
    
    animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.dataset.target === '99.2' ? '%' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (element.dataset.target === '99.2' ? '%' : '');
            }
        }, 16);
    }
    
    setupTerminalDemo() {
        const runButton = document.querySelector('.run-demo');
        const codeDisplay = document.querySelector('.code-display');
        
        runButton.addEventListener('click', () => {
            this.simulateCodeExecution(codeDisplay);
        });
    }
    
    simulateCodeExecution(display) {
        const lines = [
            "// Deploying quantum service cluster...",
            "✓ Database optimized",
            "✓ AI models loaded", 
            "✓ Security protocols activated",
            "✓ Performance tuning complete",
            "🚀 Service ready for launch!",
            "> Welcome to the future of digital excellence"
        ];
        
        display.innerHTML = '';
        
        lines.forEach((line, index) => {
            setTimeout(() => {
                const lineElement = document.createElement('div');
                lineElement.className = 'code-line';
                lineElement.innerHTML = `
                    <span class="line-number">${index + 1}</span>
                    <span class="code-comment">${line}</span>
                `;
                display.appendChild(lineElement);
                display.scrollTop = display.scrollHeight;
            }, index * 800);
        });
    }
    
    setupAIAssistant() {
        const aiAvatar = document.querySelector('.ai-avatar');
        const messageBubble = document.querySelector('.message-bubble');
        
        // AI interaction
        aiAvatar.addEventListener('click', () => {
            this.animateAIResponse(messageBubble);
        });
    }
    
    animateAIResponse(bubble) {
        const messages = [
            "Let's build something extraordinary together!",
            "Your vision + our expertise = digital magic!",
            "Ready to transform your ideas into reality?",
            "The future of your business starts here!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Animate message change
        bubble.style.opacity = '0';
        setTimeout(() => {
            bubble.textContent = `"${randomMessage}"`;
            bubble.style.opacity = '1';
        }, 300);
    }
    
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hologram-card, .dashboard-card');
            
            parallaxElements.forEach((el, index) => {
                const speed = 0.5 + (index * 0.1);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    setupPerformanceOptimizations() {
        // Throttle scroll events
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Preload critical elements
        this.preloadHologramAssets();
    }
    
    handleScroll() {
        // Handle scroll-based animations
        const elements = document.querySelectorAll('.hologram-card');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                el.classList.add('in-view');
            }
        });
    }
    
    preloadHologramAssets() {
        // Preload any critical assets
        const preloadLinks = [
            // Add paths to critical assets
        ];
        
        preloadLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UltimateServices();
});

// Add CSS for additional animations
const wowStyles = `
    .hologram-card {
        transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }
    
    .hologram-card.in-view {
        animation: hologramAppear 1s ease-out;
    }
    
    @keyframes hologramAppear {
        from {
            opacity: 0;
            transform: translateY(100px) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .data-stream:nth-child(odd) {
        left: 20%;
        animation-delay: 0s;
    }
    
    .data-stream:nth-child(even) {
        left: 80%;
        animation-delay: 1.5s;
    }
    
    .service-portal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        display: none;
        z-index: 10000;
    }
    
    .service-portal.active {
        display: block;
        animation: portalOpen 0.5s ease-out;
    }
    
    @keyframes portalOpen {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = wowStyles;
document.head.appendChild(styleSheet);
