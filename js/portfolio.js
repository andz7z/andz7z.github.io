// Portfolio section specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const portfolioTitle = document.querySelector('#portfolio .title');
    
    // Add 3D effect to portfolio title
    portfolioTitle.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    
    portfolioTitle.addEventListener('mouseenter', function() {
        this.style.transform = 'perspective(500px) rotateX(10deg) rotateY(10deg)';
        this.style.textShadow = '5px 5px 10px rgba(0, 0, 0, 0.5)';
    });
    
    portfolioTitle.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(500px) rotateX(0) rotateY(0)';
        this.style.textShadow = 'none';
    });
});
