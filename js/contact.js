class ContactManager {
  constructor() {
    this.db = window.db;
    this.firebase = window.firebase;
    
    this.dom = {
      form: document.getElementById('contact-form'),
      socials: document.querySelectorAll('.social-item'),
      body: document.body
    };

    if (!this.validateSystem()) return;

    this.init();
  }

  validateSystem() {
    if (typeof this.db === 'undefined' || !this.db) {
      console.error('Database connection missing.');
      return false;
    }
    return true;
  }

  init() {
    this.injectStyles();
    this.setupForm();
    this.setupSocials();
    this.setupRealTimeValidation();
    
    window.contactSystem = {
      showNotification: (msg, type) => this.showNotification(msg, type)
    };
  }

  injectStyles() {
    if (document.getElementById('contact-sys-styles')) return;
    
    const css = `
      .sys-notif {
        position: fixed; top: 20px; right: 20px;
        padding: 12px 16px; border-radius: 10px;
        display: flex; align-items: center; gap: 12px;
        z-index: 10000; font-family: 'Sora', sans-serif; font-size: 0.9rem;
        max-width: 300px; color: #fff;
        animation: slideInRight 0.3s ease-out forwards;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      .sys-notif.success { background: #1a1a1a; border: 1.5px solid #00ff88; }
      .sys-notif.error { background: #331a1a; border: 1.5px solid #ff4444; }
      .sys-notif.hiding { animation: slideOutRight 0.3s ease-in forwards; }
      .sys-notif button {
        background: none; border: none; color: #fff; cursor: pointer;
        padding: 4px; border-radius: 50%; display: flex;
        transition: background 0.2s;
      }
      .sys-notif button:hover { background: rgba(255,255,255,0.1); }
      .field-error { color: #ff6b6b; font-size: 0.8rem; margin-top: 5px; font-family: 'Sora', sans-serif; }
      .input-error { border-color: #ff6b6b !important; }
      @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    
    const style = document.createElement('style');
    style.id = 'contact-sys-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  setupForm() {
    if (!this.dom.form) return;

    this.dom.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = this.dom.form.querySelector('.submit-btn');
      const originalContent = btn.innerHTML;

      if (!this.validateForm()) return;

      this.setLoading(btn, true);

      try {
        const formData = new FormData(this.dom.form);
        const data = {
          firstName: formData.get('firstName').trim(),
          lastName: formData.get('lastName').trim(),
          email: formData.get('email').trim(),
          phone: formData.get('phone')?.trim() || '',
          message: formData.get('message').trim(),
          timestamp: this.firebase.firestore.FieldValue.serverTimestamp(),
          read: false
        };

        await this.db.collection('contacts').add(data);
        this.showNotification("Message sent successfully! I'll get back to you soon.", 'success');
        this.dom.form.reset();
        this.clearErrors();
      } catch (err) {
        console.error(err);
        this.showNotification('An error occurred. Please try again.', 'error');
      } finally {
        this.setLoading(btn, false, originalContent);
      }
    });
  }

  validateForm() {
    let isValid = true;
    const required = this.dom.form.querySelectorAll('[required]');
    
    required.forEach(field => {
      if (!this.checkField(field)) isValid = false;
    });

    if (!isValid) this.showNotification('Please check the highlighted fields.', 'error');
    return isValid;
  }

  checkField(field) {
    const val = field.value.trim();
    this.clearFieldError(field);

    if (!val) {
      this.showFieldError(field, 'This field is required');
      return false;
    }

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      this.showFieldError(field, 'Invalid email address');
      return false;
    }

    return true;
  }

  showFieldError(field, msg) {
    field.classList.add('input-error');
    const div = document.createElement('div');
    div.className = 'field-error';
    div.textContent = msg;
    field.parentNode.appendChild(div);
  }

  clearFieldError(field) {
    field.classList.remove('input-error');
    const err = field.parentNode.querySelector('.field-error');
    if (err) err.remove();
  }

  clearErrors() {
    this.dom.form.querySelectorAll('.field-error').forEach(e => e.remove());
    this.dom.form.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
  }

  setupRealTimeValidation() {
    if (!this.dom.form) return;
    const inputs = this.dom.form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.checkField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  setLoading(btn, isLoading, content = '') {
    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? '<span>Sending...</span>' : content;
  }

  setupSocials() {
    this.dom.socials.forEach(item => {
      item.addEventListener('mouseenter', () => item.style.transform = 'scale(1.02)');
      item.addEventListener('mouseleave', () => item.style.transform = 'scale(1)');
    });
  }

  showNotification(msg, type) {
    document.querySelectorAll('.sys-notif').forEach(n => n.remove());

    const notif = document.createElement('div');
    notif.className = `sys-notif ${type}`;
    notif.innerHTML = `<span>${msg}</span><button><ion-icon name="close-outline"></ion-icon></button>`;
    
    const close = () => {
      notif.classList.add('hiding');
      setTimeout(() => notif.remove(), 300);
    };

    notif.querySelector('button').onclick = close;
    this.dom.body.appendChild(notif);
    setTimeout(() => { if(notif.isConnected) close(); }, 4000);
  }
}

document.addEventListener('DOMContentLoaded', () => new ContactManager());