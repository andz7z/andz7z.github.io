class AboutSection {
  constructor() {
    this.dom = {
      section: document.getElementById('about'),
      btn: document.getElementById('contactBtn'),
      text: document.getElementById('contactText'),
      icon: document.querySelector('.contact-icon'),
      val: document.getElementById('timeValue'),
      status: document.getElementById('timeStatus'),
      unit: document.querySelector('.time-unit')
    };

    if (!this.dom.section) return;

    this.config = {
      start: 8,
      end: 20,
      classes: ['time-green', 'time-yellow', 'time-orange', 'time-red', 'time-expired']
    };

    this.timer = null;
    this.lastTimeStr = ''; // Cache pentru a evita scrieri inutile în DOM
    this.init();
  }

  init() {
    this.setupObserver();
    this.startClock();
    if (this.dom.btn) {
      this.dom.btn.addEventListener('click', () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          obs.unobserve(entry.target); // Deconectăm observer-ul după animare
        }
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -50px 0px' });
    
    observer.observe(this.dom.section);
  }

  startClock() {
    this.tick();
    // Folosim setInterval dar cu logică eficientă în tick
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    // Duminică
    if (day === 0) {
      this.updateUI('Try Tomorrow', 'Available from', '08:00', 'AM', '#ff4757', 'time-expired');
      return;
    }

    if (hour < this.config.start) {
      this.updateUI('Try Tomorrow', 'Available at', '08:00', 'AM', '#ff4757', 'time-expired');
    } else if (hour >= this.config.end) {
      this.updateUI('Try Tomorrow', 'Available in', '08:00', 'AM', '#ff4757', 'time-expired');
    } else {
      this.handleWorkingState(now);
    }
  }

  handleWorkingState(now) {
    const target = new Date(now).setHours(this.config.end, 0, 0, 0);
    const diff = target - now;
    
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const fmt = n => n.toString().padStart(2, '0');
    const timeStr = `${fmt(h)}:${fmt(m)}:${fmt(s)}`;

    // Calculate color class
    let cls = 'time-red';
    if (h >= 6) cls = 'time-green';
    else if (h >= 4) cls = 'time-yellow';
    else if (h >= 2) cls = 'time-orange';

    this.updateUI('Contact Now', 'Available for', timeStr, 'hr', '', cls);
  }

  // Funcție unificată pentru actualizare DOM
  updateUI(btnText, statusText, timeVal, unitVal, iconColor, btnClass) {
    // Verificăm dacă timpul s-a schimbat înainte să atingem DOM-ul
    if (this.lastTimeStr === timeVal && this.dom.text.textContent === btnText) return;
    
    this.lastTimeStr = timeVal;
    
    requestAnimationFrame(() => {
      this.dom.text.textContent = btnText;
      this.dom.status.textContent = statusText;
      this.dom.val.textContent = timeVal;
      this.dom.unit.textContent = unitVal;
      this.dom.icon.style.color = iconColor;
      
      // Update class eficient
      this.dom.btn.classList.remove(...this.config.classes);
      this.dom.btn.classList.add(btnClass);
    });
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
  }
}

document.addEventListener('DOMContentLoaded', () => new AboutSection());