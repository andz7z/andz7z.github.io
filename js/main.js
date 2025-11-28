const firebaseConfig = {
  apiKey: "AIzaSyC0DShqS1R3eqCIVFLKXxU0vmi0mUqprek",
  authDomain: "portfolio-65392.firebaseapp.com",
  projectId: "portfolio-65392",
  storageBucket: "portfolio-65392.firebasestorage.app",
  messagingSenderId: "494719104051",
  appId: "1:494719104051:web:445c9ec94535e16b4adf46"
};

if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
}

document.addEventListener('DOMContentLoaded', () => {
  const loadScripts = () => {
    const esm = document.createElement('script');
    esm.type = 'module';
    esm.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
    document.head.appendChild(esm);

    const noModule = document.createElement('script');
    noModule.nomodule = true;
    noModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
    document.head.appendChild(noModule);
  };

  const initScrollProgress = () => {
    const fill = document.querySelector('.progress-fill');
    const progress = document.getElementById('scroll-progress');
    if (!fill || !progress) return;

    let ticking = false;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      fill.style.transform = `scaleX(${pct / 100})`;
      progress.setAttribute('aria-valuenow', Math.round(pct));
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    
    window.addEventListener('resize', update, { passive: true });
    update();
  };

  const initSmoothScroll = () => {
    document.body.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  };

  const initHomeObserver = () => {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.body.classList.add('home-section');
        } else {
          document.body.classList.remove('home-section');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(homeSection);
  };

  const initCustomCursor = () => {
    const cursor = document.querySelector('.cursor-ball');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const animateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.2; 
      cursorY += dy * 0.2; 
      
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => setTimeout(() => cursor.classList.remove('click'), 120));

    document.body.addEventListener('mouseover', (e) => {
      if (e.target.matches('a, button, .nav-link, input, textarea, [role="button"]')) {
        cursor.classList.add('active');
      }
    }, { passive: true });

    document.body.addEventListener('mouseout', (e) => {
      if (e.target.matches('a, button, .nav-link, input, textarea, [role="button"]')) {
        cursor.classList.remove('active');
      }
    }, { passive: true });
  };

  loadScripts();
  initScrollProgress();
  initSmoothScroll();
  initHomeObserver();
  initCustomCursor();
  
  if (typeof initFooter === 'function') initFooter();
});