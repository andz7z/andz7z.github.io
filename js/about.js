// Functionality for the About section (e.g., stats counter animation)
document.addEventListener('DOMContentLoaded', () => {
    const metricCards = document.querySelectorAll('.metric-card h3');

    // Simple counter animation on Intersection
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                metricCards.forEach(card => {
                    const target = parseInt(card.textContent.replace(/[^\d.]/g, ''));
                    gsap.fromTo(card, { innerHTML: 0 }, {
                        innerHTML: target,
                        duration: 2,
                        snap: "innerHTML",
                        ease: "power1.out",
                        onUpdate: function() {
                            card.textContent = Math.ceil(this.targets()[0].innerHTML) + (card.textContent.includes('%') ? '%' : '+');
                        }
                    });
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) counterObserver.observe(aboutSection);
});
