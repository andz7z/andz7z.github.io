// Functionality for the Contact section
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');

    // Simple success message after submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.2,
            onComplete: () => {
                submitBtn.textContent = 'Message Sent! ✨';
                submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                submitBtn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
                this.reset();
            }
        });
        
        // Revert button after a delay
        setTimeout(() => {
            gsap.to(submitBtn, {
                scale: 1,
                duration: 0.5,
                background: 'var(--gradient-base)',
                boxShadow: 'none',
                onComplete: () => {
                    submitBtn.textContent = originalText;
                }
            });
        }, 3000);
    });
});
