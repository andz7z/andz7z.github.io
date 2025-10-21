// Functionality for the Services section
document.addEventListener('DOMContentLoaded', () => {
    // GSAP animation for service cards on hover for extra polish
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -5, duration: 0.3, ease: 'back.out(1.7)' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
        });
    });
});
