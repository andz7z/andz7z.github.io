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

    this.config = {
      start: 8,
      end: 20,
      classes: ['time-green', 'time-yellow', 'time-orange', 'time-red', 'time-expired']
    };

    this.timer = null;
    this.init();
  }

  init() {
    this.setupObserver();
    this.startClock();
    this.dom.btn.addEventListener('click', () => console.log('Contact action triggered'));
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -50px 0px' });
    
    observer.observe(this.dom.section);
  }

  startClock() {
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    if (day === 0) {
      this.setUnavailableState('Try Tomorrow', 'Available from', '08:00', 'AM');
      return;
    }

    if (hour < this.config.start) {
      this.setUnavailableState('Try Tomorrow', 'Available at', '08:00', 'AM');
    } else if (hour >= this.config.end) {
      this.setUnavailableState('Try Tomorrow', 'Available in', '08:00', 'AM');
    } else {
      this.updateWorkingState(now);
    }
  }

  setUnavailableState(btnText, statusText, timeVal, unitVal) {
    this.dom.text.textContent = btnText;
    this.dom.status.textContent = statusText;
    this.dom.val.textContent = timeVal;
    this.dom.unit.textContent = unitVal;
    this.dom.icon.style.color = '#ff4757';
    this.updateBtnClass('time-expired');
  }

  updateWorkingState(now) {
    const target = new Date(now).setHours(this.config.end, 0, 0, 0);
    const diff = target - now;
    
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const fmt = n => n.toString().padStart(2, '0');
    
    this.dom.text.textContent = 'Contact Now';
    this.dom.status.textContent = 'Available for';
    this.dom.val.textContent = `${fmt(h)}:${fmt(m)}:${fmt(s)}`;
    this.dom.unit.textContent = 'hr';
    this.dom.icon.style.color = '';

    this.updateColorState(h);
  }

  updateColorState(hoursLeft) {
    let cls = 'time-red';
    if (hoursLeft >= 6) cls = 'time-green';
    else if (hoursLeft >= 4) cls = 'time-yellow';
    else if (hoursLeft >= 2) cls = 'time-orange';
    
    this.updateBtnClass(cls);
  }

  updateBtnClass(newClass) {
    this.dom.btn.classList.remove(...this.config.classes);
    this.dom.btn.classList.add(newClass);
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
  }
}

document.addEventListener('DOMContentLoaded', () => new AboutSection());