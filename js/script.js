// ==================== Global helpers ====================
const q = (sel) => document.querySelector(sel);
const qa = (sel) => Array.from(document.querySelectorAll(sel));

// ==================== Smooth scroll (sidebar + nav-links) ====================
qa('.menu a, .nav-links a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // ignore external links
    const href = this.getAttribute('href');
    if (!href || href.startsWith('http') || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ==================== Navbar / Sidebar "scrolled" class on scroll ====================
// Asigurăm că selectorul există; încercăm .navbar, altfel .sidebar
const navbar = q('.navbar') || q('.sidebar');
if (navbar) {
  const onSmallScrollToggle = () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  // initial check
  onSmallScrollToggle();
  window.addEventListener('scroll', onSmallScrollToggle);
}

// ==================== Fade-in words (animated-text) ====================
const text = q('#animated-text');
if (text) {
  const words = text.textContent.trim().split(/\s+/);
  text.textContent = "";
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.textContent = word + (i < words.length - 1 ? " " : "");
    span.style.display = "inline-block";
    span.style.opacity = "0";
    span.style.transform = "translateY(6px)";
    span.style.transition = `opacity 0.45s ease ${i * 0.12}s, transform 0.45s ease ${i * 0.12}s`;
    text.appendChild(span);
    // force reflow then show
    requestAnimationFrame(() => {
      span.style.opacity = "1";
      span.style.transform = "translateY(0)";
    });
  });
}

// ==================== Intersection Observer pentru secțiuni ====================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // rulează funcțiile doar dacă există
        if (id === 'about') typeof initAboutSection === 'function' && initAboutSection();
        if (id === 'services') typeof initServicesSection === 'function' && initServicesSection();
        if (id === 'reviews') typeof initReviewsSection === 'function' && initReviewsSection();
        if (id === 'contact') typeof initContactSection === 'function' && initContactSection();
      }
    });
  },
  { threshold: 0.4 }
);
qa('section').forEach((sec) => observer.observe(sec));

// ==================== Back to Top (dacă există) ====================
const backToTop = q('#backToTop');
if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== Sidebar hide on scroll + Back button show ====================
const sidebar = q('.sidebar');
const backBtn = q('.back-btn'); // elementul tău back
let lastScrollY = window.scrollY;
let ticking = false;

function handleScroll() {
  const current = window.scrollY;

  // 1) hide / show sidebar + back button (logicul cerut)
  if (sidebar && backBtn) {
    if (current > lastScrollY && current > 150) {
      // scroll down
      sidebar.classList.add('hide');
      backBtn.classList.add('show');
    } else {
      // scroll up
      sidebar.classList.remove('hide');
      backBtn.classList.remove('show');
    }
  }

  // 2) "scrolled" class for sidebar (să devină puțin mai vizibil)
  if (sidebar) {
    if (current > 150) sidebar.classList.add('scrolled');
    else sidebar.classList.remove('scrolled');
  }

  lastScrollY = current;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

// back button behaviour (safe-guard)
if (backBtn) {
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // dacă avem istoric, mergem back; altfel mergem sus.
    if (window.history.length > 1) window.history.back();
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== Magnetic effect pentru .menu a (hover attraction) ====================
// Când mouse-ul se mișcă deasupra sidebar-ului, itemele se atrag ușor spre cursor.
// Reset la mouseleave.
const menuLinks = qa('.sidebar .menu a');

if (q('.sidebar') && menuLinks.length) {
  const root = q('.sidebar');

  function onMove(e) {
    const rect = root.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    menuLinks.forEach(link => {
      const r = link.getBoundingClientRect();
      // center of link
      const lx = r.left + r.width / 2;
      const ly = r.top + r.height / 2;
      // vector from link center to cursor
      const dx = (e.clientX - lx);
      const dy = (e.clientY - ly);
      const dist = Math.sqrt(dx * dx + dy * dy);
      // dacă e aproape, aplicăm transform; altfel reset
      const maxAttract = 120; // zona de influență
      if (dist < maxAttract) {
        const strength = (1 - dist / maxAttract); // 0..1
        // mică traducere și scalare
        const tx = dx * 0.15 * strength;
        const ty = dy * 0.12 * strength;
        const scale = 1 + 0.06 * strength;
        link.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        link.style.transition = 'transform 120ms ease-out';
      } else {
        // reset
        link.style.transform = '';
        link.style.transition = 'transform 300ms cubic-bezier(.2,.9,.2,1)';
      }
    });
  }

  function onLeave() {
    menuLinks.forEach(link => {
      link.style.transform = '';
      link.style.transition = 'transform 300ms cubic-bezier(.2,.9,.2,1)';
    });
  }

  // Attach listeners
  root.addEventListener('mousemove', onMove);
  root.addEventListener('mouseleave', onLeave);
  // For touch devices, disable magnetic (no pointer)
  // (optional) you can check pointer type if needed
}
// ==================== Magnetic effect for Back Button ====================
if (backBtn) {
  const strength = 40; // cât de puternic "atrage"
  const scale = 1.12;  // mărire ușoară

  backBtn.addEventListener('mousemove', (e) => {
    const rect = backBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    backBtn.style.transform = `translate(${x / 5}px, ${y / 5}px) scale(${scale})`;
  });

  backBtn.addEventListener('mouseleave', () => {
    backBtn.style.transform = 'translate(0, 0) scale(1)';
  });
}
// ==================== Safety: prevent errors if elements lipsesc ====================
// (to avoid console errors in pagini partiale)
