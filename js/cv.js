document.addEventListener('DOMContentLoaded', () => {
  const setupTimelineInteractions = () => {
    const items = document.querySelectorAll('.cv-timeline-item');
    
    items.forEach(item => {
      const marker = item.querySelector('.cv-timeline-marker');
      if (!marker) return;

      item.addEventListener('mouseenter', () => {
        marker.style.transform = 'scale(1.2)';
      });
      
      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('cv-timeline-active')) {
          marker.style.transform = 'scale(1)';
        }
      });
    });
  };

  const setupScrollAnimations = () => {
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  };

  setupTimelineInteractions();
  setupScrollAnimations();
});