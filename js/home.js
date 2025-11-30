document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Optimized Text Carousel ---
  const textEl = document.querySelector(".switch-text");
  
  if (textEl) {
    const roles = ["Front-end Developer", "UI/UX Designer", "Content Creator"];
    let roleIdx = 0;
    let timeoutId;

    const cycleRoles = () => {
      textEl.style.opacity = '0';
      
      // Folosim un singur timeout gestionat
      timeoutId = setTimeout(() => {
        roleIdx = (roleIdx + 1) % roles.length;
        
        // requestAnimationFrame asigură că schimbarea textului e sincronizată cu randarea
        requestAnimationFrame(() => {
          textEl.textContent = roles[roleIdx];
          textEl.style.opacity = '1';
        });
      }, 600);
    };

    // Inițializare
    setTimeout(() => {
      textEl.textContent = roles[0];
      textEl.style.opacity = '1';
      setInterval(cycleRoles, 3000);
    }, 3500);
  }

  // --- High-Performance Home Section Cursor ---
  const cursor = document.querySelector('.custom-cursor');
  const homeSection = document.getElementById('home');
  
  if (cursor && homeSection) {
    let mouseX = 0;
    let mouseY = 0;
    let isVisible = false;
    let rAF;

    // Render loop - rulează doar când e necesar
    const render = () => {
      if (isVisible) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        rAF = requestAnimationFrame(render);
      }
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible && document.body.classList.contains('home-cursor-active')) {
        isVisible = true;
        rAF = requestAnimationFrame(render);
      }
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });

    // Efficient Section Detection
    const toggleCursor = (isActive) => {
      document.body.classList.toggle('home-cursor-active', isActive);
      cursor.style.opacity = isActive ? '1' : '0';
      isVisible = isActive;
      
      if (isActive) {
        cancelAnimationFrame(rAF);
        rAF = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(rAF);
      }
    };

    homeSection.addEventListener('mouseenter', () => toggleCursor(true));
    homeSection.addEventListener('mouseleave', () => toggleCursor(false));
  }
});