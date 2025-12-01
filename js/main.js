/**
 * MAIN.JS - Core System Optimization
 * - Singleton pattern for Firebase
 * - Debounced resize events
 * - Optimized Global Cursor using translate3d
 */
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function closeIOSPrompt() {
  document.getElementById("ios-install").style.display = "none";
  localStorage.setItem("iosPromptShown", "true");
}

window.addEventListener("load", () => {
  // Arată mesajul doar pe iOS + Safari, o singură dată
  if (isIOS() && isSafari() && !localStorage.getItem("iosPromptShown")) {
    setTimeout(() => {
      document.getElementById("ios-install").style.display = "block";
    }, 1500);
  }
});

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
