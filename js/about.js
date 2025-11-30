class AboutSection {
  constructor() {
    this.dom = {
      section: document.getElementById('about'),
      video: document.getElementById('bgVideo'),
      canvas: document.getElementById('revealCanvas'),
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
      classes: ['time-green', 'time-yellow', 'time-orange', 'time-red', 'time-expired'],
      brushSize: 130,
      
      // === SETĂRI NOI PENTRU DURATĂ LUNGĂ ===
      baseFade: 0.002,         // Foarte mic = Urma rămâne mult timp vizibilă
      maxFade: 0.05,           // Viteza maximă de ștergere (când e complet inactiv)
      fadeAcceleration: 0.0001 // Accelerează foarte lent procesul de ștergere
    };

    this.timer = null;
    this.rafId = null;
    this.lastTimeStr = '';
    
    // Variabile pentru logica de smooth fade
    this.currentFade = this.config.baseFade;
    this.lastMouseMove = Date.now();
    this.isMoving = false;

    // Canvas setup
    this.ctx = this.dom.canvas ? this.dom.canvas.getContext('2d') : null;
    this.maskCanvas = document.createElement('canvas');
    this.maskCtx = this.maskCanvas.getContext('2d');
    
    this.mouse = { x: -1000, y: -1000 };

    this.init();
  }

  init() {
    this.setupObserver();
    this.startClock();
    
    if (this.dom.canvas && this.dom.video) {
      this.setupCanvas();
      this.startCanvasLoop();
    }

    if (this.dom.btn) {
      this.dom.btn.addEventListener('click', () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  setupCanvas() {
    const updateSize = () => {
      const rect = this.dom.canvas.getBoundingClientRect();
      // Folosim Math.ceil pentru a evita linii albe la margini
      const w = Math.ceil(rect.width);
      const h = Math.ceil(rect.height);
      
      this.dom.canvas.width = w;
      this.dom.canvas.height = h;
      this.maskCanvas.width = w;
      this.maskCanvas.height = h;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Mouse Move Logic
    this.dom.section.addEventListener('mousemove', (e) => {
      const rect = this.dom.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      
      // Resetăm fade-ul la viteza minimă (cea lentă) când utilizatorul e activ
      this.currentFade = this.config.baseFade;
      this.lastMouseMove = Date.now();
      this.isMoving = true;
    });

    // Când mouse-ul iese, lăsăm bucla să șteargă urma lin
    this.dom.section.addEventListener('mouseleave', () => {
      this.isMoving = false;
    });
  }

  startCanvasLoop() {
    const animate = () => {
      this.drawCanvas();
      this.rafId = requestAnimationFrame(animate);
    };
    animate();
  }

  drawCanvas() {
    if (!this.ctx || !this.dom.video) return;
    const w = this.dom.canvas.width;
    const h = this.dom.canvas.height;
    const now = Date.now();

    // 1. CALCUL DINAMIC AL VITEZEI DE DISPARIȚIE (Smooth Decay)
    // Am mărit timpul de așteptare la 300ms (era 100ms) înainte să înceapă accelerarea ștergerii
    if (now - this.lastMouseMove > 300) {
        this.isMoving = false;
        // Creștem treptat puterea de ștergere până la maxFade
        if (this.currentFade < this.config.maxFade) {
            this.currentFade += this.config.fadeAcceleration;
        }
    }

    // 2. APLICARE FADE (Ștergere parțială a măștii)
    this.maskCtx.globalCompositeOperation = 'destination-out';
    this.maskCtx.fillStyle = `rgba(0, 0, 0, ${this.currentFade})`;
    this.maskCtx.fillRect(0, 0, w, h);

    // 3. DESENARE MOUSE (Doar dacă se mișcă activ)
    if (this.isMoving) {
      this.maskCtx.globalCompositeOperation = 'source-over';
      const grad = this.maskCtx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, this.config.brushSize);
      
      // Gradient fin pentru margini moi
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      this.maskCtx.fillStyle = grad;
      this.maskCtx.beginPath();
      this.maskCtx.arc(this.mouse.x, this.mouse.y, this.config.brushSize, 0, Math.PI * 2);
      this.maskCtx.fill();
    }

    // 4. COMPUNERE FINALĂ
    this.ctx.clearRect(0, 0, w, h);

    // A. Desenare video color
    this.ctx.globalCompositeOperation = 'source-over';
    if (this.dom.video.readyState >= 2) {
      const vRatio = this.dom.video.videoWidth / this.dom.video.videoHeight;
      const cRatio = w / h;
      let drawW, drawH, drawX, drawY;

      if (cRatio > vRatio) {
        drawW = w;
        drawH = w / vRatio;
        drawX = 0;
        drawY = (h - drawH) / 2;
      } else {
        drawH = h;
        drawW = h * vRatio;
        drawX = (w - drawW) / 2;
        drawY = 0;
      }
      this.ctx.drawImage(this.dom.video, drawX, drawY, drawW, drawH);
    }

    // B. Aplicare Mască
    this.ctx.globalCompositeOperation = 'destination-in';
    this.ctx.drawImage(this.maskCanvas, 0, 0);
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

    let cls = 'time-red';
    if (h >= 6) cls = 'time-green';
    else if (h >= 4) cls = 'time-yellow';
    else if (h >= 2) cls = 'time-orange';

    this.updateUI('Contact Now', 'Available for', timeStr, 'hr', '', cls);
  }

  updateUI(btnText, statusText, timeVal, unitVal, iconColor, btnClass) {
    if (this.lastTimeStr === timeVal && this.dom.text.textContent === btnText) return;
    
    this.lastTimeStr = timeVal;
    
    requestAnimationFrame(() => {
      this.dom.text.textContent = btnText;
      this.dom.status.textContent = statusText;
      this.dom.val.textContent = timeVal;
      this.dom.unit.textContent = unitVal;
      this.dom.icon.style.color = iconColor;
      
      this.dom.btn.classList.remove(...this.config.classes);
      this.dom.btn.classList.add(btnClass);
    });
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

document.addEventListener('DOMContentLoaded', () => new AboutSection());