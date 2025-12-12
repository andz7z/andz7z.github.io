document.addEventListener('DOMContentLoaded', () => {
  
  // FUNCȚIE PENTRU TIMELINE LOOP AUTOMAT
  const initTimelineLoop = () => {
    // Selectăm toate elementele timeline
    const items = document.querySelectorAll('.cv-timeline-item');
    if (!items.length) return;

    let currentIndex = 0;
    let loopInterval = null;

    // Funcția care mută lumina pe următorul element
    const activateNext = () => {
      // 1. Curăță clasa 'active-auto' de pe TOATE elementele
      items.forEach(item => {
        item.classList.remove('active-auto');
      });

      // 2. Adaugă clasa pe elementul curent
      items[currentIndex].classList.add('active-auto');

      // 3. Calculează următorul index (dacă ajunge la final, o ia de la 0)
      currentIndex = (currentIndex + 1) % items.length;
    };

    // Funcția de pornire a ciclului
    const startLoop = () => {
      // Dacă există deja un interval, nu mai face altul
      if (loopInterval) return; 
      
      // Activează imediat unul, apoi setează intervalul
      activateNext();
      loopInterval = setInterval(activateNext, 1200); // Se schimbă la fiecare 1.2 secunde
    };

    // Funcția de oprire (când userul vrea să dea hover manual)
    const stopLoop = () => {
      clearInterval(loopInterval);
      loopInterval = null;
      
      // Opțional: Ștergem clasa activă când userul intervine, 
      // ca să nu rămână două aprinse (cea automată + cea de hover)
      items.forEach(item => item.classList.remove('active-auto'));
    };

    // PORNIM LOOP-UL LA ÎNCĂRCAREA PAGINII
    startLoop();

    // INTERACȚIUNE MOUSE (Opțional, dar recomandat)
    // Când userul pune mouse-ul, oprim animația automată.
    // Când ia mouse-ul, animația repornește.
    const timelineContainer = document.querySelector('.cv-timeline-horizontal');
    if (timelineContainer) {
      timelineContainer.addEventListener('mouseenter', stopLoop);
      timelineContainer.addEventListener('mouseleave', startLoop);
    }
  };

  // FUNCȚIE PENTRU ANIMAȚII LA SCROLL (deja existentă la tine)
  const initScrollAnimations = () => {
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

  // Executăm funcțiile
  initTimelineLoop();
  initScrollAnimations();
});
// Adaugă acest cod în fișierul tău JavaScript existent
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observă toate elementele care trebuie să apară
  document.querySelectorAll('.cv-header, .cv-tech-section, .cv-timeline-section, .cv-timeline-item').forEach(el => {
    observer.observe(el);
  });
});