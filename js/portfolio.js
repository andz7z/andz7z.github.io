function initPortfolio() {
    // Portfolio filtering
    initPortfolioFilter();
    
    // Portfolio item animations
    initPortfolioAnimations();
}

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    gsap.to(item, { opacity: 1, scale: 1, duration: 0.5 });
                } else {
                    gsap.to(item, { 
                        opacity: 0, 
                        scale: 0.8, 
                        duration: 0.5,
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

function initPortfolioAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach((item, index) => {
        gsap.set(item, { opacity: 0, y: 50 });
        
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out"
        });
    });
}
