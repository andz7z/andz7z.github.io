// Portfolio Section JavaScript
class PortfolioModule {
    constructor() {
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.modal = document.querySelector('.portfolio-modal');
        this.init();
    }
    
    init() {
        this.setupFiltering();
        this.setupModal();
        this.setupHoverEffects();
        this.setupScrollAnimations();
    }
    
    setupFiltering() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter items
                const filter = button.getAttribute('data-filter');
                this.filterItems(filter);
            });
        });
    }
    
    filterItems(filter) {
        this.portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                // Add animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    setupModal() {
        const viewButtons = document.querySelectorAll('.view-project');
        const closeModal = document.querySelector('.close-modal');
        
        // View project buttons
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const portfolioItem = button.closest('.portfolio-item');
                this.openModal(portfolioItem);
            });
        });
        
        // Portfolio item click (opens modal)
        this.portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openModal(item);
            });
        });
        
        // Close modal
        closeModal.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    openModal(portfolioItem) {
        const image = portfolioItem.querySelector('img').src;
        const title = portfolioItem.querySelector('h3').textContent;
        const category = portfolioItem.querySelector('p').textContent;
        
        // Create modal content
        const modalBody = this.modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="modal-image">
                <img src="${image}" alt="${title}">
            </div>
            <div class="modal-info">
                <h2>${title}</h2>
                <p class="modal-category">${category}</p>
                <div class="modal-description">
                    <p>This project showcases my expertise in ${category.toLowerCase()}. It features modern design principles, responsive layout, and optimized performance.</p>
                    <div class="project-details">
                        <h4>Project Details</h4>
                        <ul>
                            <li><strong>Technologies:</strong> HTML5, CSS3, JavaScript, React</li>
                            <li><strong>Features:</strong> Responsive Design, Modern UI, Optimized Performance</li>
                            <li><strong>Timeline:</strong> 4-6 weeks</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="live-demo-btn">Live Demo</button>
                    <button class="source-code-btn">Source Code</button>
                </div>
            </div>
        `;
        
        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Clear modal content after transition
        setTimeout(() => {
            this.modal.querySelector('.modal-body').innerHTML = '';
        }, 300);
    }
    
    setupHoverEffects() {
        this.portfolioItems.forEach(item => {
            const overlay = item.querySelector('.portfolio-overlay');
            
            item.addEventListener('mouseenter', () => {
                overlay.style.backdropFilter = 'blur(0px)';
            });
            
            item.addEventListener('mouseleave', () => {
                overlay.style.backdropFilter = 'blur(5px)';
            });
        });
    }
    
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        this.portfolioItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }
}
