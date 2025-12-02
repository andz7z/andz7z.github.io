/**
 * MAIN.JS - Core System Optimization
 * - Singleton pattern for Firebase
 * - Debounced resize events
 * - Optimized Global Cursor using translate3d
 */

const firebaseConfig = {
  apiKey: "AIzaSyC0DShqS1R3eqCIVFLKXxU0vmi0mUqprek",
  authDomain: "portfolio-65392.firebaseapp.com",
  projectId: "portfolio-65392",
  storageBucket: "portfolio-65392.firebasestorage.app",
  messagingSenderId: "494719104051",
  appId: "1:494719104051:web:445c9ec94535e16b4adf46"
};

// Initialize Firebase only once
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
}

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Utility: Load Scripts ---
  const loadScripts = () => {
    if (document.querySelector('script[src*="ionicons"]')) return;
    
    const esm = document.createElement('script');
    esm.type = 'module';
    esm.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
    document.head.appendChild(esm);

    const noModule = document.createElement('script');
    noModule.nomodule = true;
    noModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
    document.head.appendChild(noModule);
  };

  // --- Scroll Progress (Throttled via rAF) ---
  const initScrollProgress = () => {
    const fill = document.querySelector('.progress-fill');
    const progress = document.getElementById('scroll-progress');
    if (!fill || !progress) return;

    let ticking = false;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

      fill.style.transform = `scaleX(${pct})`;
      progress.setAttribute('aria-valuenow', Math.round(pct * 100));
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    
    window.addEventListener('resize', update, { passive: true });
  };

  // --- Smooth Scroll (Event Delegation) ---
  const initSmoothScroll = () => {
    document.body.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };
  // --- Home Observer ---
  const initHomeObserver = () => {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Toggle class on body based on visibility
        document.body.classList.toggle('home-section', entry.isIntersecting);
      });
    }, { threshold: 0.1 });

    observer.observe(homeSection);
  };

  // Init
  loadScripts();
  initScrollProgress();
  initSmoothScroll();
  initHomeObserver();
  
  // Footer check
  if (typeof window.initFooter === 'function') window.initFooter();
});
document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURARE ---
    const mesaje = [
        "‎ ‎∀ N D Z | PORTFOLIO",
        "‎ ‎ MADE TO PERFORM",
        "‎ ‎∀ N D Z | PORTFOLIO",
        "‎ ‎ ‎ ‎ ‎ ‎UI / UX | DESIGN"
    ];

    // TRUC CENTRARE
    const spatiereCentrare = "          "; 

    // TIMING (milisecunde)
    const vitezaScriere = 200;  
    const vitezaStergere = 100; 
    const pauzaCitire = 2000;   
    const pauzaIntreMesaje = 400; 

    // VARIABILE INTERNE
    let mesajIndex = 0;
    let charIndex = 0;
    let seSterge = false;

    // --- FUNCȚIE DETECTARE MOBIL ---
    function esteMobil() {
        // Verificăm dacă ecranul e mai mic de 768px SAU dacă e un device mobil
        return (window.innerWidth < 768) || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function animatieTitlu() {
        const mesajCurent = mesaje[mesajIndex];
        
        // Logica de tăiere a textului
        if (seSterge) {
            charIndex--;
            if (charIndex < 0) charIndex = 0;
        } else {
            charIndex++;
            if (charIndex > mesajCurent.length) charIndex = mesajCurent.length;
        }

        const textPartial = mesajCurent.substring(0, charIndex);

        // --- RANDARE ÎN TITLU ---
        if (textPartial.length === 0) {
            document.title = "\u200E"; 
        } else {
            document.title = spatiereCentrare + textPartial;
        }

        // --- CALCUL TIMP ---
        let timpUrmator = vitezaScriere;

        if (!seSterge && charIndex === mesajCurent.length) {
            timpUrmator = pauzaCitire;
            seSterge = true;
        } else if (seSterge && charIndex === 0) {
            seSterge = false;
            mesajIndex = (mesajIndex + 1) % mesaje.length;
            timpUrmator = pauzaIntreMesaje;
        } else if (seSterge) {
            timpUrmator = vitezaStergere;
        }

        setTimeout(animatieTitlu, timpUrmator);
    }

    // --- PORNIRE CONDIȚIONATĂ ---
    if (esteMobil()) {
        // CAZ MOBIL: Setăm doar primul titlu static, fără animație
        // NOTĂ: Pe mobil nu folosim 'spatiereCentrare' deoarece tab-ul e prea mic
        // și textul ar dispărea în dreapta. Afișăm direct mesajul.
        document.title = mesaje[0]; 
    } else {
        // CAZ DESKTOP: Pornim animația
        animatieTitlu();
    }
});
(function () {
  const bar = document.getElementById('scroll-progress-bar');
  const wrap = document.getElementById('scroll-progress-wrap');
  if (!bar || !wrap) return;

  let ticking = false;
  let lastScroll = 0;
  let idleTimer = null;

  function update() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

    // Folosim transform pentru performanta
    bar.style.transform = 'scaleX(' + progress + ')';

    // show idle state subtle (poți elimina)
    wrap.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => wrap.classList.add('idle'), 800);

    ticking = false;
  }

  function onScroll() {
    lastScroll = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // init
  update();
})();