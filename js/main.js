(function () {
  const progress = document.getElementById('scroll-progress');
  const fill = progress.querySelector('.progress-fill');

  function updateProgress() {
    const doc = document.documentElement;
    const scrollTop = window.pageYOffset || doc.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    // setează lățimea fill-ului
    fill.style.width = pct + '%';

    // actualizează aria pentru accesibilitate
    progress.setAttribute('aria-valuenow', Math.round(pct));
  }

  // Update la scroll și resize (resize poate schimba înălțimea documentului)
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  // update inițial
  updateProgress();
})();
// main.js - Configurare Firebase o singură dată
const firebaseConfig = {
  apiKey: "AIzaSyC0DShqS1R3eqCIVFLKXxU0vmi0mUqprek",
  authDomain: "portfolio-65392.firebaseapp.com",
  projectId: "portfolio-65392",
  storageBucket: "portfolio-65392.firebasestorage.app",
  messagingSenderId: "494719104051",
  appId: "1:494719104051:web:445c9ec94535e16b4adf46"
};

// Inițializare Firebase o singură dată
firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized in main.js');
// Footer JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initFooter();
});
// Adăugarea scriptului pentru ionicons
document.addEventListener('DOMContentLoaded', function() {
  // Încărcarea ionicons
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
  document.head.appendChild(script);
  
  const nomodule = document.createElement('script');
  nomodule.nomodule = true;
  nomodule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
  document.head.appendChild(nomodule);
  
  // Navigare smooth la click pe linkuri
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Verificare dacă suntem în secțiunea Home
  function checkHomeSection() {
    const homeSection = document.getElementById('home');
    if (homeSection && isElementInViewport(homeSection)) {
      document.body.classList.add('home-section');
    } else {
      document.body.classList.remove('home-section');
    }
  }
  
  // Funcție pentru a verifica dacă un element este în viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Verificare la încărcare și la scroll
  window.addEventListener('load', checkHomeSection);
  window.addEventListener('scroll', checkHomeSection);
});
const cursor = document.querySelector('.cursor-ball');
const cursorInner = document.querySelector('.cursor-ball-inner');

document.addEventListener('mousemove', e => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

/* Click pulse */
document.addEventListener('mousedown', () => {
  cursor.classList.add('click');
});

document.addEventListener('mouseup', () => {
  setTimeout(() => cursor.classList.remove('click'), 120);
});

/* Detectează elemente clickable */
const clickableElements = document.querySelectorAll('a, button, .nav-link');

clickableElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });
});

