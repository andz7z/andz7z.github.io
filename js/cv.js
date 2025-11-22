// JavaScript pentru sectiunea CV - Denumiri specifice
document.addEventListener('DOMContentLoaded', function() {
  // Hover effects pentru timeline items
  const cvTimelineItems = document.querySelectorAll('.cv-timeline-item');
  cvTimelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.querySelector('.cv-timeline-marker').style.transform = 'scale(1.2)';
    });
    
    item.addEventListener('mouseleave', function() {
      if (!this.classList.contains('cv-timeline-active')) {
        this.querySelector('.cv-timeline-marker').style.transform = 'scale(1)';
      }
    });
  });

  // Animare la scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);

  document.querySelectorAll('[style*="animation"]').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
});