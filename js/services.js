// Services Section JavaScript - Mobile Optimized
class ServicesSection {
    constructor() {
        this.cards = document.querySelectorAll('.service-card');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.modal = document.getElementById('serviceModal');
        this.quickView = document.getElementById('quickView');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.sliderBtns = document.querySelectorAll('.slider-btn');
        this.dots = document.querySelectorAll('.dot');
        
        this.currentSlide = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupTouchEvents();
        this.startStatsCounter();
        this.startSliderAutoPlay();
        
        // Add mobile-specific classes
        this.detectMobile();
    }
    
    detectMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            document.body.classList.add('is-mobile');
        }
    }
    
    setupEventListeners() {
        // Card click events for mobile
        this.cards.forEach(card => {
            // Click to flip on mobile
            card.addEventListener('click', (e) => {
                // Don't flip if clicking a button
                if (e.target.closest('.action-btn') || e.target.closest('.quick-view')) {
                    return;
                }
                
                if (window.innerWidth <= 1024) {
                    card.classList.toggle('flipped');
                }
            });
            
            // Button events
            const buttons = card.querySelectorAll('.action-btn, .quick-view');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const service = btn.dataset.service;
                    this.handleButtonClick(service, btn.classList.contains('quick-view'));
                });
            });
        });
        
        // Navigation filtering
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterServices(btn.dataset.category);
                this.navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Modal close
        const closeButtons = document.querySelectorAll('.modal-close, .quick-view-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });
        
        // Modal backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModals();
            }
        });
        
        this.quickView.addEventListener('click', (e) => {
            if (e.target === this.quickView) {
                this.closeModals();
            }
        });
        
        // Slider controls
        this.sliderBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('next')) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            });
        });
        
        // Dot controls
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-btn');
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleCTAClick(btn);
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }
    
    setupTouchEvents() {
        // Touch events for slider
        const slider = document.querySelector('.slider-container');
        if (slider) {
            slider.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            slider.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        }
        
        // Prevent zoom on double tap for cards
        this.cards.forEach(card => {
            let lastTouchEnd = 0;
            card.addEventListener('touchend', (e) => {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, { passive: false });
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('service-card')) {
                        entry.target.style.animationDelay = `${entry.target.dataset.index * 0.1}s`;
                        entry.target.classList.add('visible');
                    } else if (entry.target.classList.contains('stat-item')) {
                        this.animateStat(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe cards
        this.cards.forEach((card, index) => {
            card.dataset.index = index;
            observer.observe(card);
        });
        
        // Observe stats
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            observer.observe(item);
        });
        
        // Observe other elements
        const elementsToObserve = document.querySelectorAll('.testimonials-section, .cta-section');
        elementsToObserve.forEach(el => {
            observer.observe(el);
        });
    }
    
    startStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target + (stat.dataset.count === '98' ? '%' : '+');
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current) + (stat.dataset.count === '98' ? '%' : '+');
                }
            }, 16);
        });
    }
    
    animateStat(statItem) {
        statItem.style.transform = 'translateY(0)';
        statItem.style.opacity = '1';
    }
    
    filterServices(category) {
        this.cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                // Reset animation
                card.classList.remove('visible');
                setTimeout(() => card.classList.add('visible'), 100);
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    handleButtonClick(service, isQuickView = false) {
        if (isQuickView) {
            this.openQuickView(service);
        } else {
            this.openModal(service);
        }
    }
    
    openModal(service) {
        const serviceData = this.getServiceData(service);
        this.populateModal(serviceData);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add vibration feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    openQuickView(service) {
        const serviceData = this.getServiceData(service);
        this.populateQuickView(serviceData);
        this.quickView.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add vibration feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    }
    
    closeModals() {
        this.modal.classList.remove('active');
        this.quickView.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset card flips when modal closes
        if (window.innerWidth <= 1024) {
            this.cards.forEach(card => {
                card.classList.remove('flipped');
            });
        }
    }
    
    populateModal(data) {
        // Implementation for modal content
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalSubtitle').textContent = data.subtitle;
        document.getElementById('modalDescription').textContent = data.description;
        
        // Add more modal population logic here
    }
    
    populateQuickView(data) {
        // Implementation for quick view content
        const content = document.getElementById('quickViewContent');
        content.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.quickDescription}</p>
            <div class="quick-features">
                ${data.quickFeatures.map(feature => `<span>${feature}</span>`).join('')}
            </div>
        `;
    }
    
    getServiceData(service) {
        // Mock data - replace with actual data
        const services = {
            'web-dev': {
                title: 'Web Development',
                subtitle: 'Complete Web Solutions',
                description: 'Full-stack web development services...',
                quickDescription: 'Modern, responsive websites built with cutting-edge technology.',
                quickFeatures: ['Responsive Design', 'Fast Performance', 'SEO Optimized']
            },
            // Add other services...
        };
        
        return services[service] || {
            title: 'Service',
            subtitle: 'Details',
            description: 'Service information...',
            quickDescription: 'Quick overview...',
            quickFeatures: ['Feature 1', 'Feature 2', 'Feature 3']
        };
    }
    
    // Slider functionality
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    updateSlider() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startSliderAutoPlay() {
        // Only auto-play on desktop
        if (window.innerWidth > 768) {
            setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
    }
    
    handleCTAClick(button) {
        const action = button.textContent.trim();
        
        // Add vibration feedback
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        
        // Handle different CTA actions
        switch(action) {
            case 'Get Free Quote':
                this.openModal('quote');
                break;
            case 'Schedule Call':
                // Open calendar or scheduling
                window.open('tel:+1234567890', '_self');
                break;
            default:
                this.openModal('contact');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ServicesSection();
});

// Handle resize events
window.addEventListener('resize', () => {
    // Reset card flips on orientation change
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('flipped');
        });
    }
});

// Load fonts and optimize performance
window.addEventListener('load', () => {
    // Mark as loaded for any loading animations
    document.body.classList.add('loaded');
    
    // Preload critical images
    const criticalImages = [
        // Add critical image paths here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    });
}

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);
    });
});

observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });

// Error handling
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
});

// Online/offline detection
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
});
