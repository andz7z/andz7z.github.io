document.addEventListener('DOMContentLoaded', () => {
  // --- Optimized Text Carousel ---
  const textEl = document.querySelector(".switch-text");
  const roles = ["Front-end Developer", "UI/UX Designer", "Content Creator"];
  let roleIdx = 0;

  const cycleRoles = () => {
    textEl.style.opacity = '0';
    
    setTimeout(() => {
      roleIdx = (roleIdx + 1) % roles.length;
      textEl.textContent = roles[roleIdx];
      textEl.style.opacity = '1';
    }, 600);
  };

  setTimeout(() => {
    textEl.textContent = roles[0];
    textEl.style.opacity = '1';
    setInterval(cycleRoles, 3000);
  }, 3500);

  // --- High-Performance Custom Cursor ---
  const cursor = document.querySelector('.custom-cursor');
  const homeSection = document.getElementById('home');
  let mouseX = 0;
  let mouseY = 0;
  let isMoving = false;

  // Render loop using requestAnimationFrame (60fps locked)
  const render = () => {
    if (isMoving) {
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  // Lightweight Input Listener
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
  }, { passive: true });

  // Efficient Section Detection
  if (homeSection) {
    homeSection.addEventListener('mouseenter', () => {
      document.body.classList.add('home-cursor-active');
    });
    
    homeSection.addEventListener('mouseleave', () => {
      document.body.classList.remove('home-cursor-active');
    });
  }

  // Window Visibility Handling
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('home-cursor-active');
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
});